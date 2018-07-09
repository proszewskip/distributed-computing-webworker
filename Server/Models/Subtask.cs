namespace Server.Models
{
    public class Subtask
    {
        public int Id { get; set; }

        public int SequenceNumber { get; set; }

        public string Token { get; set; }

        public int DistributedTaskId { get; set; }
        public DistributedTask DistributedTask { get; set; }

        public string InputData { get; set; }

        public string Result { get; set; }

        public SubtaskStatus Status { get; set; }
    }
}
