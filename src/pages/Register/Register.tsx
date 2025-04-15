import { useState } from "react";
import { Mail, Phone, User, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarContainer, CalendarGrid, CalendarHeader, Container, CurrentMonth, Day, FormContainer, Input, InputGroup, InputWithIcon, Label, MonthNavigator, SubmitButton, TextArea, Title, WeekDay } from "./styles";
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth, subMonths } from "date-fns";


export function Register() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    description: '',
  });
  //temporary booked dates just for tests
  const bookedDates = [
    new Date(2024, new Date().getMonth(), 13),
    new Date(2024, new Date().getMonth(), 15),
    new Date(2024, new Date().getMonth(), 20),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll add the database submission logic later
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
    setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(date, bookedDate));
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return(
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
              {monthDays.map(day => (
                <Day
                  key={day.toISOString()}
                  isBooked={isDateBooked(day)}
                  isSelected={formData.date === format(day, 'yyyy-MM-dd')}
                  onClick={() => !isDateBooked(day) && handleDateSelect(day)}
                  disabled={isDateBooked(day)}
                >
                  {format(day, 'd')}
                </Day>
              ))}
            </CalendarGrid>
          </CalendarContainer>
        </InputGroup>

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

        <SubmitButton type="submit">
          Schedule Service
        </SubmitButton>
      </FormContainer>
    </Container>
    
  )
}