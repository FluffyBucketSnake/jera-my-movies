import { ProfileDTO } from "dtos/Profile";
import "next-auth";

declare module "next-auth" {
  export interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
    };
  }
}
