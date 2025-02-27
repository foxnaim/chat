"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  text: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Загрузка сообщений из localStorage при первом рендере
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Сохранение сообщений в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Прокрутка вниз после отправки сообщения
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input }]);
    setInput("");
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Чат</h2>

      <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 bg-gray-100 rounded-md mb-2">{msg.text}</div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          ➤
        </button>
        <button onClick={clearChat} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          ✖
        </button>
      </div>
    </div>
  );
};

export default Chat;
