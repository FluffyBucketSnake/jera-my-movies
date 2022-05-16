import { User, UserData } from "@prisma/client";
import { prisma } from "config/db";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export type WithAuthenticationAPIHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User & { info: UserData }
) => Promise<void>;

export type WithAuthenticationOptions = {
  signupCompleteOnly?: boolean;
};

export function withAuthentication(
  handler: WithAuthenticationAPIHandler,
  { signupCompleteOnly = true }: WithAuthenticationOptions = {}
): NextApiHandler {
  return async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
      res
        .status(401)
        .json({ error: { message: "This route needs authentication" } });
      return;
    }
    const user = (await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { info: true },
    }))!;
    if (signupCompleteOnly && !user.info) {
      res.status(403).json({
        error: { message: "This route only allows fully signed up users" },
      });
      return;
    }
    // This middleware only allows fully signup users, so info must not be null
    await handler(req, res, user as User & { info: UserData });
  };
}
