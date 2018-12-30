using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Server.Models;

namespace Server.DTO
{
    public class ChangePasswordDTO
    {
        [Required]
        [JsonProperty("old-password")]
        public string OldPassword { get; set; }

        [Required]
        [JsonProperty("new-password")]
        public string NewPassword { get; set; }
    }
}
