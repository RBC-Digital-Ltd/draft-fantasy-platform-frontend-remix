import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { auth } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const { userProfile } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  if (!userProfile) {
    return redirect("/create-profile");
  }

  return redirect("/");
};
