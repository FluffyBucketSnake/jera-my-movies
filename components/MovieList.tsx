import { Box, CircularProgress } from "@mui/material";
import React, { FC } from "react";
import Movie from "./Movie";

export type MovieListProps = {
  movieIds?: number[];
  loading?: boolean;
};

const MovieList: FC<MovieListProps> = ({ loading, movieIds }) => {
  return (
    <Box position="relative" width={1}>
      {loading && (
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
  );
};

export default MovieList;
