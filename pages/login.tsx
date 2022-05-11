import { NextPage } from "next";
import LoginForm from "../components/LoginForm";
import { LoginLayout } from "../layouts/LoginLayout";

const LoginPage: NextPage = () => {
  return (
    <LoginLayout title="Login">
      <LoginForm />
    </LoginLayout>
  );
};

export default LoginPage;
