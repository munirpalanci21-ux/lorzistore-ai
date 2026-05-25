import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../context/StoreContext";
import { Send, Check, CheckCheck, Smile, HelpCircle, BadgeAlert, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface ChatSystemProps {
  initialChatId?: string | null;
  showToast: (msg: string, type: "success" | "error") => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ initialChatId = null, showToast }) => {
  const { chats, messages, sendMessage, currentUser, markMessagesAsRead } = useStore();
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChatId]);

  // Handle auto-reading messages when chat loads
  useEffect(() => {
    if (activeChatId) {
      markMessagesAsRead(activeChatId);
    }
  }, [activeChatId, messages]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center font-sans">
        <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <MessageSquare className="mx-auto text-purple-500 mb-4 animate-bounce" size={40} />
          <h3 className="text-lg font-black text-white">Giriş Yapmalısınız</h3>
          <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">Sohbet kutunuzu görmek ve diğer alıcı-satıcılarla mesajlaşabilmek için lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  // Filter chats relevant of current logged in user
  const userChats = chats.filter(c => c.buyerId === currentUser.id || c.sellerId === currentUser.id);

  // Active chat object
  const activeChat = userChats.find(c => c.id === activeChatId);

  // Chat messages
  const activeChatMessages = messages.filter(m => m.chatId === activeChatId);

  // Find recipient ID of active chat
  const recipientId = activeChat 
    ? (activeChat.buyerId === currentUser.id ? activeChat.sellerId : activeChat.buyerId)
    : "";
  const recipientName = activeChat
    ? (activeChat.buyerId === currentUser.id ? activeChat.sellerName : activeChat.buyerName)
    : "";

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatId || !activeChat) return;

    sendMessage(
      recipientId,
      recipientName,
      typedMessage,
      activeChat.listingId,
      activeChat.listingTitle,
      activeChat.listingImage
    );

    setTypedMessage("");
    showToast("Mesajınız gönderildi.", "success");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 font-sans" id="chat-system-page">
      <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-gray-950 bg-gray-950/40 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] h-[650px]" id="chat-frame-box">
        
        {/* LEFT BAR: Sohbet Odası Listeleri */}
        <div className="col-span-1 border-r border-gray-900 flex flex-col h-full overflow-hidden bg-gray-950/60" id="chats-sidebar">
          
          <div className="p-4 border-b border-gray-900 flex justify-between items-center bg-gray-950">
            <div>
              <h3 className="text-sm font-black text-white">Sohbetlerim</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5 tracking-wider">MESAJ KUTUSU</p>
            </div>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[9px] font-black text-purple-400">
              {userChats.length} Görüşme
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-900/60" id="chat-rooms-list">
            {userChats.length > 0 ? (
              userChats.map(chat => {
                const partnerName = chat.buyerId === currentUser.id ? chat.sellerName : chat.buyerName;
                const isRoomActive = chat.id === activeChatId;

                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-4 flex gap-3 items-center cursor-pointer transition-all hover:bg-gray-900/30 ${
                      isRoomActive ? "bg-purple-950/15 border-l-2 border-purple-500" : ""
                    }`}
                  >
                    {/* Chat avatar / Listing small preview */}
                    <div className="relative">
                      <div className="h-10 w-10 rounded-xl bg-purple-950/30 border border-purple-500/15 flex items-center justify-center text-purple-400 font-bold overflow-hidden">
                        {chat.listingImage ? (
                          <img src={chat.listingImage} alt={chat.listingTitle} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span>{partnerName.substring(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      {chat.unreadCount && chat.unreadCount > 0 && chat.id !== activeChatId ? (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-600 text-[8px] font-black text-white animate-pulse">
                          {chat.unreadCount}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-200 block truncate">@{partnerName}</span>
                        <span className="text-[9px] text-gray-500 font-bold">
                          {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-400 truncate block mt-0.5 font-semibold">{chat.listingTitle}</span>
                      <p className="text-[11px] text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-gray-500 px-4">
                <MessageSquare size={32} className="mx-auto text-gray-800 mb-2" />
                <h5 className="text-xs font-bold text-gray-400">Görüşme Bulunmuyor</h5>
                <p className="text-[10px] text-gray-600 max-w-[200px] mx-auto mt-1">İlan kartındaki 'Sohbet' butonunu kullanarak satıcılarla anında yazışabilirsiniz.</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT BOX: Sohbet Mesaj Akışı */}
        <div className="col-span-1 md:col-span-2 flex flex-col h-full overflow-hidden bg-gray-950/10" id="chat-messages-container">
          {activeChat ? (
            <>
              {/* Partner Header details */}
              <div className="p-4 border-b border-gray-900 flex justify-between items-center bg-gray-950">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-gray-200">@{recipientName}</h4>
                    <span className="text-[10px] text-purple-400 block truncate max-w-[180px] md:max-w-xs font-semibold">{activeChat.listingTitle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-850 px-3 py-1.5 rounded-xl">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase">REFERANS KODU</span>
                  <span className="text-[10px] font-black text-purple-400">LORZI-{activeChat.listingId.substring(4, 8).toUpperCase()}</span>
                </div>
              </div>

              {/* Feed of Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950/30" id="messages-scroller-box">
                
                {/* Notice banner */}
                <div className="mx-auto max-w-sm rounded-xl border border-dashed border-purple-500/20 bg-purple-500/5 p-3 text-center text-[10px] text-purple-400/80 leading-relaxed font-semibold">
                  <AlertCircle size={12} className="mx-auto mb-1 text-purple-400" />
                  <span>LorziStore koruması kapsamında alışverişlerinizi ve para transfer kodlarınızı site dışı paylaşmayınız.</span>
                </div>

                {activeChatMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs md:text-sm leading-relaxed ${
                        isMe
                          ? "bg-purple-600 border border-purple-500 text-white rounded-tr-none"
                          : "bg-gray-900 border border-gray-850 text-gray-200 rounded-tl-none"
                      }`}>
                        
                        {!isMe && (
                          <span className="block text-[10px] font-extrabold text-purple-400 mb-1">@{msg.senderName}</span>
                        )}

                        <p className="font-medium whitespace-pre-wrap">{msg.content}</p>

                        <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] opacity-70">
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && (
                            msg.read ? <CheckCheck size={11} className="text-emerald-400" /> : <Check size={11} />
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Send Input Box area */}
              <form onSubmit={handleSendMessageSubmit} className="p-4 bg-gray-950 border-t border-gray-900 flex gap-2">
                <input
                  type="text"
                  required
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Mesajınızı dürüstlük kurallarına uygun olarak yazın..."
                  className="w-full rounded-xl bg-gray-900 border border-gray-850 px-4 py-3 text-xs md:text-sm text-white placeholder:text-gray-600 outline-none focus:border-purple-500 font-medium transition-all"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 text-white hover:bg-purple-700 px-5 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-10" id="chat-fallback">
              <MessageSquare size={48} className="text-gray-800 mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-gray-400">Görüşme Seçilmedi</h4>
              <p className="text-xs text-gray-600 text-center max-w-xs mt-1">Görüşmeleri okumak ve mesaj göndermek için sol taraftaki kutudan bir sohbet odası seçin.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
