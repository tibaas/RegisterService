import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, MapPin, Phone, Mail, MessageSquare, CheckCircle, XCircle, User, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ActionButtons, BookingCard, BookingDate, BookingGrid, BookingInfo, Button, Container, Description, Header, InfoItem, PageButton, Pagination, StatusBadge, Title } from './styles';


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
  created_at: string;
}

export const Admin: React.FC = () => {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false)
  const bookingsPerPage = 10;

  useEffect(() => {
    // checkIfAdmin();
    fetchBookings();
  }, []);

  // const checkIfAdmin = async () => {
  //   const {
  //     data: {user},
  //     error,
  //   } = await supabase.auth.getUser()

  //   if (error) {
  //     console.error('Error getting user:', error)
  //     return
  //   }
  //   if (user?.email === 'tibaz420@gmail.com') {
  //     setIsAdmin(true)
  //   }
  // }

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('service_date', { ascending: true })
        .order('booking_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Header>
        <Title>Service Bookings</Title>
      </Header>
      
      <BookingGrid>
        {currentBookings.map((booking) => (
          <BookingCard key={booking.id}>
            <BookingDate>
              <Calendar size={20} />
              {format(parseISO(booking.service_date), "d 'de' MMMM yyyy", {
                locale: ptBR,
              })}
              {/* {(booking.service_date)} */}
              <Clock size={16} style={{ marginLeft: '8px' }} />
              {booking.booking_time}
            </BookingDate>
            
            <StatusBadge status={booking.status}>
              {booking.status === 'completed' ? (
                <CheckCircle size={16} />
              ) : booking.status === 'cancelled' ? (
                <XCircle size={16} />
              ) : (
                <Clock size={16} />
              )}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </StatusBadge>

            <BookingInfo>
              <InfoItem>
                <User size={18} />
                {booking.name}
              </InfoItem>
              <InfoItem>
                <Mail size={18} />
                {booking.email}
              </InfoItem>
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

            <ActionButtons>
              {booking.status === 'pending' && (
                <>
                  <Button
                    variant="success"
                    onClick={() => updateBookingStatus(booking.id, 'completed')}
                    disabled={isLoading}
                  >
                    <CheckCircle size={16} />
                    Complete
                  </Button>
                  <Button
                    variant="error"
                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                    disabled={isLoading}
                  >
                    <XCircle size={16} />
                    Cancel
                  </Button>
                </>
              )}
              <Button
                variant="delete"
                onClick={() => deleteBooking(booking.id)}
                disabled={isLoading}
              >
                <Trash2 size={16} />
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
          Previous
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
          Next
        </PageButton>
      </Pagination>
    </Container>
  );
};