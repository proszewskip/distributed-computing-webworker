
getDeployPrefix = getDeployPrefix || function (pathSuffix) { return pathSuffix;}

var Module = {
	onRuntimeInitialized: function () {
		MONO.mono_load_runtime_and_bcl (
			"@VFS_PREFIX@",
			getDeployPrefix("@DEPLOY_PREFIX@"),
			@ENABLE_DEBUGGING@,
			[ @FILE_LIST@ ],
			function () {
				@BINDINGS_LOADING@
				App.init ();
			});
	},
};
