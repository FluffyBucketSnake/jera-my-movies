import { GetServerSideProps, PreviewData } from "next";
import { getSession } from "next-auth/react";
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
    if (!session.user.signupComplete) {
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
