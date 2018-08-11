using System;
using System.ComponentModel.DataAnnotations;
using JsonApiDotNetCore.Models;

namespace Server.Models
{
    public class Subtask : Identifiable
    {
        [Required]
        [Attr("sequence-number", isImmutable: true)]
        public int SequenceNumber { get; set; }

        [Required]
        public Guid Token { get; set; }

        public int DistributedTaskId { get; set; }

        [Required]
        [HasOne("distributed-task")]
        public DistributedTask DistributedTask { get; set; }

        [Required]
        public byte[] InputData { get; set; }

        public byte[] Result { get; set; }

        [Required]
        [Attr("subtask-status", isImmutable: true)]
        public SubtaskStatus Status { get; set; }
    }
}
