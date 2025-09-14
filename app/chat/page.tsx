"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { motion } from "motion/react";
import { Response } from "@/components/ai-elements/response";

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const hasMessages = messages.length > 0;

  return (
    <main className="fixed inset-0 flex flex-col select-none">
      {hasMessages && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-full lg:max-w-[896px] lg:mx-auto lg:w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`w-full ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {message.parts
                .filter((part) => part.type === "text")
                .map((part, index) =>
                  message.role === "user" ? (
                    <div key={index} className="p-2">
                      {part.text}
                    </div>
                  ) : (
                    <Response key={index}>{part.text}</Response>
                  )
                )}
            </div>
          ))}
        </div>
      )}

      <div className={`${!hasMessages ? 'flex-1 flex flex-col items-center justify-center p-4' : ''}`} style={!hasMessages ? { transform: "translateY(-10vh)" } : {}}>
        {!hasMessages && (
          <motion.div
            className="text-center mb-8"
            animate={{ opacity: hasMessages ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-base">Chat with Milind's Resume</h1>
            <p className="text-md opacity-60">
              Ask anything about my work, projects, or experience
            </p>
          </motion.div>
        )}

        <motion.div
          layout
          className={`max-w-full lg:max-w-[896px] lg:mx-auto lg:w-full p-4 ${
            hasMessages ? 'flex-shrink-0' : ''
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput("");
              }
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
              placeholder="Ask something about Milind's work..."
              className="flex-1 border p-3 text-base disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status !== "ready" || !input.trim()}
              className="border px-4 py-3 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
