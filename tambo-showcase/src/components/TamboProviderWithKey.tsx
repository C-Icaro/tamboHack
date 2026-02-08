"use client";

import { ApiKeyCheck } from "@/components/ApiKeyCheck";
import { ApiKeySettings } from "@/components/ApiKeySettings";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { TamboProvider } from "@tambo-ai/react";
import type { TamboComponent } from "@tambo-ai/react";
import type { TamboTool } from "@tambo-ai/react";
import type { McpServer } from "@/components/tambo/mcp-config-modal";

interface TamboProviderWithKeyProps {
  components: TamboComponent[];
  tools?: TamboTool[];
  tamboUrl?: string;
  mcpServers?: McpServer[];
  children: React.ReactNode;
}

/**
 * Wraps TamboProvider with API key from context (env or dashboard).
 * Shows ApiKeyCheck + ApiKeySettings when key is not configured.
 */
export function TamboProviderWithKey({
  components,
  tools = [],
  tamboUrl,
  mcpServers,
  children,
}: TamboProviderWithKeyProps) {
  const { effectiveApiKey, isConfigured } = useApiKey();

  if (!isConfigured || !effectiveApiKey) {
    return (
      <div className="p-6 space-y-6">
        <ApiKeyCheck>
          <span className="text-wellness-muted">
            Configure your API key below to use Tambo features.
          </span>
        </ApiKeyCheck>
        <ApiKeySettings />
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={effectiveApiKey}
      components={components}
      tools={tools}
      tamboUrl={tamboUrl}
      mcpServers={mcpServers}
    >
      {children}
    </TamboProvider>
  );
}
