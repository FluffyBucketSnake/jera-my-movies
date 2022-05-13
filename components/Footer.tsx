import { Box, Typography } from "@mui/material";
import Image from "next/image";
import TMDBLogo from "public/tmdb_logo.svg";
import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <Box
      component="footer"
      alignSelf="stretch"
      display="flex"
      flexDirection="column"
      alignItems="center"
      mx={2}
      borderTop="1px solid #0004"
      p={2}
    >
      <Typography variant="caption" gutterBottom>
        This product uses the TMDB API but is not endorsed or certified by TMDB
      </Typography>
      <Image src={TMDBLogo} height={16} alt="TMDB Logo" />
    </Box>
  );
};

export default Footer;
