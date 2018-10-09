using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Models;
using JsonApiDotNetCore.Serialization;
using JsonApiDotNetCore.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Server.Services
{
    public interface IJsonApiResponseFactory
    {
        Task<IActionResult> CreateResponseAsync<T>(HttpResponse response, T entity) where T : class, IIdentifiable<int>;
        Task<IActionResult> CreateResponseAsync<T, TId>(HttpResponse response, T entity) where T : class, IIdentifiable<TId>;

        /// <summary>
        /// Sets up the internal Json Api structures. This has to be used when trying to return a Json Api response
        /// from a controller that does not extend any Json Api controllers.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="controller"></param>
        void ApplyFakeContext<T>(Controller controller) where T : class, IIdentifiable;
    }

    public class JsonApiResponseFactory : IJsonApiResponseFactory
    {
        private readonly IJsonApiSerializer _jsonApiSerializer;
        private readonly IJsonApiContext _jsonApiContext;

        public JsonApiResponseFactory(IJsonApiSerializer jsonApiSerializer, IJsonApiContext jsonApiContext)
        {
            _jsonApiSerializer = jsonApiSerializer;
            _jsonApiContext = jsonApiContext;
        }

        public Task<IActionResult> CreateResponseAsync<T>(HttpResponse response, T entity) where T : class, IIdentifiable<int>
        {
            return CreateResponseAsync<T, int>(response, entity);
        }

        public async Task<IActionResult> CreateResponseAsync<T, TId>(HttpResponse response, T entity) where T : class, IIdentifiable<TId>
        {
            response.ContentType = Constants.ContentType;

            var serializedResult = _jsonApiSerializer.Serialize(entity);
            await response.Body.WriteAsync(Encoding.UTF8.GetBytes(serializedResult));

            return new EmptyResult();
        }

        public void ApplyFakeContext<T>(Controller controller) where T : class, IIdentifiable
        {
            _jsonApiContext.BeginOperation();
            _jsonApiContext.ApplyContext<T>(controller);
        }
    }
}
