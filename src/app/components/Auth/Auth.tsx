"use client";

import { useState, useEffect } from "react";
import { auth, googleProvider } from "../../lib/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(auth.currentUser);

  // Следим за состоянием пользователя
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      {user ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold">Привет, {user.displayName || user.email}!</h2>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Выйти
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
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

export default Auth;
