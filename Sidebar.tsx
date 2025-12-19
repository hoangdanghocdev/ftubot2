import React, { useState, useRef, useEffect } from "react";
import {
  MenuIcon,
  PlusIcon,
  HistoryIcon,
  EditIcon,
  CopyrightIcon,
} from "./components/icons";
import { User } from "firebase/auth";
import { useTheme } from "./ThemeContext"; // Import hook đã tạo

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
  const { theme, toggleTheme } = useTheme();

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
      className={`sidebar relative p-2 flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-16"
      }`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center justify-between mb-4 h-12 px-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-[var(--bg-hover)]"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-6 h-6 text-[var(--ftu-red)]" />
        </button>
        {isExpanded && (
          <button
            onClick={onNewChat}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)]"
            aria-label="New Chat"
          >
            <PlusIcon className="w-6 h-6 text-[var(--ftu-red)]" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        {isExpanded && (
          <div className="px-3 pb-2 text-xs font-semibold text-[var(--text-gray)] uppercase">
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
                    ? "bg-[var(--bg-hover)] text-[var(--ftu-red)]"
                    : "text-[var(--text-gray)] hover:bg-[var(--bg-hover)] hover:text-[var(--ftu-red)]"
                }`}
              >
                <HistoryIcon className="w-5 h-5 flex-shrink-0 text-[var(--text-gray)]" />
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
                        className="ml-4 flex-1 bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-1 py-0 text-[var(--text-primary)]"
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
                        ? "opacity-100 bg-[var(--bg-hover)]"
                        : "opacity-0 group-hover:opacity-100 bg-[var(--bg-hover)]"
                    }`}
                >
                  <button
                    onClick={() => handleStartEditing(chat)}
                    className="p-1 rounded-full hover:bg-[var(--bg-hover)]"
                    aria-label="Rename chat"
                  >
                    <EditIcon className="w-4 h-4 text-[var(--text-gray)]" />
                  </button>
                  <button
                    onClick={() => onDeleteChat(chat.id)}
                    className="p-1 rounded-full hover:bg-[var(--bg-hover)]"
                    aria-label="Delete chat"
                  >
                    <PlusIcon className="w-4 h-4 text-[var(--text-gray)]" />
                  </button>

                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* --- Footer Sidebar: Nút Dark Mode --- */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <label className="flex items-center cursor-pointer justify-between group">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
             {/* Icon trăng khuyết/mặt trời tùy logic hiển thị */}
             <span>Dark mode</span>
          </div>
          
          {/* Custom Toggle Switch UI */}
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={theme === 'dark'} 
              onChange={toggleTheme} 
            />
            {/* Thanh trượt (Track) */}
            <div className={`w-10 h-6 rounded-full shadow-inner transition-colors duration-300 ${theme === 'dark' ? 'bg-[var(--ftu-red)]' : 'bg-gray-300'}`}></div>
            {/* Nút tròn (Dot) */}
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
        </label>
      </div>

      <div className="mt-auto">
        {isExpanded && (
          <div className="flex items-center p-3 text-sm text-[var(--text-secondary)]">
            <CopyrightIcon className="w-5 h-5 flex-shrink-0 text-[var(--text-gray)]" />
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
