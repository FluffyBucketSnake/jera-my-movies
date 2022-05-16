import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import LoginForm from "../components/LoginForm";
import { LoginLayout } from "../layouts/LoginLayout";
import { GetUserDataResponse } from "./api/user";

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
    const userData = await axios
      .get<GetUserDataResponse>("/api/user", {
        baseURL: process.env.NEXTAUTH_URL,
        headers: { Cookie: context.req.headers["cookie"] as string },
      })
      .then(({ data }) => data);
    if (userData.signupComplete) {
      return { redirect: { permanent: false, destination: "/" } };
    }
    return { redirect: { permanent: false, destination: "/signup" } };
  }
  return { props: {} };
};

export default LoginPage;
