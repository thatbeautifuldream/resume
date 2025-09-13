"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Response } from "@/components/ai-elements/response";

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");

  return (
    <main className="fixed inset-0 flex flex-col select-none">
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

      <div className="p-4 flex-shrink-0 max-w-full lg:max-w-[896px] lg:mx-auto lg:w-full">
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
            className="flex-1 border p-2 text-base"
          />
          <button
            type="submit"
            disabled={status !== "ready"}
            className="border p-2"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
