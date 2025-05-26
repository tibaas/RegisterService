import { supabase } from "../../lib/supabase";
import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { Container, ErrorMessage, FormContainer, GoogleButton, Title } from "./styles";

export const LoginForm: React.FC = () => {
  // const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>Admin Login</Title>
        
        <GoogleButton 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <LogIn size={20} />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </GoogleButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
    </Container>
  );
};