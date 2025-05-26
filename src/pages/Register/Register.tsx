import { useEffect, useState } from "react";
import { Mail, Phone, User, Home, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { CalendarContainer, CalendarGrid, CalendarHeader, Container, CurrentMonth, Day, ErrorMessage, FormContainer, Input, InputGroup, InputWithIcon, Label, MonthNavigator, SubmitButton, SuccessMessage, TextArea, TimeSelect, TimeSlotLabel, Title, WeekDay } from "./styles";
import { addMonths, eachDayOfInterval, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";




interface BookedSlot {
  service_date: string;
  booking_time: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    description: '',
  });

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            service_date: formData.date,
            booking_time: formData.time,
            description: formData.description,
            status: 'pending'
          },
        ]);

      if (error) throw error;

      setSuccess('Booking submitted successfully! Redirecting to home page...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to submit booking. Please try again.');
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
    setFormData(prev => ({ ...prev, date: formattedDate, time: '' }));
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <Title>Schedule Your Service</Title>

        <InputGroup>
          <Label htmlFor="name">Full Name</Label>
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
          <Label htmlFor="email">Email</Label>
          <InputWithIcon>
            <Mail size={20} />
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputWithIcon>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="phone">Phone Number</Label>
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
          <Label htmlFor="address">Address</Label>
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
          <Label>Select Service Date</Label>
          <CalendarContainer>
            <CalendarHeader>
              <MonthNavigator onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft size={20} />
              </MonthNavigator>
              <CurrentMonth>
                {format(currentDate, 'MMMM yyyy')}
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
              <Label htmlFor="time">Select Time Slot</Label>
            </TimeSlotLabel>
            <TimeSelect
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Select a time</option>
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
          <Label htmlFor="description">Service Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please describe the service you need (installation, maintenance, repair, etc.)"
            required
          />
        </InputGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Schedule Service'}
        </SubmitButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </FormContainer>
    </Container>
  );
};


// export function Register() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     date: '',
//     description: '',
//   });
//   //temporary booked dates just for tests
//   const bookedDates = [
//     new Date(2024, new Date().getMonth(), 13),
//     new Date(2024, new Date().getMonth(), 15),
//     new Date(2024, new Date().getMonth(), 20),
//   ];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Here we'll add the database submission logic later
//     console.log(formData);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleDateSelect = (date: Date) => {
//     setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
//   };

//   const isDateBooked = (date: Date) => {
//     return bookedDates.some(bookedDate => isSameDay(date, bookedDate));
//   };

//   const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
//   const monthStart = startOfMonth(currentDate);
//   const monthEnd = endOfMonth(currentDate);
//   const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

//   return(
//     <Container>
//       <FormContainer onSubmit={handleSubmit}>
//         <Title>Schedule Your Service</Title>

//         <InputGroup>
//           <Label htmlFor="name">Full Name</Label>
//           <InputWithIcon>
//             <User size={20} />
//             <Input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </InputWithIcon>
//         </InputGroup>

//         <InputGroup>
//           <Label htmlFor="email">Email</Label>
//           <InputWithIcon>
//             <Mail size={20} />
//             <Input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </InputWithIcon>
//         </InputGroup>

//         <InputGroup>
//           <Label htmlFor="phone">Phone Number</Label>
//           <InputWithIcon>
//             <Phone size={20} />
//             <Input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//             />
//           </InputWithIcon>
//         </InputGroup>

//         <InputGroup>
//           <Label htmlFor="address">Address</Label>
//           <InputWithIcon>
//             <Home size={20} />
//             <Input
//               type="text"
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               required
//             />
//           </InputWithIcon>
//         </InputGroup>

//         <InputGroup>
//           <Label>Select Service Date</Label>
//           <CalendarContainer>
//             <CalendarHeader>
//               <MonthNavigator onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
//                 <ChevronLeft size={20} />
//               </MonthNavigator>
//               <CurrentMonth>
//                 {format(currentDate, 'MMMM yyyy', {locale: ptBR})}
//               </CurrentMonth>
//               <MonthNavigator onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
//                 <ChevronRight size={20} />
//               </MonthNavigator>
//             </CalendarHeader>
//             <CalendarGrid>
//               {weekDays.map(day => (
//                 <WeekDay key={day}>{day}</WeekDay>
//               ))}
//               {Array.from({ length: monthStart.getDay() }).map((_, index) => (
//                 <Day key={`empty-${index}`} disabled />
//               ))}
//               {monthDays.map(day => (
//                 <Day
//                   key={day.toISOString()}
//                   isBooked={isDateBooked(day)}
//                   isSelected={formData.date === format(day, 'yyyy-MM-dd')}
//                   onClick={() => !isDateBooked(day) && handleDateSelect(day)}
//                   disabled={isDateBooked(day)}
//                 >
//                   {format(day, 'd', {locale: ptBR})}
//                 </Day>
//               ))}
//             </CalendarGrid>
//           </CalendarContainer>
//         </InputGroup>

//         <InputGroup>
//           <Label htmlFor="description">Service Description</Label>
//           <TextArea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             placeholder="Please describe the service you need (installation, maintenance, repair, etc.)"
//             required
//           />
//         </InputGroup>

//         <SubmitButton type="submit">
//           Schedule Service
//         </SubmitButton>
//       </FormContainer>
//     </Container>
    
//   )
// }