import { MovieWatchlistEntry, Profile } from "@prisma/client";

export type ProfileDTO = {
  id: string;
  name: string;
  movieWatchlist: number[];
};

export function convertProfileModelToDTO(
  model: Profile & { movieWatchlist: MovieWatchlistEntry[] }
): ProfileDTO {
  return {
    id: model.id,
    name: model.name,
    movieWatchlist: model.movieWatchlist.map(({ movieId }) =>
      parseInt(movieId)
    ),
  };
}
