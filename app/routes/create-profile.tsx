import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { auth, destroySession, getSession } from "~/utils/auth.server";

import {
  API_BASE,
  AUTH0_LOGOUT_URL,
  AUTH0_RETURN_TO_URL,
  AUTH0_CLIENT_ID,
} from "~/constants/index.server";

export const loader = async ({ request }: LoaderArgs) => {
  const { userProfile } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  if (userProfile) {
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
  console.log(body);

  console.log("sending request to create profile...");

  await fetch(`${API_BASE}/profile`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      firstName: body.get("firstName"),
      lastName: body.get("lastName"),
      email: body.get("email"),
    }),
  });

  const session = await getSession(request.headers.get("Cookie"));
  const logoutURL = new URL(AUTH0_LOGOUT_URL);

  logoutURL.searchParams.set("client_id", AUTH0_CLIENT_ID);
  logoutURL.searchParams.set("returnTo", AUTH0_RETURN_TO_URL);

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function CreateProfile() {
  return (
    <>
      <Form method="post" action="/create-profile">
        <label htmlFor="firstName">First Name: </label>
        <input name="firstName" type="text" />
        <label htmlFor="lastname">Last Name: </label>
        <input name="lastName" type="text" />
        <label htmlFor="email">Email: </label>
        <input name="email" type="email" />
        <button type="submit">Create Profile</button>
      </Form>
    </>
  );
}
