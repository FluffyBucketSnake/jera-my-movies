import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import Movie from "components/Movie";
import MovieFilterForm from "components/MovieFilterForm";
import DefaultLayout from "layouts/DefaultLayout";
import { withAuthentication } from "middlewares/frontend/withAuthentication";
import type { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { GetMoviesResponse } from "./api/movies";

const Homepage: NextPage = () => {
  const [fetchingMovies, setFetchingMovies] = useState<boolean>(false);
  const [movieIds, setMovieIds] = useState<number[]>();
  const [query, setQuery] = useState<string>("");

  const refetchMovies = (query: string) => {
    setFetchingMovies(true);
    const baseURL = "/api/movies";
    fetch(query ? `${baseURL}?q=${query}` : baseURL)
      .then((response) => response.json())
      .then(({ movieIds }: GetMoviesResponse) => setMovieIds(movieIds))
      .catch(() => {})
      .finally(() => setFetchingMovies(false));
  };

  const updateFilter = (e: FormEvent<HTMLFormElement>, query: string) => {
    e.preventDefault();
    setQuery(query);
  };

  useEffect(() => refetchMovies(query), [query]);

  return (
    <DefaultLayout title="Home">
      <MovieFilterForm onSubmit={updateFilter} />
      <Box position="relative" width={1}>
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
