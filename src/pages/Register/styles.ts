import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

export const FormContainer = styled.form`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  padding: 1rem;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.5rem;

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

export const Input = styled.input`
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

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export const InputWithIcon = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.text};
    opacity: 0.5;
  }

  input {
    padding-left: 2.5rem;
  }
`;

export const CalendarContainer = styled.div`
  margin-bottom: 2rem;
  overflow: hidden;
  width: 100%;
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

export const MonthNavigator = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CurrentMonth = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background: ${({ theme }) => theme.colors.background};
  padding: 0.5rem;
  border-radius: 8px;

  @media (min-width: 640px) {
    gap: 0.5rem;
    padding: 1rem;
  }
`;

export const WeekDay = styled.div`
  text-align: center;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.25rem;
  font-size: 0.8rem;

  @media (min-width: 640px) {
    padding: 0.5rem;
    font-size: 1rem;
  }
`;

interface DayProps {
  isBooked?: boolean;
  isSelected?: boolean;
}

export const Day = styled.button<DayProps>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${({ isBooked, isSelected, theme }) => 
    isBooked ? theme.colors.error + '20' : 
    isSelected ? theme.colors.primary : 
    theme.colors.white};
  color: ${({ isBooked, isSelected, theme }) => 
    isBooked ? theme.colors.error : 
    isSelected ? theme.colors.white : 
    theme.colors.text};
  cursor: ${({ isBooked }) => isBooked ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  @media (min-width: 640px) {
    font-size: 1rem;
    border-radius: 8px;
  }

  &:hover {
    background: ${({ isBooked, theme }) => 
      isBooked ? theme.colors.error + '20' : 
      theme.colors.primary + '20'};
    transform: ${({ isBooked }) => isBooked ? 'none' : 'translateY(-2px)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.background};
  }
`;