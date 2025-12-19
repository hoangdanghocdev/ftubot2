import React from 'react';
import { Menu, Plus, Paperclip, Send, MessageSquare } from 'lucide-react';
import ThemeToggle from '../ThemeToggle'; // Import the ThemeToggle component

const FtuAiInterface = () => {
  return (
    <div className="flex h-screen font-sans">
      
      {/* --- SIDEBAR (Left) --- */}
      <aside className="w-[280px] flex flex-col justify-between p-4 border-r border-gray-200">
        <div>
          {/* Top Icons */}
          <div className="flex justify-between items-center mb-8">
            <button className="p-2 hover:bg-gray-100 rounded-md transition">
              <Menu className="w-6 h-6 text-red-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md transition">
              <Plus className="w-6 h-6 text-red-700" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-4 mb-8 text-gray-500 font-medium">
            <div className="hover:text-red-700 cursor-pointer transition">Văn bản hành chính</div>
            <div className="hover:text-red-700 cursor-pointer transition">Biểu mẫu</div>
          </nav>

          {/* Recent Chats */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Recent Chats</h3>
            <ul className="space-y-2 text-gray-500">
              <li className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                 <span>Chat 1</span>
              </li>
              <li className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded cursor-pointer">
                 <span>Chat 2</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Global Theme Toggle */}
        <div className="mt-auto flex items-center justify-center p-2">
            <ThemeToggle />
        </div>
      </aside>

      {/* --- MAIN CONTENT (Right) --- */}
      <main className="flex-1 flex flex-col relative">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 py-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold text-xs">
              {/* Thay bằng thẻ <img> nếu có file logo */}
              FTU
            </div>
            <span className="text-xl font-bold text-red-800">FTU AI</span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="font-bold text-sm">Student Test</div>
              <div className="text-xs text-gray-400">student@ftu.edu.vn</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white font-bold">
              M
            </div>
          </div>
        </header>

        {/* Center Content (Chat Area) */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
          
          {/* Center Logo */}
          <div className="w-24 h-24 mb-6 rounded-full bg-red-800 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
             {/* Placeholder cho Logo lớn */}
             FTU
          </div>
          
          {/* Greeting Text */}
          <h1 className="text-3xl font-bold mb-2">Hello, I'm FTU AI.</h1>
          <p className="text-xl text-gray-400 font-light">How can I help you today?</p>
        </div>

        {/* Footer Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-center w-full border border-gray-300 rounded-2xl shadow-sm bg-white overflow-hidden p-2">
              
              {/* Attachment Icon */}
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Input Field */}
              <input 
                type="text" 
                placeholder="Hi" 
                className="flex-1 outline-none px-4 text-gray-700 placeholder-gray-400"
              />

              {/* Send Button */}
              <button className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-xl transition-colors shadow-md">
                <Send className="w-5 h-5" />
              </button>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default FtuAiInterface;