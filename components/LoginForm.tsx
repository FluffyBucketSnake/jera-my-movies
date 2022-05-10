import FacebookIcon from "@mui/icons-material/Facebook";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import React, { FC } from "react";

const LoginForm: FC = () => {
  return (
    <Box component="form" display="flex" flexDirection="column">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography component="h2" variant="h6" align="center" gutterBottom>
          ...with your email
        </Typography>
        <TextField label="Email" type="email" margin="dense" fullWidth />
        <TextField label="Password" type="password" margin="dense" fullWidth />
      </Paper>
      <Typography
        component="span"
        variant="subtitle2"
        align="center"
        sx={{ mb: 3 }}
      >
        ...or...
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography component="h2" variant="h6" align="center" gutterBottom>
          ...with your social media account
        </Typography>
        <Button startIcon={<FacebookIcon />} variant="contained" fullWidth>
          Facebook
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginForm;
