import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { MovieDTO } from "dtos/Movie";
import Image from "next/image";
import { GetMovieResponse } from "pages/api/movies/[movieId]";
import React, { FC, useEffect, useState } from "react";

export type MovieProps = {
  movieId: number;
};

const Movie: FC<MovieProps> = ({ movieId }) => {
  const [fetchingMovie, setFetchingMovie] = useState<boolean>();
  const [movie, setMovie] = useState<MovieDTO>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    setFetchingMovie(true);
    setMovie(undefined);
    fetch(`/api/movies/${movieId}`)
      .then((response) => response.json())
      .then(({ movie }: GetMovieResponse) => {
        setMovie(movie);
      })
      .catch(setError)
      .finally(() => setFetchingMovie(false));
  }, [movieId]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 240,
        width: "100%",
        height: 300,
        overflow: "hidden",
        m: 2,
      }}
    >
      <CardContent
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: 0,
        }}
      >
        <>
          {fetchingMovie && <CircularProgress size="3rem" />}
          {error && (
            <Typography variant="caption" color="error">
              There was an error while fetching the movie data. Details:{" "}
              {JSON.stringify(error)}
            </Typography>
          )}
          {movie && (
            <Image
              src={movie.poster.src}
              layout="fill"
              objectFit="cover"
              alt={movie.poster.src}
            />
          )}
        </>
      </CardContent>
      <CardContent>
        {movie && (
          <Typography
            component="span"
            variant="h6"
            align="center"
            sx={{ mt: 1 }}
          >
            {movie.title}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default Movie;
