/* Source code of Packager class is downloaded from mono repository: https://github.com/mono/mono
 * Exact file location: https://github.com/mono/mono/blob/master/sdks/wasm/packager.cs
 */

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Mono.Cecil;

public interface IPackager
{
    string Run(string[] args);
}

public class Packager : IPackager
{
    private const string BINDINGS_ASM_NAME = "bindings";
    private bool enable_debug;
    private string app_prefix, framework_prefix, bcl_prefix, out_prefix;
    private readonly HashSet<string> asm_list = new HashSet<string>();
    private readonly List<string> file_list = new List<string>();
    private readonly StringBuilder packager_logs_builder = new StringBuilder();

    public string Run(string[] args)
    {
        var root_assemblies = new List<string>();
        enable_debug = false;
        var add_binding = true;
        out_prefix = Environment.CurrentDirectory;
        app_prefix = Environment.CurrentDirectory;
        var deploy_prefix = "managed";
        var vfs_prefix = "managed";
        var use_release_runtime = true;

        file_list.Clear();
        asm_list.Clear();
        packager_logs_builder.Clear();

        var tool_prefix = Path.Combine(Directory.GetCurrentDirectory(), "../mono-wasm-sdk/");

        //are we working from the tree?
        if (Directory.Exists(Path.Combine(tool_prefix, "../out/bcl/wasm")))
        {
            framework_prefix = tool_prefix; //all framework assemblies are currently side built to packaker.exe
            bcl_prefix = Path.Combine(tool_prefix, "../out/bcl/wasm");
        }
        else
        {
            framework_prefix = Path.Combine(tool_prefix, "framework");
            bcl_prefix = Path.Combine(tool_prefix, "bcl");
        }

        foreach (var a in args)
        {
            if (a[0] != '-')
            {
                root_assemblies.Add(a);
                continue;
            }

            var kv = a.Split('=');
            var key = kv[0].Substring(1);
            var value = kv.Length > 1 ? kv[1] : null;
            switch (key)
            {
                case "debug":
                    enable_debug = true;
                    break;
                case "nobinding":
                    add_binding = false;
                    break;
                case "out":
                    out_prefix = value;
                    break;
                case "prefix":
                    app_prefix = value;
                    break;
                case "deploy":
                    deploy_prefix = value;
                    break;
                case "vfs":
                    vfs_prefix = value;
                    break;
                case "debugrt":
                    use_release_runtime = false;
                    break;
                case "help":
                    Usage();
                    return packager_logs_builder.ToString();
                default:
                    packager_logs_builder.AppendLine($"Invalid parameter {key}");
                    Usage();
                    Environment.Exit(-1);
                    break;
            }
        }

        foreach (var ra in root_assemblies)
        {
            AssemblyKind kind;
            var resolved = Resolve(ra, out kind);
            Import(resolved, kind);
        }

        if (add_binding)
            Import(ResolveFramework(BINDINGS_ASM_NAME + ".dll"), AssemblyKind.Framework);

        if (!Directory.Exists(out_prefix))
            Directory.CreateDirectory(out_prefix);

        var bcl_dir = Path.Combine(out_prefix, deploy_prefix);
        if (Directory.Exists(bcl_dir))
            Directory.Delete(bcl_dir, true);
        Directory.CreateDirectory(bcl_dir);
        foreach (var f in file_list)
        {
            packager_logs_builder.AppendLine($"cp {f} -> {Path.Combine(bcl_dir, Path.GetFileName(f))}");
            File.Copy(f, Path.Combine(bcl_dir, Path.GetFileName(f)));
        }

        if (deploy_prefix.EndsWith("/"))
            deploy_prefix = deploy_prefix.Substring(0, deploy_prefix.Length - 1);
        if (vfs_prefix.EndsWith("/"))
            vfs_prefix = vfs_prefix.Substring(0, vfs_prefix.Length - 1);

        var template = File.ReadAllText(Path.Combine(tool_prefix, "runtime.g.js"));

        var file_list_str = string.Join(",", file_list.Select(f => $"\"{Path.GetFileName(f)}\""));
        template = template.Replace("@FILE_LIST@", file_list_str);
        template = template.Replace("@VFS_PREFIX@", vfs_prefix);
        template = template.Replace("@DEPLOY_PREFIX@", deploy_prefix);
        template = template.Replace("@ENABLE_DEBUGGING@", enable_debug ? "1" : "0");
        if (add_binding)
            template = template.Replace("@BINDINGS_LOADING@", $"Module.mono_bindings_init (\"{BINDINGS_ASM_NAME}\");");
        else
            template = template.Replace("@BINDINGS_LOADING@", "");

        var runtime_js = Path.Combine(out_prefix, "runtime.js");
        Debug($"create {runtime_js}");
        File.Delete(runtime_js);
        File.WriteAllText(runtime_js, template);

        var runtime_dir = Path.Combine(tool_prefix, use_release_runtime ? "release" : "debug");
        File.Delete(Path.Combine(out_prefix, "mono.js"));
        File.Delete(Path.Combine(out_prefix, "mono.wasm"));

        File.Copy(
            Path.Combine(runtime_dir, "mono.js"),
            Path.Combine(out_prefix, "mono.js"));
        File.Copy(
            Path.Combine(runtime_dir, "mono.wasm"),
            Path.Combine(out_prefix, "mono.wasm"));

        return packager_logs_builder.ToString();
    }

    private void Usage()
    {
        packager_logs_builder.AppendLine("Valid arguments:");
        packager_logs_builder.AppendLine("\t-help         Show this help message");
        packager_logs_builder.AppendLine("\t-debug        Enable Debugging (default false)");
        packager_logs_builder.AppendLine(
           "\t-debugrt      Use the debug runtime (default release) - this has nothing to do with C# debugging");
        packager_logs_builder.AppendLine("\t-nobinding    Disable binding engine (default include engine)");
        packager_logs_builder.AppendLine("\t-prefix=x     Set the input assembly prefix to 'x' (default to the current directory)");
        packager_logs_builder.AppendLine("\t-out=x        Set the output directory to 'x' (default to the current directory)");
        packager_logs_builder.AppendLine("\t-deploy=x     Set the deploy prefix to 'x' (default to 'managed')");
        packager_logs_builder.AppendLine("\t-vfs=x        Set the VFS prefix to 'x' (default to 'managed')");

        packager_logs_builder.AppendLine("foo.dll         Include foo.dll as one of the root assemblies");
    }

    private void Debug(string s)
    {
        packager_logs_builder.AppendLine(s);
    }

    private string FindFrameworkAssembly(string asm)
    {
        return asm;
    }

    private bool Try(string prefix, string name, out string out_res)
    {
        out_res = null;

        var res = Path.Combine(prefix, name);
        if (File.Exists(res))
        {
            out_res = Path.GetFullPath(res);
            return true;
        }

        return false;
    }

    private string ResolveWithExtension(string prefix, string name)
    {
        string res = null;

        if (Try(prefix, name, out res))
            return res;
        if (Try(prefix, name + ".dll", out res))
            return res;
        if (Try(prefix, name + ".exe", out res))
            return res;
        return null;
    }

    private string ResolveUser(string asm_name)
    {
        return ResolveWithExtension(app_prefix, asm_name);
    }

    private string ResolveFramework(string asm_name)
    {
        return ResolveWithExtension(framework_prefix, asm_name);
    }

    private string ResolveBcl(string asm_name)
    {
        return ResolveWithExtension(bcl_prefix, asm_name);
    }

    private string Resolve(string asm_name, out AssemblyKind kind)
    {
        packager_logs_builder.AppendLine(Directory.GetCurrentDirectory());

        kind = AssemblyKind.User;
        var asm = ResolveUser(asm_name);
        if (asm != null)
            return asm;

        kind = AssemblyKind.Framework;
        asm = ResolveFramework(asm_name);
        if (asm != null)
            return asm;

        kind = AssemblyKind.Bcl;
        asm = ResolveBcl(asm_name);
        if (asm != null)
            return asm;

        kind = AssemblyKind.None;
        throw new Exception($"Could not resolve {asm_name}");
    }

    private void Import(string ra, AssemblyKind kind)
    {
        var rp = new ReaderParameters();
        var add_pdb = enable_debug && File.Exists(Path.ChangeExtension(ra, "pdb"));
        if (add_pdb) rp.ReadSymbols = true;

        rp.InMemory = true;

        var image = ModuleDefinition.ReadModule(ra, rp);
        if (!asm_list.Add(ra))
            return;
        file_list.Add(ra);
        Debug($"Processing {ra} debug {add_pdb}");

        if (add_pdb && kind == AssemblyKind.User)
            file_list.Add(Path.ChangeExtension(ra, "pdb"));

        foreach (var ar in image.AssemblyReferences)
        {
            var resolve = Resolve(ar.Name, out kind);
            Import(resolve, kind);
        }
    }

    private enum AssemblyKind
    {
        User,
        Framework,
        Bcl,
        None
    }
}
