import { Container } from "@mui/material";
import Footer from "components/Footer";
import NavBar from "components/NavBar";
import Head from "next/head";
import React, { FC, PropsWithChildren } from "react";

export type DefaultLayoutProps = PropsWithChildren<{ title: string }>;

const DefaultLayout: FC<DefaultLayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title} - MyMovies</title>
      </Head>
      <NavBar title={title} />
      <Container maxWidth="md" sx={{ flex: 1 }}>
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default DefaultLayout;
