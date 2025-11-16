import React, { useState, useRef, useEffect } from "react";
import {
  MenuIcon,
  PlusIcon,
  HistoryIcon,
  EditIcon,
  CopyrightIcon,
} from "./components/icons";
import { User } from "firebase/auth";

export interface ChatSession {
  id: number;
  name: string;
}

interface SidebarProps {
  user: User | null;
  activeChatId: number | null;
  onChatSelect: (id: number) => void;
  onNewChat: () => void;
  chatHistory: ChatSession[];
  onDeleteChat: (id: number) => void;
  onRenameChat: (id: number, newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeChatId,
  onChatSelect,
  onNewChat,
  chatHistory,
  onDeleteChat,
  onRenameChat,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleStartEditing = (chat: ChatSession) => {
    setEditingId(chat.id);
    setEditingName(chat.name);
  };

  const handleFinishEditing = (idToUpdate: number) => {
    if (
      editingName.trim() &&
      editingName.trim() !== chatHistory.find((c) => c.id === idToUpdate)?.name
    ) {
      onRenameChat(idToUpdate, editingName.trim());
    }
    setEditingId(null);
    setEditingName("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === "Enter") {
      handleFinishEditing(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingName("");
    }
  };

  return (
    <div
      className={`relative bg-black p-2 flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between mb-4 h-12 px-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-gray-800"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-6 h-6 text-gray-400" />
        </button>
        {isExpanded && (
          <button
            onClick={onNewChat}
            className="p-2 rounded-full hover:bg-gray-800"
            aria-label="New Chat"
          >
            <PlusIcon className="w-6 h-6 text-gray-400" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        {isExpanded && (
          <div className="px-3 pb-2 text-xs font-semibold text-gray-500 uppercase">
            Recent
          </div>
        )}
        <ul>
          {chatHistory.map((chat) => (
            <li key={chat.id} className="relative group">
              <div
                onClick={() => editingId !== chat.id && onChatSelect(chat.id)}
                className={`w-full flex items-center p-3 my-1 rounded-lg text-left transition-colors cursor-pointer ${
                  activeChatId === chat.id
                    ? "bg-gray-800 text-gray-100"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                }`}
              >
                <HistoryIcon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <>
                    {editingId === chat.id ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => handleFinishEditing(chat.id)}
                        onKeyDown={(e) => handleKeyDown(e, chat.id)}
                        className="ml-4 flex-1 bg-transparent border border-gray-500 rounded px-1 py-0"
                      />
                    ) : (
                      <span className="ml-4 font-medium whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                        {chat.name}
                      </span>
                    )}
                  </>
                )}
              </div>
              {isExpanded && (
                <div
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center rounded-lg transition-opacity duration-200 
                    ${
                      activeChatId === chat.id
                        ? "opacity-100 bg-gray-800"
                        : "opacity-0 group-hover:opacity-100 bg-gray-700"
                    }`}
                >
                  <button
                    onClick={() => handleStartEditing(chat)}
                    className="p-1 rounded-full hover:bg-gray-600"
                    aria-label="Rename chat"
                  >
                    <EditIcon className="w-4 h-4 text-gray-300" />
                  </button>
                  <button
                    onClick={() => onDeleteChat(chat.id)}
                    className="p-1 rounded-full hover:bg-gray-600"
                    aria-label="Delete chat"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        {isExpanded && (
          <div className="flex items-center p-3 text-sm text-gray-500">
            <CopyrightIcon className="w-5 h-5 flex-shrink-0" />
            <span className="ml-4 font-medium whitespace-nowrap">
              Design by 2M3H
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
