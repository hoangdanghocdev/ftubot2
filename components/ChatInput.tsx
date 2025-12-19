
import React, { useState, useRef, useCallback, ChangeEvent, FormEvent } from 'react';
import { PaperclipIcon, SendIcon, XCircleIcon } from './icons';

interface ChatInputProps {
  onSend: (prompt: string, imageFile: File | null) => void;
  isLoading: boolean;
  isBlocked: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, isBlocked }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const removeImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (isLoading || isBlocked || (!prompt.trim() && !imageFile)) return;
    onSend(prompt, imageFile);
    setPrompt('');
    removeImage();
    if(textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  }, [prompt, imageFile, isLoading, isBlocked, onSend, removeImage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };
  
  return (
    <div>
        {isBlocked && (
            <div className="text-center p-2 text-sm rounded-md mb-2"
                style={{
                    color: 'var(--ftu-red)',
                    backgroundColor: 'var(--bg-hover)',
                }}
            >
                Message limit reached. Please sign in to continue.
            </div>
        )}
      <form onSubmit={handleSubmit} className="relative rounded-2xl p-2 flex flex-col"
        style={{
            backgroundColor: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
        }}
      >
        {imagePreview && (
          <div className="relative w-24 h-24 m-2 p-1 rounded-lg"
            style={{ border: '1px solid var(--border-color)' }}
          >
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 rounded-full p-0.5 transition-colors"
              style={{
                backgroundColor: 'var(--text-secondary)',
                color: 'var(--bg-primary)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--ftu-red)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--text-secondary)')}
              aria-label="Remove image"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isBlocked}
            className="p-2 disabled:opacity-50 transition-colors"
            style={{
                color: 'var(--text-gray)', // Changed to gray
            }}
            // Removed onMouseEnter and onMouseLeave as per new instruction
            aria-label="Attach file"
          >
            <PaperclipIcon className="w-6 h-6" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message FTU AI..."
            className="flex-1 bg-transparent p-2 focus:outline-none resize-none"
            rows={1}
            style={{
                color: 'var(--text-primary)',
                maxHeight: '200px',
            }}
            disabled={isLoading || isBlocked}
          />
          <button
            type="submit"
            disabled={isLoading || isBlocked || (!prompt.trim() && !imageFile)}
            className="disabled:cursor-not-allowed transition-colors" // Removed p-2 and rounded-full
            style={{
                backgroundColor: 'var(--ftu-red)', // Nền đỏ
                color: 'white', // Chữ/icon trắng
                padding: '10px', // Căn chỉnh độ to
                borderRadius: '50%', // Bo tròn thành hình tròn
            }}
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
