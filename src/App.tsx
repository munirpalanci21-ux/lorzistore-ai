/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { MarketplaceFeed } from "./components/MarketplaceFeed";
import { AddListingPage } from "./components/AddListingPage";
import { ChatSystem } from "./components/ChatSystem";
import { FavoritesPage } from "./components/FavoritesPage";
import { OrdersPage } from "./components/OrdersPage";
import { DepositPage } from "./components/DepositPage";
import { ProfilePage } from "./components/ProfilePage";
import { AdminPanel } from "./components/AdminPanel";
import { AuthModal } from "./components/AuthModal";
import { LiveSupport } from "./components/LiveSupport";
import { ListingDetailModal } from "./components/ListingDetailModal";
import { Listing } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Info, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

interface ToastState {
  message: string;
  type: "success" | "error";
  id: number;
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedListingDetail, setSelectedListingDetail] = useState<Listing | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [initLoading, setInitLoading] = useState(true);
  const { currentUser, listings } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleNavigate = (page: string) => {
    // Protected routes barrier: if user is not logged in, prevent accessing restricted pages
    const protectedPages = ["add-listing", "orders", "favorites", "messages", "deposit", "profile"];
    if (protectedPages.includes(page) && !currentUser) {
      showToast("Lütfen öncelikle giriş yapın.", "error");
      setAuthModalTab("login");
      setIsAuthOpen(true);
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render Page Content based on current navigation state
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectCategory={(id) => {
                setSelectedCategory(id);
                // Also trigger scroll smoothly to active feed
                const feedEl = document.getElementById("marketplace-feed-container");
                if (feedEl) {
                  feedEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              activeCategory={selectedCategory}
            />
            <MarketplaceFeed
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onBuy={handleMarketplaceBuy}
              onMessage={(sellerId, sellerName, listingId, title, image) => {
                // Find or create chat and navigate to messages tab
                const { sendMessage } = useStore();
                sendMessage(sellerId, sellerName, "Merhaba, ilanı satın almak istiyorum veya detaylı bilgi alabilir miyim?", listingId, title, image);
                handleNavigate("messages");
              }}
              showToast={showToast}
              onViewDetails={(id) => {
                const item = listings.find(l => l.id === id);
                if (item) setSelectedListingDetail(item);
              }}
            />
          </motion.div>
        );
      
      case "add-listing":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <AddListingPage onNavigate={handleNavigate} showToast={showToast} />
          </motion.div>
        );

      case "messages":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChatSystem showToast={showToast} />
          </motion.div>
        );

      case "favorites":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FavoritesPage
              onNavigate={handleNavigate}
              onBuy={(id) => {
                const { buyListing } = useStore();
                const res = buyListing(id);
                if (res.success) {
                  showToast(res.message, "success");
                  handleNavigate("orders");
                } else {
                  showToast(res.message, "error");
                }
              }}
              onMessage={(sellerId, sellerName, listingId, title, image) => {
                const { sendMessage } = useStore();
                sendMessage(sellerId, sellerName, "Merhaba, favorilerimdeki bu ilanla ilgileniyorum.", listingId, title, image);
                handleNavigate("messages");
              }}
              onViewDetails={(id) => {
                const item = listings.find(l => l.id === id);
                if (item) setSelectedListingDetail(item);
              }}
            />
          </motion.div>
        );

      case "orders":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <OrdersPage onNavigate={handleNavigate} showToast={showToast} />
          </motion.div>
        );

      case "deposit":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <DepositPage onNavigate={handleNavigate} showToast={showToast} />
          </motion.div>
        );

      case "profile":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ProfilePage onNavigate={handleNavigate} showToast={showToast} />
          </motion.div>
        );

      case "admin":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminPanel onNavigate={handleNavigate} showToast={showToast} />
          </motion.div>
        );

      default:
        return <div>Uygulama Hatası: Sayfa bulunamadı.</div>;
    }
  };

  // Define buy function from useStore context
  const { buyListing } = useStore();
  const handleMarketplaceBuy = (id: string) => {
    const res = buyListing(id);
    if (res.success) {
      showToast(res.message, "success");
      handleNavigate("orders");
    } else {
      showToast(res.message, "error");
    }
  };

  if (initLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#04060b] font-sans text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4 text-center cursor-default"
        >
          {/* Pulsing Loading Logo Emblem */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 shadow-[0_0_40px_rgba(168,85,247,0.4)] animate-pulse">
            <ShieldCheck size={36} className="text-white" />
          </div>
          <div className="mt-2">
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent tracking-tighter uppercase italic leading-none">
              LorziStore
            </h1>
            <p className="text-[9px] tracking-widest text-gray-500 font-extrabold mt-2 uppercase">GAMING MARKETPLACE</p>
          </div>
          {/* Subtle Spinner */}
          <div className="mt-2 h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent animate-pulse"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between selection:bg-purple-600/30 selection:text-purple-300 font-sans">
      
      {/* Background radial effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-purple-900/10 blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar
          onNavigate={handleNavigate}
          currentPage={currentPage}
          onOpenAuth={(tab) => {
            setAuthModalTab(tab);
            setIsAuthOpen(true);
          }}
          showToast={showToast}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {currentPage === "home" ? (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Hero
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSelectCategory={(id) => {
                    setSelectedCategory(id);
                    const feedEl = document.getElementById("marketplace-feed-container");
                    if (feedEl) {
                      feedEl.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  activeCategory={selectedCategory}
                />
                <MarketplaceFeed
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onBuy={handleMarketplaceBuy}
                  onMessage={(sellerId, sellerName, listingId, title, image) => {
                    const { sendMessage } = useStore();
                    sendMessage(sellerId, sellerName, "Merhaba, ilanla ilgileniyorum. Detaylar hakkında bilgi verebilir misiniz?", listingId, title, image);
                    handleNavigate("messages");
                  }}
                  showToast={showToast}
                  onViewDetails={(id) => {
                    const item = listings.find(l => l.id === id);
                    if (item) setSelectedListingDetail(item);
                  }}
                />
              </motion.div>
            ) : (
              renderPage()
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Canlı Destek Butonu */}
      <LiveSupport />

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-gray-900/60 bg-gray-950 py-10 px-4 mt-20 font-sans">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">LorziStore</h4>
            <p className="text-[11px] text-gray-500 mt-1">Sınır tanımayan dijital ticaret pazarı. Tüm hakları saklıdır. &copy; 2026</p>
          </div>
          <div className="flex gap-4.5 text-xs text-gray-500 font-bold mb-4 md:mb-0">
            <button onClick={() => handleNavigate("home")} className="hover:text-purple-400 transition-colors">Ana Sayfa</button>
            <span>•</span>
            <span className="text-gray-600">Lorzi Store Güvencesi</span>
            <span>•</span>
            <span className="text-gray-600">7/24 Koruma</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal (Giriş / Kayıt) */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            initialTab={authModalTab}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Listing Detail Modal */}
      <AnimatePresence>
        {selectedListingDetail && (
          <ListingDetailModal
            listing={selectedListingDetail}
            isOpen={!!selectedListingDetail}
            onClose={() => setSelectedListingDetail(null)}
            onBuy={handleMarketplaceBuy}
            onMessage={(sellerId, sellerName, listingId, title, image) => {
              const { sendMessage } = useStore();
              sendMessage(sellerId, sellerName, "Merhaba, ilandaki ürün hakkında bilgi alabilir miyim?", listingId, title, image);
              handleNavigate("messages");
            }}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Premium Toast Array Notifications Display */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none" id="toasts-dock">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`flex items-center gap-2.5 rounded-2xl border px-4.5 py-3.5 shadow-2xl backdrop-blur-md pointer-events-auto min-w-[280px] max-w-sm ${
                toast.type === "success"
                  ? "border-emerald-500/30 bg-gray-950/95 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                  : "border-rose-500/30 bg-gray-950/95 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={18} className="shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle size={18} className="shrink-0 text-rose-400" />
              )}
              <span className="text-xs font-semibold leading-normal text-gray-205">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
