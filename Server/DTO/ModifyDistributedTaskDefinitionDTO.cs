using System.ComponentModel.DataAnnotations;

namespace Server.DTO
{
    public class ModifyDistributedTaskDefinitionDTO
    {
        [StringLength(255, MinimumLength = 3)]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
