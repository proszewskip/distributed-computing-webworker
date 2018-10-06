using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JsonApiDotNetCore.Internal;
using JsonApiDotNetCore.Models;
using JsonApiDotNetCore.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Server.Services
{
    public interface IJsonApiResponseFactory
    {
        Task<IActionResult> CreateResponse<T>(HttpResponse response, T entity) where T : class, IIdentifiable<int>;
        Task<IActionResult> CreateResponse<T, TId>(HttpResponse response, T entity) where T : class, IIdentifiable<TId>;
    }

    public class JsonApiResponseFactory : IJsonApiResponseFactory
    {
        private readonly IJsonApiSerializer _jsonApiSerializer;

        public JsonApiResponseFactory(IJsonApiSerializer jsonApiSerializer)
        {
            _jsonApiSerializer = jsonApiSerializer;
        }

        public Task<IActionResult> CreateResponse<T>(HttpResponse response, T entity) where T : class, IIdentifiable<int>
        {
            return CreateResponse<T, int>(response, entity);
        }

        public async Task<IActionResult> CreateResponse<T, TId>(HttpResponse response, T entity) where T : class, IIdentifiable<TId>
        {
            var serializedResult = _jsonApiSerializer.Serialize(entity);

            response.ContentType = Constants.ContentType;
            // TODO: check if there is a way to provide a default StatusCode (200) if there is none
            // httpResponse.StatusCode = 201;
            await response.Body.WriteAsync(Encoding.UTF8.GetBytes(serializedResult));

            return new EmptyResult();
        }
    }
}
