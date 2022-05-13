import movieDB from "apis/tmdb";
import { NextApiHandler } from "next";

export type GetMoviesQuery = {
  q?: string;
};

export type GetMoviesResponse = {
  movieIds: number[];
};

const GetMoviesRoute: NextApiHandler<GetMoviesResponse> = async (req, res) => {
  const { q: query } = req.query as GetMoviesQuery;
  const tmdbResponse = await (query
    ? movieDB.searchMovie({ query })
    : movieDB.moviePopular());
  const movies = tmdbResponse.results!;
  const movieIds = movies.map(({ id }) => id!);
  res.json({ movieIds });
};

export default GetMoviesRoute;
