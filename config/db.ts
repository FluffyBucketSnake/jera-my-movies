import { PrismaClient } from "@prisma/client";
import { registerService } from "utils/registerService";

export const prisma = registerService("prisma", () => new PrismaClient());
