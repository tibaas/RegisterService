import { useNavigate } from "react-router-dom"
import { Container, Content, Description, IconContainer, RegisterButton, Title } from "./styles"
import { Wind, Thermometer } from "lucide-react"

export function Home() {
  const navigate = useNavigate()

  return (
    <Container>
      <Content>
        <IconContainer>
          <Wind size={48} />
          <Thermometer size={48} />
        </IconContainer>
        <Title>Professional Air Conditioning Services</Title>
        <Description>
          Expert installation, maintenance, and repair services for your comfort.
          Schedule your service today with our easy-to-use booking system.
        </Description>
        <RegisterButton onClick={() => navigate('/register')}>
          Schedule Service
          <Wind size={20} />
        </RegisterButton>
      </Content>
    </Container>
  )
}