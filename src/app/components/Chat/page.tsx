"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Загружаем данные из localStorage при первом рендере
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    const savedUsername = localStorage.getItem("chatUsername");

    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedUsername) {
      setUsername(savedUsername);
      setIsUsernameSet(true);
    }
  }, []);

  // Сохранение сообщений в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Автоскролл вниз
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !isUsernameSet) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: username,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  const handleUsernameSubmit = () => {
    if (!username.trim()) return;
    localStorage.setItem("chatUsername", username);
    setIsUsernameSet(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Чат</h2>

      {/* Форма для установки имени */}
      {!isUsernameSet ? (
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите ваше имя..."
            className="p-2 border rounded-lg w-full"
          />
          <button
            onClick={handleUsernameSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Подтвердить
          </button>
        </div>
      ) : (
        <>
          {/* Список сообщений */}
          <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 mb-2 rounded-md ${
                  msg.sender === username
                    ? "bg-blue-500 text-white text-right ml-auto"
                    : "bg-gray-100 text-black"
                } max-w-[75%]`}
              >
                <p className="text-sm font-bold">{msg.sender}</p>
                <p>{msg.text}</p>
                <p className="text-xs opacity-70">{msg.timestamp}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Форма ввода сообщения */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите сообщение..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              ➤
            </button>
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              ✖
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
