import React from "react";
import { useStore } from "../context/StoreContext";
import { ListingCard } from "./ListingCard";
import { Heart, Home, ArrowLeft } from "lucide-react";

interface FavoritesPageProps {
  onNavigate: (page: string) => void;
  onBuy: (id: string) => void;
  onMessage: (sellerId: string, sellerName: string, listingId: string, title: string, image?: string) => void;
  onViewDetails?: (id: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate, onBuy, onMessage, onViewDetails }) => {
  const { listings, favorites, toggleFavorite, currentUser } = useStore();

  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 font-sans" id="favorites-page-container">
      
      <div className="mb-8 flex items-center justify-between border-b border-gray-900 pb-5">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Heart className="text-rose-500 fill-rose-500 h-5 w-5 animate-pulse" />
            <span>Favori İlanlarım</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Takip ettiğiniz, her an satın alabileceğiniz favori ilanlarınız ve rütbe hizmetleri.</p>
        </div>
        
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-1.5 rounded-xl border border-gray-850 bg-gray-900/40 hover:bg-gray-900 px-3.5 py-2 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Alışverişe Dön</span>
        </button>
      </div>

      {favoriteListings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" id="favs-grid">
          {favoriteListings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onBuy={onBuy}
              onMessage={onMessage}
              onToggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(listing.id)}
              currentUser={currentUser}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-950/10 py-24 text-center text-gray-500" id="favorites-empty">
          <Heart size={44} className="mx-auto text-gray-800 mb-3" />
          <h4 className="text-sm font-bold text-gray-400">Favorileriniz Boş</h4>
          <p className="text-xs max-w-sm mx-auto text-gray-600 mt-1">Henüz hiçbir ilanı favorilerinize eklemediniz. Pazar yerini gezerken kalp ikonuna basarak ekleyebilirsiniz.</p>
        </div>
      )}

    </div>
  );
};
