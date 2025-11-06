import { auth } from "../../../../auth";

export async function POST({ request }: { request: Request }) {
  try {
    // Sign out the user
    const result = await auth.api.signOut({
      headers: request.headers,
    });

    // Return success response
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to logout" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}