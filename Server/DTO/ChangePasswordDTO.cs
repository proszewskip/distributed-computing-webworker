using Newtonsoft.Json;
using Server.Models;

namespace Server.DTO
{
    public class ChangePasswordDTO
    {
        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("old-password")]
        public string OldPassword { get; set; }

        [JsonProperty("new-password")]
        public string NewPassword { get; set; }
    }
}
