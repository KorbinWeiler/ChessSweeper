using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChessSweeperController : ControllerBase
    {
        [HttpGet(Name = "GetChessSweeperStatus")]
        public string Get()
        {
            return "ChessSweeper API is running.";
        }

        [HttpPost(Name = "newExplosion")]
        public IActionResult NewExplosion([FromBody] ExplosionData data)
        {
            // Process the explosion data (e.g., log it, update game state, etc.)
            // For now, just return a success response.
            return Ok(new { message = "Explosion data received.", receivedData = data });
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            // Return some dummy statistics for now
            var stats = new ExplosionData
            {
                Id = 1,
                Timestamp = DateTime.UtcNow,
                PieceType = "Queen",
                Color = "White"
            };
            return Ok(stats);
        }
    }
}