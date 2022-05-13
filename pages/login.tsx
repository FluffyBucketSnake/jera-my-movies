import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import LoginForm from "../components/LoginForm";
import { LoginLayout } from "../layouts/LoginLayout";

const LoginPage: NextPage = () => {
  return (
    <LoginLayout title="Login">
      <LoginForm />
    </LoginLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    if (session.user.signupComplete) {
      return { redirect: { permanent: false, destination: "/" } };
    }
    return { redirect: { permanent: false, destination: "/signup" } };
  }
  return { props: {} };
};

export default LoginPage;
