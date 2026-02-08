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
import { NotesUpload } from "@/components/NotesUpload";
import { TamboProviderWithKey } from "@/components/TamboProviderWithKey";
import { GentlePrompt } from "@/components/wellness/GentlePrompt";
import { components, tools } from "@/lib/tambo";

/**
 * Digital Twin Notes - Adaptive interface for personal notes.
 * Chat with the AI to explore notes by sentiment, study, or search.
 */
export default function NotesPage() {
  return (
    <TamboProviderWithKey
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
    >
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chat - Left side */}
        <div className="w-1/2 flex flex-col border-r border-wellness-border bg-wellness-surface">
          <div className="p-6 border-b border-wellness-border">
            <h2 className="text-lg font-semibold text-wellness-text">
              My Notes
            </h2>
            <p className="text-sm text-wellness-muted mt-1">
              e.g. &quot;Show my sentiment notes&quot; | &quot;Study notes&quot; |
              &quot;Search for planning&quot; | &quot;Note 3 details&quot;
            </p>
          </div>

          <ScrollableMessageContainer className="flex-1 p-6">
            <ThreadContent variant="default">
              <ThreadContentMessages />
            </ThreadContent>
          </ScrollableMessageContainer>

          <div className="p-6 border-t border-wellness-border">
            <MessageInput variant="bordered">
              <MessageInputTextarea placeholder="Ask about your notes..." />
              <MessageInputToolbar>
                <MessageInputSubmitButton />
              </MessageInputToolbar>
            </MessageInput>
          </div>
        </div>

        {/* Visualization area - Right side */}
        <div className="w-1/2 flex flex-col p-6 overflow-auto bg-wellness-bg gap-6">
          <NotesUpload />
          <GentlePrompt message="How about exploring your notes today? Use the chat on the left to search and view. The AI will render lists, details and insights here." />
        </div>
      </div>
    </TamboProviderWithKey>
  );
}
