"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

/**
 * Chat page with Tambo and MCP integration.
 */
export default function ChatPage() {
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <div className="h-[calc(100vh-4rem)] p-6">
        <div className="chat-wellness-context max-w-4xl mx-auto h-full rounded-2xl border border-wellness-border bg-wellness-surface shadow-sm overflow-hidden">
          <MessageThreadFull className="h-full" />
        </div>
      </div>
    </TamboProvider>
  );
}
