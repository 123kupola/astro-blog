import { auth } from "../../../../auth";

export async function GET({ request }: { request: Request }) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      return new Response(
        JSON.stringify({
          loggedIn: true,
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ loggedIn: false }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return new Response(
      JSON.stringify({ loggedIn: false, error: "Failed to check auth status" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}