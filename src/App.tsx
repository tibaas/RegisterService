import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Home }  from './pages/Home/Home';
import { Register } from './pages/Register/Register';
import { GlobalStyle } from './styles/global';
import { defaultTheme } from './styles/themes/theme';


export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
   </ThemeProvider>
  )
}


