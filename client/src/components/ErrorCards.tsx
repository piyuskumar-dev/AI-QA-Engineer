import { AlertTriangle, WifiOff, Clock, RefreshCw } from "lucide-react";

interface ErrorCardProps {
  errorType: string;
  message: string;
  suggestion?: string;
  onRetry?: () => void;
}

export default function ErrorCard({
  errorType,
  message,
  suggestion,
  onRetry
}: ErrorCardProps) {
  const getIcon = () => {
    switch (errorType) {
      case "UNSUPPORTED_STACK":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "TIMEOUT_ERROR":
        return <Clock className="w-5 h-5 text-zinc-400" />;
      case "AI_SERVICE_UNAVAILABLE":
        return <WifiOff className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getBorderColor = () => {
    switch (errorType) {
      case "UNSUPPORTED_STACK":
        return "border-amber-950/40 bg-amber-950/5";
      case "TIMEOUT_ERROR":
        return "border-zinc-800 bg-zinc-950/20";
      case "AI_SERVICE_UNAVAILABLE":
        return "border-red-950/40 bg-red-950/5";
      default:
        return "border-zinc-800 bg-zinc-950/20";
    }
  };

  const getTitle = () => {
    switch (errorType) {
      case "UNSUPPORTED_STACK":
        return "Unsupported Technology Stack";
      case "TIMEOUT_ERROR":
        return "Generation Timeout";
      case "AI_SERVICE_UNAVAILABLE":
        return "AI Service Unavailable";
      case "EMPTY_INPUT":
        return "Empty Code Input";
      default:
        return "Operation Failed";
    }
  };

  return (
    <div
      className={`border rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${getBorderColor()}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded bg-zinc-900 border border-zinc-800/80 flex-shrink-0 mt-0.5 sm:mt-0">
          {getIcon()}
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-200">
            {getTitle()}
          </h4>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-medium">
            {message}
          </p>
          {suggestion && (
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              💡 {suggestion}
            </p>
          )}
        </div>
      </div>

      {onRetry && (errorType === "TIMEOUT_ERROR" || errorType === "AI_SERVICE_UNAVAILABLE" || errorType === "AI_RESPONSE_ERROR" || errorType === "INTERNAL_SERVER_ERROR") && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all text-[11px] font-semibold cursor-pointer active:scale-95 flex-shrink-0 w-full sm:w-auto justify-center"
        >
          <RefreshCw className="w-3 h-3" />
          Retry Generation
        </button>
      )}
    </div>
  );
}
