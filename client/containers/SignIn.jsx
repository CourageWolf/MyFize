import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LinkUI from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router';
import {
  Link,
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';
import PlaidButton from '../components/PlaidButton.jsx';

// renders copyright line at bottom of page
function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <LinkUI color='inherit' href='#'>
        MyFize
      </LinkUI>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function SignIn() {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successfulLogin, setLogin] = useState(false);

  const history = useHistory();

  // sends username/password to database to confirm login info
  const clickHandler = (e) => {
    console.log(username, password);
    e.preventDefault();
    console.log('enters click handler');
    fetch('/bcrypt/check_pw', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => data.json())
      .then((result) => {
        if (result) {
          // if username and password are a match, redirect to landing page
          setLogin(true);
          history.push('landing');
        } else {
          // otherwise, notify that password is incorrect
          alert('Invalid username or password');
        }
      })
      .then((data) => data.json())
      .then((result) => {
        if (result) {
          setLogin(true);
          history.push('landing');
        } else {
          alert('Invalid username or password');
        }
      });
  };

  // redirects to sign-up page to allow user to create account
  const toSignUpPage = () => {
    history.push('signup');
  };

  const routeChange = () => {
    if (successfulLogin) {
      return <Redirect to='/landing' />;
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='35'
            height='35'
            fill='currentColor'
            className='bi bi-wallet2'
            viewBox='0 0 16 16'
          >
            <path d='M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z' />
          </svg>
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value='remember' color='primary' />}
            label='Remember me'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={clickHandler}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <LinkUI href="#" variant="body2">  ---> stretch feature 
                Forgot password?
              </LinkUI> */}
            </Grid>
            <Grid item>
              <LinkUI href='#' onClick={() => toSignUpPage()} variant='body2'>
                {"Don't have an account?"} {<strong>Sign Up</strong>}
              </LinkUI>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
