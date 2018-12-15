using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Server.Services
{
    /// <summary>
    /// Enables interaction with the file system.
    /// </summary>
    public interface IFileStorage
    {
        Task<string> SaveFileAsync(string directoryPath, IFormFile file);
        Task<string[]> SaveFilesAsync(string directoryPath, IFormFileCollection files);

        void DeleteDirectory(string directoryPath);
    }
}
