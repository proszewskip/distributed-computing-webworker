using System;
using System.Buffers;
using System.Collections.Generic;
using System.Text;
using JsonApiDotNetCore.Extensions;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using NUnit.Framework.Internal;
using Server.Filters;
using Server.Models;
using Server.Services;
using Server.Services.Api;
using Server.Services.Cleanup;

namespace Server.Tests
{
    class TestStartup
    {
        public IConfiguration Configuration { get; }

        public TestStartup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public virtual void ConfigureServices(IServiceCollection services)
        {
            AddMvc(services);
            ConfigureDependencyInjection(services);
            ConfigureDatabaseProvider(services);
            services.AddJsonApi<TestDbContext>(options =>
            {
                options.IncludeTotalRecordCount = true;
                options.DefaultPageSize = 25;
                options.ValidateModelState = true;
            });
            services.AddDefaultIdentity<IdentityUser>()
                .AddEntityFrameworkStores<TestDbContext>();

            services.Configure<IdentityOptions>(options => { });
            services.ConfigureApplicationCookie(options => { options.ExpireTimeSpan = TimeSpan.FromDays(30); });

            services.Configure<ServerConfig>(options => { options.CompiledTaskDefinitionsDirectoryPath= "../netcoreapp2.2";
                options.TaskDefinitionsDirectoryPath = "../netcoreapp2.2";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public virtual void Configure(IApplicationBuilder app, IHostingEnvironment env, UserManager<IdentityUser> userManager)
        {
            ConfigureCompiledTaskDefinitionsHosting(app);

            app.UseAuthentication();
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
            var distributedNodeLifetime = TimeSpan.FromMinutes(2);

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
                .AddScoped<ISubtasksInProgressCleanupService, SubtasksInProgressCleanupService>()
                .AddScoped<IDistributedNodesCleaner>(serviceProvider =>
                    new DistributedNodesCleaner(serviceProvider.GetService<TestDbContext>(),
                        serviceProvider.GetService<IComputationCancelService>(),
                        distributedNodeLifetime))
                .AddScoped<FormatErrorActionFilter>()
                .AddScoped<AuthorizationFilter>()
                .AddScoped<IDistributedComputingDbContext>(provider => provider.GetService<TestDbContext>());

            services.AddHostedService<CleanupHostedService>();

            services.AddSingleton<IPathsProvider, PathsProvider>();
        }

        private void ConfigureDatabaseProvider(IServiceCollection services)
        {
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();



            services.AddDbContext<TestDbContext>(options =>
            {
                options.UseInMemoryDatabase("InMemoryDbForTesting");
                options.UseInternalServiceProvider(serviceProvider);
            });

            var sp = services.BuildServiceProvider();
            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<TestDbContext>();
                var logger = scopedServices
                    .GetRequiredService<ILogger<TestStartup>>();

                // Ensure the database is created.
                db.Database.EnsureCreated();
            }
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
    }
}
