import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { UserProfileProvider } from "context/UserProfileContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <UserProfileProvider>
        <CssBaseline />
        <Component {...pageProps} />
      </UserProfileProvider>
    </SessionProvider>
  );
}

export default MyApp;
