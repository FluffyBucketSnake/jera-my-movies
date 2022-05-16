import { Button, Paper, TextField } from "@mui/material";
import axios from "axios";
import { LoginLayout } from "layouts/LoginLayout";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { FormEvent, useState } from "react";

export type SignUpPageProps = {
  hydratedFields: HydratedFields;
};

export type HydratedFields = {
  email: string | null;
};

const SignUpPage: NextPage<SignUpPageProps> = ({ hydratedFields }) => {
  const router = useRouter();
  const [signingUp, setSigningUp] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  const signUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signingUp) return;
    setSigningUp(true);
    const formData = new FormData(formRef.current!);
    const data = {
      email: formData.get("email") ?? hydratedFields.email,
      password: formData.get("password"),
      birthday: formData.get("birthday"),
    };
    try {
      await axios.post("/api/user/signup", data);
      router.push("/login");
    } catch (err) {
      alert("Failed to sign up. Try again later.");
    }
    setSigningUp(false);
  };

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
        ref={formRef}
        onSubmit={signUp}
      >
        <TextField
          name="email"
          type="email"
          label={!hydratedFields.email ? "Email" : undefined}
          margin="dense"
          value={hydratedFields.email ?? undefined}
          disabled={!!hydratedFields.email}
        />
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
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={signingUp}
        >
          Sign Up
        </Button>
      </Paper>
    </LoginLayout>
  );
};

export const getServerSideProps: GetServerSideProps<SignUpPageProps> = async (
  context
) => {
  const session = await getSession(context);
  if (session) {
    if (session.user.signupComplete) {
      return { redirect: { permanent: false, destination: "/" } };
    }
    return { props: { hydratedFields: { email: session.user.email } } };
  }
  return { props: { hydratedFields: { email: null } } };
};

export default SignUpPage;
