import { Activity } from "lucide-react";

export interface AnalysisMetrics {
  validationCoverage: string;
  securityRisk: string;
  errorHandling: string;
  testCompleteness: string;
}

interface AnalysisBlockProps {
  analysis: AnalysisMetrics | null;
  loading: boolean;
}

export default function AnalysisBlock({ analysis, loading }: AnalysisBlockProps) {
  const getRatingColor = (key: string, val: string) => {
    const normalVal = val.toLowerCase();
    if (key === "securityRisk") {
      if (normalVal.includes("high") || normalVal.includes("critical"))
        return "text-red-400 bg-red-950/20 border-red-900/30";
      if (normalVal.includes("medium") || normalVal.includes("moderate"))
        return "text-amber-400 bg-amber-950/20 border-amber-900/30";
      return "text-emerald-400 bg-emerald-950/20 border-emerald-900/30";
    } else {
      if (normalVal.includes("high") || normalVal.includes("complete"))
        return "text-emerald-400 bg-emerald-950/20 border-emerald-900/30";
      if (normalVal.includes("medium") || normalVal.includes("moderate"))
        return "text-amber-400 bg-amber-950/20 border-amber-900/30";
      return "text-red-400 bg-red-950/20 border-red-900/30";
    }
  };

  const getMetricLabel = (key: string) => {
    switch (key) {
      case "validationCoverage":
        return "Validation Coverage";
      case "securityRisk":
        return "Security Risk Level";
      case "errorHandling":
        return "Error Resiliency";
      case "testCompleteness":
        return "Test Completeness";
      default:
        return key;
    }
  };

  if (!analysis && !loading) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-1.5">
        <Activity className="w-3.5 h-3.5" />
        AI Quality & Risk Analysis
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#0b0b0d] border border-zinc-900 rounded-lg p-4 animate-pulse space-y-2"
            >
              <div className="h-3 bg-zinc-900 rounded w-2/3" />
              <div className="h-5 bg-zinc-900 rounded w-1/2" />
            </div>
          ))
        ) : analysis ? (
          Object.entries(analysis).map(([key, value]) => (
            <div
              key={key}
              className="bg-[#0b0b0d] border border-zinc-900 rounded-lg p-4 flex flex-col justify-between hover:border-zinc-800 transition-all duration-200"
            >
              <span className="text-[10px] font-medium text-zinc-500 block uppercase tracking-wider">
                {getMetricLabel(key)}
              </span>
              <div className="flex items-center justify-between mt-3">
                <span className="text-base font-bold text-white">{value}</span>
                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getRatingColor(
                    key,
                    value
                  )}`}
                >
                  Rating
                </span>
              </div>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}
