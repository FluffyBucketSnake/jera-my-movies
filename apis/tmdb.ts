import { MovieDb } from "moviedb-promise";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY env. variable is not defined");
}
const movieDB = new MovieDb(TMDB_API_KEY);
export default movieDB;
