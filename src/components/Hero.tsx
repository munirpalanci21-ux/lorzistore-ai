import React, { useState, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Users, 
  ArrowRight, 
  Coins, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Clock,
  ThumbsUp
} from "lucide-react";
import { CATEGORIES } from "../categories";
import { motion } from "motion/react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategory: (catId: string) => void;
  activeCategory: string;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  activeCategory
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "GÜVENLİ HAVUZ SİSTEMİ",
      subtitle: "Satsan da Alsan da %100 Güvendesin!",
      desc: "Ödemeleriniz Lorzi Store güvencesinde! Alıcı onay vermeden para satıcıya aktarılmaz, dolandırıcılığın önüne geçilir.",
      badge: "Sıfır Risk",
      bgGradient: "from-purple-950/40 via-purple-900/10 to-transparent",
      borderColor: "border-purple-500/20",
      accentColor: "text-purple-400"
    },
    {
      title: "SADECE %7 EN DÜŞÜK KOMİSYON",
      subtitle: "Kazancın Tamamı Cebinde Kalsın!",
      desc: "Diğer sitelerin aksine devasa komisyonlar kesmiyoruz. 15 TL üzeri başarılı başarılı pazar yeri işlemlerinde sabit %7 komisyon oranı oranı uygulanır.",
      badge: "En Karlı Seçenek",
      bgGradient: "from-emerald-950/40 via-emerald-900/10 to-transparent",
      borderColor: "border-emerald-500/20",
      accentColor: "text-emerald-400"
    },
    {
      title: "VİTRİN ÖNE ÇIKARMA (DOPİNG)",
      subtitle: "İlanlarını Çabucak Satışa Çevir!",
      desc: "İlan doping paketleri ile ilanınızı Vitrin Grubuna taşıyabilir, yukarı tazeleyebilir veya Öne Çıkanlar listesine ekleyerek binlerce alıcıya hemen ulaştırabilirsiniz.",
      badge: "Hızlı Satış",
      bgGradient: "from-amber-950/40 via-amber-900/10 to-transparent",
      borderColor: "border-amber-500/20",
      accentColor: "text-amber-400"
    },
    {
      title: "7/24 DİREKT CANLI SOHBET DESTEĞİ",
      subtitle: "Destek Her An Seninle!",
      desc: "Herhangi bir sorun mu var? Canlı destek sistemimiz ile müşteri temsilcilerimize ve canlı moderasyon ekibimize anında ulaşarak hızlıca destek alabilirsiniz.",
      badge: "Resmi Destek",
      bgGradient: "from-blue-950/40 via-blue-900/10 to-transparent",
      borderColor: "border-blue-500/20",
      accentColor: "text-blue-400"
    }
  ];

  // Auto-play the slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const stats = [
    { label: "Güvenilir Satıcılar", value: "320+", icon: ThumbsUp, color: "text-purple-400" },
    { label: "Aktif İlanlar", value: "4,680+", icon: Zap, color: "text-amber-400" },
    { label: "Toplam Satış Hacmi", value: "24,500+ TL", icon: Trophy, color: "text-emerald-400" },
    { label: "Kullanıcı Memnuniyeti", value: "%99.4", icon: ShieldCheck, color: "text-blue-400" }
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-[#070709] py-10 md:py-16 font-sans" id="hero-section">
      {/* Background radial glows mapping ItemSatis cosmic layout */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.12)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 h-72 w-72 rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-4">
        
        {/* UPPER ANNOUNCEMENT BAR & GLOBAL DECORATION */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10" id="hero-top-panels">
          
          {/* LEFT: SLIDER CAROUSEL (Anasayfa Kampanyaları & Güvence) */}
          <div className="w-full lg:w-2/3 shrink-0 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-gray-950 via-[#0A0A0E] to-gray-950 relative p-6 md:p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)] min-h-[300px]">
            {/* Ambient sliding background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[activeSlide].bgGradient} transition-all duration-700 pointer-events-none`} />
            
            {/* Top row */}
            <div className="relative flex items-center justify-between z-10">
              <span className={`rounded-xl border ${slides[activeSlide].borderColor} bg-white/5 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest ${slides[activeSlide].accentColor}`}>
                {slides[activeSlide].badge}
              </span>
              
              {/* Manual arrows */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-xl p-1 backdrop-blur-sm">
                <button 
                  onClick={handlePrevSlide} 
                  className="rounded-lg p-1 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  type="button"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-mono font-bold text-gray-500 tracking-wider">
                  {activeSlide + 1} / {slides.length}
                </span>
                <button 
                  onClick={handleNextSlide} 
                  className="rounded-lg p-1 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  type="button"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Middle Row (Content) */}
            <div className="relative z-10 my-6 space-y-2.5 max-w-xl">
              <span className="text-[10px] font-black text-gray-450 uppercase tracking-widest block">LORZİ STORE GÜVENCESİ</span>
              <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-none uppercase">
                {slides[activeSlide].title}
              </h2>
              <span className={`block text-xs md:text-sm font-black italic duration-300 ${slides[activeSlide].accentColor}`}>
                {slides[activeSlide].subtitle}
              </span>
              <p className="text-xs text-gray-400/90 leading-relaxed font-semibold">
                {slides[activeSlide].desc}
              </p>
            </div>

            {/* Bottom Row / Navigation Dots mapping ItemSatis slider indicator */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === i 
                        ? "w-6 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" 
                        : "w-2 bg-gray-700 hover:bg-gray-500"
                    }`}
                    type="button"
                  />
                ))}
              </div>
              <button 
                onClick={() => {
                  const feedEl = document.getElementById("marketplace-feed-container");
                  if (feedEl) feedEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-1 text-[10px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>İlanları İncele</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* RIGHT: SECURE ESCROW PATH DIAGRAM (Nasıl Güvenli Alım Yapılır Mini-Rehber) */}
          <div className="w-full lg:w-1/3 rounded-2xl p-5 border border-white/5 bg-[#0A0A0E] flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck size={14} />
                </span>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Güvenli İşlem Akışı</h4>
                  <span className="text-[9px] text-gray-500 font-bold block">10 Saniyede Güvenli Ticaret Metodu</span>
                </div>
              </div>

              {/* Steps timeline mini representation */}
              <div className="space-y-3.5 pr-2">
                <div className="flex gap-2.5">
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-purple-600 text-[10px] font-black text-white">1</span>
                  <div>
                    <span className="text-[11px] font-black text-gray-200 block leading-tight">Ödemeyi Yap & Bakiye Yükle</span>
                    <p className="text-[9px] text-gray-550 font-bold mt-0.5 leading-tight">Alıcı, site üzerinden bakiyesini kullanarak güvenli ödeme işlemini başlatır.</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-purple-600 text-[10px] font-black text-white">2</span>
                  <div>
                    <span className="text-[11px] font-black text-gray-200 block leading-tight">Lorzi Store Güvence Havuzu</span>
                    <p className="text-[9px] text-gray-550 font-bold mt-0.5 leading-tight">Para, Lorzi Store'un korunan havuz bakiyesine kilitlenerek askıya alınır.</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-black text-white">3</span>
                  <div>
                    <span className="text-[11px] font-black text-gray-200 block leading-tight">Satıcı Teslimatı Gerçekleştirir</span>
                    <p className="text-[9px] text-gray-550 font-bold mt-0.5 leading-tight">Satıcı, alıcıya chat sistemi üzerinden hesap bilgilerini veya skini ulaştırır.</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-emerald-600 text-[10px] font-black text-white">4</span>
                  <div>
                    <span className="text-[11px] font-black text-gray-200 block leading-tight">Alıcı Onaylar & Para Satıcıda</span>
                    <p className="text-[9px] text-gray-550 font-bold mt-0.5 leading-tight">Alıcı kontrol ettikten sonra onaylar; para komisyon kesilip satıcıya geçer.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-900 pt-3 flex items-center justify-between">
              <span className="text-[8px] text-emerald-405 font-extrabold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)] block">
                %100 DOLANDIRILMA KORUMASI
              </span>
              <span className="text-[10px] text-gray-500 font-extrabold flex items-center gap-0.5">
                Lorzi Store Güvencesiyle
              </span>
            </div>
          </div>

        </div>

        {/* INTERACTIVE HERO SEARCH & STATS HEADER */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-none">
            DİJİTAL PAZARIN <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent italic font-black">
              YENİ NESİL ZİRVESİ LORZİ STORE
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-bold max-w-2xl mx-auto">
            Valorant hesapları, CS2 skinleri, Lol boost rütbe yükseltme işleri ve her türlü sosyal medya ilanları Lorzi Store güvenceli havuzu eşliğinde anında teslimat farkıyla burada!
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto pt-2" id="hero-search-area">
            <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#0A0A0C]/80 p-1.5 shadow-[0_4px_30px_rgba(124,58,237,0.15)] focus-within:border-purple-500/40 focus-within:ring-2 focus-within:ring-purple-400/10 transition-all backdrop-blur-md">
              <span className="pl-4 text-gray-500">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Valorant hesap, CS2 skin, boost veya bakiye ara..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2.5 pl-3 pr-4 text-xs sm:text-sm text-white outline-none placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="rounded-lg mr-2 p-1 text-[10px] text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  Temizle
                </button>
              )}
              <button 
                onClick={() => {
                  const feedEl = document.getElementById("marketplace-feed-container");
                  if (feedEl) feedEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-black text-white hover:bg-purple-750 active:scale-95 transition-all mr-0.5 cursor-pointer shadow-[0_4px_12px_rgba(139,92,246,0.3)]"
              >
                Ara
              </button>
            </div>
          </div>
        </div>

        {/* DETAILED GAME CATEGORY CARDS SHOWCASE (ItemSatis style visual listing groups) */}
        <div className="mb-14" id="visual-categories-grid">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles size={14} className="animate-pulse" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Popüler Kategoriler & Oyunlar</h3>
              <p className="text-[10px] text-gray-500">Görsel destekli, rütbeli ve rütbesiz ilan dükkanları</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {CATEGORIES.filter(c => !c.isDisabled).map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const feedEl = document.getElementById("marketplace-feed-container");
                  if (feedEl) feedEl.scrollIntoView({ behavior: "smooth" });
                }}
                className={`group relative overflow-hidden rounded-2xl border aspect-video w-full transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.4)] ${
                  activeCategory === cat.id 
                    ? "border-purple-500 ring-2 ring-purple-500/30" 
                    : "border-white/5 hover:border-purple-500/40"
                }`}
              >
                {/* Background image overlay */}
                <div className="absolute inset-0 bg-gray-950">
                  <img
                    src={cat.bgImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=crop"}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover opacity-35 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-50"
                  />
                </div>

                {/* Shading gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Top Overlay Badge */}
                {cat.badgeText && (
                  <span className="absolute top-2.5 left-2.5 z-10 rounded bg-purple-600/90 hover:bg-purple-600 border border-purple-500/30 px-2 py-0.5 text-[7px] font-black text-white uppercase tracking-widest backdrop-blur-xs">
                    {cat.badgeText}
                  </span>
                )}

                {/* Content Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col justify-end z-10 text-left">
                  <span className="text-[9px] font-black text-purple-400 tracking-wider font-mono">
                    {cat.gameCode}
                  </span>
                  <h4 className="text-xs font-black text-white leading-tight uppercase group-hover:text-purple-300 transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[8px] font-bold text-gray-500 mt-0.5 group-hover:text-gray-400 transition-colors">
                    {cat.itemCount || "Aktif İlan Çarşısı"}
                  </span>
                </div>

                {/* Hover outline glowing indicator */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* LORZI STORE TRUST STATS ROW */}
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4" id="hero-stats-grid">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-gray-950/40 p-4 transition-all hover:border-purple-500/20 shadow-[0_4px_15px_rgba(0,0,0,0.15)] backdrop-blur-xs"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5`}>
                  <Icon size={16} className={stat.color} />
                </div>
                <div className="text-left font-sans">
                  <span className="block text-base font-black text-white leading-none tracking-tight font-mono">
                    {stat.value}
                  </span>
                  <span className="text-[8.5px] text-gray-550 font-black tracking-wide uppercase mt-0.5 block">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
