import { useState } from "react";
import { Mail, Phone, User, Home, Calendar } from "lucide-react";
import { Container, FormContainer, Input, InputGroup, InputWithIcon, Label, SubmitButton, TextArea, Title } from "./styles";


export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll add the database submission logic later
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return(
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <Title>Agende seu serviço</Title>

        <InputGroup>
          <Label htmlFor="name">Nome</Label>
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
          <Label htmlFor="phone">Contato</Label>
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
          <Label htmlFor="address">Endereço</Label>
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
          <Label htmlFor="date">Data para o serviço</Label>
          <InputWithIcon>
            <Calendar size={20} />
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </InputWithIcon>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="description">Descreva alguma informação adicional importante</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva serviço que você deseja (instalação, manutenção, reparo, etc.)"
            required
          />
        </InputGroup>

        <SubmitButton type="submit">
          Agendar serviço
        </SubmitButton>
      </FormContainer>
    </Container>
    
  )
}