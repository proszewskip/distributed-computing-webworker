using System.Buffers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using JsonApiDotNetCore.Extensions;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Server.Models;
using Server.Services;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;
using Server.Services.Api;

namespace Server
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            AddMvc(services);
            ConfigureDependencyInjection(services);
            ConfigureDatabaseProvider(services);
            services.AddJsonApi<DistributedComputingDbContext>(options => {
                options.IncludeTotalRecordCount = true;
                options.DefaultPageSize = 25;
            });
            services.Configure<ServerConfig>(Configuration.GetSection("ServerConfig"));
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            EnsureDatabaseCreated(app);
            ConfigureCompiledTaskDefinitionsHosting(app);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            // app.UseHttpsRedirection();
            app.UseCors(builder =>
                builder
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
            );
            app.UseJsonApi();
        }

        private static void AddMvc(IServiceCollection services)
        {
            services.AddMvc(options =>
                {
                    options.OutputFormatters.Clear();
                    options.OutputFormatters.Add(new JsonOutputFormatter(new JsonSerializerSettings()
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    }, ArrayPool<char>.Shared));
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        private static void ConfigureDependencyInjection(IServiceCollection services)
        {
            services
                .AddScoped<IAssemblyLoader, AssemblyLoader>()
                .AddScoped<IPackager, Packager>()
                .AddScoped<IDataFormatterFactory, DataFormatterFactory>()
                .AddScoped<IProblemPluginFacadeFactory, ProblemPluginFacadeFactory>()
                .AddScoped<IFileStorage, FileStorage>()
                .AddScoped<IResourceService<DistributedTaskDefinition>, DistributedTaskDefinitionService>()
                .AddScoped<IResourceService<DistributedTask>, DistributedTaskService>()
                .AddScoped<IFinishComputationService, FinishComputationService>()
                .AddScoped<IJsonApiResponseFactory, JsonApiResponseFactory>();

            services.AddSingleton<IPathsProvider, PathsProvider>();
        }

        private void ConfigureDatabaseProvider(IServiceCollection services)
        {
            var connectionString = Configuration.GetConnectionString("DistributedComputingContext");
            services.AddEntityFrameworkNpgsql()
                .AddDbContext<DistributedComputingDbContext>(options => options.UseNpgsql(connectionString));
        }

        private static void ConfigureCompiledTaskDefinitionsHosting(IApplicationBuilder app)
        {
            var pathsProvider = app.ApplicationServices.GetService<IPathsProvider>();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(pathsProvider.CompiledTasksDefinitionsDirectoryPath),
                RequestPath = "/public/task-definitions"
            });
        }

        private static void EnsureDatabaseCreated(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<DistributedComputingDbContext>();
                context.Database.EnsureCreated();
            }
        }
    }
}
