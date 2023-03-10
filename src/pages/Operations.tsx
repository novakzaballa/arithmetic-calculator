import React, {useEffect, useState} from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { alpha } from '@mui/material/styles';


const theme = createTheme();

interface EnhancedTableToolbarProps {
  remainingMoney: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { remainingMoney } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...({
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Balance: {remainingMoney}
        </Typography>
    </Toolbar>
  );
}

export default function Operations() {

  const [oneItem, setOneItem] = useState(false);
  const [type, setType] = useState('');
  const [remainingMoney, setRemainingMoney] = useState(90);
  const [buttonDisabled, setButtonDisabled]  = useState(true);
  const [number1, setNumber1] = useState(NaN);
  const [number2, setNumber2] = useState(NaN);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if((number1 && number2 && type) || (number1 && type !== 'square_root')) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [number1, number2, type]);

  const setTypeAndOneItem = (type: string, oneItem: boolean) => {
    setType(type);
    setOneItem(oneItem);
  }
  const calculateResult = () => {
    const cost = 10;
    if(remainingMoney < cost ) {
      setOpenAlert(true)
    }

  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%' }}>
      <EnhancedTableToolbar remainingMoney={remainingMoney}/>
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
              Select an Operation
            </Typography>
            <Box component="form" sx={{mt: 1}}>
            <Grid container spacing={3} >
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={()=>{setTypeAndOneItem('addition', false)}}
                  sx={{background: type === 'addition' ? 'green' : 'primary'}}
                >
                  +
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={()=>{setTypeAndOneItem('subtraction', false)}}
                  sx={{background: type === 'subtraction' ? 'green' : 'primary'}}
                >
                  -
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={()=>{setTypeAndOneItem('multiplication', false)}}
                  sx={{background: type === 'multiplication' ? 'green' : 'primary'}}
                >
                  *
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={()=>{setTypeAndOneItem('division', false)}}
                  sx={{background: type === 'division' ? 'green' : 'primary'}}
                >
                  /
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={()=>{setTypeAndOneItem('random_string', false)}}
                  sx={{background: type === 'random_string' ? 'green' : 'primary'}}
                >
                  RND
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={()=>{setTypeAndOneItem('square_root', true)}}
                  sx={{background: type === 'square_root' ? 'green' : 'primary'}}
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
                label="number 1"
                name="number1"
                autoComplete="number1"
                autoFocus
                value={number1}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setNumber1(parseInt(event.target.value))
                }}
              />
              { !oneItem &&
                <TextField
                  margin="normal"
                  type="number"
                  required
                  fullWidth
                  label="number 2"
                  name="number2"
                  autoComplete="number2"
                  value={number2}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNumber2(parseInt(event.target.value))
                  }}
                />
              }
              <Collapse in={openAlert}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  {'You do not have enough credit to carry out the operation!'}
                </Alert>
              </Collapse>
              <Button
                fullWidth
                variant="contained"
                disabled={buttonDisabled}
                onClick={() => {calculateResult()}}
              >
                Result
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
