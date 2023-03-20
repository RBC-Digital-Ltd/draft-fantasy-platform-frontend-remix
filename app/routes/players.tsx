import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { auth } from "~/utils/auth.server";

import { API_BASE } from "~/constants/index.server";

type Player = {
  id: string;
  name: string;
  position: string;
  footballTeam: {
    name: string;
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const { accessToken } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const res = await fetch(`${API_BASE}/players`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const players: Player[] = await res.json();

  return json({ players });
};

export default function Players() {
  const { players } = useLoaderData<typeof loader>();

  return (
    <main className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Players</h1>
      <div className="grid grid-cols-3">
        <div className="font-bold">Player</div>
        <div className="font-bold">Position</div>
        <div className="font-bold">Team</div>
        {players.map(({ name, position, footballTeam }) => (
          <>
            <div>{name}</div>
            <div>{position}</div>
            <div>{footballTeam.name}</div>
          </>
        ))}
      </div>
    </main>
  );
}
