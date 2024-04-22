import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox,
    Paper, Grid, Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchHeader from '../components/SearchHeader'
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Api } from '@mui/icons-material';

// 주소: /SignIn



const defaultTheme = createTheme();

export default function SignIn() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };
  const register = async () => {
    await Api
      .post("/pages/SignIn", {
        uid,
        password,
      })
      .then((res) =>{
        console.log(res);
        const token = res.data.access_token;
        localStorage.setItem("token", token);
        window.localStorage.replace("/");
      })
      .catch((err) => console.log(err));
  }

  return (
    <ThemeProvider theme={defaultTheme}>
        <SearchHeader />
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              로그인
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="나를 기억하기"   // 아이디 기억하기 기능이나 로그인 상태 유지하기 구현 예정
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                로그인
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" style={{ textDecoration: 'none', color: 'black'  }}>
                    비밀번호을 잊으셨나요?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/SignUp" variant="body2" style={{ textDecoration: 'none', color: 'black'  }}>
                    {"계정이 없으신가요? 가입하기"}
                  </Link>
                </Grid>
              </Grid>
              <Footer sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
