import React, { useRef, useEffect } from "react";
import { Message } from "../types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center justify-start p-4">
    <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-2xl p-3 text-gray-800 dark:text-gray-200 shadow-sm">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  </div>
);

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 pb-20">
    <img
      src="logo/ftu-logo.png"
      alt="FTU Logo"
      className="w-20 h-20 mb-4 rounded-full"
    />
    <h2 className="text-4xl font-bold text-white">Hello, I'm FTU AI</h2>
    <p className="max-w-md mt-2 text-white">How can I help you today?</p>
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
