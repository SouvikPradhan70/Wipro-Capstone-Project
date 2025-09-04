using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentAPlace.Api.Data;
using RentAPlace.Api.Dtos;
using RentAPlace.Api.Models;
using RentAPlace.Api.Services;
using System.Security.Claims;

namespace RentAPlace.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IEmailService _email;
        public ReservationsController(AppDbContext db, IEmailService email) { _db = db; _email = email; }

        // POST api/reservations
        // Renter creates reservation
        [HttpPost]
        [Authorize(Roles = "Renter")]
        public async Task<ActionResult> Create(ReservationCreateDto dto)
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(sub)) return Unauthorized();
            var renterId = Guid.Parse(sub);

            var property = await _db.Properties.Include(p => p.Owner).FirstOrDefaultAsync(p => p.Id == dto.PropertyId);
            if (property == null) return NotFound("Property not found");

            // Check overlap with existing reservations
            var overlap = await _db.Reservations.AnyAsync(r => r.PropertyId == dto.PropertyId && r.Status != "Cancelled" &&
                (dto.CheckIn < r.CheckOut && dto.CheckOut > r.CheckIn));
            if (overlap) return BadRequest("Selected dates are not available");

            var nights = (dto.CheckOut.DayNumber - dto.CheckIn.DayNumber);
            if (nights <= 0) return BadRequest("Check-out must be after check-in");

            var total = property.PricePerNight * nights;

            var res = new Reservation
            {
                PropertyId = property.Id,
                RenterId = renterId,
                CheckIn = dto.CheckIn,
                CheckOut = dto.CheckOut,
                Guests = dto.Guests,
                Status = "Pending",
                TotalPrice = total,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Reservations.Add(res);
            await _db.SaveChangesAsync();

            // Notify owner by email if SMTP configured; errors ignored in dev
            if (!string.IsNullOrWhiteSpace(property.Owner?.Email))
            {
                var subject = $"New reservation request for {property.Title}";
                var body = $"There is a new reservation request for {nights} night(s).";
                try { await _email.SendAsync(property.Owner!.Email, subject, body); } catch { }
            }

            return Created($"/api/reservations/{res.Id}", new { res.Id, res.Status, res.TotalPrice });
        }

        // POST api/reservations/{id}/confirm
        // Owner confirms a reservation
        [HttpPost("{id}/confirm")]
        [Authorize(Roles = "Owner")]
        public async Task<ActionResult> Confirm(int id)
        {
            var res = await _db.Reservations.FindAsync(id);
            if (res == null) return NotFound();
            res.Status = "Confirmed";
            res.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(new { res.Id, res.Status });
        }

        // POST api/reservations/{id}/cancel
        // Owner or Renter can cancel; here we allow both roles for simplicity
        [HttpPost("{id}/cancel")]
        [Authorize]
        public async Task<ActionResult> Cancel(int id)
        {
            var res = await _db.Reservations.FindAsync(id);
            if (res == null) return NotFound();
            res.Status = "Cancelled";
            res.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(new { res.Id, res.Status });
        }
    }
}
