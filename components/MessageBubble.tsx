import React from "react";
import { Message, MessagePart } from "../types";
import { SparklesIcon, UserIcon } from "./icons";

interface MessageBubbleProps {
  message: Message;
}

const renderInline = (text: string) => {
  const boldRegex = /(\*\*.*?\*\*)/g;
  return text.split(boldRegex).map((chunk, index) => {
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={index}>{chunk.slice(2, -2)}</strong>;
    }
    return chunk;
  });
};

const renderMarkdown = (text: string) => {
  if (!text) return null;
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const parts = text.split(codeBlockRegex);

  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).trim();
      return (
        <pre
          key={index}
          className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md my-2 whitespace-pre-wrap font-mono text-sm"
        >
          <code>{code}</code>
        </pre>
      );
    }

    const paragraphs = part.trim().split("\n\n");
    return paragraphs.map((para, pIndex) => {
      const lines = para.trim().split("\n");
      const listItems: string[] = [];
      const otherLines: string[] = [];

      lines.forEach((line) => {
        if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
          listItems.push(line.trim().substring(2));
        } else {
          otherLines.push(line);
        }
      });

      return (
        <div key={`${index}-${pIndex}`}>
          {otherLines.length > 0 && <p>{renderInline(otherLines.join(" "))}</p>}
          {listItems.length > 0 && (
            <ul className="list-disc list-inside space-y-1 my-2">
              {listItems.map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ul>
          )}
        </div>
      );
    });
  });
};

const PartRenderer: React.FC<{ part: MessagePart }> = ({ part }) => {
  if ("text" in part) {
    return (
      <div className="whitespace-pre-wrap leading-relaxed">
        {renderMarkdown(part.text)}
      </div>
    );
  }
  if ("inlineData" in part) {
    return (
      <img
        src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`}
        alt="User upload"
        className="mt-2 rounded-lg max-w-xs max-h-64 object-contain"
      />
    );
  }
  return null;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  const bubbleClasses = isUser
    ? "bg-gray-700 text-gray-100"
    : "bg-gray-800 text-gray-200";

  const containerClasses = isUser ? "justify-end" : "justify-start";

  const Icon = isUser ? UserIcon : SparklesIcon;

  return (
    <div className={`flex items-start gap-3 ${containerClasses}`}>
      {!isUser && (
        <img
          src="logo/FTU-logo.png"
          alt="Bot Avatar"
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      )}
      <div
        className={`flex flex-col max-w-lg md:max-w-xl lg:max-w-2xl p-3 rounded-2xl shadow-sm ${bubbleClasses}`}
      >
        {message.parts.map((part, index) => (
          <PartRenderer key={index} part={part} />
        ))}
      </div>
      {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
