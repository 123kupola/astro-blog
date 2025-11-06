import Database from "better-sqlite3";

// Create database migration for user roles
const db = new Database("./auth.db");

// Add role column to user table if it doesn't exist
try {
  // Check if role column exists
  const tableInfo = db.prepare("PRAGMA table_info(user)").all();
  const hasRoleColumn = tableInfo.some((column) => column.name === 'role');

  if (!hasRoleColumn) {
    console.log("Adding role column to user table...");

    // Add role column with default value 'user'
    db.exec("ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'user'");

    // Create index for performance
    db.exec("CREATE INDEX IF NOT EXISTS idx_user_role ON user(role)");

    console.log("✅ Role column added successfully");
  } else {
    console.log("✅ Role column already exists");
  }

  // Check if this is the first user and make them admin
  const userCount = db.prepare("SELECT COUNT(*) as count FROM user").get();

  if (userCount.count === 0) {
    console.log("No users exist yet. First user will be assigned admin role.");
  } else {
    console.log(`Found ${userCount.count} existing users`);

    // Check if any user has admin role
    const adminCount = db.prepare("SELECT COUNT(*) as count FROM user WHERE role = 'admin'").get();

    if (adminCount.count === 0) {
      console.log("No admin users found. You may need to manually assign admin role to an existing user.");
      console.log("To make a user admin, run: UPDATE user SET role = 'admin' WHERE email = 'user@example.com';");
    } else {
      console.log(`Found ${adminCount.count} admin user(s)`);
    }
  }

} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  db.close();
}

console.log("Database migration completed successfully!");