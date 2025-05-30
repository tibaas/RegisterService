import styled from "styled-components";


export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

export const FormContainer = styled.form`
  width: 100%;
  max-width: 500px;
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;

  @media (min-width: 640px) {
    font-size: 2rem;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

export const InputWithIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 0.75rem;
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.5;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CalendarContainer = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
`;

export const MonthNavigator = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const CurrentMonth = styled.div`
  font-weight: 500;
  font-size: 0.875rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
  padding: 1px;
`;

export const WeekDay = styled.div`
  background: #f8fafc;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  @media (min-width: 640px) {
    font-size: 0.875rem;
    padding: 0.75rem;
  }
`;

interface DayProps {
  isBooked?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
}

export const Day = styled.button<DayProps>`
  aspect-ratio: 1;
  background: ${props => 
    props.isSelected ? props.theme.colors.primary : 
    props.isBooked ? '#f1f5f9' : 
    'white'
  };
  border: none;
  color: ${props => 
    props.isSelected ? 'white' : 
    props.isBooked ? '#94a3b8' : 
    props.theme.colors.text
  };
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => 
      props.disabled ? '#f1f5f9' : 
      props.isSelected ? props.theme.colors.primary : 
      '#e2e8f0'
    };
  }

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
`;

export const TimeSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TimeSlotLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;


export const ServiceSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

export const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;