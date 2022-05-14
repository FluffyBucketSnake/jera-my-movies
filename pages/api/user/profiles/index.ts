import { User, UserData } from "@prisma/client";
import { prisma } from "config/db";
import { convertProfileModelToDTO, ProfileDTO } from "dtos/Profile";
import { withAuthentication } from "middlewares/backend/withAuthentication";
import { NextApiRequest, NextApiResponse } from "next";
import { z, ZodError } from "zod";

// This could go to a config file of business rules
const MAX_PROFILE_COUNT_PER_USER = 4;

export const zodCreateProfileRequest = z.object({
  name: z.string().min(1),
});

export type CreateProfileRequest = z.infer<typeof zodCreateProfileRequest>;

export type GetProfilesResponse = {
  profiles: ProfileDTO[];
};

async function CreateProfileHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) {
  const { name } = zodCreateProfileRequest.parse(req.body);
  const profileCount = await prisma.profile.count({
    where: { userDataId: user.info.id },
  });
  if (profileCount + 1 > MAX_PROFILE_COUNT_PER_USER) {
    res
      .status(403)
      .json({ error: { message: "Only 4 profiles per user are allowed" } });
    return;
  }
  const nameIsUsed = !!(await prisma.profile.findFirst({
    where: { userDataId: user.info.id, name },
  }));
  if (nameIsUsed) {
    res.status(403).json({
      error: { message: "A profile with the same name already exists" },
    });
    return;
  }
  await prisma.profile.create({ data: { userDataId: user.info.id, name } });
  res.status(201).end();
}

async function GetProfilesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) {
  const profiles = await prisma.profile.findMany({
    where: { userDataId: user.info.id },
  });
  const dtos = profiles.map(convertProfileModelToDTO);
  res.json({ profiles: dtos });
}

async function ProfileRoute(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) {
  try {
    switch (req.method) {
      case "POST":
        await CreateProfileHandler(req, res, user);
        return;
      case "GET":
        await GetProfilesHandler(req, res, user);
        return;
      default:
        res.status(405).json({
          error: {
            message: `This route does not allow ${req.method} requests`,
          },
        });
        return;
    }
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: { message: err.message } });
      return;
    }
    throw err;
  }
}

export default withAuthentication(ProfileRoute);
