import "next-auth";

declare module "next-auth" {
  export interface Session {
    user: {
      name?: string;
      email: string;
    };
  }
}
