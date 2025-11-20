import { useEffect, useState } from "react";
import { Phone, User, Home, ChevronLeft, ChevronRight, Clock, Wrench, CheckCircle, XCircle, Mic, StopCircle, Trash2 } from "lucide-react";
import { CalendarContainer, CalendarGrid, CalendarHeader, Container, CurrentMonth, Day, FormContainer, Input, InputGroup, InputWithIcon, Label, MonthNavigator, ServiceSelect, SubmitButton, TextArea, TimeSelect, TimeSlotLabel, Title, WeekDay, ModalOverlay, ModalContent, ModalIcon, ModalMessage, ModalCloseButton, AudioControls, AudioButton, AudioPlayerContainer } from "./styles";
import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";




interface BookedSlot {
  service_date: string;
  booking_time: string;
}




export  function Register() {
   const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: 'service@example.com',
    phone: '',
    address: '',
    date: '',
    time: '',
    description: '',
    audio_url: '', // Novo campo para a URL do áudio
    service_type: '',
  });

  const timeSlots = [
    '09:00', '11:00', '15:00','17:00',
  ];

  useEffect(() => {
    fetchBookedSlots();
  }, [currentDate]);

  const fetchBookedSlots = async () => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);

    const { data, error } = await supabase
      .from('bookings')
      .select('service_date, booking_time')
      .gte('service_date', startDate.toISOString())
      .lte('service_date', endDate.toISOString())
      .neq('status', 'cancelled');

    if (error) {
      console.error('Error fetching booked slots:', error);
      return;
    }

    setBookedSlots(data || []);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const localAudioChunks: Blob[] = [];
      setMediaRecorder(recorder);
      setAudioBlob(null);
      setAudioURL(null);

      recorder.ondataavailable = (event) => {
        localAudioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const newAudioBlob = new Blob(localAudioChunks, { type: 'audio/webm' });
        const newAudioURL = URL.createObjectURL(newAudioBlob);
        setAudioBlob(newAudioBlob);
        setAudioURL(newAudioURL);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Erro ao acessar o microfone:', err);
      setModalState({ type: 'error', message: 'Não foi possível acessar o microfone. Verifique as permissões.' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const deleteAudio = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioBlob(null);
    setAudioURL(null);
    // audioChunks state was removed, no need to clear it.
    setMediaRecorder(null);
    setIsRecording(false);
    setFormData(prev => ({ ...prev, audio_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalState(null);
    let uploadedAudioUrl = '';
    
    try {
      // ETAPA 1: Upload do Áudio (Agora dentro do try...catch)
      if (audioBlob) {
        const filePath = `${Date.now()}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('booking-audios')
          .upload(filePath, audioBlob);

        if (uploadError) {
          // Lança um erro específico para falha no upload
          throw new Error(`Falha no upload do áudio: ${uploadError.message}`);
        }

        uploadedAudioUrl = supabase.storage.from('booking-audios').getPublicUrl(uploadData.path).data.publicUrl;
      }

      // ETAPA 2: Inserção no Banco de Dados
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service_type: formData.service_type,
            address: formData.address,
            service_date: formData.date,
            booking_time: formData.time,
            description: formData.description,
            audio_url: uploadedAudioUrl, // Salva a URL do áudio
            status: 'pending'
          },
        ]);

      if (error) throw error;

      setModalState({ type: 'success', message: 'Agendamento realizado com sucesso! Redirecionando...' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Erro no handleSubmit:', error);
      const errorMessage = error.message.includes("upload") 
        ? `Erro ao enviar o áudio. Verifique suas políticas de Storage.`
        : `Erro ao criar o agendamento. Verifique os dados e as políticas da tabela 'bookings'.`;
      setModalState({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setFormData(prev => ({ ...prev, date: formattedDate, time: '', audio_url: '' })); // Limpa o áudio ao mudar a data
  };

  const handleCloseModal = () => {
    setModalState(null);
  };

  const getBookingsForDate = (date: string) => {
    return bookedSlots.filter(slot => slot.service_date === date).length;
  };

  const isTimeSlotAvailable = (date: string, time: string) => {
    return !bookedSlots.some(slot => 
      slot.service_date === date && 
      slot.booking_time === time
    );
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <Title>Agendar Serviço</Title>

        <InputGroup>
          <Label htmlFor="name">Nome Completo</Label>
          <InputWithIcon>
            <User size={20} />
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputWithIcon>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="serviceType">Tipo de Serviço</Label>
          <InputWithIcon>
            <Wrench size={20} />
            <ServiceSelect
              id="serviceType"
              name="serviceType"
              value={formData.service_type}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um serviço</option>
              <option value="Instalação">Instalação</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Limpeza">Limpeza</option>
            </ServiceSelect>
          </InputWithIcon>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="phone">Telefone</Label>
          <InputWithIcon>
            <Phone size={20} />
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </InputWithIcon>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="address">Endereço</Label>
          <InputWithIcon>
            <Home size={20} />
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </InputWithIcon>
        </InputGroup>

        <InputGroup>
          <Label>Selecione a Data do Serviço</Label>
          <CalendarContainer>
            <CalendarHeader>
              <MonthNavigator onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft size={20} />
              </MonthNavigator>
              <CurrentMonth>
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </CurrentMonth>
              <MonthNavigator onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight size={20} />
              </MonthNavigator>
            </CalendarHeader>
            <CalendarGrid>
              {weekDays.map(day => (
                <WeekDay key={day}>{day}</WeekDay>
              ))}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <Day key={`empty-${index}`} disabled />
              ))}
              {monthDays.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const bookingsCount = getBookingsForDate(dateStr);
                const isFullyBooked = bookingsCount >= 3;
                const isPastDate = day < new Date(new Date().setHours(0, 0, 0, 0));
                return (
                  <Day
                    key={day.toISOString()}
                    isBooked={isFullyBooked}
                    isSelected={formData.date === dateStr}
                    onClick={() => !isFullyBooked && !isPastDate && handleDateSelect(day)}
                    disabled={isFullyBooked || isPastDate}
                  >
                    {format(day, 'd')}
                  </Day>
                );
              })}
            </CalendarGrid>
          </CalendarContainer>
        </InputGroup>

        {formData.date && (
          <InputGroup>
            <TimeSlotLabel>
              <Clock size={20} />
              <Label htmlFor="time">Selecione o Horário</Label>
            </TimeSlotLabel>
            <TimeSelect
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um horário</option>
              {timeSlots.map(time => (
                <option
                  key={time}
                  value={time}
                  disabled={!isTimeSlotAvailable(formData.date, time)}
                >
                  {time}
                </option>
              ))}
            </TimeSelect>
          </InputGroup>
        )}

        <InputGroup>
          <Label htmlFor="description">Observações Adicionais</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Por favor, forneça detalhes adicionais sobre suas necessidades de serviço"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label htmlFor="audio">Gravar Áudio (Opcional)</Label>
          <AudioControls>
            {!isRecording && !audioURL && (
              <AudioButton type="button" onClick={startRecording} disabled={isSubmitting}>
                <Mic size={20} /> Gravar
              </AudioButton>
            )}
            {isRecording && (
              <AudioButton type="button" onClick={stopRecording} disabled={isSubmitting}>
                <StopCircle size={20} /> Parar
              </AudioButton>
            )}
            {audioURL && (
              <AudioPlayerContainer>
                <audio controls src={audioURL} />
                <AudioButton type="button" onClick={deleteAudio} disabled={isSubmitting}>
                  <Trash2 size={20} /> Excluir
                </AudioButton>
              </AudioPlayerContainer>
            )}
          </AudioControls>
          {isRecording && <p>Gravando áudio...</p>}
          {audioURL && <p>Áudio gravado. Você pode reproduzir ou excluir.</p>}
        </InputGroup>



        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Agendando...' : 'Agendar Serviço'}
        </SubmitButton>

      </FormContainer>
      {modalState && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalIcon type={modalState.type}>
              {modalState.type === 'success' ? <CheckCircle size={48} /> : <XCircle size={48} />}
            </ModalIcon>
            <ModalMessage>{modalState.message}</ModalMessage>
            <ModalCloseButton onClick={handleCloseModal}>
              Fechar
            </ModalCloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}


