import Editor from "@monaco-editor/react";
import {
  Layers,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
  Shield,
  Download,
  Terminal,
  ArrowDownToLine,
  Inbox
} from "lucide-react";

interface OutputBlockProps {
  result: string | null;
  frameworkUsed: string | null;
  framework: string;
  edgeCases: string[];
  securitySuggestions: string[];
  loading: boolean;
  onCopyTests: () => void;
  testsCopied: boolean;
  onCopyEdgeCases: () => void;
  edgeCasesCopied: boolean;
  onCopySecurity: () => void;
  securityCopied: boolean;
  onExport: (format: "test.js" | "py" | "txt") => void;
}

export default function OutputBlock({
  result,
  frameworkUsed,
  framework,
  edgeCases,
  securitySuggestions,
  loading,
  onCopyTests,
  testsCopied,
  onCopyEdgeCases,
  edgeCasesCopied,
  onCopySecurity,
  securityCopied,
  onExport
}: OutputBlockProps) {
  const getEditorLanguage = (fw: string) => {
    return fw === "Pytest" ? "python" : "javascript";
  };

  // 1. Empty placeholder state
  if (!loading && !result) {
    return (
      <div className="bg-[#0b0b0d] border border-zinc-900 rounded-lg p-16 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center mb-4">
          <Inbox className="w-4 h-4 text-zinc-500" />
        </div>
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">No suite generated</h3>
        <p className="text-[11px] text-zinc-500 mt-1 max-w-sm">
          Paste your backend or frontend code to generate intelligent test cases, quality analysis, and security reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Test code editor container */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Generated Test Cases ({frameworkUsed || framework})
          </h3>
          
          <div className="flex items-center gap-3">
            {/* Export options */}
            {result && !loading && (
              <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 rounded px-1 py-0.5">
                <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-wider px-1.5">
                  Export
                </span>
                <button
                  onClick={() => onExport("test.js")}
                  className="text-[9px] hover:text-white text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 px-2 py-0.5 rounded transition-all font-mono"
                >
                  .js
                </button>
                <button
                  onClick={() => onExport("py")}
                  className="text-[9px] hover:text-white text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 px-2 py-0.5 rounded transition-all font-mono"
                >
                  .py
                </button>
                <button
                  onClick={() => onExport("txt")}
                  className="text-[9px] hover:text-white text-zinc-400 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 px-2 py-0.5 rounded transition-all font-mono"
                >
                  .txt
                </button>
              </div>
            )}

            {/* Copy Button */}
            {result && !loading && (
              <button
                onClick={onCopyTests}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-2 py-1 rounded font-medium"
              >
                {testsCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied successfully</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Loading skeleton or code view */}
        {loading ? (
          <div className="border border-zinc-900 rounded-lg bg-zinc-950 p-8 flex flex-col items-center justify-center min-h-[300px]">
            <RefreshCw className="w-6 h-6 text-zinc-600 animate-spin mb-3" />
            <span className="text-[11px] text-zinc-400 animate-pulse font-medium">
              Generating intelligent test cases...
            </span>
            <span className="text-[9px] text-zinc-600 mt-1">
              Analyzing routes, schemas, error paths, and security boundaries
            </span>
          </div>
        ) : result ? (
          <div className="rounded-lg border border-zinc-900 bg-zinc-950 overflow-hidden py-2 relative">
            <div className="absolute top-2.5 right-3.5 z-10 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider pointer-events-none">
              Verified Code Out
            </div>
            <Editor
              height="380px"
              theme="vs-dark"
              language={getEditorLanguage(frameworkUsed || framework)}
              value={result}
              options={{
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: "on",
                readOnly: true,
                domReadOnly: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                }
              }}
            />
          </div>
        ) : null}
      </div>

      {/* Grid of lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Edge Cases block */}
        <div className="bg-[#0b0b0d] border border-zinc-900 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                Potential Edge Cases
              </h4>
            </div>
            {edgeCases.length > 0 && !loading && (
              <button
                onClick={onCopyEdgeCases}
                className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 hover:bg-zinc-900 px-2 py-0.5 rounded transition-all font-medium border border-zinc-900 hover:border-zinc-800"
              >
                {edgeCasesCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied successfully</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy List</span>
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse py-2">
              <div className="h-2.5 bg-zinc-900 rounded w-[90%]" />
              <div className="h-2.5 bg-zinc-900 rounded w-[80%]" />
              <div className="h-2.5 bg-zinc-900 rounded w-[85%]" />
              <div className="h-2.5 bg-zinc-900 rounded w-[70%]" />
            </div>
          ) : edgeCases.length > 0 ? (
            <ul className="space-y-2.5 text-xs text-zinc-400">
              {edgeCases.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-600 italic py-2">No edge cases analyzed yet.</p>
          )}
        </div>

        {/* Security block */}
        <div className="bg-[#0b0b0d] border border-zinc-900 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-zinc-400" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-300">
                Security & Abuse Suggestions
              </h4>
            </div>
            {securitySuggestions.length > 0 && !loading && (
              <button
                onClick={onCopySecurity}
                className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1 hover:bg-zinc-900 px-2 py-0.5 rounded transition-all font-medium border border-zinc-900 hover:border-zinc-800"
              >
                {securityCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied successfully</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy List</span>
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse py-2">
              <div className="h-2.5 bg-zinc-900 rounded w-[85%]" />
              <div className="h-2.5 bg-zinc-900 rounded w-[75%]" />
              <div className="h-2.5 bg-zinc-900 rounded w-[80%]" />
              <div className="h-2.5 bg-zinc-900 rounded w-[90%]" />
            </div>
          ) : securitySuggestions.length > 0 ? (
            <ul className="space-y-2.5 text-xs text-zinc-400">
              {securitySuggestions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-zinc-600 italic py-2">No security analysis analyzed yet.</p>
          )}
        </div>

      </div>

    </div>
  );
}
