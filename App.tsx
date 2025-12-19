import React, { useState, useCallback, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { Message, ImagePart, MessagePart } from "./types";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import Sidebar, { ChatSession } from "./Sidebar";
import { auth } from "./services/firebase";
import { getUserPersona, saveUserPersona } from "./services/firestoreService";
import { getDefaultPersona } from "./services/personaService";
import FormFilling from "./components/FormFilling";
import AudioCreation from "./components/AudioCreation";
import { ThemeProvider } from "./ThemeContext"; // Import ThemeProvider

export interface Conversation {
  [chatId: number]: Message[];
}

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([
    { id: 1, name: "Welcome Chat" },
  ]);
  const [conversations, setConversations] = useState<Conversation>({
    1: [],
  });
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userMessageCount, setUserMessageCount] = useState<number>(0);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(
    null
  );
  const [activeFeature, setActiveFeature] = useState<
    "chat" | "forms" | "audio"
  >("chat");

  const GUEST_MESSAGE_LIMIT = 3;

  const messages = conversations[activeChatId] || [];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Delay persona loading slightly to allow Firestore client to connect
        setTimeout(async () => {
          setUserMessageCount(0);
          try {
            // Load user's persona preference
            const savedPersonaId = await getUserPersona(currentUser.uid);
            if (savedPersonaId) {
              setSelectedPersonaId(savedPersonaId);
            } else {
              // Set default persona if none is saved
              const defaultPersona = getDefaultPersona();
              setSelectedPersonaId(defaultPersona.id);
              // Save the default persona for future visits
              await saveUserPersona(currentUser.uid, defaultPersona.id);
            }
          } catch (error) {
            console.error(
              "Initial persona load failed, possibly due to offline client:",
              error
            );
            // Set a default persona temporarily so the app can continue.
            // The user can change it later.
            const defaultPersona = getDefaultPersona();
            setSelectedPersonaId(defaultPersona.id);
          }
        }, 500); // 500ms delay
      } else {
        // Reset to guest state if user signs out
        const initialChatId = 1;
        setChatHistory([{ id: initialChatId, name: "Welcome Chat" }]);
        setConversations({ [initialChatId]: [] });
        setActiveChatId(initialChatId);
        setUserMessageCount(0);
        setSelectedPersonaId(null);
        setActiveFeature("chat");
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePersonaChange = useCallback(
    async (personaId: string) => {
      setSelectedPersonaId(personaId);
      if (user) {
        await saveUserPersona(user.uid, personaId);
      }
    },
    [user]
  );

  const handleNewChat = useCallback(() => {
    const newChatId = Date.now();
    const newChat: ChatSession = { id: newChatId, name: "New Chat" };
    setChatHistory((prev) => [newChat, ...prev]);
    setConversations((prev) => ({ ...prev, [newChatId]: [] }));
    setActiveChatId(newChatId);
  }, []);

  const handleDeleteChat = useCallback(
    (idToDelete: number) => {
      const newChatHistory = chatHistory.filter(
        (chat) => chat.id !== idToDelete
      );
      setChatHistory(newChatHistory);

      setConversations((prev) => {
        const newConversations = { ...prev };
        delete newConversations[idToDelete];
        return newConversations;
      });

      // If the active chat is deleted, switch to the first available chat or create a new one
      if (activeChatId === idToDelete) {
        if (newChatHistory.length > 0) {
          setActiveChatId(newChatHistory[0].id);
        } else {
          handleNewChat();
        }
      }
    },
    [activeChatId, chatHistory, handleNewChat]
  );

  const handleRenameChat = useCallback((id: number, newName: string) => {
    const updatedChat = { id, name: newName };
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === id ? updatedChat : chat))
    );
  }, []);

  const handleSend = useCallback(
    async (prompt: string, imageFile: File | null) => {
      if (!prompt.trim() && !imageFile) return;

      // Helper function to convert file to base64 generative part
      const fileToGenerativePart = async (
        file: File
      ): Promise<ImagePart["inlineData"]> => {
        const base64EncodedData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(file);
        });
        return {
          mimeType: file.type,
          data: base64EncodedData,
        };
      };

      if (!user && userMessageCount >= GUEST_MESSAGE_LIMIT) {
        alert(
          "You have reached the 3-message limit for guests. Please sign in to continue chatting."
        );
        return;
      }

      let imagePart: ImagePart | null = null;
      if (imageFile) {
        try {
          const generativePart = await fileToGenerativePart(imageFile);
          imagePart = { inlineData: generativePart };
        } catch (error) {
          console.error("Error processing image:", error);
          const errorMsg: Message = {
            id: `error-${Date.now()}`,
            role: "model",
            parts: [
              {
                text: "Sorry, I couldn't process that image file. Please try another one.",
              },
            ],
          };
          setConversations((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), errorMsg],
          }));
          return;
        }
      }

      const currentMessages = conversations[activeChatId] || [];

      const userParts: MessagePart[] = [{ text: prompt }];
      if (imagePart) {
        userParts.unshift(imagePart);
      }

      const userMessage: Message = {
        id: `user-${activeChatId}-${Date.now()}`,
        role: "user",
        parts: userParts,
      };

      const updatedMessages: Message[] = [
        ...currentMessages,
        userMessage,
        {
          id: `model-${activeChatId}-${Date.now()}`,
          role: "model",
          parts: [{ text: "" }],
        },
      ];
      setConversations((prev) => ({
        ...prev,
        [activeChatId]: updatedMessages,
      }));

      if (!user) {
        setUserMessageCount((prev) => prev + 1);
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            imageParts: imagePart ? [imagePart] : [],
            persona: selectedPersonaId,
          }),
        });

        if (response.status === 500) {
          throw new Error(
            "Server responded with a 500 Internal Server Error. Check the backend logs for details."
          );
        }

        if (!response.ok || !response.body) {
          // In lỗi ra console để biết nó là 404 hay 500
          console.error("Lỗi HTTP:", response.status, response.statusText);
          const errorText = await response.text();
          console.error("Chi tiết lỗi từ Server:", errorText);

          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";
        let buffer = "";

        // Read Server-Sent Events stream
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonString = line.slice(6);
                if (!jsonString.trim()) {
                  // Bỏ qua các dòng dữ liệu rỗng
                  continue;
                }
                const data = JSON.parse(jsonString);
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.done) {
                  break;
                }
                if (data.text) {
                  fullResponse += data.text;
                  // Update UI in real-time
                  setConversations((prev) => {
                    const currentConv = [...(prev[activeChatId] || [])];
                    const lastMessage = currentConv[currentConv.length - 1];
                    if (lastMessage && lastMessage.role === "model") {
                      lastMessage.parts = [{ text: fullResponse }];
                    }
                    return { ...prev, [activeChatId]: currentConv };
                  });
                }
              } catch (e) {
                console.error("Error parsing JSON from SSE line:", line, e);
                if (e instanceof SyntaxError) {
                  console.error(
                    "Malformed JSON received from server. Backend có thể đang gửi thêm ký tự hoặc JSON không hợp lệ."
                  );
                } else {
                  throw e; // Ném lại các lỗi khác để điều tra thêm
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error connecting to backend proxy:", error);
        const errorMessageText =
          "Oops! Something went wrong while connecting to the AI. Please try again later.";
        setConversations((prev) => {
          const currentConv = [...(prev[activeChatId] || [])];
          const lastMessage = currentConv[currentConv.length - 1];
          if (lastMessage && lastMessage.role === "model") {
            lastMessage.parts = [{ text: errorMessageText }];
          }
          return { ...prev, [activeChatId]: currentConv };
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      user,
      userMessageCount,
      conversations,
      activeChatId,
      chatHistory,
      selectedPersonaId,
    ]
  );

  const isChatBlocked = !user && userMessageCount >= GUEST_MESSAGE_LIMIT;

  return (
    <ThemeProvider>
      <div className="flex h-screen font-sans">
        <Sidebar
          user={user}
          activeChatId={activeChatId}
          onChatSelect={setActiveChatId}
          onNewChat={handleNewChat}
          chatHistory={chatHistory}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          activeFeature={activeFeature}
          onFeatureChange={setActiveFeature}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header
            isLoggedIn={!!user}
            user={user}
            selectedPersonaId={selectedPersonaId}
            onPersonaChange={handlePersonaChange}
            activeFeature={activeFeature}
            onFeatureChange={setActiveFeature}
          />
          <div
            className="relative flex-1 w-full flex flex-col overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            {activeFeature === "chat" && (
              <>
                <main className="flex-1 overflow-y-auto">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 h-full">
                    <MessageList messages={messages} isLoading={isLoading} />
                  </div>
                </main>
                <footer
                  className="w-full border-t p-2 sm:p-4 backdrop-blur-sm"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-primary)", // Using --bg-primary, adjust if a different background is desired
                  }}
                >
                  <div className="max-w-4xl mx-auto">
                    <ChatInput
                      onSend={handleSend}
                      isLoading={isLoading}
                      isBlocked={isChatBlocked}
                    />
                  </div>
                </footer>
              </>
            )}
            {activeFeature === "forms" && user && (
              <FormFilling userId={user.uid} />
            )}
            {activeFeature === "audio" && user && (
              <AudioCreation userId={user.uid} />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
