import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';

const theme = createTheme();

export default function Operations() {

  const [oneItem, setOneItem] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
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
            Select an Operations
          </Typography>
          <Box component="form" sx={{mt: 1}}>
          <Grid container spacing={3} >
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                
                onClick={()=>{setOneItem(false)}}
              >
                +
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={()=>{setOneItem(false)}}
              >
                -
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={()=>{setOneItem(false)}}
              >
                *
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={()=>{setOneItem(false)}}
              >
                /
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
              >
                RND
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={()=>{setOneItem(true)}}
              >
                √
              </Button>
            </Grid>
          </Grid>
            <TextField
              margin="normal"
              type="number"
              required
              fullWidth
              id="number1"
              label="number 1"
              name="number1"
              autoComplete="number1"
              autoFocus
            />
            { !oneItem &&
              <TextField
                margin="normal"
                type="number"
                required
                fullWidth
                id="number2"
                label="number 2"
                name="number2"
                autoComplete="number2"
                autoFocus
              />
            }
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}