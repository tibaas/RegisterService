import { useNavigate } from "react-router-dom"
import { Container, Content, Description, IconContainer, RegisterButton, Title } from "./styles"
import { Wind, CalendarArrowUp, Snowflake } from "lucide-react"


export function Home() {
  const navigate = useNavigate()

  return (
    <Container>
      <Content>
        <IconContainer>
          <Snowflake size={48} />
          <Wind size={48} />
        </IconContainer>
        <Title>Serviço Profissional em Climatizações</Title>
        <Description>
          Manutenção, limpeza, instalação e serviços em geral, atendemos em Ouricuri e região.
        </Description>
        <RegisterButton onClick={() => navigate('/register')}>
          Agendar Serviço
          <CalendarArrowUp size={20} />
        </RegisterButton>
      </Content>
    </Container>
  )
}