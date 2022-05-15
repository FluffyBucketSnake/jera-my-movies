import { MovieWatchlistEntry, Profile } from "@prisma/client";
import { MovieWatchlistEntryDTO } from "./MovieWatchlistEntry";

export type ProfileDTO = {
  id: string;
  name: string;
  movieWatchlist: MovieWatchlistEntryDTO[];
};

export function convertProfileModelToDTO(
  model: Profile & { movieWatchlist: MovieWatchlistEntry[] }
): ProfileDTO {
  return {
    id: model.id,
    name: model.name,
    movieWatchlist: model.movieWatchlist.map(({ movieId, watched }) => ({
      movieId: parseInt(movieId),
      watched,
    })),
  };
}
