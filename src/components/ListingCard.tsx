import React from "react";
import { Listing } from "../types";
import { MessageSquare, ShoppingCart, ShieldCheck, Zap, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface ListingCardProps {
  listing: Listing;
  onBuy: (id: string) => void;
  onMessage: (sellerId: string, sellerName: string, listingId: string, title: string, image?: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  currentUser: any;
  onOpenDoping?: (id: string) => void; // for seller to upgrade their own listing
  onViewDetails?: (id: string) => void; // call detailed view
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onBuy,
  onMessage,
  onToggleFavorite,
  isFavorite,
  currentUser,
  onOpenDoping,
  onViewDetails
}) => {
  const isOwnListing = currentUser?.id === listing.sellerId;

  // Render quick seller avatar or online glow with fallback indicator
  const avatarSeed = encodeURIComponent(listing.sellerName);
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onViewDetails && onViewDetails(listing.id)}
      className={`relative flex flex-col overflow-hidden rounded-2xl p-4 transition-all duration-300 font-sans group cursor-pointer border ${
        listing.isFeatured 
          ? "border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.25)] bg-gradient-to-b from-purple-950/20 via-[#06080c] to-[#0A0A0C]" 
          : "border-gray-900/80 bg-gray-950/40 hover:border-purple-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      }`}
      id={`listing-card-${listing.id}`}
    >
      {/* Dynamic Ambient Backlight Glow on Hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-600/10 to-indigo-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />

      {/* Badges container */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5" id={`badges-${listing.id}`}>
        {listing.isFeatured && (
          <span className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-2.5 py-1 text-[9px] font-black text-white shadow-[0_0_12px_rgba(168,85,247,0.4)] tracking-wide">
            <Zap size={10} className="animate-pulse" />
            Öne Çıkan
          </span>
        )}
        {listing.isCarousel && (
          <span className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-1 text-[9px] font-black text-white shadow-[0_0_12px_rgba(37,99,235,0.4)] tracking-wide">
            <Sparkles size={10} />
            Vitrin
          </span>
        )}
        {listing.disabledCategory && (
          <span className="flex items-center gap-1 rounded-lg bg-rose-600/80 px-2.5 py-1 text-[9px] font-black text-white shadow-[0_0_10px_rgba(244,63,94,0.3)] tracking-wide">
            Yakında
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(listing.id);
        }}
        className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-xl bg-gray-950/70 border border-gray-800/80 text-gray-400 backdrop-blur-md transition-all hover:bg-gray-950 hover:text-rose-500 hover:border-rose-500/30 cursor-pointer"
        id={`fav-btn-${listing.id}`}
        title={isFavorite ? "Favorilerden Çıkar" : "Favoriye Ekle"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4.5 w-4.5 transition-transform duration-300 ${isFavorite ? "text-rose-500 scale-110" : ""}`}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800/50">
        <img
          src={listing.images[0] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80"></div>
        
        {/* Category Badge overlay on bottom */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="rounded-md bg-gray-950/80 border border-gray-800/85 px-2 py-0.5 text-[9px] font-black text-gray-300 backdrop-blur-sm">
            {listing.category}
          </span>
          <span className="rounded-md bg-purple-950/85 border border-purple-500/25 px-2 py-0.5 text-[9px] font-black text-purple-400 backdrop-blur-sm">
            {listing.subcategory}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Seller details with interactive elements & online look */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <img 
                  src={avatarUrl} 
                  alt={listing.sellerName}
                  className="h-4 w-4 rounded-full bg-purple-900/40 ring-1 ring-purple-500/20"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-gray-950"></span>
              </div>
              <span className="text-[10px] font-black text-gray-400 group-hover:text-purple-400 transition-colors">
                @{listing.sellerName}
              </span>
              {listing.sellerVerified && (
                <div 
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-purple-500 text-white shrink-0" 
                  title="Güvenilir Satıcı"
                >
                  <ShieldCheck size={9} />
                </div>
              )}
            </div>
            <span className="text-[9px] text-gray-500 font-black uppercase">
              {listing.deliveryTime}
            </span>
          </div>

          <h4 className="text-xs md:text-sm font-black text-gray-100 line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors h-10 pt-1">
            {listing.title}
          </h4>
          
          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-900 flex flex-col gap-3">
          {/* Price display with premium styling and glow */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[8px] text-gray-500 font-extrabold uppercase tracking-widest block">GÜVENLİ SATIŞ</span>
              <span className="text-base font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block font-mono">
                {listing.price.toLocaleString()} TL
              </span>
            </div>
            
            {/* Stock tracker */}
            <div className="text-right">
              <span className="text-[8px] text-gray-500 font-extrabold uppercase tracking-widest block">STOK DURUMU</span>
              <span className={`text-[10px] font-black ${listing.stock > 3 ? "text-gray-400" : "text-amber-500 font-bold"}`}>
                {listing.stock > 0 ? `${listing.stock} Adet` : "Tükendi"}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2" id={`actions-row-${listing.id}`}>
            {listing.disabledCategory ? (
              <div className="col-span-2 rounded-xl bg-gray-900 border border-gray-800 text-center py-2 text-xs font-black text-gray-500">
                Yakında Satışa Açılacak
              </div>
            ) : isOwnListing ? (
              <button
                onClick={() => onOpenDoping && onOpenDoping(listing.id)}
                className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10 py-2.5 text-xs font-black text-purple-400 transition-all cursor-pointer"
                id={`doping-btn-${listing.id}`}
              >
                <TrendingUp size={13} />
                <span>Uygula/Doping Satın Al</span>
              </button>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMessage(listing.sellerId, listing.sellerName, listing.id, listing.title, listing.images[0]);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900 text-xs font-bold text-gray-300 hover:text-white py-2.5 transition-all cursor-pointer active:scale-95"
                  id={`msg-act-${listing.id}`}
                >
                  <MessageSquare size={13} />
                  <span>Sohbet</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (listing.stock > 0) onBuy(listing.id);
                  }}
                  disabled={listing.stock <= 0}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-black text-white shadow-[0_4px_12px_rgba(16,185,129,0.15)] transition-all cursor-pointer active:scale-95 ${
                    listing.stock > 0
                      ? "bg-gradient-to-r from-orange-500 to-purple-600 hover:shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:scale-[1.02]"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-800"
                  }`}
                  id={`buy-act-${listing.id}`}
                >
                  <ShoppingCart size={13} />
                  <span>Satın Al</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
