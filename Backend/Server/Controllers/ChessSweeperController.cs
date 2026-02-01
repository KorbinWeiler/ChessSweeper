using ChessSweeper.Server.Data;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChessSweeperController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChessSweeperController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("/GetChessSweeperStatus")]
        public string Get()
        {
            return "ChessSweeper API is running.";
        }

        [HttpPost("/newExplosion")]
        public IActionResult NewExplosion([FromBody] ExplosionData data)
        {
            // Process the explosion data (e.g., log it, update game state, etc.)
            // For now, just return a success response.
            _context.Explosions.Add(data);
            _context.SaveChanges();
            return Ok(new { message = "Explosion data received.", receivedData = data });
        }

        [HttpGet("/stats")]
        public IActionResult GetStats()
        {
            // Return some dummy statistics for now
            // var stats = new ExplosionData
            // {
            //     Id = 1,
            //     Timestamp = DateTime.UtcNow,
            //     PieceType = "Queen",
            //     Color = "White"
            // };
            var stats = new
            {
                TotalExplosions = _context.Explosions.Count(),
                NumberExplodedByPiece = _context.Explosions
                    .GroupBy(e => e.PieceType)
                    .Select(g => new { PieceType = g.Key, Count = g.Count() })
                    .ToList().OrderByDescending(x => x.Count),
                whiteExplosions = _context.Explosions.Count(e => e.Color == "White"),
                blackExplosions = _context.Explosions.Count(e => e.Color == "Black")

            };
            return Ok(stats);
        }
    }
}