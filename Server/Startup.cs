using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using dotenv.net.DependencyInjection.Extensions;

using Server.Models;
using Server.Services;
using Microsoft.Extensions.FileProviders;

namespace Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddEnv();
            services.AddScoped<IAssemblyAnalyzer, AssemblyAnalyzer>()
                .AddScoped<IAssemblyAnalyzer, AssemblyAnalyzer>()
                .AddScoped<ICommandRunner, CommandRunner>()
                .AddScoped<IAssemblyLoader, AssemblyLoader>()
                .AddScoped<ISubtaskFactoryFactory, SubtaskFactoryFactory>()
                .AddScoped<IPackagerRunner, PackagerRunner>();

            services.AddSingleton<IPathsProvider, PathsProvider>();

            var connectionString = Configuration.GetConnectionString("DistributedComputingContext");
            services.AddEntityFrameworkNpgsql()
                .AddDbContext<DistributedComputingDbContext>(options => options.UseNpgsql(connectionString));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<DistributedComputingDbContext>();
                context.Database.EnsureCreated();
            }

            var pathsProvider = app.ApplicationServices.GetService<IPathsProvider>();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(pathsProvider.CompiledTasksDefinitionsDirectoryPath),
                RequestPath = "/public/task-definitions"
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
