import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import theme from './theme';
import BackgroundVideo from './components/common/BackgroundVideo';
import BackgroundAudio from './components/common/BackgroundAudio';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BackgroundVideo />
      <BackgroundAudio />
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
