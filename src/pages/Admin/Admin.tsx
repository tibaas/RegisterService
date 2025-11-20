import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle, User, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ActionButtons, AudioPlayerWrapper, BookingCard, BookingDate, BookingGrid, BookingInfo, Button, Container, Description, Header, InfoItem, PageButton, Pagination, StatusBadge, Title } from './styles';


interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  service_date: string;
  booking_time: string;
  description: string;
  status: string;
  audio_url?: string; // Adiciona o campo opcional para a URL do áudio
  created_at: string;
}

export const Admin: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const bookingsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('service_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      const fetchedBookings = data || [];
      setBookings(fetchedBookings);
      generateSignedUrls(fetchedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSignedUrls = async (bookingsToProcess: Booking[]) => {
    const urls: Record<string, string> = {};
    for (const booking of bookingsToProcess) {
      if (booking.audio_url) {
        const path = new URL(booking.audio_url).pathname.split('/booking-audios/')[1];
        if (path) {
          const { data } = await supabase.storage
            .from('booking-audios')
            .createSignedUrl(path, 60 * 60); // URL válida por 1 hora

          if (data) {
            urls[booking.id] = data.signedUrl;
          }
        }
      }
    }
    setAudioUrls(prev => ({ ...prev, ...urls }));
  };



  const updateBookingStatus = async (id: string, status: string) => {
  try {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select(); // força retorno dos dados atualizados

    if (error) throw error;

    if (data && data.length > 0) {
      // Atualiza com dados reais do supabase
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id ? data[0] : booking
        )
      );
    } else {
      console.warn('Nenhum dado foi retornado após o update');
      // Como fallback, refetch tudo
      await fetchBookings();
    }
  } catch (error) {
    console.error('Error updating booking:', error);
    alert('Falha ao atualizar o status. Por favor, tente novamente.');
  } finally {
    setIsLoading(false);
  }
};

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Falha ao excluir o agendamento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };

  return (
    <Container>
      <Header>
        <Title>Agendamentos</Title>
      </Header>
      
      <BookingGrid>
        {currentBookings.map((booking) => (
          <BookingCard key={booking.id}>
            <BookingDate>
              <Calendar size={20} />
              {format(new Date(booking.service_date), 'dd/MM/yyyy')}
              <Clock size={16} style={{ marginLeft: '8px' }} />
              {booking.booking_time}
            </BookingDate>
            
            <StatusBadge status={booking.status}>
              {booking.status === 'completado' ? (
                <CheckCircle size={16} />
              ) : booking.status === 'cancelado' ? (
                <XCircle size={16} />
              ) : (
                <Clock size={16} />
              )}
              {getStatusDisplay(booking.status)}
            </StatusBadge>

            <BookingInfo>
              <InfoItem>
                <User size={18} />
                {booking.name}
              </InfoItem>
              {/* <InfoItem>
                <Mail size={18} />
                {booking.email}
              </InfoItem> */}
              <InfoItem>
                <Phone size={18} />
                {booking.phone}
              </InfoItem>
              <InfoItem>
                <MapPin size={18} />
                {booking.address}
              </InfoItem>
            </BookingInfo>

            <Description>
              <MessageSquare size={18} />
              {booking.description}
            </Description>
            
            {booking.audio_url && (
              <AudioPlayerWrapper>
                {audioUrls[booking.id] && <audio controls src={audioUrls[booking.id]} />}
              </AudioPlayerWrapper>
            )}

            <ActionButtons>
              {booking.status !== 'completado' && booking.status !== 'cancelado' && (
                <>
                  <Button
                    variant="success"
                    onClick={() => updateBookingStatus(booking.id, 'completado')}
                    disabled={isLoading}
                  >
                    <CheckCircle size={16} />
                    Completar
                  </Button>
                  <Button
                    variant="error"
                    onClick={() => updateBookingStatus(booking.id, 'cancelado')}
                    disabled={isLoading}
                  >
                    <XCircle size={16} />
                    Cancelar
                  </Button>
                </>
              )}
              <Button
                variant="delete"
                onClick={() => deleteBooking(booking.id)}
                disabled={isLoading}
              >
                <Trash2 size={16} />
                Excluir
              </Button>
            </ActionButtons>
          </BookingCard>
        ))}
      </BookingGrid>

      <Pagination>
        <PageButton
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Anterior
        </PageButton>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i + 1}
            onClick={() => paginate(i + 1)}
            active={currentPage === i + 1}
            disabled={isLoading}
          >
            {i + 1}
          </PageButton>
        ))}
        <PageButton
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Próximo
        </PageButton>
      </Pagination>
    </Container>
  );
};





















// import React, { useEffect, useState } from 'react';
// import { format } from 'date-fns';
// import { Calendar, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle, User, Trash2 } from 'lucide-react';
// import { supabase } from '../../lib/supabase';
// import { ActionButtons, AudioPlayerWrapper, BookingCard, BookingDate, BookingGrid, BookingInfo, Button, Container, Description, Header, InfoItem, PageButton, Pagination, StatusBadge, Title } from './styles';


// interface Booking {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   service_date: string;
//   booking_time: string;
//   description: string;
//   status: string;
//   audio_url?: string; 
//   created_at: string;
// }

// export const Admin: React.FC = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const bookingsPerPage = 10;

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     setIsLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('bookings')
//         .select('*')
//         .order('service_date', { ascending: true })
//         .order('booking_time', { ascending: true });

//       if (error) throw error;
//       setBookings(data || []);
//     } catch (error) {
//       console.error('Error fetching bookings:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };




//   const updateBookingStatus = async (id: string, status: string) => {
//   try {
//     setIsLoading(true);

//     const { data, error } = await supabase
//       .from('bookings')
//       .update({ status })
//       .eq('id', id)
//       .select(); // força retorno dos dados atualizados

//     if (error) throw error;

//     if (data && data.length > 0) {
//       // Atualiza com dados reais do supabase
//       setBookings(prevBookings => 
//         prevBookings.map(booking => 
//           booking.id === id ? data[0] : booking
//         )
//       );
//     } else {
//       console.warn('Nenhum dado foi retornado após o update');
//       // Como fallback, refetch tudo
//       await fetchBookings();
//     }
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     alert('Falha ao atualizar o status. Por favor, tente novamente.');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const deleteBooking = async (id: string) => {
//     if (!window.confirm('Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.')) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const { error } = await supabase
//         .from('bookings')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;
      
//       setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
//     } catch (error) {
//       console.error('Error deleting booking:', error);
//       alert('Falha ao excluir o agendamento. Por favor, tente novamente.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const indexOfLastBooking = currentPage * bookingsPerPage;
//   const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
//   const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
//   const totalPages = Math.ceil(bookings.length / bookingsPerPage);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   const getStatusDisplay = (status: string) => {
//     switch (status) {
//       case 'completado':
//         return 'Completado';
//       case 'cancelado':
//         return 'Cancelado';
//       default:
//         return 'Pendente';
//     }
//   };

//   return (
//     <Container>
//       <Header>
//         <Title>Agendamentos</Title>
//       </Header>
      
//       <BookingGrid>
//         {currentBookings.map((booking) => (
//           <BookingCard key={booking.id}>
//             <BookingDate>
//               <Calendar size={20} />
//               {format(new Date(booking.service_date), 'dd/MM/yyyy')}
//               <Clock size={16} style={{ marginLeft: '8px' }} />
//               {booking.booking_time}
//             </BookingDate>
            
//             <StatusBadge status={booking.status}>
//               {booking.status === 'completado' ? (
//                 <CheckCircle size={16} />
//               ) : booking.status === 'cancelado' ? (
//                 <XCircle size={16} />
//               ) : (
//                 <Clock size={16} />
//               )}
//               {getStatusDisplay(booking.status)}
//             </StatusBadge>

//             <BookingInfo>
//               <InfoItem>
//                 <User size={18} />
//                 {booking.name}
//               </InfoItem>
//               {/* <InfoItem>
//                 <Mail size={18} />
//                 {booking.email}
//               </InfoItem> */}
//               <InfoItem>
//                 <Phone size={18} />
//                 {booking.phone}
//               </InfoItem>
//               <InfoItem>
//                 <MapPin size={18} />
//                 {booking.address}
//               </InfoItem>
//             </BookingInfo>

//             <Description>
//               <MessageSquare size={18} />
//               {booking.description}
//             </Description>
            
//             {booking.audio_url && (
//               <AudioPlayerWrapper>
//                 <audio controls src={booking.audio_url} />
//               </AudioPlayerWrapper>
//             )}

//             <ActionButtons>
//               {booking.status !== 'completado' && booking.status !== 'cancelado' && (
//                 <>
//                   <Button
//                     variant="success"
//                     onClick={() => updateBookingStatus(booking.id, 'completado')}
//                     disabled={isLoading}
//                   >
//                     <CheckCircle size={16} />
//                     Completar
//                   </Button>
//                   <Button
//                     variant="error"
//                     onClick={() => updateBookingStatus(booking.id, 'cancelado')}
//                     disabled={isLoading}
//                   >
//                     <XCircle size={16} />
//                     Cancelar
//                   </Button>
//                 </>
//               )}
//               <Button
//                 variant="delete"
//                 onClick={() => deleteBooking(booking.id)}
//                 disabled={isLoading}
//               >
//                 <Trash2 size={16} />
//                 Excluir
//               </Button>
//             </ActionButtons>
//           </BookingCard>
//         ))}
//       </BookingGrid>

//       <Pagination>
//         <PageButton
//           onClick={() => paginate(currentPage - 1)}
//           disabled={currentPage === 1 || isLoading}
//         >
//           Anterior
//         </PageButton>
//         {Array.from({ length: totalPages }, (_, i) => (
//           <PageButton
//             key={i + 1}
//             onClick={() => paginate(i + 1)}
//             active={currentPage === i + 1}
//             disabled={isLoading}
//           >
//             {i + 1}
//           </PageButton>
//         ))}
//         <PageButton
//           onClick={() => paginate(currentPage + 1)}
//           disabled={currentPage === totalPages || isLoading}
//         >
//           Próximo
//         </PageButton>
//       </Pagination>
//     </Container>
//   );
// };
