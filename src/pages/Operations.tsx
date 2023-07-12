import React, {useEffect, useState} from 'react';
import axios from 'axios';
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
import {alpha} from '@mui/material/styles';
import { useFlags, useFlagsmith } from 'flagsmith/react';
import {useAuth} from '../hooks/useAuth';
import axiosRetry from 'axios-retry';

const theme = createTheme();

interface EnhancedTableToolbarProps {
  remainingBalance: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {remainingBalance} = props;

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        ...{
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      }}
    >
      <Typography
        sx={{color: '#1976d2', justifyContent: 'flex-end'}}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Balance:
      </Typography>
      <Typography variant="h6" id='remainingBalance'>{remainingBalance}</Typography>
    </Toolbar>
  );
}

export default function Operations() {
  const {token, logout} = useAuth();

  const [oneItem, setOneItem] = useState(false);
  const [type, setType] = useState('');
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [operand1, setOperand1] = useState(NaN);
  const [operand2, setOperand2] = useState(NaN);
  const [openAlert, setOpenAlert] = useState(false);
  const [result, setResult] = useState(NaN);

  const flags = useFlags(['operation_rnd']);

  // const flagsmith = useFlagsmith();
  // flagsmith.init({
  //   environmentID: 'WYBZSCbJrGkApn9EqGZxEa',
  //   api:"http://localhost:8000/api/v1/",
  //   // cacheFlags: true, // stores flags in localStorage cache
  //   onChange: (oldFlags, params) => {
  //    //Occurs whenever flags are changed
  //    const { isFromServer } = params; //determines if the update came from the server or local cached storage
  //    console.log('DEBUG: isFromServer:', isFromServer)

  //    //Check for a feature
  //    if (flagsmith.hasFeature('operation_rnd')) {
  //       console.log('DEBUG: hasFeature:')
  //    }

  //    //Or, use the value of a feature
  //    const flagValue2 = flagsmith.getValue('operation_rnd')
  //    console.log('DEBUG: flagValue2:', flagValue2)
  //   },
  //  });

  // console.log('DEBUG: flags:', flags)

  const random_number_operation = flags.operation_rnd.enabled
  console.log('DEBUG: random_number_operation:', random_number_operation)

  useEffect(() => {
    if (operand1 && operand2 && type) {
      setButtonDisabled(false);
    } else if (
      operand1 &&
      (type === 'square_root' || type === 'random_string')
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [operand1, operand2, type]);

  useEffect(() => {
    axiosRetry(axios, {
      retries: 3,
      retryDelay: () => {
        return 10000;
      },
      retryCondition: (error) => {
        return error?.code === 'ERR_NETWORK';
      },
    });

    axios
      .get(
        'https://68i17san2e.execute-api.us-east-1.amazonaws.com/dev/api/v1/users/current_user/balance',
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      )
      .then((response) => {
        setRemainingBalance(response.data.payload.result);
      })
      .catch((e) => {
        if (e.response.status === 401) {
          logout();
        }
      });
  }, [logout, token]);

  const setTypeAndOneItem = (type: string, oneItem: boolean) => {
    setType(type);
    setOneItem(oneItem);
  };
  const calculateResult = (type: string, parameters: object) => {
    setOpenAlert(false);
    axiosRetry(axios, {
      retries: 3,
      retryDelay: () => {
        return 10000;
      },
      retryCondition: (error) => {
        console.log('ERROR: error:', error);
        return error?.code === 'ERR_NETWORK';
      },
    });

    axios
      .post(
        'https://68i17san2e.execute-api.us-east-1.amazonaws.com/dev/api/v1/operations',
        {
          operation: type,
          arguments: parameters,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      )
      .then((response) => {
        setResult(response.data.payload.result);
        setRemainingBalance(response.data.payload.user_balance);
      })
      .catch((e) => {
        if (e.response.status === 401) {
          logout();
        } else if (e.response.status === 503) {
          setOpenAlert(true);
        }
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{width: '100%'}}>
        <EnhancedTableToolbar remainingBalance={remainingBalance} />
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
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    name="addition"
                    onClick={() => {
                      setTypeAndOneItem('addition', false);
                    }}
                    sx={{background: type === 'addition' ? 'green' : 'primary'}}
                  >
                    +
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    name="subtraction"
                    onClick={() => {
                      setTypeAndOneItem('subtraction', false);
                    }}
                    sx={{
                      background: type === 'subtraction' ? 'green' : 'primary',
                    }}
                  >
                    -
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    name="multiplication"
                    onClick={() => {
                      setTypeAndOneItem('multiplication', false);
                    }}
                    sx={{
                      background:
                        type === 'multiplication' ? 'green' : 'primary',
                    }}
                  >
                    *
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    name="division"
                    onClick={() => {
                      setTypeAndOneItem('division', false);
                    }}
                    sx={{background: type === 'division' ? 'green' : 'primary'}}
                  >
                    /
                  </Button>
                </Grid>
                {random_number_operation && 
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    name="random_string"
                    onClick={() => {
                      setTypeAndOneItem('random_string', true);
                    }}
                    sx={{
                      background:
                        type === 'random_string' ? 'green' : 'primary',
                    }}
                  >
                    RND
                  </Button>
                </Grid>}
                <Grid item xs={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    name="square_root"
                    onClick={() => {
                      setTypeAndOneItem('square_root', true);
                    }}
                    sx={{
                      background: type === 'square_root' ? 'green' : 'primary',
                    }}
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
                label={type === 'random_string' ? 'Lenght' : 'Number 1'}
                name="operand1"
                autoComplete="operand1"
                autoFocus
                value={operand1}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOperand1(parseInt(event.target.value));
                }}
              />
              {!oneItem && (
                <TextField
                  margin="normal"
                  type="number"
                  required
                  fullWidth
                  label="Number 2"
                  name="operand2"
                  autoComplete="operand2"
                  value={operand2}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setOperand2(parseInt(event.target.value));
                  }}
                />
              )}
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
                  sx={{mb: 2}}
                >
                  {'You do not have enough credit to carry out the operation!'}
                </Alert>
              </Collapse>
              <Button
                fullWidth
                variant="contained"
                disabled={buttonDisabled}
                name="result"
                onClick={() => {
                  type === 'square_root'
                    ? calculateResult(type, {operand1})
                    : type === 'random_string'
                    ? calculateResult(type, {length: operand1})
                    : calculateResult(type, {operand1, operand2});
                }}
              >
                Result
              </Button>
              {!isNaN(result) && (
                <TextField
                  fullWidth
                  disabled
                  label="Result"
                  name="resultField"
                  value={result}
                  sx={{mt: 2}}
                />
              )}

              {/*!isNaN(result) &&<Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {result}
                </Typography>*/}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
