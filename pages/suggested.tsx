import { Typography } from "@mui/material";
import MovieList from "components/MovieList";
import { useUserProfile } from "context/UserProfileContext";
import { useSuggestedMovies } from "hooks/useSuggestedMovies";
import DefaultLayout from "layouts/DefaultLayout";
import { withAuthentication } from "middlewares/frontend/withAuthentication";
import type { NextPage } from "next";
import { FC } from "react";

const SuggestedMoviesPage: NextPage = () => {
  return (
    <DefaultLayout title="Suggested movies">
      <SuggestedMovieList />
    </DefaultLayout>
  );
};

const SuggestedMovieList: FC = () => {
  const { loading: profileLoading, profiles } = useUserProfile();
  const { loading: fetchingMovies, movies } = useSuggestedMovies();

  const hasNoProfile = !(profileLoading || profiles.length > 0);

  if (hasNoProfile) {
    return (
      <Typography component="span" variant="h6">
        You have no profiles. Create one first to look at your suggested movies
      </Typography>
    );
  }

  if (movies && movies.length === 0) {
    return (
      <Typography
        component="span"
        variant="body1"
        color="textSecondary"
        sx={{ mx: "auto" }}
      >
        Your list is empty. Add some movies to your watchlist and
        recommendations will appear here
      </Typography>
    );
  }

  return <MovieList movieIds={movies} loading={fetchingMovies} />;
};

export const getServerSideProps = withAuthentication(async () => ({
  props: {},
}));

export default SuggestedMoviesPage;
