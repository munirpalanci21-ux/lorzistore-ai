import React, { useState } from "react";
import { MessageSquare, X, Instagram, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const LiveSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="live-support-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="mb-4 w-80 md:w-96 rounded-3xl border border-purple-500/20 bg-gray-950/90 p-5 shadow-[0_10px_40px_rgba(139,92,246,0.25)] backdrop-blur-xl"
            id="live-support-popup"
          >
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-gray-950 animate-ping"></span>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-gray-950"></span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <MessageSquare size={18} className="animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">LorziStore Canlı Destek</h4>
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider">Geçici Olarak Çevrimdışı</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-gray-905 p-1.5 text-gray-500 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
                id="close-support-btn"
              >
                <X size={15} />
              </button>
            </div>

            <div className="my-5">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/10 border border-purple-500/25 text-purple-400 text-xs font-black">
                  LS
                </div>
                <div className="rounded-2xl rounded-tl-none bg-gray-950/80 px-4 py-3 border border-gray-900 shadow-inner">
                  <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                    Merhaba 👋 <span className="text-purple-400 font-bold">LorziStore</span> henüz yeni. Canlı destek şu an aktif değil.
                  </p>
                  <p className="mt-2 text-xs text-gray-300 leading-normal">
                    Her türlü soru ve sorunlarınız için Instagram üzerinden bizimle iletişime geçebilirsiniz:
                  </p>
                  
                  <a
                    href="https://instagram.com/munirrz0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-3 py-2 text-xs font-black text-white shadow-lg transition-all transform active:scale-95"
                  >
                    <Instagram size={14} />
                    <span>@munirrz0</span>
                  </a>

                  <p className="mt-3 text-[10px] text-gray-500 font-bold flex items-center justify-center gap-1">
                    <span>En kısa sürede yardımcı olacağız</span>
                    <Heart size={9} className="text-rose-500 fill-rose-500 animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with custom ping animation */}
      <div className="relative">
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-60 blur-md animate-pulse"></span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#090d16] text-white border border-purple-500/30 cursor-pointer shadow-2xl"
          id="live-support-floating-btn"
        >
          {isOpen ? <X size={20} /> : <MessageSquare size={20} className="text-purple-400" />}
        </motion.button>
      </div>
    </div>
  );
};
