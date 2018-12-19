namespace DistributedComputing
{
    /// <summary>
    ///     A facade for IProblemPlugin that simplifies interacting with the plugin.
    ///     It also hides away the generic type parameters of IProblemPlugin.
    /// </summary>
    internal interface IProblemPluginFacade
    {
        byte[] Compute(byte[] data);
    }


    internal class ProblemPluginFacade<TTask, TTaskResult, TSubtask, TSubtaskResult> : IProblemPluginFacade
    {
        private readonly IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> _problemPluginInstance;

        public ProblemPluginFacade(IProblemPlugin<TTask, TTaskResult, TSubtask, TSubtaskResult> problemPluginInstance)
        {
            _problemPluginInstance = problemPluginInstance;
        }


        public byte[] Compute(byte[] data)
        {
            var parsedSubtask = _problemPluginInstance.SubtaskDataFormatter.Deserialize(data);

            var result = _problemPluginInstance.Compute(parsedSubtask);

            return _problemPluginInstance.SubtaskResultDataFormatter.Serialize(result);
        }
    }
}
