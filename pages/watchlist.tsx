import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Movie from "components/Movie";
import MovieFilterForm from "components/MovieFilterForm";
import MovieList from "components/MovieList";
import { useUserProfile } from "context/UserProfileContext";
import { useWatchlist } from "hooks/useWatchlist";
import DefaultLayout from "layouts/DefaultLayout";
import { withAuthentication } from "middlewares/frontend/withAuthentication";
import type { NextPage } from "next";
import { FC } from "react";

const WatchlistPage: NextPage = () => {
  return (
    <DefaultLayout title="Watchlist">
      <Watchlist />
    </DefaultLayout>
  );
};

const Watchlist: FC = () => {
  const { loading: profileLoading, profiles } = useUserProfile();
  const { loading: fetchingWatchlist, watchlist } = useWatchlist();

  const hasNoProfile = !(profileLoading || profiles.length > 0);

  if (hasNoProfile) {
    return (
      <Typography component="span" variant="h6">
        You have no profiles. Create one first to look at your watchlist
      </Typography>
    );
  }

  return <MovieList movieIds={watchlist} loading={fetchingWatchlist} />;
};

export const getServerSideProps = withAuthentication(async () => ({
  props: {},
}));

export default WatchlistPage;
