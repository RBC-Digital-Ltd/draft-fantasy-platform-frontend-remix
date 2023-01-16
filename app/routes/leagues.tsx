import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { auth } from "~/utils/auth.server";

import { API_BASE } from "~/constants/index.server";

type League = {
  id: string;
  name: string;
  teams: Array<{
    id: string;
    name: string;
  }>;
};

export const loader = async ({ request }: LoaderArgs) => {
  const { accessToken } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const res = await fetch(`${API_BASE}/leagues`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const leagues: League[] = await res.json();

  return json({ leagues });
};

export default function Leagues() {
  const { leagues } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Leagues</h1>
      <table>
        <thead>
          <tr>
            <th>League Id</th>
            <th>League Name</th>
          </tr>
        </thead>
        <tbody>
          {leagues.map((league) => (
            <tr key={league.id}>
              <Link to={`/leagues/${league.id}/team/${league.teams[0].id}`}>
                <td>{league.id}</td>
              </Link>
              <td>{league.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
