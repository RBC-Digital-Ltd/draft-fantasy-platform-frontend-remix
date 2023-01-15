import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { auth } from "~/utils/auth.server";

import { API_BASE } from "~/constants/index.server";

export const loader = async ({ request }: LoaderArgs) => {
  const { userProfile } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  if (!userProfile) {
    return redirect("/check-profile");
  }

  return null;
};

/**
 * Create a profile for the user
 * After creating the profile, redirect to the logout URL
 * This will clear the session cookie and redirect to the homepage
 * We have to do this because the remix-auth-oauth2 package doesn't support re-verifying to get the user profile
 */
export const action = async ({ request }: ActionArgs) => {
  const { accessToken } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const body = await request.formData();

  await fetch(`${API_BASE}/leagues`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      league: {
        name: body.get("leagueName"),
      },
      team: {
        name: body.get("teamName"),
      },
    }),
  });

  return null;
};

export default function CreateLeague() {
  return (
    <>
      <Form method="post" action="/create-league">
        <label htmlFor="leagueName">League Name: </label>
        <input name="leagueName" type="text" />
        <label htmlFor="teamName">Team Name: </label>
        <input name="teamName" type="text" />
        <button type="submit">Create League</button>
      </Form>
    </>
  );
}
