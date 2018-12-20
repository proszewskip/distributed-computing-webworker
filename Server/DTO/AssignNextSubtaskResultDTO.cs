using Newtonsoft.Json;
using Server.Models;

namespace Server.DTO
{
    public class AssignNextSubtaskResultDTO
    {
        [JsonProperty("subtask-in-progress-id")]
        public string SubtaskInProgressId { get; set; }

        [JsonProperty("subtask-id")] public string SubtaskId { get; set; }

        [JsonProperty("compiled-task-definition-url")]
        public string CompiledTaskDefinitionURL { get; set; }

        [JsonProperty("problem-plugin-info")] public ProblemPluginInfo ProblemPluginInfo { get; set; }
    }
}
