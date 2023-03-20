import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { auth } from "~/utils/auth.server";
import { API_BASE } from "~/constants/index.server";
import { useState } from "react";

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

export const positions = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Attacker",
] as const;

export const teams = [
  "Arsenal",
  "Aston Villa",
  "Chelsea",
  "Manchester United",
] as const;

export default function Players() {
  const { players } = useLoaderData<typeof loader>();
  const [selectedPositions, setSelectedPositions] = useState<string[]>([
    "ALL",
    "Defender",
    "Attacker",
  ]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([
    "ALL",
    "Aston Villa",
    "Chelsea",
    "Manchester United",
  ]);

  return (
    <main className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">Players</h1>
      {/* 
          Filters.
          
          We plan to use a custom component so that we can control the styling
      */}
      <h2 className="text-xl text-gray-900">Filters</h2>
      <div className="flex items-center gap-4">
        <label htmlFor="position">Position:</label>
        <select
          name="position"
          id="position"
          value={selectedPositions[0]}
          onChange={(e) => {
            const index = selectedPositions.findIndex(
              (f) => f === e.target.value
            );
            if (index >= 0) {
              selectedPositions.splice(index, 1); // Remove position from array
              setSelectedPositions([...selectedPositions]);
            } else {
              setSelectedPositions([...selectedPositions, e.target.value]);
            }
          }}
        >
          <option key="all" value="all">
            All
          </option>
          {positions.map((position) => {
            return (
              <option key={position} value={position}>
                {position}
              </option>
            );
          })}
        </select>

        <label htmlFor="team">Team:</label>
        <select
          name="team"
          id="team"
          value={selectedTeams[0]}
          onChange={(e) => {
            const index = selectedTeams.findIndex((f) => f === e.target.value);
            if (index >= 0) {
              selectedTeams.splice(index, 1); // Remove position from array
              setSelectedTeams([...selectedTeams]);
            } else {
              setSelectedTeams([...selectedTeams, e.target.value]);
            }
          }}
        >
          <option key="all" value="all">
            All
          </option>
          {teams.map((team) => {
            return (
              <option key={team} value={team}>
                {team}
              </option>
            );
          })}
        </select>
      </div>
      {/* 
          Chips.
          
          Display the selected filters underneath the dropdowns
      */}
      <div className="flex flex-wrap gap-2">
        {selectedPositions.map((sp) => {
          if (sp === "ALL") return null;
          return (
            <div
              key={sp}
              className="flex gap-2 bg-slate-400 px-3 py-1 rounded-full"
            >
              <span>{sp}</span>
              <button
                onClick={() => {
                  const index = selectedPositions.findIndex((f) => f === sp);
                  if (index >= 0) {
                    selectedPositions.splice(index, 1); // Remove position from array
                    setSelectedPositions([...selectedPositions]);
                  }
                }}
              >
                X
              </button>
            </div>
          );
        })}
        {selectedTeams.map((t) => {
          if (t === "ALL") return null;
          return (
            <div
              key={t}
              className="flex gap-2 bg-slate-400 px-3 py-1 rounded-full"
            >
              <span>{t}</span>
              <button
                onClick={() => {
                  const index = selectedTeams.findIndex((f) => f === t);
                  if (index >= 0) {
                    selectedTeams.splice(index, 1); // Remove position from array
                    setSelectedTeams([...selectedTeams]);
                  }
                }}
              >
                X
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3">
        <div className="font-bold">Player</div>
        <div className="font-bold">Position</div>
        <div className="font-bold">Team</div>
        {players
          .filter((player) => {
            // If the selected positions doesn't include any specific position, show all positions
            if (
              !selectedPositions.length ||
              (selectedPositions.length === 1 && selectedPositions[0] === "ALL")
            ) {
              return true;
            }

            return selectedPositions.includes(player.position);
          })
          .filter((player) => {
            // If the selected teams don't include any specific team, show all teams
            if (
              !selectedTeams.length ||
              (selectedTeams.length === 1 && selectedTeams[0] === "ALL")
            ) {
              return true;
            }

            return selectedTeams.includes(player.footballTeam.name);
          })

          .map(({ name, position, footballTeam }) => (
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
