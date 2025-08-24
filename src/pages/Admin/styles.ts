import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  //to try to fit the screen in desktop mode was 1200px before
  max-width: 100vw;
  margin: 0 auto;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.white};
`;

export const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  
`;

export const BookingDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = styled.div<StatusBadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'completado':
        return `
          background-color: ${theme.colors.success}15;
          color: ${theme.colors.success};
        `;
      case 'cancelado':
        return `
          background-color: ${theme.colors.error}15;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background-color: ${theme.colors.primary}15;
          color: ${theme.colors.primary};
        `;
    }
  }}
`;

export const BookingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Description = styled.div`
  display: flex;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    margin-top: 0.25rem;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

interface ButtonProps {
  variant: 'success' | 'error' | 'delete';
  disabled?: boolean;
}

export const Button = styled.button<ButtonProps>`
  flex: 1;
  padding: 0.5rem;
  border: none;
  white-space: nowrap;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: opacity 0.2s;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};

  ${({ variant, theme }) => {
    switch (variant) {
      case 'success':
        return `background: ${theme.colors.success}; color: white;`;
      case 'error':
        return `background: ${theme.colors.error}; color: white;`;
      case 'delete':
        return `background: #EF4444; color: white;`;
      default:
        return '';
    }
  }}

  &:hover {
    opacity: ${props => props.disabled ? 0.5 : 0.9};
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

export const PageButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  background: ${({ active, theme }) => active ? theme.colors.primary : 'white'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.primary};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, disabled }) => !disabled && theme.colors.primary};
    color: ${({ disabled }) => !disabled && 'white'};
  }
`;