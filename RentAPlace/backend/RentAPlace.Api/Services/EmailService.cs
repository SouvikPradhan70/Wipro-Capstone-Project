using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace RentAPlace.Api.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string bodyHtml);
    }

    // Simple SMTP service; safe to no-op in development if SMTP is not configured
    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _config;
        public SmtpEmailService(IConfiguration config) { _config = config; }

        public async Task SendAsync(string to, string subject, string bodyHtml)
        {
            var from = _config["Email:From"]!;
            using var client = new SmtpClient(_config["Email:SmtpHost"!], int.Parse(_config["Email:SmtpPort"!]!))
            {
                EnableSsl = bool.Parse(_config["Email:UseSsl"!]!),
                Credentials = new NetworkCredential(_config["Email:User"], _config["Email:Password"])
            };

            var msg = new MailMessage(from, to, subject, bodyHtml) { IsBodyHtml = true };
            await client.SendMailAsync(msg);
        }
    }
}
