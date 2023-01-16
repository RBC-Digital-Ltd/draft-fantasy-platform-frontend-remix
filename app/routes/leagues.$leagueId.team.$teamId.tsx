import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { auth } from "~/utils/auth.server";
import { API_BASE } from "~/constants/index.server";

interface Player {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  footballTeamId: number;
}

interface PlayersResponse {
  players: Player[];
}

export const loader = async ({ request, params }: LoaderArgs) => {
  const { accessToken } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const res = await fetch(`${API_BASE}/leagueTeams/players/${params.teamId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const teamPlayers: PlayersResponse = await res.json();

  return json({ teamPlayers });
};

export default function Screen() {
  const { teamPlayers } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Players</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {teamPlayers.players.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
