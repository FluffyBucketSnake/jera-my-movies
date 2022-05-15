import FacebookIcon from "@mui/icons-material/Facebook";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { signIn } from "next-auth/react";
import NextLink from "next/link";
import React, { FC, FormEvent } from "react";

const LoginForm: FC = () => {
  const loginWithCredentials = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    signIn("credentials", { email, password });
  };

  const loginWithFacebook = () => signIn("facebook");

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      onSubmit={loginWithCredentials}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography component="h2" variant="h6" align="center" gutterBottom>
          ...with your email
        </Typography>
        <TextField
          name="email"
          label="Email"
          type="email"
          margin="dense"
          fullWidth
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          margin="dense"
          fullWidth
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
          Login
        </Button>
      </Paper>
      <Typography
        component="span"
        variant="subtitle2"
        align="center"
        sx={{ mb: 3 }}
      >
        ...or...
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography component="h2" variant="h6" align="center" gutterBottom>
          ...with your social media account
        </Typography>
        <Button
          type="button"
          startIcon={<FacebookIcon />}
          variant="contained"
          onClick={loginWithFacebook}
          fullWidth
        >
          Facebook
        </Button>
      </Paper>
      <Typography
        component="span"
        variant="subtitle2"
        align="center"
        sx={{ mb: 3 }}
      >
        Don&apos;t have an account yet?
      </Typography>
      <Paper sx={{ p: 3 }}>
        <NextLink href="/signup" passHref>
          <Button type="button" variant="contained" fullWidth>
            Sign up
          </Button>
        </NextLink>
      </Paper>
    </Box>
  );
};

export default LoginForm;
