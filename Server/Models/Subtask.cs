using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class Subtask : Identifiable
    {
        [Attr("sequence-number", isImmutable: true)]
        public int SequenceNumber { get; set; }

        public string Token { get; set; }

        [Attr("distributed-task-id", isImmutable: true)]
        public int DistributedTaskId { get; set; }

        [HasOne("distributed-task")]
        public DistributedTask DistributedTask { get; set; }

        [Attr("input-data", isImmutable: true)]
        public string InputData { get; set; }

        [Attr("result", isImmutable: true)]
        public string Result { get; set; }

        [Attr("subtask-status", isImmutable: true)]
        public SubtaskStatus Status { get; set; }
    }
}
