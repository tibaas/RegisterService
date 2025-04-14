import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const FormContainer = styled.form`
  max-width: 800px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
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