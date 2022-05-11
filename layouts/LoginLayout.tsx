import { Container, Typography } from "@mui/material";
import Head from "next/head";
import { FC, PropsWithChildren } from "react";

export type LoginLayoutProps = PropsWithChildren<{ title: string }>;

export const LoginLayout: FC<LoginLayoutProps> = ({ children, title }) => (
  <>
    <Head>
      <title>{title} - MyMovies</title>
    </Head>
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
        minWidth: "100vw",
        minHeight: "100vh",
        bgcolor: (theme) => theme.palette.primary.light,
      }}
    >
      <Typography component="h1" variant="h3" align="center" gutterBottom>
        {title}
      </Typography>
      {children}
    </Container>
  </>
);
