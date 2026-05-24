import Editor from "@monaco-editor/react";
import { Code, Sparkles, RefreshCw } from "lucide-react";

interface EditorBlockProps {
  code: string;
  setCode: (code: string) => void;
  framework: string;
  setFramework: (framework: string) => void;
  loading: boolean;
  onGenerate: (e: React.FormEvent) => void;
  onLoadDemo: (demoKey: string) => void;
}

export default function EditorBlock({
  code,
  setCode,
  framework,
  setFramework,
  loading,
  onGenerate,
  onLoadDemo
}: EditorBlockProps) {
  const getEditorLanguage = (fw: string) => {
    return fw === "Pytest" ? "python" : "javascript";
  };

  const getLanguageLabel = (fw: string) => {
    return fw === "Pytest" ? "python (pytest)" : "javascript (node)";
  };

  return (
    <div className="bg-[#0b0b0d] border border-zinc-900 rounded-lg p-5 shadow-sm">
      <form onSubmit={onGenerate} className="space-y-4">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-semibold text-zinc-300">Workspace Editor</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-500 font-mono">
              {getLanguageLabel(framework)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Demo selector */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onLoadDemo(e.target.value);
                  e.target.value = ""; // Reset dropdown view
                }
              }}
              className="text-[11px] bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 font-medium focus:outline-none focus:border-zinc-700 cursor-pointer hover:bg-zinc-800 transition-all"
            >
              <option value="">Use Demo Example</option>
              <option value="expressAuth">Express Auth Route</option>
              <option value="reactComponent">React Profile Form</option>
              <option value="loyaltyEngine">Loyalty Discount Engine</option>
            </select>
            
            <select
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              className="text-[11px] bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 font-medium focus:outline-none focus:border-zinc-700 cursor-pointer hover:bg-zinc-800 transition-all"
            >
              <option value="Jest">Jest</option>
              <option value="Pytest">Pytest</option>
              <option value="Cypress">Cypress</option>
            </select>
          </div>
        </div>

        {/* Monaco Canvas */}
        <div className="rounded border border-zinc-900 bg-zinc-950 overflow-hidden py-1">
          <Editor
            height="220px"
            theme="vs-dark"
            language={getEditorLanguage(framework)}
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              tabSize: 2,
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              }
            }}
            loading={
              <div className="flex items-center justify-center h-[220px] text-xs text-zinc-600">
                Initializing workspace editor...
              </div>
            }
          />
        </div>

        {/* Control actions */}
        <div className="flex justify-between items-center pt-2">
          <div className="text-[11px] text-zinc-500">
            Paste target function, router controller, or class logic here.
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-zinc-100 hover:bg-white text-black font-semibold text-xs transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Generating Suite...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Suite
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
