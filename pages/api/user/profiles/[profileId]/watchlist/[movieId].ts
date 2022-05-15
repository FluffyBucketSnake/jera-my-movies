import { MovieWatchlistEntry, User, UserData } from "@prisma/client";
import { prisma } from "config/db";
import { withAuthentication } from "middlewares/backend/withAuthentication";
import { NextApiRequest, NextApiResponse } from "next";
import firstOrSelf from "utils/firstOrSelf";
import { z, ZodError } from "zod";

export const zodUpdateWatchlistMovieRequest = z.object({
  watched: z.boolean(),
});

export type UpdateWatchlistMovieRequest = z.infer<
  typeof zodUpdateWatchlistMovieRequest
>;

async function UpdateWatchlistMovieHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  entry: MovieWatchlistEntry
) {
  const { watched } = zodUpdateWatchlistMovieRequest.parse(req.body);
  entry.watched = watched;
  await prisma.movieWatchlistEntry.update({
    where: {
      movieId_profileId: { movieId: entry.movieId, profileId: entry.profileId },
    },
    data: { watched },
  });
  return res.status(200).end();
}

async function ProfileWatchlistRoute(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) {
  const profileId = firstOrSelf(req.query.profileId)!;
  const movieId = firstOrSelf(req.query.movieId)!;
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
  const entry = await prisma.movieWatchlistEntry.findUnique({
    where: { movieId_profileId: { movieId, profileId } },
  });
  if (!entry) {
    res.status(404).json({
      error: { message: "The specified movie is not inside the watchlist" },
    });
    return;
  }
  try {
    switch (req.method) {
      case "PUT":
        await UpdateWatchlistMovieHandler(req, res, entry);
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
