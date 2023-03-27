import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const theme = createTheme();

export default function LogIn() {
  const { login, token } = useAuth();
  const [mail, setMail]  = useState('');
  const [password, setPassword]  = useState('');
  // const [buttonDisabled, setButtonDisabled]  = useState(true);

  // useEffect(() => {
  //   const validate = validateMail(mail);
  //   if(validate && password){
  //     setButtonDisabled(false)
  //   } else {
  //     setButtonDisabled(true)
  //   }
  // }, [mail, password]);

  // const validateMail = (mail: string) => {
  //   return String(mail)
  //     .toLowerCase()
  //     .match(
  //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //     );
  // };

  if (token) {
    return <Navigate to="/calculator/operations" />;
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login({
      username: data.get("email"),
      password: data.get("password")
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={mail}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setMail(event.target.value)
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value)
              }}
            />
              <Button
                type="submit"
                fullWidth
                // disabled={buttonDisabled}
                variant="contained"
                sx={{mt: 3, mb: 2}}
              >
                LOGIN
              </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
