import { MovieWatchlistEntry, Profile, User, UserData } from "@prisma/client";
import movieDB from "apis/tmdb";
import { prisma } from "config/db";
import { withAuthentication } from "middlewares/backend/withAuthentication";
import { NextApiRequest, NextApiResponse } from "next";
import firstOrSelf from "utils/firstOrSelf";

export type GetSuggestedMoviesResponse = {
  movies: number[];
};

async function GetSuggestedMoviesRoute(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }
  const profileId = firstOrSelf(req.query.profileId)!;
  const profile = await prisma.profile.findFirst({
    where: { id: profileId, userDataId: user.info.id },
    include: { movieWatchlist: true },
  });
  if (!profile) {
    res.status(404).json({
      error: { message: "User has no profile with the specified ID" },
    });
    return;
  }
  const genres = await getProfileGenres(profile);
  const movieIds = await getSuggestedMoviesByGenre(genres);
  const resBody: GetSuggestedMoviesResponse = { movies: movieIds };
  res.json(resBody);
}

export default withAuthentication(GetSuggestedMoviesRoute);

async function getProfileGenres(
  profile: Profile & { movieWatchlist: MovieWatchlistEntry[] }
) {
  const genresByMovie = await Promise.all(
    profile.movieWatchlist.map(({ movieId }) => getMovieGenres(movieId))
  );
  const genresWithFrequencyMap = new Map<number, number>();
  genresByMovie
    .flat()
    .forEach((genre) =>
      genresWithFrequencyMap.set(
        genre,
        (genresWithFrequencyMap.get(genre) ?? 0) + 1
      )
    );
  return Array.from(genresWithFrequencyMap.entries()).sort(
    (a, b) => a[1] - b[1]
  );
}

function getMovieGenres(movieId: string): Promise<number[]> {
  return movieDB
    .movieInfo(movieId)
    .then(({ genres }) => genres!)
    .then((genres) => genres.map(({ id }) => id!));
}

const MAX_SUGGESTED_MOVIES = 20;

async function getSuggestedMoviesByGenre(
  genres: [number, number][]
): Promise<number[]> {
  genres.splice(3);
  return Promise.all(
    genres.map(([genreId, _]) =>
      movieDB
        .discoverMovie({ with_genres: genreId.toString() })
        .then(({ results }) => results!)
        .then((movies) =>
          movies.splice(0, MAX_SUGGESTED_MOVIES).map(({ id }) => id!)
        )
    )
  )
    .then((moviesByGenre) => moviesByGenre.flat())
    .then((movies) => new Set(movies).values())
    .then((movies) => Array.from(movies).splice(0, MAX_SUGGESTED_MOVIES));
}
