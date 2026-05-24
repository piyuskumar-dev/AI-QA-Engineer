"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import EditorBlock from "../components/EditorBlock";
import AnalysisBlock, { AnalysisMetrics } from "../components/AnalysisBlock";
import OutputBlock from "../components/OutputBlock";
import Toast, { ToastItem } from "../components/Toast";
import ErrorCard from "../components/ErrorCards";

function QuickStartGuide() {
  return (
    <div className="bg-[#0b0b0d] border border-zinc-900 rounded-lg p-4">
      <h3 className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 mb-2">
        Quick Start Guide
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-[10px] text-zinc-500">
        <div className="flex gap-2">
          <span className="font-mono text-zinc-300">01.</span>
          <span>Paste target source code or select a preloaded Demo Example.</span>
        </div>
        <div className="flex gap-2">
          <span className="font-mono text-zinc-300">02.</span>
          <span>Choose Jest, Pytest, or Cypress from the dropdown list.</span>
        </div>
        <div className="flex gap-2">
          <span className="font-mono text-zinc-300">03.</span>
          <span>Click "Generate Suite" to analyze edge cases and risk metrics.</span>
        </div>
        <div className="flex gap-2">
          <span className="font-mono text-zinc-300">04.</span>
          <span>Inspect the suite, copy raw blocks, or export direct test files.</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [code, setCode] = useState("");
  const [framework, setFramework] = useState("Jest");
  const [loading, setLoading] = useState(false);
  
  // Structured results
  const [result, setResult] = useState<string | null>(null);
  const [frameworkUsed, setFrameworkUsed] = useState<string | null>(null);
  const [edgeCases, setEdgeCases] = useState<string[]>([]);
  const [securitySuggestions, setSecuritySuggestions] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisMetrics | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{
    errorType: string;
    message: string;
    suggestion?: string;
  } | null>(null);

  // Toast array
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Clipboard feedback
  const [testsCopied, setTestsCopied] = useState(false);
  const [edgeCasesCopied, setEdgeCasesCopied] = useState(false);
  const [securityCopied, setSecurityCopied] = useState(false);

  // Demo datasets
  const demoCodes: Record<string, { code: string; framework: string; label: string }> = {
    expressAuth: {
      label: "Express Auth Route",
      framework: "Jest",
      code: `// Express JWT Authentication Route Handler
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await db.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Authentication failure:', error);
    return res.status(500).json({ error: 'Internal server failure' });
  }
};`
    },
    reactComponent: {
      label: "React Profile Form",
      framework: "Cypress",
      code: `// Profile Settings Form Component
import React, { useState } from 'react';

export default function ProfileSettings({ user, onUpdate }) {
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Display Name cannot be empty');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onUpdate({ name, bio });
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container max-w-md p-6 bg-zinc-950 border border-zinc-900 rounded">
      <h2 className="text-sm font-semibold text-white mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Display Name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Short Bio</label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white h-20"
          />
        </div>
        {error && <div id="error-message" className="text-xs text-red-400">{error}</div>}
        <button
          id="save-profile-btn"
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-white text-black text-xs font-semibold rounded disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};`
    },
    loyaltyEngine: {
      label: "Loyalty Discount Engine",
      framework: "Pytest",
      code: `# Loyalty discount calculations logic
from datetime import datetime

def calculate_discount(user_id, cart_total, db_client):
    """
    Computes Loyalty reward points and applies discounts based on:
    - active account age (years_active > 5 -> 20%, years_active > 2 -> 10%)
    - premium VIP membership status (+5%)
    - cap discount at 50% max
    """
    user = db_client.get_user(user_id)
    if not user:
        raise ValueError("User profile not found")

    if cart_total <= 0:
        return 0.0

    account_age_years = (datetime.now() - user.joined_date).days / 365.25
    discount_pct = 0.0

    if account_age_years > 5:
        discount_pct = 0.20
    elif account_age_years > 2:
        discount_pct = 0.10
    else:
        discount_pct = 0.05

    if user.is_vip:
        discount_pct += 0.05

    final_discount = min(discount_pct, 0.50)
    return float(cart_total * (1.0 - final_discount))`
    }
  };

  const handleAddToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      handleRemoveToast(id);
    }, 3000);
  };

  const handleRemoveToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoadDemo = (demoKey: string) => {
    const selected = demoCodes[demoKey];
    if (selected) {
      setCode(selected.code);
      setFramework(selected.framework);
      setResult(null);
      setFrameworkUsed(null);
      setEdgeCases([]);
      setSecuritySuggestions([]);
      setAnalysis(null);
      setError(null);
      setErrorDetails(null);
      handleAddToast(`Loaded demo: ${selected.label} (Recommended: ${selected.framework})`, "info");
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // 1. Handle Empty Input
    if (!code.trim()) {
      setError("Please paste source code before generating tests.");
      setErrorDetails({
        errorType: "EMPTY_INPUT",
        message: "Please paste source code before generating tests."
      });
      handleAddToast("Code input is empty.", "error");
      return;
    }

    setLoading(true);
    setError(null);
    setErrorDetails(null);
    // Note: Do NOT clear result, edgeCases, analysis, etc. here so they remain visible on failures

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${apiUrl}/api/ai/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, framework }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.generatedTests);
        setFrameworkUsed(data.framework);
        setEdgeCases(data.edgeCases);
        setSecuritySuggestions(data.securitySuggestions);
        setAnalysis(data.analysis);
        handleAddToast("Test suite generated successfully!", "success");
      } else {
        const errorType = data.errorType || "AI_RESPONSE_ERROR";
        const errMsg = data.message || "Unable to generate test suite.";
        const suggestion = data.suggestion || "Please try again with cleaner or supported source code.";
        
        setError(errMsg);
        setErrorDetails({
          errorType,
          message: errMsg,
          suggestion
        });
        handleAddToast(`Generation failed: ${errMsg}`, "error");
      }
    } catch (err) {
      console.error("Connection error:", err);
      setError("AI service temporarily unavailable.");
      setErrorDetails({
        errorType: "AI_SERVICE_UNAVAILABLE",
        message: "AI service temporarily unavailable.",
        suggestion: "Please check your network connection and verify if the backend server is running."
      });
      handleAddToast("Generation failed: Connection error", "error");
    } finally {
      setLoading(false);
    }
  };


  const handleCopyTests = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setTestsCopied(true);
    handleAddToast("Test suite copied to clipboard", "success");
    setTimeout(() => setTestsCopied(false), 2000);
  };

  const handleCopyEdgeCases = () => {
    if (edgeCases.length === 0) return;
    const text = edgeCases.map(item => `- ${item}`).join("\n");
    navigator.clipboard.writeText(text);
    setEdgeCasesCopied(true);
    handleAddToast("Edge cases list copied to clipboard", "success");
    setTimeout(() => setEdgeCasesCopied(false), 2000);
  };

  const handleCopySecurity = () => {
    if (securitySuggestions.length === 0) return;
    const text = securitySuggestions.map(item => `- ${item}`).join("\n");
    navigator.clipboard.writeText(text);
    setSecurityCopied(true);
    handleAddToast("Security suggestions list copied to clipboard", "success");
    setTimeout(() => setSecurityCopied(false), 2000);
  };

  const handleExport = (format: "test.js" | "py" | "txt") => {
    if (!result) return;

    let content = `// ==============================================\n`;
    content += `// Generated with AI QA Engineer\n`;
    content += `// Framework: ${frameworkUsed || framework}\n`;
    content += `// Timestamp: ${new Date().toISOString()}\n`;
    content += `// ==============================================\n\n`;
    content += `${result}\n\n`;
    
    content += `/*\n==============================================\n`;
    content += `POTENTIAL EDGE CASES:\n`;
    edgeCases.forEach((item, idx) => {
      content += `${idx + 1}. ${item}\n`;
    });
    content += `\n==============================================\n`;
    content += `SECURITY & ABUSE SUGGESTIONS:\n`;
    securitySuggestions.forEach((item, idx) => {
      content += `${idx + 1}. ${item}\n`;
    });
    content += `==============================================\n*/\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Format timestamp: YYYYMMDD_HHMM
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestampStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
    
    const fwName = (frameworkUsed || framework).toLowerCase();
    let filename = `${fwName}_suite_${timestampStr}.${format}`;

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    handleAddToast(`Exported ${filename} successfully!`, "success");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-300 antialiased font-sans">
      
      {/* Toast Overlay */}
      <Toast toasts={toasts} onClose={handleRemoveToast} />

      {/* Header */}
      <header className="border-b border-zinc-900 bg-black sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded">
              <Terminal className="w-4 h-4 text-zinc-100" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">
                AI QA Engineer
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                Demo
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Service Connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 flex flex-col justify-center gap-6">
        
        {/* Title Details */}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            AI Test Suite Generator
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Generate and export fully detailed, runnable tests, edge cases, and risk rating metrics from code inputs.
          </p>
        </div>

        {/* Quick Start Guide Section */}
        <QuickStartGuide />

        {/* 1. Monaco Input Editor Workspace */}
        <EditorBlock
          code={code}
          setCode={setCode}
          framework={framework}
          setFramework={setFramework}
          loading={loading}
          onGenerate={handleGenerate}
          onLoadDemo={handleLoadDemo}
        />

        {/* Error Details Section */}
        {errorDetails && (
          <ErrorCard
            errorType={errorDetails.errorType}
            message={errorDetails.message}
            suggestion={errorDetails.suggestion}
            onRetry={() => handleGenerate()}
          />
        )}

        {/* 2. Analysis Ratings Dashboard */}
        <AnalysisBlock analysis={analysis} loading={loading} />

        {/* 3. Monaco Output Panel, Edge Cases, Security Suggestions */}
        <OutputBlock
          result={result}
          frameworkUsed={frameworkUsed}
          framework={framework}
          edgeCases={edgeCases}
          securitySuggestions={securitySuggestions}
          loading={loading}
          onCopyTests={handleCopyTests}
          testsCopied={testsCopied}
          onCopyEdgeCases={handleCopyEdgeCases}
          edgeCasesCopied={edgeCasesCopied}
          onCopySecurity={handleCopySecurity}
          securityCopied={securityCopied}
          onExport={handleExport}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-[10px] text-zinc-600 bg-black mt-20">
        <p>© {new Date().getFullYear()} AI QA Engineer. Structured Product Presentation.</p>
      </footer>
    </div>
  );
}
