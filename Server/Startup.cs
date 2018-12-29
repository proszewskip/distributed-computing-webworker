using System;
using System.Buffers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using JsonApiDotNetCore.Extensions;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.StaticFiles;
using Server.Models;
using Server.Services;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Server.Filters;
using Server.Services.Api;
using Server.Services.Cleanup;

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
            services.AddJsonApi<DistributedComputingDbContext>(options =>
            {
                options.IncludeTotalRecordCount = true;
                options.DefaultPageSize = 25;
                options.ValidateModelState = true;
            });
            services.AddDefaultIdentity<IdentityUser>()
                .AddEntityFrameworkStores<DistributedComputingDbContext>();

            services.Configure<IdentityOptions>(options => { });
            services.ConfigureApplicationCookie(options => { options.ExpireTimeSpan = TimeSpan.FromDays(30); });

            services.Configure<ServerConfig>(Configuration.GetSection("ServerConfig"));
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, UserManager<IdentityUser> userManager)
        {
            EnsureDatabaseCreated(app);

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
                    .WithOrigins("http://localhost:3000")
                    .AllowCredentials()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
            );
            ConfigureCompiledTaskDefinitionsHosting(app);

            app.UseAuthentication();
            IdentityDataSeeder.SeedUsers(userManager);
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
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    }, ArrayPool<char>.Shared));
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        private static void ConfigureDependencyInjection(IServiceCollection services)
        {
            var distributedNodeLifetime = TimeSpan.FromMinutes(60);

            services
                .AddScoped<IAssemblyLoader, AssemblyLoader>()
                .AddScoped<IPackager, Packager>()
                .AddScoped<IProblemPluginFacadeFactory, ProblemPluginFacadeFactory>()
                .AddScoped<IProblemPluginFacadeProvider, ProblemPluginFacadeProvider>()
                .AddScoped<IFileStorage, FileStorage>()
                .AddScoped<IResourceService<DistributedTaskDefinition>, DistributedTaskDefinitionService>()
                .AddScoped<IResourceService<DistributedTask>, DistributedTaskService>()
                .AddScoped<IComputationFailService, ComputationFailService>()
                .AddScoped<IComputationCompleteService, ComputationCompleteService>()
                .AddScoped<IComputationCancelService, ComputationCancelService>()
                .AddScoped<IGetNextSubtaskToComputeService, GetNextSubtaskToComputeService>()
                .AddScoped<IJsonApiResponseFactory, JsonApiResponseFactory>()
                .AddScoped<IJsonApiActionResultFactory, JsonApiActionResultFactory>()
                .AddScoped<IDistributedNodesCleaner>(serviceProvider =>
                    new DistributedNodesCleaner(serviceProvider.GetService<DistributedComputingDbContext>(),
                        serviceProvider.GetService<IComputationCancelService>(),
                        distributedNodeLifetime))
                .AddScoped<FormatErrorActionFilter>()
                .AddScoped<AuthorizationFilter>();

            services.AddHostedService<CleanupHostedService>();

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
            var contentTypeProvider = new FileExtensionContentTypeProvider();

            contentTypeProvider.Mappings[".wasm"] = "application/wasm";

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(pathsProvider.CompiledTasksDefinitionsDirectoryPath),
                RequestPath = "/public/task-definitions",
                ServeUnknownFileTypes = true,
                ContentTypeProvider = contentTypeProvider
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
