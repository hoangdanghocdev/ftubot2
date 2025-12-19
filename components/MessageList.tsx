import React, { useRef, useEffect } from "react";
import { Message } from "../types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center justify-start p-4">
    <div className="flex items-center gap-2 rounded-2xl p-3 shadow-sm"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
      <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:0.2s]" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
      <div className="w-2 h-2 rounded-full animate-pulse [animation-delay:0.4s]" style={{ backgroundColor: 'var(--text-secondary)' }}></div>
    </div>
  </div>
);

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center pb-20"
    style={{ color: 'var(--text-secondary)' }}
  >
    <img
      src="logo/FTU-logo.png"
      alt="FTU Logo"
      className="w-20 h-20 mb-4 rounded-full"
    />
    <h2 className="text-4xl font-bold transition-colors" style={{ color: 'var(--text-black)' }}>Hello, I'm FTU AI</h2>
    <p className="max-w-md mt-2 transition-colors" style={{ color: 'var(--text-gray)' }}>How can I help you today?</p>
  </div>
);

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return <WelcomeScreen />;
  }

  return (
    <div className="pt-6 pb-2 space-y-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <LoadingIndicator />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
