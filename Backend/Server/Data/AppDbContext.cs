using Microsoft.EntityFrameworkCore;
 
 namespace ChessSweeper.Server.Data
 {
     public class AppDbContext : DbContext
     {
         public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
         {
         }

         public DbSet<ExplosionData> Explosions { get; set; }
 
         // Define DbSets for your entities here
         // public DbSet<YourEntity> YourEntities { get; set; }
     }
 }