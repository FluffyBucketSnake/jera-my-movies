import movieDB from "apis/tmdb";
import { MovieDTO, MovieImage } from "dtos/Movie";
import { NextApiHandler } from "next";

export type GetMovieParams = {
  movieId: string;
};

export type GetMovieResponse = { movie: MovieDTO };

type TMDBImageConfiguration = {
  baseURL: string;
  size: string;
};

const GetMovieRoute: NextApiHandler<GetMovieResponse> = async (req, res) => {
  const { movieId } = req.query as GetMovieParams;
  const movie: MovieDTO = await getMovieFromTMDB(movieId);
  res.json({ movie });
};

export default GetMovieRoute;

async function getMovieFromTMDB(movieId: string) {
  const configuration: TMDBImageConfiguration = await getImageConfiguration();
  const tmdbResponse = await movieDB.movieInfo({
    id: movieId,
    append_to_response: "images",
  });
  const title = tmdbResponse.title!;
  const [tmdbPoster] = (tmdbResponse as any).images.posters;
  const poster = convertTMDBImage(tmdbPoster, configuration);
  const movie: MovieDTO = { id: parseInt(movieId), title, poster };
  return movie;
}

async function getImageConfiguration() {
  const tmdbResponse = await movieDB.configuration();
  const baseURL = tmdbResponse.images.secure_base_url!;
  const sizes = tmdbResponse.images.poster_sizes!;
  const size = sizes.find((size) => size === "original") ?? sizes.at(0)!;
  const configuration: TMDBImageConfiguration = { baseURL, size };
  return configuration;
}

function convertTMDBImage(
  tmdbImage: any,
  configuration: TMDBImageConfiguration
): MovieImage {
  const src = new URL(
    configuration.size + tmdbImage.file_path,
    configuration.baseURL
  ).href;
  const width = tmdbImage.width;
  const height = tmdbImage.height;
  return { src, width, height };
}
