import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { CATEGORIES, Category } from "../categories";
import { ListingCard } from "./ListingCard";
import { 
  Flame, 
  ArrowUpDown, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  X,
  Zap,
  Tag
} from "lucide-react";
import * as LucideIcons from "lucide-react";

interface MarketplaceFeedProps {
  searchQuery: string;
  onBuy: (id: string) => void;
  onMessage: (sellerId: string, sellerName: string, listingId: string, title: string, image?: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
  onViewDetails?: (id: string) => void;
}

export const MarketplaceFeed: React.FC<MarketplaceFeedProps> = ({
  searchQuery,
  onBuy,
  onMessage,
  selectedCategory,
  setSelectedCategory,
  showToast,
  onViewDetails
}) => {
  const { listings, favorites, toggleFavorite, currentUser, applyDoping } = useStore();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest"); // newest, lowest-price, highest-price, featured
  
  // Doping Modal States
  const [dopingListingId, setDopingListingId] = useState<string | null>(null);
  const [selectedDopingType, setSelectedDopingType] = useState<"featured" | "carousel" | "bump">("featured");
  const [dopingOption, setDopingOption] = useState<number>(0); // index for featured (1, 3, 7 days)

  // Dynamically load lucide icons for sidebar
  const renderIcon = (iconName: string, size = 16, className = "") => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={size} className={className} />;
    }
    return <LucideIcons.Gamepad size={size} className={className} />;
  };

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);

  // Sorting and Filtering algorithm
  const filteredListings = listings.filter(l => {
    // 1. Category check
    if (selectedCategory) {
      const matchCat = activeCategoryObj?.name.toLowerCase() === l.category.toLowerCase();
      if (!matchCat) return false;
    }

    // 2. Subcategory check
    if (selectedSubcategory) {
      if (l.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) return false;
    }

    // 3. Search query check
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const inTitle = l.title.toLowerCase().includes(query);
      const inDesc = l.description.toLowerCase().includes(query);
      const inCat = l.category.toLowerCase().includes(query);
      const inSub = l.subcategory.toLowerCase().includes(query);
      return inTitle || inDesc || inCat || inSub;
    }

    return true;
  });

  // Apply sorting
  const sortedListings = [...filteredListings].sort((a, b) => {
    // Priority: Doping of bumpedAt (Yukarı Taşıtı)
    const timeA = a.bumpedAt ? new Date(a.bumpedAt).getTime() : 0;
    const timeB = b.bumpedAt ? new Date(b.bumpedAt).getTime() : 0;
    
    if (timeA !== timeB) {
      return timeB - timeA; // Most recently bumped first
    }

    if (sortBy === "lowest-price") return a.price - b.price;
    if (sortBy === "highest-price") return b.price - a.price;
    if (sortBy === "featured") {
      const valA = a.isFeatured ? 1 : 0;
      const valB = b.isFeatured ? 1 : 0;
      return valB - valA;
    }
    // newest as default
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Hot/Vitrin listings (Doping olanlar veya vitrin seçilenler)
  const carouselListings = listings.filter(l => l.isCarousel && l.status === "active");

  const dopingPrices = {
    bump: 9,
    carousel: 29,
    featured: [
      { days: 1, price: 19 },
      { days: 3, price: 39 },
      { days: 7, price: 69 }
    ]
  };

  const handleApplyDopingSubmit = () => {
    if (!dopingListingId) return;

    let price = 0;
    if (selectedDopingType === "featured") {
      price = dopingPrices.featured[dopingOption].price;
    } else if (selectedDopingType === "carousel") {
      price = dopingPrices.carousel;
    } else {
      price = dopingPrices.bump;
    }

    const res = applyDoping(dopingListingId, selectedDopingType, price);
    if (res.success) {
      showToast(res.message, "success");
      setDopingListingId(null);
    } else {
      showToast(res.message, "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 font-sans" id="marketplace-feed-container">
      
      {/* 1. VITRIN ILANLARI (Haftanın Fırsatları & Carousel) */}
      {carouselListings.length > 0 && !selectedCategory && !selectedSubcategory && (
        <div className="mb-14" id="carousel-area">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Sparkles size={16} />
              </span>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Vitrin İlanları / Haftanın Fırsatları</h3>
                <p className="text-xs text-gray-400">Lorzi Store güvencesi ile en çok dikkat çeken dijital ilanlar</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {carouselListings.slice(0, 3).map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onBuy={onBuy}
                onMessage={onMessage}
                onToggleFavorite={toggleFavorite}
                isFavorite={favorites.includes(listing.id)}
                currentUser={currentUser}
                onOpenDoping={(id) => setDopingListingId(id)}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. ANA PAZAR YERİ VE SIDEBAR */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4" id="main-listings-grid">
        
        {/* SIDEBAR: Kategoriler & Kapalı Epin Grupları */}
        <div className="space-y-6 lg:col-span-1" id="sidebar-container">
          
          {/* Aktif Pazar Yeri Kategorileri */}
          <div className="rounded-2xl glass p-5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] bg-black/20">
            <h4 className="mb-4 text-xs font-black tracking-widest text-purple-400 uppercase">AKTiF KATEGORİLER</h4>
            
            <div className="space-y-1.5 flex flex-col">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSubcategory("");
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === ""
                    ? "bg-purple-600/15 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]"
                    : "text-gray-400 hover:bg-gray-900/40 hover:text-gray-300 border border-transparent"
                }`}
              >
                <Flame size={14} />
                <span>Tüm Marketplace</span>
              </button>

              {CATEGORIES.filter(c => !c.isDisabled).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubcategory("");
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-purple-600/15 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]"
                      : "text-gray-400 hover:bg-gray-900/40 hover:text-gray-300 border border-transparent"
                  }`}
                >
                  {renderIcon(cat.iconName, 14, selectedCategory === cat.id ? "text-purple-400" : "text-gray-400")}
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Kapalı Epin / Top-up Kategorileri */}
          <div className="rounded-2xl glass p-5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] bg-black/20">
            <h4 className="mb-1 text-xs font-black tracking-widest text-rose-500 uppercase">EPIN / TOP-UP REYTİNGLERİ</h4>
            <span className="text-[10px] text-gray-500 block mb-4 font-bold">Anlaşma Yakında Başlayacak</span>
            
            <div className="space-y-1">
              {CATEGORIES.filter(c => c.isDisabled).map(cat => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs text-gray-500 bg-gray-900/20 border border-gray-900/50"
                  title="Bu kategoride satışlar yakında başlayacaktır."
                >
                  <div className="flex items-center gap-2">
                    {renderIcon(cat.iconName, 13, "text-gray-600")}
                    <span className="font-semibold text-gray-400">{cat.name}</span>
                  </div>
                  <span className="rounded-md bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 text-[8px] font-black text-rose-400">
                    YAKINDA
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FEED: İlan Listesi ve Filtreleme Başlıkları */}
        <div className="lg:col-span-3 space-y-6" id="listings-feed-pane">
          
          {/* Filtre ve Alt Kategori Başlığı */}
          <div className="rounded-2xl glass p-4 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.15)] bg-black/20 flex flex-col gap-4">
            
            {/* Header / Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{activeCategoryObj ? activeCategoryObj.name : "Tüm İlanlar"}</span>
                  <span className="text-xs font-bold text-gray-500 bg-gray-900 px-2.5 py-1 rounded-lg">
                    {sortedListings.length} İlan Listeleniyor
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-semibold">Tüm ilanlar güvenli transfer kodu eşliği ile satılmaktadır.</p>
              </div>

              {/* Sorting Switch */}
              <div className="flex items-center gap-2" id="sorting-dropdown">
                <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                  <ArrowUpDown size={12} />
                  Sırala:
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 px-3 py-2 outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="newest">En Yeni İlanlar</option>
                  <option value="lowest-price">Fiyata Göre Artan</option>
                  <option value="highest-price">Fiyata Göre Azalan</option>
                  <option value="featured">Dopingli/Öne Çıkanlar</option>
                </select>
              </div>
            </div>

            {/* Subcategories (if a category is active) */}
            {activeCategoryObj && (
              <div className="border-t border-gray-900 pt-4" id="subcategories-bar">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2.5">ALT KATEGORİ SEÇİN (ZORUNLU)</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedSubcategory("");
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-bold border transition-all cursor-pointer ${
                      selectedSubcategory === ""
                        ? "bg-purple-600/15 text-purple-400 border-purple-500/30"
                        : "bg-gray-900/60 text-gray-400 border-gray-900 hover:text-gray-200"
                    }`}
                  >
                    Tümü
                  </button>
                  {activeCategoryObj.subcategories.map(subcat => (
                    <button
                      key={subcat}
                      onClick={() => {
                        setSelectedSubcategory(subcat);
                      }}
                      className={`rounded-xl px-3 py-2 text-xs font-bold border transition-all cursor-pointer ${
                        selectedSubcategory === subcat
                          ? "bg-purple-600/15 text-purple-400 border-purple-500/30"
                          : "bg-gray-900/60 text-gray-400 border-gray-900 hover:text-gray-200"
                      }`}
                    >
                      {subcat}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* List of Results */}
          {sortedListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3" id="listings-results-grid">
              {sortedListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onBuy={onBuy}
                  onMessage={onMessage}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(listing.id)}
                  currentUser={currentUser}
                  onOpenDoping={(id) => setDopingListingId(id)}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-950/20 py-20 text-center text-gray-500" id="empty-feed">
              <Clock size={40} className="mx-auto text-gray-700 mb-3" />
              <h4 className="text-base font-bold text-gray-400 mb-1">Aradığınız İlan Bulunamadı</h4>
              <p className="text-xs max-w-sm mx-auto text-gray-600">Bu filtreye uygun aktif ilan bulunmuyor. Farklı bir arama yapmayı deneyebilirsiniz.</p>
            </div>
          )}

        </div>

      </div>

      {/* DOPING UPGRADE PURCHASE DIALOG */}
      {dopingListingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border border-purple-500/20 bg-gray-950 p-6 shadow-[0_0_50px_rgba(168,85,247,0.2)]">
            
            <button
              onClick={() => setDopingListingId(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-purple-400" size={20} />
              <h3 className="text-lg font-black text-white">İlan Doping / Öne Çıkarma</h3>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              İlanlarınızı öne çıkararak satış hızınızı 5 katına kadar artırabilirsiniz. Lütfen satın almak istediğiniz doping türünü seçin:
            </p>

            <div className="space-y-4">
              
              {/* Type selector option 1: Featured (Öne Çıkarılan) */}
              <div 
                onClick={() => setSelectedDopingType("featured")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedDopingType === "featured"
                    ? "border-purple-500 bg-purple-500/5 text-white"
                    : "border-gray-900 bg-gray-900/10 text-gray-400 hover:border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                    <Zap size={15} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block text-xs font-black">Öne Çıkan İlan Dopingi</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">İlan listenin en başında 'Öne Çıkan' rozetiyle yer alır.</span>
                  </div>
                </div>

                {selectedDopingType === "featured" && (
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-purple-500/10 pt-3">
                    {dopingPrices.featured.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDopingOption(idx);
                        }}
                        className={`rounded-lg py-2.5 text-xs font-bold border transition-all ${
                          dopingOption === idx
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-gray-900/60 border-purple-500/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        <span className="block font-black">{opt.days} Gün</span>
                        <span className="block text-[10px] mt-0.5 opacity-80">{opt.price} TL</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type selector option 2: Carousel (Vitrin) */}
              <div 
                onClick={() => setSelectedDopingType("carousel")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedDopingType === "carousel"
                    ? "border-blue-500 bg-blue-500/5 text-white"
                    : "border-gray-900 bg-gray-900/10 text-gray-400 hover:border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                    <Sparkles size={15} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block text-xs font-black">Vitrin İlanı / Haftanın Fırsatı</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">Anasayfanın en tepesinde devasa vitrin bölümünde barındırılır.</span>
                  </div>
                  <span className="text-xs font-black text-blue-400">{dopingPrices.carousel} TL / 3 Gün</span>
                </div>
              </div>

              {/* Type selector option 3: Bump (Yukarı Taşı) */}
              <div 
                onClick={() => setSelectedDopingType("bump")}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedDopingType === "bump"
                    ? "border-emerald-500 bg-emerald-500/5 text-white"
                    : "border-gray-900 bg-gray-900/10 text-gray-400 hover:border-gray-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <TrendingUp size={15} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block text-xs font-black">Yukarı Taşı (Instant Bump)</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">İlan oluşturulma tarihini şimdiye günceller ve en tepeye fırlatır.</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">{dopingPrices.bump} TL / 1 Kez</span>
                </div>
              </div>

            </div>

            <div className="mt-6 flex gap-3 border-t border-gray-900 pt-4" id="doping-modal-actions">
              <button
                onClick={() => setDopingListingId(null)}
                className="flex-1 rounded-xl border border-gray-850 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-900 transition-all cursor-pointer"
              >
                İptal Et
              </button>
              <button
                onClick={handleApplyDopingSubmit}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:scale-[1.01] transition-all cursor-pointer"
              >
                Ödeme Yap ve Uygula
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};
