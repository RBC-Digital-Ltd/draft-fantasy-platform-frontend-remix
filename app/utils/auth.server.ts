import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import type { Auth0Profile } from "remix-auth-auth0";
import { Auth0Strategy } from "remix-auth-auth0";

import {
  AUTH0_CALLBACK_URL,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_DOMAIN,
  SECRETS,
  API_BASE,
} from "~/constants/index.server";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  auth0Id: string;
}

interface Auth0ProfileToken {
  userProfile?: UserProfile;
  accessToken: string;
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_remix_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [SECRETS],
    secure: process.env.NODE_ENV === "production",
  },
});

export const auth = new Authenticator<Auth0ProfileToken>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  {
    callbackURL: AUTH0_CALLBACK_URL,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    domain: AUTH0_DOMAIN,
    scope: "openid profile email",
    audience: "https://draft-fantasy-pl-backend.fplstats.co.uk/",
  },
  async ({ accessToken }) => {
    const profileRes = await fetch(`${API_BASE}/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error("Unable to get user profile");
      return { accessToken };
    }

    const userProfile: UserProfile = await profileRes.json();

    return {
      userProfile,
      accessToken,
    };
  }
);

auth.use(auth0Strategy);

export const { getSession, commitSession, destroySession } = sessionStorage;
