import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
