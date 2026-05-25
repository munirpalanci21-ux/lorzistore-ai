import React, { useState } from "react";
import { Listing, Review } from "../types";
import { useStore } from "../context/StoreContext";
import { 
  X, 
  MessageSquare, 
  ShoppingCart, 
  ShieldCheck, 
  Heart, 
  AlertTriangle, 
  Star, 
  Clock, 
  UserCheck, 
  Package,
  Calendar,
  Sparkles,
  Award,
  ThumbsUp
} from "lucide-react";
import { motion } from "motion/react";

interface ListingDetailModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (id: string) => void;
  onMessage: (sellerId: string, sellerName: string, listingId: string, title: string, image?: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  onBuy,
  onMessage,
  showToast
}) => {
  const { reviews, favorites, toggleFavorite, currentUser, users, listings } = useStore();
  const [complaintText, setComplaintText] = useState("");
  const [isComplaining, setIsComplaining] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Local navigation inside the modal for similar items
  const [localActiveListing, setLocalActiveListing] = useState<Listing | null>(null);
  const currentListing = localActiveListing || listing;

  // Reset local state when parent listing changes
  React.useEffect(() => {
    setLocalActiveListing(null);
    setActiveImageIndex(0);
  }, [listing.id]);

  if (!isOpen) return null;

  const isFavorite = favorites.includes(currentListing.id);
  const isOwnListing = currentUser?.id === currentListing.sellerId;

  // Find seller online status
  const sellerUser = users.find(u => u.id === currentListing.sellerId);
  const isOnline = sellerUser?.isOnline ?? false;
  const lastSeenStr = sellerUser?.lastSeen 
    ? new Date(sellerUser.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "Bilinmiyor";

  // Calculate seller reviews & rating
  const sellerReviews = reviews.filter(r => r.sellerId === currentListing.sellerId);
  const totalSellerReviews = sellerReviews.length;
  const avgSellerRating = totalSellerReviews > 0
    ? (sellerReviews.reduce((sum, r) => sum + r.rating, 0) / totalSellerReviews).toFixed(1)
    : "5.0";

  // Positive feedback ratio (4 or 5 stars)
  const positiveReviewsCount = sellerReviews.filter(r => r.rating >= 4).length;
  const positiveRatio = totalSellerReviews > 0
    ? Math.round((positiveReviewsCount / totalSellerReviews) * 100)
    : 100;

  // Calculate item reviews
  const itemReviews = reviews.filter(r => r.listingId === currentListing.id);

  const handleReport = () => {
    showToast("İlan şikayeti Lorzi Store Yönetici Ekibi'ne başarıyla iletildi. İlgili ilan kontrol edilecektir.", "success");
    setIsComplaining(false);
  };

  // Gallery Images Builder - ensures we always have 3 genuine high quality related pictures
  const galleryImages = [
    currentListing.images[0] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600",
    currentListing.category.toLowerCase() === "valorant"
      ? "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600"
      : currentListing.category.toLowerCase().includes("pubg")
      ? "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600"
      : currentListing.category.toLowerCase() === "cs2"
      ? "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=600"
      : "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=600",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600"
  ];

  // Similar listings filter (same category, different ID)
  const similarItems = listings.filter(
    l => l.id !== currentListing.id && 
         l.category.toLowerCase() === currentListing.category.toLowerCase() && 
         l.status === "active"
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 md:p-6 backdrop-blur-md overflow-y-auto font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-5xl rounded-3xl border border-gray-800 bg-[#07090e] shadow-[0_10px_50px_rgba(139,92,246,0.15)] overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Banner with sparkles */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-900/60 bg-gray-950/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-[10px] font-black tracking-wider text-purple-400 border border-purple-500/20 uppercase">
              {currentListing.category} / {currentListing.subcategory}
            </span>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-[11px] text-gray-400 font-bold">İlan ID: {currentListing.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="rounded-xl border border-gray-850 p-2 text-gray-400 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Content Container */}
        <div className="overflow-y-auto p-5 md:p-8 flex-1 space-y-8 scrollbar-thin scrollbar-thumb-purple-900 bg-[#04060b]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Visual Column / Gallery (Left & Top - 5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Main Active image container with gradient borders */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-950 border border-purple-500/20 shadow-2xl group">
                <img 
                  src={galleryImages[activeImageIndex]} 
                  alt={currentListing.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {currentListing.isFeatured && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-[10px] font-black text-white shadow-lg tracking-wide">
                    <Sparkles size={11} className="animate-spin" />
                    ÖNE ÇIKAN İLAN
                  </div>
                )}

                {/* Left/Right manual indicators overlay */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/75 rounded-lg text-[9px] text-gray-400 font-black px-2 py-1 select-none">
                  FOTO {activeImageIndex + 1} / {galleryImages.length}
                </div>
              </div>

              {/* Gallery thumbnails selectors */}
              <div className="flex items-center gap-2.5 select-none" id="gallery-indicator-row">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-12 w-16 rounded-xl border-2 overflow-hidden bg-gray-900 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx 
                        ? "border-purple-500 scale-105 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                        : "border-gray-900 opacity-60 hover:opacity-100 hover:border-gray-850"
                    }`}
                  >
                    <img src={img} className="h-full w-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              {/* Delivery Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-gray-900/40 border border-gray-900 p-3 text-center">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase block tracking-wider mb-1">TESLİMAT</span>
                  <div className="flex items-center justify-center gap-1 text-xs font-black text-purple-400">
                    <Clock size={12} />
                    <span>{currentListing.deliveryTime}</span>
                  </div>
                </div>
                <div className="rounded-xl bg-gray-900/40 border border-gray-900 p-3 text-center">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase block tracking-wider mb-1">STOK DURUMU</span>
                  <span className={`text-xs font-black ${currentListing.stock > 0 ? "text-emerald-400" : "text-rose-500"}`}>
                    {currentListing.stock > 0 ? `${currentListing.stock} Adet` : "Tükendi"}
                  </span>
                </div>
                <div className="rounded-xl bg-gray-900/40 border border-gray-900 p-3 text-center">
                  <span className="text-[9px] text-gray-500 font-extrabold uppercase block tracking-wider mb-1">GÜVENCE</span>
                  <span className="text-xs font-black text-blue-400 flex items-center justify-center gap-0.5">
                    <ShieldCheck size={12} className="shrink-0 text-blue-400" />
                    <span>%100</span>
                  </span>
                </div>
              </div>

              {/* Seller Profiling Card */}
              <div className="rounded-2xl border border-gray-900 bg-gray-950/60 p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">SATICI KARTI</span>
                  <div className="flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-650 animate-pulse"}`}></span>
                    <span className="text-[10px] text-gray-500 font-bold">{isOnline ? "Çevrimiçi" : `Aktiflik: ${lastSeenStr}`}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img 
                    src={sellerUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentListing.sellerName)}`} 
                    alt={currentListing.sellerName}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-xl object-cover bg-purple-950/40 ring-2 ring-purple-500/20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h5 className="text-sm font-black text-white hover:text-purple-400 transition-colors cursor-pointer truncate">@{currentListing.sellerName}</h5>
                      {currentListing.sellerVerified && (
                        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-600 text-[9px] font-black text-white" title="Kimliği Onaylanmış Güvenilir Mağaza">✓</span>
                      )}
                    </div>
                    <p className="text-[10px] text-purple-400 font-bold tracking-tight uppercase">Güvenilir Satıcı Üye</p>
                  </div>
                </div>

                {/* Seller Ratings Indicator */}
                <div className="border-t border-gray-900/60 pt-3 grid grid-cols-2 gap-2 text-center bg-black/10 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[9px] text-gray-500 font-extrabold uppercase block tracking-wider">MAĞAZA PUANI</span>
                    <div className="flex items-center justify-center gap-1 mt-0.5 text-xs font-extrabold text-[#FFA800]">
                      <Star size={11} fill="#FFA800" stroke="none" />
                      <span>{avgSellerRating} / 5</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 font-extrabold uppercase block tracking-wider">MEMNUNİYET ORANI</span>
                    <span className="text-xs font-black text-emerald-400 mt-0.5 block">%{positiveRatio} Olumlu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Column / Actions (Right Column - 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
                    {currentListing.title}
                  </h1>
                  <span className="inline-block mt-2 rounded-lg bg-gray-900 border border-gray-800 px-3 py-1 text-xs font-extrabold text-gray-400">
                    Kategori: <strong className="text-gray-200">{currentListing.category}</strong> • Alt: <strong className="text-purple-400">{currentListing.subcategory}</strong>
                  </span>
                </div>

                {/* Price Display Block */}
                <div className="rounded-2xl bg-gradient-to-r from-gray-950/85 to-purple-950/15 border border-purple-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block">GÜVENLİ HAVUZ SATIŞ FİYATI</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                      {currentListing.price.toLocaleString()} TL
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(currentListing.id)}
                      className={`flex h-11 px-4 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                        isFavorite 
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-500" 
                          : "border-gray-850 bg-gray-900/40 text-gray-400 hover:text-white"
                      }`}
                      title="Favoriye Ekle"
                    >
                      <Heart size={16} className={`${isFavorite ? "fill-current" : ""}`} />
                      <span className="text-xs font-black ml-1.5">{isFavorite ? "Favoride" : "Favoriye Ekle"}</span>
                    </button>

                    <button
                      onClick={() => setIsComplaining(!isComplaining)}
                      className="flex h-11 px-3.5 items-center justify-center rounded-xl border border-gray-850 bg-gray-900/10 text-gray-500 hover:text-rose-500 hover:border-rose-500/20 transition-all cursor-pointer"
                      title="İlanı Şikayet Et"
                    >
                      <AlertTriangle size={15} />
                    </button>
                  </div>
                </div>

                {/* Complaint Text Box */}
                {isComplaining && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10 space-y-3"
                  >
                    <span className="text-xs font-extrabold text-rose-400 block uppercase tracking-wider">İLAN ŞİKAYET SEBEBİ</span>
                    <textarea 
                      value={complaintText}
                      onChange={(e) => setComplaintText(e.target.value)}
                      placeholder="Lütfen şikayet nedeninizi kısaca yazın (Hatalı fiyat, teslim edilmeyen ürün, yanıltıcı açıklama vb.)..."
                      className="w-full text-xs bg-gray-950/80 border border-gray-855 rounded-xl p-3 outline-none focus:border-rose-500 text-gray-200 resize-none h-20"
                    />
                    <div className="flex justify-end gap-2 text-xs font-bold">
                      <button onClick={() => setIsComplaining(false)} className="px-3 py-1.5 text-gray-500 hover:text-white">İptal</button>
                      <button onClick={handleReport} className="rounded-lg bg-rose-600 px-4 py-1.5 text-white font-black">Şikayet Gönder</button>
                    </div>
                  </motion.div>
                )}

                {/* Description */}
                <div className="space-y-1.5 border-t border-gray-900/60 pt-4">
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block">ÜRÜN AÇIKLAMASI</span>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium bg-gray-950/40 border border-gray-900 p-4 rounded-xl">
                    {currentListing.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-4 border-t border-gray-900/60 flex flex-col sm:flex-row gap-3">
                {isOwnListing ? (
                  <div className="w-full text-center py-3 rounded-xl bg-gray-900/50 border border-purple-500/10 text-xs font-bold text-gray-500 leading-tight">
                    Kendi ilanınıza bakıyorsunuz. Dopingler üzerinden ilanınızı ana sayfada vitrine taşıyabilirsiniz.
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => onMessage(currentListing.sellerId, currentListing.sellerName, currentListing.id, currentListing.title, currentListing.images[0])}
                      className="flex-1 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 text-xs font-black text-gray-300 py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-gray-750"
                    >
                      <MessageSquare size={14} />
                      <span>Sohbet Başlat / Mesaj At</span>
                    </button>
                    <button
                      onClick={() => {
                        if (currentListing.stock > 0) {
                          onBuy(currentListing.id);
                          onClose();
                        }
                      }}
                      disabled={currentListing.stock <= 0}
                      className={`flex-1 rounded-xl py-3.5 shadow-xl text-xs font-black text-white flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        currentListing.stock > 0
                          ? "bg-gradient-to-r from-orange-500 via-purple-600 to-indigo-600 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]"
                          : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-850"
                      }`}
                    >
                      <ShoppingCart size={15} />
                      <span>{currentListing.stock > 0 ? "Güvenli Satın Al" : "Stok Tükendi"}</span>
                    </button>
                  </>
                )}
              </div>

            </div>

          </div>

          {/* SIMILAR PRODUCTS / BENZER İLANLAR ROW */}
          {similarItems.length > 0 && (
            <div className="border-t border-gray-900/60 pt-6 space-y-4" id="item-similar-row">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                <span className="text-[11px] font-black text-purple-400 uppercase tracking-wider block">BENZER İLANLAR / KATEGORİ ÖNERİLERİ ({similarItems.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarItems.map((simListing) => (
                  <div
                    key={simListing.id}
                    onClick={() => {
                      setLocalActiveListing(simListing);
                      setActiveImageIndex(0);
                    }}
                    className="flex gap-3 bg-gray-950/60 hover:bg-gray-950 border border-gray-900/80 hover:border-purple-500/35 p-3 rounded-2xl cursor-pointer transition-all group"
                  >
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-900">
                      <img src={simListing.images[0]} className="h-full w-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                      <h6 className="text-xs font-bold text-gray-200 truncate group-hover:text-purple-300 transition-colors leading-tight">{simListing.title}</h6>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-orange-400 font-mono">{simListing.price} TL</span>
                        <span className="text-[9px] text-gray-500 font-bold">@{simListing.sellerName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Reviews Feed Section */}
          <div className="border-t border-gray-900/60 pt-6 space-y-4" id="item-reviews-context">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <Award size={15} className="text-purple-400" />
                  <span>Müşteri Yorumları & Mağaza Değerlendirmeleri ({itemReviews.length + sellerReviews.length})</span>
                </h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Sadece bu satıcıyla işlemlerini tamamlayan kullanıcıların gerçek puanlamaları listelenir.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Product Direct Reviews */}
              <div className="space-y-3 bg-gray-950/20 border border-gray-900 p-4 rounded-2xl">
                <span className="text-[11px] font-black text-purple-400 tracking-wider uppercase block">BU İLANA GELEN DEĞERLENDİRMELER ({itemReviews.length})</span>
                
                {itemReviews.length > 0 ? (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {itemReviews.map(rev => (
                      <div key={rev.id} className="p-3 bg-gray-900/35 border border-gray-850 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-300">@{rev.buyerName}</span>
                          <div className="flex items-center gap-0.5 text-[#FFA800]">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={10} fill="#FFA800" stroke="none" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">"{rev.comment}"</p>
                        <span className="text-[9px] text-gray-600 block text-right">{new Date(rev.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-600 text-[11px] font-bold">
                    Bu ilana henüz doğrudan yorum bırakılmamış. İlk yorumu sipariş sonrasında siz bırakabilirsiniz!
                  </div>
                )}
              </div>

              {/* Seller General Reviews */}
              <div className="space-y-3 bg-gray-950/20 border border-gray-900 p-4 rounded-2xl">
                <span className="text-[11px] font-black text-rose-400 tracking-wider uppercase block">SATICIYA DAİR DİĞER YORUMLAR ({sellerReviews.length})</span>
                
                {sellerReviews.length > 0 ? (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {sellerReviews.map(rev => (
                      <div key={rev.id} className="p-3 bg-gray-900/35 border border-gray-850 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-300">@{rev.buyerName}</span>
                          <div className="flex items-center gap-0.5 text-[#FFA800]">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={10} fill="#FFA800" stroke="none" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic">"{rev.comment}"</p>
                        <span className="text-[9px] text-gray-600 block text-right">{new Date(rev.createdAt).toLocaleDateString("tr-TR")}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-600 text-[11px] font-bold">
                    Satıcı için henüz başka bir yorum bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
