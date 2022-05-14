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
import { useSession } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";

const LOCAL_STORAGE_CURRENT_PROFILE_KEY = "mymovies:current_profile";

export type UserProfileListProps = {
  sx?: SxProps;
};

const UserProfileList: FC<UserProfileListProps> = ({ sx }) => {
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated: () => router.push("/login"),
  });

  const [listOpen, setListOpen] = useState<boolean>(false);
  const [currentProfileId, setCurrentProfileId] = useState<string>();

  const listAnchorRef = useRef<HTMLButtonElement | null>(null);

  const openList = () => setListOpen(true);
  const closeList = () => setListOpen(false);
  const changeCurrentProfile = (id: string) => {
    localStorage.setItem(LOCAL_STORAGE_CURRENT_PROFILE_KEY, id);
    setCurrentProfileId(id);
  };

  useEffect(() => {
    if (!(status === "authenticated" && data.user.signupComplete)) return;
    const currentProfileId = localStorage.getItem(
      LOCAL_STORAGE_CURRENT_PROFILE_KEY
    );
    setCurrentProfileId(currentProfileId ?? undefined);
  }, [status, data]);

  if (status === "loading") {
    return <CircularProgress color="inherit" size="1rem" sx={sx} />;
  }

  const { user } = data;
  const currentProfile =
    user.profiles!.find(({ id }) => id === currentProfileId) ??
    user.profiles![0];

  if (!user.signupComplete) {
    throw new Error(
      "This component can only be used with full signed up users"
    );
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
