"use client";

import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "../../lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
};

const ChatApp = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Ошибка Google-входа:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    const senderName = user.displayName || user.email || "Аноним";

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: senderName,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {user ? (
        <>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Чат</h2>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Выйти
            </button>
          </div>

          <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 mb-2 rounded-md ${
                  msg.sender === user.displayName || msg.sender === user.email
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
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-center">Авторизация</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <button onClick={login} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Войти
          </button>
          <button onClick={register} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Регистрация
          </button>
          <button onClick={loginWithGoogle} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
            Войти через Google
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
