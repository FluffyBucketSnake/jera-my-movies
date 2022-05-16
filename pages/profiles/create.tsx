import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useUserProfile } from "context/UserProfileContext";
import DefaultLayout from "layouts/DefaultLayout";
import { withAuthentication } from "middlewares/frontend/withAuthentication";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FC, FormEvent, useState } from "react";
import { useMutation } from "react-query";

const CreateProfilePage: NextPage = () => {
  return (
    <DefaultLayout title="Create a new profile">
      <CreateProfile />
    </DefaultLayout>
  );
};

const CreateProfile: FC = () => {
  const router = useRouter();

  const {
    loading: loadingProfiles,
    canUserCreateNewProfile,
    invalidateProfiles,
  } = useUserProfile();

  const [profileName, setProfileName] = useState<string>("");

  const createProfileMutation = useMutation(
    (name: string) => axios.post("/api/user/profiles", { name }),
    {
      onSuccess: () => {
        invalidateProfiles();
        router.push("/");
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.response) {
          alert((err.response.data as any).error.message);
          return;
        }
        alert(err);
      },
    }
  );

  const createProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createProfileMutation.mutate(profileName);
  };

  const creatingProfile = createProfileMutation.isLoading;

  if (loadingProfiles) {
    return (
      <Box
        component="section"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!canUserCreateNewProfile) {
    return (
      <Box
        component="section"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
      >
        <Typography component="span" variant="h6" color="error" align="center">
          You already have the max amount of profiles
        </Typography>
        <NextLink href="/" passHref>
          <Button color="primary" sx={{ mt: 2 }}>
            Go back
          </Button>
        </NextLink>
      </Box>
    );
  }

  return (
    <Box component="form" display="flex" p={4} onSubmit={createProfile}>
      <TextField
        label="Profile name"
        name="name"
        type="text"
        sx={{ flex: 1 }}
        onChange={(e) => setProfileName(e.target.value)}
      />
      <Button
        type="submit"
        color="primary"
        variant="contained"
        size="large"
        disabled={creatingProfile || loadingProfiles}
        sx={{ ml: 2 }}
      >
        Create new profile
      </Button>
    </Box>
  );
};

export const getServerSideProps = withAuthentication(async (context) => ({
  props: {},
}));

export default CreateProfilePage;
