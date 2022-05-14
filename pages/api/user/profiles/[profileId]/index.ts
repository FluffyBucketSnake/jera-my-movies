import { User, UserData } from "@prisma/client";
import { prisma } from "config/db";
import { convertProfileModelToDTO, ProfileDTO } from "dtos/Profile";
import { withAuthentication } from "middlewares/backend/withAuthentication";
import { NextApiRequest, NextApiResponse } from "next";
import firstOrSelf from "utils/firstOrSelf";

export type GetProfileResponse = {
  profile: ProfileDTO;
};

async function GetProfileRoute(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) {
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
  const dto = convertProfileModelToDTO(profile);
  const resBody: GetProfileResponse = { profile: dto };
  res.json(resBody);
}

export default withAuthentication(GetProfileRoute);
