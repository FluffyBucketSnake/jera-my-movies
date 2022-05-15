import { MovieWatchlistEntry } from "@prisma/client";

export type MovieWatchlistEntryDTO = {
  movieId: number;
  watched: boolean;
};

export function convertMovieWatchlistEntryModelToDTO(
  model: MovieWatchlistEntry
): MovieWatchlistEntryDTO {
  return {
    movieId: parseInt(model.movieId),
    watched: model.watched,
  };
}
