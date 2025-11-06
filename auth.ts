import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./auth.db"),
  baseURL: import.meta.env.BETTER_AUTH_URL || "http://localhost:4321",
  secret: import.meta.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: import.meta.env.GOOGLE_CLIENT_ID!,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});