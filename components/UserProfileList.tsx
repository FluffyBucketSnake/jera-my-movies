import AddIcon from "@mui/icons-material/Add";
import SelectedIcon from "@mui/icons-material/Check";
import {
  Button,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SxProps,
} from "@mui/material";
import { useUserProfile } from "context/UserProfileContext";
import NextLink from "next/link";
import React, { FC, useRef, useState } from "react";

export type UserProfileListProps = {
  sx?: SxProps;
};

const UserProfileList: FC<UserProfileListProps> = ({ sx }) => {
  const {
    loading: profileLoading,
    user,
    currentProfile,
    changeCurrentProfile,
  } = useUserProfile();

  const [listOpen, setListOpen] = useState<boolean>(false);

  const listAnchorRef = useRef<HTMLButtonElement | null>(null);

  const openList = () => setListOpen(true);
  const closeList = () => setListOpen(false);

  if (profileLoading) {
    return <CircularProgress color="inherit" size="1rem" sx={sx} />;
  }

  return (
    <>
      <Button
        type="button"
        color="inherit"
        size="large"
        id="user-profile-list--button"
        aria-controls={listOpen ? "user-profile-list--menu" : undefined}
        aria-haspopup="true"
        aria-expanded={listOpen ? "true" : undefined}
        sx={sx}
        ref={listAnchorRef}
        onClick={openList}
      >
        Profile: {currentProfile?.name ?? "None"}
      </Button>
      <Menu
        id="user-profile-list--menu"
        anchorEl={listAnchorRef.current}
        open={listOpen}
        onClose={closeList}
        MenuListProps={{
          "aria-labelledby": "user-profile-list--button",
        }}
      >
        {[
          ...user.profiles!.map(({ id, name }) => (
            <MenuItem
              key={id}
              selected={id === currentProfile?.id}
              onClick={() => changeCurrentProfile(id)}
            >
              <ListItemText>{name}</ListItemText>
            </MenuItem>
          )),
          ...(user.canCreateNewProfile
            ? [
                ...(user.profiles!.length > 0
                  ? [<Divider key="@divider" />]
                  : []),
                <NextLink key="@new" href="/profiles/create" passHref>
                  <MenuItem>
                    <ListItemIcon>
                      <AddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Create a new profile</ListItemText>
                  </MenuItem>
                </NextLink>,
              ]
            : []),
        ]}
      </Menu>
    </>
  );
};

export default UserProfileList;
