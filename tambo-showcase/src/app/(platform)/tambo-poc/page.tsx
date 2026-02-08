"use client";

import {
  MessageInput,
  MessageInputSubmitButton,
  MessageInputTextarea,
  MessageInputToolbar,
} from "@/components/tambo/message-input";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import { InteractableNote } from "@/components/Note";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

const features = [
  "Generative UI - AI-rendered components",
  "Interactable - note editable by natural language",
  "Local Tools - getSampleData, Digital Twin",
];

/**
 * Tambo PoC - Proof of concept of Tambo AI capabilities.
 */
export default function TamboPoCPage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
    >
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat - Left side */}
        <div className="w-1/2 flex flex-col border-r border-wellness-border bg-wellness-surface">
          <div className="p-6 border-b border-wellness-border">
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-wellness-calm/30 text-wellness-text mb-2">
              Proof of Concept - Tambo AI
            </span>
            <h2 className="text-lg font-semibold text-wellness-text">
              Tambo Playground
            </h2>
            <p className="text-sm text-wellness-muted mt-1">
              Demonstration of Tambo capabilities: generative UI, interactive
              components and tools.
            </p>
            <p className="text-sm text-wellness-muted mt-2">
              e.g. &quot;Show sales by region&quot; | &quot;Summarize in 3
              points&quot; | &quot;Add to note: Meeting at 3pm&quot;
            </p>
          </div>

          <ScrollableMessageContainer className="flex-1 p-6">
            <ThreadContent variant="default">
              <ThreadContentMessages />
            </ThreadContent>
          </ScrollableMessageContainer>

          <div className="p-6 border-t border-wellness-border">
            <MessageInput variant="bordered">
              <MessageInputTextarea placeholder="Type your message..." />
              <MessageInputToolbar>
                <MessageInputSubmitButton />
              </MessageInputToolbar>
            </MessageInput>
          </div>
        </div>

        {/* Right side - Note + Features */}
        <div className="w-1/2 flex flex-col p-6 overflow-auto bg-wellness-bg gap-6">
          <div>
            <h3 className="text-base font-semibold text-wellness-text mb-2">
              Interactive Note
            </h3>
            <p className="text-sm text-wellness-muted mb-4">
              Ask to change title, content or color. e.g. &quot;Change the color
              to blue&quot;
            </p>
            <InteractableNote
              interactableId="showcase-note"
              title="My Note"
              content="Add items by asking the assistant. e.g. Add 'Meeting at 3pm' to the note."
              color="yellow"
            />
          </div>

          <div className="rounded-2xl border border-wellness-border bg-wellness-surface p-6">
            <h3 className="text-base font-semibold text-wellness-text mb-3">
              What's happening
            </h3>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-wellness-muted"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-wellness-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </TamboProvider>
  );
}
