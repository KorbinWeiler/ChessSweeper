# ChessSweeper

###### Play Here: https://thankful-plant-08ce5741e.1.azurestaticapps.net/

A creative twist on classical chess that combines traditional chess mechanics with Minesweeper-inspired bomb mechanics. Randomly placed bombs on the board can detonate when a piece moves onto them, removing the piece from the game — introducing an element of luck alongside strategy.

## Game Modes

- **ChessSweeper** — The signature mode. Bombs are randomly placed across the board (6–14, customizable). Two movement modes are available:
  - *Teleport*: Pieces jump directly to the destination, detonating only if they land on a bomb.
  - *Slide*: Pieces slide toward the destination and stop at the first bomb they hit.
- **Chessception** — Pure classic chess without bombs. Supports customizable board dimensions.
- **Shuffle Chess** — Classic chess rules with randomized starting positions. Shuffle by piece type or individual piece.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | Nuxt 4 (Vue), TypeScript, Vuetify, Axios |
| Backend  | ASP.NET Core (.NET 10), Entity Framework Core |
| Database | SQL Server (LocalDB for development) |
| Testing  | Vitest |
| Hosting  | Azure Static Web Apps (frontend), Azure App Service (backend) |

## Architecture

The app is split into a **Vue/Nuxt frontend** that owns all game logic and a lightweight **ASP.NET Core backend** used solely for persistence.

1. **Setup** — The player picks a game mode and configures options (bomb count, shuffle type). Settings are passed to the game page as query parameters.
2. **Board initialization** — The `ChessBoard` model builds an 8×8 grid, places pieces in standard positions, and randomly scatters bombs across unoccupied middle rows. Each tile calculates its bomb vicinity count.
3. **Gameplay loop** — The player selects a piece, the active game-mode composable computes valid moves, and the board highlights them. On move:
   - The piece is relocated (or slid toward the target in Slide mode).
   - If the destination contains a bomb, the bomb detonates and removes the piece.
   - The explosion event is sent to the backend via `POST /newExplosion` and stored in SQL Server.
   - The turn switches to the other color.
4. **Statistics** — The stats page calls `GET /stats` to display aggregated explosion counts (total, by piece type, by color) from the backend database.

## Features

- Full chess rule enforcement (movement, captures, path blocking)
- Customizable bomb count and movement mode (In slide mode if a piece is move over a space where there is a bomb, the piece will explode before reaching its destination)
- Bomb vicinity indicators on tiles (Minesweeper-style)
- Global statistics tracking (total explosions, by piece type, by color)
- Responsive board UI with piece highlighting and valid move indicators
- Board reset and turn tracking

## How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [.NET 10 SDK](https://dotnet.microsoft.com/)
- SQL Server LocalDB (included with Visual Studio)

### Frontend

```bash
cd Frontend
npm install
npm run dev        # http://localhost:3000
```

### Backend

```bash
cd Backend/Server
dotnet run         # http://localhost:5138
```

The database is created automatically on first run via EF Core migrations.

### Tests

```bash
cd Frontend
npm test                # run all tests
npm run test:ui         # run with Vitest UI
npm run test:coverage   # generate coverage report
```
