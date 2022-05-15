import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import Movie from "components/Movie";
import MovieFilterForm from "components/MovieFilterForm";
import MovieList from "components/MovieList";
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
      <MovieList movieIds={movieIds} loading={fetchingMovies} />
    </DefaultLayout>
  );
};

export const getServerSideProps = withAuthentication(async () => ({
  props: {},
}));

export default Homepage;
