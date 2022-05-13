import movieDB from "apis/tmdb";
import { NextApiHandler } from "next";

export type GetMoviesResponse = {
  movieIds: number[];
};

const GetMoviesRoute: NextApiHandler<GetMoviesResponse> = async (req, res) => {
  const tmdbResponse = await movieDB.moviePopular();
  const movies = tmdbResponse.results!;
  const movieIds = movies.map(({ id }) => id!);
  res.json({ movieIds });
};

export default GetMoviesRoute;
