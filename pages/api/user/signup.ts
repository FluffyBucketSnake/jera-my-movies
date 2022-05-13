import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "config/db";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export const signUpUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  birthday: z
    .union([z.string(), z.date()])
    .transform((input) => {
      if (typeof input === "string") {
        return new Date(input);
      }
      return input;
    })
    .refine((input) => input < new Date(), "Birthday needs to be before today"),
});

export type SignUpUserRequest = z.infer<typeof signUpUserRequestSchema>;

async function SignUpRoute(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const request = signUpUserRequestSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { email: request.email },
      include: { credential: true },
    });
    if (!user) {
      await registerNewUser(request);
      res.status(201).end();
    } else {
      if (user.credential) {
        res.status(403).end();
        return;
      }
      await createUserInfo(user, request);
      res.status(200).end();
      return;
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err);
      res.status(400).json({ message: err.message });
      return;
    }
    throw err;
  }
}

export default SignUpRoute;

async function registerNewUser(request: SignUpUserRequest) {
  const user = await prisma.user.create({
    data: { email: request.email },
  });
  await createUserInfo(user, request);
}

async function createUserInfo(user: User, request: SignUpUserRequest) {
  await createUserData(user, request);
  await createUserCredential(user, request.password);
}

const SALT_ROUNDS = 10;
async function createUserData(user: User, request: SignUpUserRequest) {
  await prisma.userData.create({
    data: { birthday: request.birthday, userId: user.id },
  });
}

async function createUserCredential(user: User, rawPassword: string) {
  const password = await bcrypt.hash(rawPassword, SALT_ROUNDS);
  await prisma.credential.create({ data: { password, userId: user.id } });
}
