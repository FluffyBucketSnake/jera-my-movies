import { Button, Paper, TextField } from "@mui/material";
import { LoginLayout } from "layouts/LoginLayout";

const SignUpPage = () => {
  return (
    <LoginLayout title="Sign Up">
      <Paper
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 3,
          maxWidth: "sm",
          width: "100%",
        }}
      >
        <TextField name="email" type="email" label="Email" margin="dense" />
        <TextField
          name="password"
          type="password"
          label="Password"
          margin="dense"
        />
        <TextField
          name="birthday"
          type="date"
          label="Birthday"
          margin="dense"
        />
        <Button variant="contained" sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </Paper>
    </LoginLayout>
  );
};

export default SignUpPage;
