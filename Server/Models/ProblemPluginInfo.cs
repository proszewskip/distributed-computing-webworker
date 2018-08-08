using Newtonsoft.Json;

namespace Server.Models
{
    public class ProblemPluginInfo
    {
        [JsonProperty("assembly-name")]
        public string AssemblyName { get; set; }

        [JsonProperty("namespace")]
        public string Namespace { get; set; }

        [JsonProperty("class-name")]
        public string ClassName { get; set; }
    }
}
