import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);


      img {
    height: 15rem;
    width: 25rem;
    position: absolute;
    margin-bottom: 32rem;
    /* background: black; */
    
  }

  @media (max-width: 450px) {

      img {
    height: 13rem;
    width: 23rem;
    position: absolute;
    /* margin-bottom: 21rem; */
    /* background: black; */
    
  }

  }
`;

export const Content = styled.div`
  max-width: 800px;
  /* background: ${({ theme }) => theme.colors.white}; */
  background: #f2f2f2 ;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;


`;

export const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  opacity: 0.9;
`;

export const RegisterButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;
export const IconContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};


`;