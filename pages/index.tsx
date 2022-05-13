import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import Movie from "components/Movie";
import DefaultLayout from "layouts/DefaultLayout";
import { withAuthentication } from "middlewares/frontend/withAuthentication";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { GetMoviesResponse } from "./api/movies";

const Homepage: NextPage = () => {
  const [fetchingMovies, setFetchingMovies] = useState<boolean>(false);
  const [movieIds, setMovieIds] = useState<number[]>();

  useEffect(() => {
    setFetchingMovies(true);
    fetch("/api/movies")
      .then((response) => response.json())
      .then(({ movieIds }: GetMoviesResponse) => setMovieIds(movieIds))
      .catch(() => {})
      .finally(() => setFetchingMovies(false));
  }, []);

  return (
    <DefaultLayout title="Home">
      <Box position="relative" p={4} width={1}>
        {fetchingMovies && (
          <CircularProgress
            sx={{
              position: "absolute",
              left: "50%",
              mt: 4,
              transform: "translate(-50%)",
            }}
          />
        )}
        {movieIds && (
          <Box
            component="ul"
            display="flex"
            justifyContent="center"
            flexDirection="row"
            flexWrap="wrap"
            width={1}
            p={0}
          >
            {movieIds.map((movieId) => (
              <Movie key={movieId} movieId={movieId} />
            ))}
          </Box>
        )}
      </Box>
    </DefaultLayout>
  );
};

export const getServerSideProps = withAuthentication(async () => ({
  props: {},
}));

export default Homepage;
