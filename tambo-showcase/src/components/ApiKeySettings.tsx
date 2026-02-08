"use client";

import { useApiKey } from "@/contexts/ApiKeyContext";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ApiKeySettingsProps {
  variant?: "compact" | "full";
  className?: string;
}

export function ApiKeySettings({
  variant = "full",
  className = "",
}: ApiKeySettingsProps) {
  const { effectiveApiKey, setApiKey, clearApiKey, isConfigured } = useApiKey();
  const [input, setInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "cleared" | null>(null);

  const handleSave = () => {
    if (input.trim()) {
      setApiKey(input.trim());
      setInput("");
      setFeedback("saved");
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setInput("");
    setFeedback("cleared");
    setTimeout(() => setFeedback(null), 2000);
  };

  const maskedKey = effectiveApiKey
    ? `${effectiveApiKey.slice(0, 8)}${"•".repeat(Math.min(20, effectiveApiKey.length - 8))}`
    : null;

  if (variant === "compact") {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <div
            className={`min-w-6 ${isConfigured ? "text-green-600" : "text-amber-500"}`}
          >
            {isConfigured ? "✅" : "⚠️"}
          </div>
          <span className="text-sm text-wellness-muted">
            {isConfigured ? "API key configured" : "API key required"}
          </span>
        </div>
        {isConfigured && maskedKey && (
          <p className="text-xs text-wellness-muted mt-1 font-mono flex items-center gap-1">
            {showKey ? effectiveApiKey : maskedKey}
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-wellness-primary hover:underline"
            >
              {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </button>
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-wellness-border bg-wellness-surface p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <KeyRound className="h-5 w-5 text-wellness-primary" />
        <h3 className="text-lg font-semibold text-wellness-text">
          Tambo API Key
        </h3>
        <div
          className={`ml-2 ${isConfigured ? "text-green-600" : "text-amber-500"}`}
        >
          {isConfigured ? "✅" : "⚠️"}
        </div>
      </div>

      <p className="text-sm text-wellness-muted mb-4">
        Get your free API key at{" "}
        <a
          href="https://tambo.co/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-wellness-primary hover:underline"
        >
          tambo.co/dashboard
        </a>
      </p>

      {isConfigured && maskedKey && (
        <div className="mb-4 p-3 rounded-lg bg-wellness-bg border border-wellness-border">
          <p className="text-xs text-wellness-muted mb-1">Current key</p>
          <code className="text-sm font-mono break-all">
            {showKey ? effectiveApiKey : maskedKey}
          </code>
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="ml-2 text-wellness-primary hover:underline text-xs"
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type={showKey ? "text" : "password"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your API key here"
          className="flex-1 px-4 py-2 rounded-lg border border-wellness-border bg-wellness-bg text-wellness-text placeholder:text-wellness-muted focus:outline-none focus:ring-2 focus:ring-wellness-primary/50"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={!input.trim()}
          className="px-4 py-2 rounded-lg bg-wellness-primary text-white font-medium hover:bg-wellness-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
        {isConfigured && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 rounded-lg border border-wellness-border text-wellness-muted hover:bg-wellness-muted/20 hover:text-wellness-text transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {feedback && (
        <p className="mt-2 text-sm text-wellness-primary">
          {feedback === "saved" ? "Key saved successfully." : "Key cleared."}
        </p>
      )}
    </div>
  );
}
