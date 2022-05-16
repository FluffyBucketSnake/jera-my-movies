import { User, UserData } from "@prisma/client";
import { prisma } from "config/db";
import { convertProfileModelToDTO, ProfileDTO } from "dtos/Profile";
import { withAuthentication } from "middlewares/backend/withAuthentication";
import { NextApiRequest, NextApiResponse } from "next";
import firstOrSelf from "utils/firstOrSelf";

export type GetUserDataResponse = {
  signupComplete: boolean;
  canCreateNewProfile?: boolean;
};

async function GetProfileRoute(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) {
  const profileCount =
    user.info &&
    (await prisma.profile.count({
      where: { userDataId: user.info.id },
    }));
  const canCreateNewProfile =
    profileCount != null ? profileCount < 4 : undefined;
  const resBody: GetUserDataResponse = {
    signupComplete: !!user.info,
    canCreateNewProfile,
  };
  res.json(resBody);
}

export default withAuthentication(GetProfileRoute, {
  signupCompleteOnly: false,
});
