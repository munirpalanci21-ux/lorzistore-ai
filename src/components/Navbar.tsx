import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { 
  Home, 
  PlusCircle, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  Wallet, 
  User, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  Coins,
  ArrowUpRight
} from "lucide-react";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenAuth: (tab: "login" | "register") => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onOpenAuth, showToast }) => {
  const { currentUser, logout, messages } = useStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Calculate total unread messages for current user
  const unreadCount = messages.filter(m => m.receiverId === currentUser?.id && !m.read).length;

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    showToast("Başarıyla çıkış yapıldı.", "success");
    onNavigate("home");
  };

  const menuItems = [
    { id: "home", label: "Pazar Yeri (Anasayfa)", icon: Home },
    { id: "orders", label: "Siparişlerim", icon: ShoppingBag, authRequired: true },
    { id: "favorites", label: "Favorilerim", icon: Heart, authRequired: true },
    { id: "messages", label: "Mesajlarım", icon: MessageSquare, authRequired: true, badge: unreadCount },
    { id: "deposit", label: "Bakiye Yükle", icon: Wallet, authRequired: true }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-orange-500/10 bg-[#07080a]/95 backdrop-blur-md px-4 font-sans shadow-[0_4px_30px_rgba(0,0,0,0.8)]" id="main-nav">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
        
        {/* LOGO: Cyber style glowing Mor-Mavi branding */}
        <div 
          onClick={() => { onNavigate("home"); }} 
          className="flex cursor-pointer items-center gap-2.5 group"
          id="nav-logo"
        >
          {/* Logo emblem */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-650 via-purple-600 to-indigo-550 shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:scale-105 transition-transform duration-300 border border-purple-500/20">
            <Sparkles className="h-5.5 w-5.5 text-purple-200 animate-pulse animate-duration-1000" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-xl font-black bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-tighter uppercase italic">
                LorziStore
              </span>
            </div>
            <span className="text-[8px] tracking-widest text-indigo-400 font-black mt-0.5 uppercase">GAMING MARKETPLACE</span>
          </div>
          {/* Active status indicator */}
          <span className="hidden sm:inline-flex rounded-md bg-purple-500/10 px-2 py-0.5 text-[8px] font-extrabold text-purple-400 border border-purple-500/20 animate-pulse uppercase">
            Sistem Aktif
          </span>
        </div>

        {/* SEARCH BAR (ItemSatis style fast access mockup) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-6" id="nav-search-mock">
          <div className="relative w-full">
            <input
              type="text"
              readOnly
              onClick={() => {
                onNavigate("home");
                setTimeout(() => {
                  const searchEl = document.getElementById("hero-search-area");
                  if (searchEl) searchEl.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              placeholder="Oyun, hesap veya bakiye ara..."
              className="w-full rounded-xl bg-gray-950/85 hover:bg-gray-950 border border-white/5 hover:border-orange-500/25 py-2 px-4 text-xs text-gray-400 outline-none transition-all cursor-pointer placeholder:text-gray-500 font-semibold"
            />
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-650 pointer-events-none text-[10px] uppercase font-bold text-orange-400">
              Ara
            </span>
          </div>
        </div>

        {/* NAVIGATION ACTIONS & USER AREA */}
        <div className="flex items-center gap-3.5" id="nav-right-area">
          
          {/* DIRECT ACTION 1: Para Yükle button (Top-Right requirement) */}
          {currentUser && (
            <button
              onClick={() => onNavigate("deposit")}
              className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-black tracking-wide transition-all cursor-pointer ${
                currentPage === "deposit"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  : "border-gray-800 bg-gray-900/40 hover:bg-gray-900 hover:text-white text-gray-300"
              }`}
            >
              <Wallet size={13} className="text-emerald-400" />
              <span>Para Yükle</span>
            </button>
          )}

          {/* DIRECT ACTION 2: İlan Ekle button (Top-Right requirement) */}
          <button
            onClick={() => {
              if (currentUser) {
                onNavigate("add-listing");
              } else {
                onOpenAuth("login");
                showToast("İlan eklemek için giriş yapmanız gerekmektedir.", "error");
              }
            }}
            className={`flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 px-4 py-2 text-xs font-black text-white hover:opacity-90 shadow-[0_4px_15px_rgba(249,115,22,0.25)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.4)] hover:scale-[1.03] transition-all cursor-pointer ${
              currentPage === "add-listing" ? "ring-2 ring-orange-400" : ""
            }`}
            id="nav-add-listing-item"
          >
            <PlusCircle size={14} className="text-orange-200" />
            <span>İlan Ekle</span>
          </button>

          {/* USER INTERACTIVE PROFILE DROP-DOWN BUTTON (Replacing 3-lines menu) */}
          <div className="relative" id="nav-profile-menu-container">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Desktop balance display pill */}
                <div 
                  onClick={() => onNavigate("profile")}
                  className="hidden md:flex flex-col items-end cursor-pointer bg-gray-950 px-3.5 py-1.5 rounded-xl border border-white/5 hover:border-orange-500/25 transition-all text-right"
                >
                  <span className="text-[8px] text-gray-500 font-extrabold tracking-widest">BAKİYENİZ</span>
                  <span className="text-xs font-black text-orange-400 font-mono">
                    {currentUser.balance.toLocaleString()} TL
                  </span>
                </div>

                {/* Main clickable avatar card to open dropdown panel */}
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl bg-gray-900/80 hover:bg-gray-900 border border-white/5 hover:border-orange-500/20 px-2 py-1.5 transition-all cursor-pointer"
                  type="button"
                >
                  <div className="relative">
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#07080a] animate-pulse"></span>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.username} 
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-lg object-cover ring-1 ring-orange-500/20"
                    />
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 hidden sm:inline ${isProfileDropdownOpen ? "rotate-180 text-orange-400" : ""}`} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth("login")}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-2 text-xs font-black text-gray-300 hover:bg-gray-900 hover:text-white transition-all cursor-pointer"
                >
                  <LogIn size={13} className="text-orange-400" />
                  <span>Giriş Yap</span>
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="hidden sm:inline-block rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-black text-white shadow-[0_4px_15px_rgba(249,115,22,0.25)] transition-all cursor-pointer"
                >
                  Kayıt Ol
                </button>
              </div>
            )}

            {/* NEW INTERACTIVE PANEL DRAWER/DROPDOWN */}
            {currentUser && isProfileDropdownOpen && (
              <>
                {/* Backdrop overlay */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsProfileDropdownOpen(false)}
                />
                
                {/* Visual Panel Card */}
                <div 
                  className="absolute right-0 mt-3.5 w-72 origin-top-right rounded-2xl border border-orange-500/20 bg-gray-950 p-4.5 shadow-[0_10px_40px_rgba(0,0,0,0.95)] ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                  id="profile-panel-dropdown"
                >
                  {/* Member Badge identity representation */}
                  <div className="border-b border-gray-900 pb-4.5 mb-3.5">
                    <span className="text-[8px] text-orange-400 font-extrabold uppercase bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/25 shadow-sm inline-block mb-2">
                      {currentUser.role === "admin" ? "Lorzi Store Yönetici" : "Güvenli Oyuncu"}
                    </span>
                    <div className="flex items-center gap-3">
                      <img 
                        src={currentUser.avatar} 
                        alt={currentUser.username}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-xl object-cover border border-orange-500/30"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white flex items-center gap-1 truncate">
                          @{currentUser.username}
                          {currentUser.kycStatus === "approved" && (
                            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] text-white" title="Kimliği Doğrulanmış Mağaza">✓</span>
                          )}
                        </span>
                        <span className="block text-[10px] text-gray-500 tracking-wider truncate">{currentUser.email}</span>
                      </div>
                    </div>

                    {/* Quick mobile financial info */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-900 text-left">
                      <div className="bg-gray-900/60 p-2 rounded-xl border border-gray-900">
                        <span className="block text-[8px] text-gray-500 font-extrabold uppercase">CÜZDAN</span>
                        <span className="text-xs font-black text-orange-405 font-mono">{currentUser.balance} TL</span>
                      </div>
                      <div className="bg-gray-900/60 p-2 rounded-xl border border-gray-900">
                        <span className="block text-[8px] text-gray-500 font-extrabold uppercase">SATIŞ GELİRİ</span>
                        <span className="text-xs font-black text-purple-400 font-mono">{currentUser.salesBalance} TL</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational links list */}
                  <div className="space-y-1.5" id="profile-panel-links">
                    
                    {/* View Profile wallet */}
                    <button
                      onClick={() => {
                        onNavigate("profile");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-905 hover:text-white transition-colors text-left"
                    >
                      <User size={14} className="text-orange-400" />
                      <span>Profilim & Cüzdan</span>
                    </button>

                    {/* Deposit Balance */}
                    <button
                      onClick={() => {
                        onNavigate("deposit");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-905 hover:text-white transition-colors text-left"
                    >
                      <Wallet size={14} className="text-emerald-400" />
                      <span>Bakiye Yükle (EFT/Havale)</span>
                    </button>

                    {/* Add Listing */}
                    <button
                      onClick={() => {
                        onNavigate("add-listing");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-905 hover:text-white transition-colors text-left"
                    >
                      <PlusCircle size={14} className="text-indigo-400" />
                      <span>Yeni İlan Satışa Çıkar</span>
                    </button>

                    {/* Orders */}
                    {currentUser && (
                      <button
                        onClick={() => {
                          onNavigate("orders");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-905 hover:text-white transition-colors text-left"
                      >
                        <ShoppingBag size={14} className="text-blue-400" />
                        <span>Siparişlerim & Satışlarım</span>
                      </button>
                    )}

                    {/* Messages */}
                    {currentUser && (
                      <button
                        onClick={() => {
                          onNavigate("messages");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-905 hover:text-white transition-colors text-left"
                      >
                        <MessageSquare size={14} className="text-yellow-400" />
                        <span className="flex-1">Mesajlarım</span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-orange-650 px-1.5 py-0.5 text-[8px] font-black text-white animate-pulse">
                            {unreadCount} YENİ
                          </span>
                        )}
                      </button>
                    )}

                    {/* Favorites */}
                    {currentUser && (
                      <button
                        onClick={() => {
                          onNavigate("favorites");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-905 hover:text-white transition-colors text-left"
                      >
                        <Heart size={14} className="text-rose-400" />
                        <span>Favorilerim</span>
                      </button>
                    )}

                    {/* Admin Panel button if is admin */}
                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          onNavigate("admin");
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl bg-red-950/20 border border-red-900/30 px-3 py-2.5 text-xs font-extrabold text-red-400 hover:bg-red-950/40 transition-all text-left"
                      >
                        <ShieldCheck size={14} />
                        <span>Yönetici Paneli (Admin)</span>
                      </button>
                    )}

                  </div>

                  {/* Sign Out Trigger section */}
                  <div className="border-t border-gray-900 mt-3 pt-3">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-black text-red-500 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Güvenli Çıkış Yap</span>
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* QUICK SUB NAV MENU (ItemSatis style product directory bar) */}
      <div className="border-t border-white/5 border-dashed py-2.5 hidden lg:block bg-black/20">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-3 text-xs">
          <div className="flex items-center gap-6 text-gray-400 font-bold">
            {menuItems.map(m => {
              if (m.authRequired && !currentUser) return null;
              const isActive = currentPage === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onNavigate(m.id)}
                  className={`hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer font-black uppercase text-[10px] tracking-wider ${isActive ? "text-orange-400" : ""}`}
                >
                  <m.icon size={11} className={isActive ? "text-orange-400" : "text-gray-500"} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase">
            <span>Komisyon Oranı: %7</span>
            <span>•</span>
            <span>7/24 Onay Havuzu</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
