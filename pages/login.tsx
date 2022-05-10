import { Container, Typography } from "@mui/material";
import { NextPage } from "next";

import Head from "next/head";
import LoginForm from "../components/LoginForm";

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login - MyMovies</title>
      </Head>
      <Container sx={{ p: 4 }}>
        <Typography component="h1" variant="h3" align="center" gutterBottom>
          Login
        </Typography>
        <LoginForm />
      </Container>
    </>
  );
};

export default LoginPage;
