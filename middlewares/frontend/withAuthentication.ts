import axios from "axios";
import { GetServerSideProps, PreviewData } from "next";
import { getSession } from "next-auth/react";
import { GetUserDataResponse } from "pages/api/user";
import { ParsedUrlQuery } from "querystring";

export function withAuthentication<
  P = {},
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
>(gssp: GetServerSideProps<P, Q, D>): GetServerSideProps<P, Q, D> {
  return async (context) => {
    const session = await getSession(context);
    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
      };
    }
    const data = await axios
      .get<GetUserDataResponse>("/api/user", {
        baseURL: process.env.NEXTAUTH_URL,
        headers: { Cookie: context.req.headers["cookie"] as string },
      })
      .then((response) => response.data);
    if (!data.signupComplete) {
      return {
        redirect: {
          permanent: false,
          destination: "/signup",
        },
      };
    }
    return gssp(context);
  };
}
