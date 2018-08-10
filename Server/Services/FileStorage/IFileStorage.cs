using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Server.Services
{
    public interface IFileStorage
    {
        Task<string> SaveFileAsync(string directoryPath, IFormFile file);
        Task<string[]> SaveFilesAsync(string directoryPath, IFormFileCollection files);
    }
}
