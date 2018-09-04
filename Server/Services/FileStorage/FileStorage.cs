using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Server.Services
{
    public class FileStorage : IFileStorage
    {
        public Task<string> SaveFileAsync(string directoryPath, IFormFile file)
        {
            CreateDirectoryIfNotExists(directoryPath);

            return UnsafeSaveFileAsync(directoryPath, file);
        }

        public Task<string[]> SaveFilesAsync(string directoryPath, IFormFileCollection files)
        {
            return Task.WhenAll(files.Select(file => UnsafeSaveFileAsync(directoryPath, file)));
        }

        public void DeleteDirectory(string directoryPath)
        {
            Directory.Delete(directoryPath, true);
        }

        private void CreateDirectoryIfNotExists(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        private async Task<string> UnsafeSaveFileAsync(string directoryPath, IFormFile file)
        {
            // TODO: sanitize FileName (check for vulnerabilities)
            var filePath = Path.Combine(directoryPath, file.FileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return filePath;
        }
    }
}
