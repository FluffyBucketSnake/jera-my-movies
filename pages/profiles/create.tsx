import { Box, Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import { prisma } from "config/db";
import DefaultLayout from "layouts/DefaultLayout";
import { withAuthentication } from "middlewares/frontend/withAuthentication";
import { NextPage } from "next";
import { getSession } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export type Props = {
  forbidden: boolean;
};

const CreateProfilePage: NextPage<Props> = ({ forbidden }) => {
  const router = useRouter();

  const [creatingProfile, setCreatingProfile] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>("");

  const createProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreatingProfile(true);
    const data = { name: profileName };
    try {
      await axios.post("/api/user/profiles", data);
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // TODO: use an actual type
        alert((err.response.data as any).error.message);
        setCreatingProfile(false);
        return;
      }
      throw err;
    }
  };

  return (
    <DefaultLayout title="Create a new profile">
      {!forbidden ? (
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
            disabled={creatingProfile}
            sx={{ ml: 2 }}
          >
            Create new profile
          </Button>
        </Box>
      ) : (
        <Box
          component="section"
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={4}
        >
          <Typography
            component="span"
            variant="h6"
            color="error"
            align="center"
          >
            You already have the max amount of profiles
          </Typography>
          <NextLink href="/" passHref>
            <Button color="primary" sx={{ mt: 2 }}>
              Go back
            </Button>
          </NextLink>
        </Box>
      )}
    </DefaultLayout>
  );
};

export const getServerSideProps = withAuthentication<Props>(async (context) => {
  const session = (await getSession(context))!;
  const forbidden = !session.user.canCreateNewProfile;
  return { props: { forbidden } };
});

export default CreateProfilePage;
