import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  text-align: center;
`;

export const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

export const GoogleButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #fff;
  color: #757575;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    background: #f8f8f8;
    box-shadow: ${({ theme }) => theme.shadows.md};
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
`;