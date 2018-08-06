using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Server.DTO
{
    public class CreateDistributedTaskDefinitionDTO
    {
        [Required]
        [StringLength(255, MinimumLength = 3)]
        public string Name { get; set; }

        public string Description { get; set; } = "";

        [Required] public IFormFile MainDll { get; set; }

        [Required] public IFormFileCollection AdditionalDlls { get; set; }
    }
}
