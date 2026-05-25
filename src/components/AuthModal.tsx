import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { X, Mail, Lock, User, Sparkles, KeySquare } from "lucide-react";
import { motion } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
  showToast: (msg: string, type: "success" | "error") => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = "login", showToast }) => {
  const { login, register } = useStore();
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "login") {
      const res = login(email, password);
      if (res.success) {
        showToast(res.message, "success");
        onClose();
      } else {
        showToast(res.message, "error");
      }
    } else {
      const res = register(username, email);
      if (res.success) {
        showToast(res.message, "success");
        onClose();
      } else {
        showToast(res.message, "error");
      }
    }
  };

  const fillAdminCredentials = () => {
    setEmail("munirpalanci21@gmail.com");
    setPassword("admin123");
    setActiveTab("login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 px-4 backdrop-blur-md font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-purple-500/20 bg-gray-950 p-6 md:p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)]"
        id="auth-modal-card"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
          id="auth-close-btn"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">LorziStore</span>
            <Sparkles className="text-purple-400 h-5 w-5" />
          </h3>
          <p className="text-xs text-gray-400 mt-1">Dijital hesap, skin ve ilan pazar yeri</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-6" id="auth-tabs">
          <button
            onClick={() => {
              setActiveTab("login");
              setPassword("");
            }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "login"
                ? "border-purple-500 text-purple-400 font-bold"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setPassword("");
            }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "register"
                ? "border-purple-500 text-purple-400 font-bold"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "register" && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Kullanıcı Adı</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Kullanıcı adınızı girin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">E-posta Adresi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="E-posta adresinizi girin"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl bg-gray-900 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Şifre</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required={activeTab === "login"}
                placeholder="Şifrenizi girin (Lütfen kaydedin)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl bg-gray-900 border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer mt-2"
          >
            {activeTab === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        {activeTab === "login" && (
          <div className="mt-6 border-t border-gray-900 pt-4">
            <button
              onClick={fillAdminCredentials}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-purple-500/20 bg-purple-500/5 px-4 py-3 text-xs text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all cursor-pointer"
              type="button"
              id="admin-quick-login-btn"
            >
              <KeySquare size={14} />
              <span>Geliştirici İçi: Admin Girişi Yap</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
