using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Server.Services.Cleanup
{
    public class CleanupHostedService : IHostedService, IDisposable
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<CleanupHostedService> _logger;
        private Timer _timer;

        public CleanupHostedService(IServiceProvider serviceProvider, ILogger<CleanupHostedService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Starting cleanup service");

            _timer = new Timer(Cleanup, null, TimeSpan.FromSeconds(5), TimeSpan.FromMinutes(5));

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Stopping cleanup service");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }

        private async void Cleanup(object state)
        {
            _logger.LogInformation("Running distributed nodes cleaner");

            using (var scope = _serviceProvider.CreateScope())
            {
                var distributedNodesCleaner = scope.ServiceProvider.GetService<IDistributedNodesCleaner>();

                await distributedNodesCleaner.CleanAsync();
            }
        }
    }
}
