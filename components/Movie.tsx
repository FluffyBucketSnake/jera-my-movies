import AddToWatchlistIcon from "@mui/icons-material/AddBoxOutlined";
import AddedToWatchlistIcon from "@mui/icons-material/Check";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { MovieDTO } from "dtos/Movie";
import { useWatchlistStatus } from "hooks/useWatchlistStatus";
import Image from "next/image";
import NextLink from "next/link";
import { GetMovieResponse } from "pages/api/movies/[movieId]";
import React, { FC, useEffect, useState } from "react";

export type MovieProps = {
  movieId: number;
};

const Movie: FC<MovieProps> = ({ movieId }) => {
  const [fetchingMovie, setFetchingMovie] = useState<boolean>(false);
  const {
    status: watchlistStatus,
    movieStatus: watchlistMovieStatus,
    addToWatchlist,
  } = useWatchlistStatus(movieId);
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
            <>
              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F8F8F8",
                  right: (theme) => theme.spacing(1),
                  top: (theme) => theme.spacing(1),
                  zIndex: 10,
                  borderRadius: "100%",
                  p: 1,
                  width: 1,
                  height: 1,
                  maxWidth: "2.5rem",
                  maxHeight: "2.5rem",
                }}
              >
                {watchlistStatus === "loading" && (
                  <CircularProgress color="inherit" size="1rem" />
                )}
                {watchlistStatus === "noprofile" && (
                  <NextLink href="/profiles/create" passHref>
                    <IconButton aria-label="Add to watchlist">
                      <AddToWatchlistIcon />
                    </IconButton>
                  </NextLink>
                )}
                {watchlistStatus === "loaded" &&
                  (watchlistMovieStatus !== "notadded" ? (
                    <AddedToWatchlistIcon />
                  ) : (
                    <IconButton
                      aria-label="Add to watchlist"
                      onClick={() => addToWatchlist()}
                    >
                      <AddToWatchlistIcon />
                    </IconButton>
                  ))}
              </Box>
              {movie.poster ? (
                <Image
                  src={movie.poster.src}
                  layout="fill"
                  objectFit="cover"
                  alt={movie.poster.src}
                />
              ) : (
                <Typography variant="caption" align="center">
                  This movie does not have poster
                </Typography>
              )}
            </>
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
