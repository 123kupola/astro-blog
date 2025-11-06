import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const db = new Database("./auth.db");

export const auth = betterAuth({
  database: db,
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

// Helper function to assign admin role to first user
export function assignFirstUserAdminRole(userId: string) {
  try {
    // Check if this is the first user
    const userCount = db.prepare("SELECT COUNT(*) as count FROM user").get() as { count: number };

    if (userCount.count === 1) {
      // This is the first user, make them admin
      db.prepare("UPDATE user SET role = 'admin' WHERE id = ?").run(userId);
      console.log(`First user assigned admin role`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error assigning admin role:", error);
    return false;
  }
}

// Helper function to get user role
export function getUserRole(userId: string): string {
  try {
    const user = db.prepare("SELECT role FROM user WHERE id = ?").get(userId) as { role: string } | undefined;
    return user?.role || 'user';
  } catch (error) {
    console.error("Error getting user role:", error);
    return 'user';
  }
}