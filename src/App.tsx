import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Home }  from './pages/Home/Home';
import { Register } from './pages/Register/Register';
import { GlobalStyle } from './styles/global';
import { defaultTheme } from './styles/themes/theme';
import { LoginForm } from './components/LoginForm/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { Admin } from './pages/Admin/Admin';


export function App() {

  return (
      <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element=
          {
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}


