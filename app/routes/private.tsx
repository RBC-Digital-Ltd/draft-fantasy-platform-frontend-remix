import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { auth } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const { profile, accessToken } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return json({ profile, accessToken });
};

export default function Screen() {
  const { profile, accessToken } = useLoaderData<typeof loader>();
  return (
    <>
      <Form method="post" action="/logout">
        <button>Log Out</button>
      </Form>

      <hr />

      <pre>
        <code>{JSON.stringify(profile, null, 2)}</code>
      </pre>
      <hr />
      <pre>
        <code>{JSON.stringify(accessToken, null, 2)}</code>
      </pre>
    </>
  );
}
