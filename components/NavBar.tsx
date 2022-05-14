import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { signOut } from "next-auth/react";
import { title } from "process";
import React, { FC, useState } from "react";
import UserProfileList from "./UserProfileList";

export type NavBarProps = {
  title: string;
};

const NavBar: FC<NavBarProps> = ({ title }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      <AppBar component="nav" position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="h1">
            MyMovies - {title}
          </Typography>
          <UserProfileList sx={{ ml: "auto" }} />
          <Button
            color="inherit"
            size="large"
            onClick={() => signOut()}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box component="nav" sx={{ width: 240 }}>
          <List>
            <ListItem button>
              <ListItemText primary="Home" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => signOut()}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
