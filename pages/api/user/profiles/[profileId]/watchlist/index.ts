import { Profile, User, UserData } from "@prisma/client";
import movieDB from "apis/tmdb";
import { prisma } from "config/db";
import {
  convertMovieWatchlistEntryModelToDTO,
  MovieWatchlistEntryDTO,
} from "dtos/MovieWatchlistEntry";
import { convertProfileModelToDTO } from "dtos/Profile";
import { withAuthentication } from "middlewares/backend/withAuthentication";
import { NextApiRequest, NextApiResponse } from "next";
import firstOrSelf from "utils/firstOrSelf";
import { z, ZodError } from "zod";

export const zodAddMovieToWatchlistRequest = z.object({ movieId: z.number() });

export type AddMovieToWatchlistRequest = z.infer<
  typeof zodAddMovieToWatchlistRequest
>;

export type GetWatchlistResponse = {
  entries: MovieWatchlistEntryDTO[];
};

async function AddMovieToWatchlistHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  profile: Profile
) {
  const { movieId } = zodAddMovieToWatchlistRequest.parse(req.body);
  const movieExists = await movieDB
    .movieInfo({ id: movieId })
    .then(() => true)
    .catch(() => false);
  if (!movieExists) {
    return res
      .status(404)
      .json({ error: { message: "The specified movie does not exist" } });
  }
  const alreadyOnTheList = !!(await prisma.movieWatchlistEntry.findUnique({
    where: {
      movieId_profileId: { movieId: movieId.toString(), profileId: profile.id },
    },
  }));
  if (alreadyOnTheList) return res.status(200).end();
  await prisma.movieWatchlistEntry.create({
    data: {
      profileId: profile.id,
      movieId: movieId.toString(),
      watched: false,
    },
  });
  return res.status(201).end();
}

async function GetWatchlistHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  profile: Profile
) {
  const entries = await prisma.movieWatchlistEntry.findMany({
    where: { profileId: profile.id },
  });
  const dtos = entries.map(convertMovieWatchlistEntryModelToDTO);
  const resBody: GetWatchlistResponse = { entries: dtos };
  return res.json(resBody);
}

async function ProfileWatchlistRoute(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) {
  const profileId = firstOrSelf(req.query.profileId)!;
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: { userData: true },
  });
  if (!profile) {
    res
      .status(404)
      .json({ error: { message: "The specified profile does not exist" } });
    return;
  }
  if (profile.userDataId !== user.info.id) {
    res
      .status(403)
      .json({ error: { message: "Profile belongs to another user" } });
    return;
  }
  try {
    switch (req.method) {
      case "POST":
        await AddMovieToWatchlistHandler(req, res, profile);
        return;
      case "GET":
        await GetWatchlistHandler(req, res, profile);
        return;
      default:
        return res.status(405).json({
          error: {
            message: `This route does not allow ${req.method} requests`,
          },
        });
    }
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: { message: err.message } });
      return;
    }
    throw err;
  }
}

export default withAuthentication(ProfileWatchlistRoute);
