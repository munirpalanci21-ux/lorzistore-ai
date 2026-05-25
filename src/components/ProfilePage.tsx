import React, { useState, useRef } from "react";
import { useStore } from "../context/StoreContext";
import { 
  User, 
  ShieldCheck, 
  Wallet, 
  Upload, 
  Check, 
  X, 
  Camera, 
  Calendar, 
  Lock, 
  Clock, 
  ArrowRight,
  Sparkles,
  Inbox,
  AlertTriangle,
  Grid
} from "lucide-react";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, showToast }) => {
  const { 
    currentUser, 
    listings, 
    payments, 
    withdraws, 
    submitWithdrawRequest, 
    submitKycRequest,
    reviews
  } = useStore();

  const [activeTab, setActiveTab] = useState<"listings" | "kyc" | "withdraw" | "history" | "reviews">("listings");

  // KYC States
  const [kycIdCard, setKycIdCard] = useState<string | null>(null);
  const [kycSelfie, setKycSelfie] = useState<string | null>(null);
  const [kycDatedSelfie, setKycDatedSelfie] = useState<string | null>(null);

  // Withdraw States
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawIban, setWithdrawIban] = useState("");

  const idCardRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const datedSelfieRef = useRef<HTMLInputElement>(null);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center font-sans">
        <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <Lock className="mx-auto text-purple-500 mb-4 animate-bounce" size={40} />
          <h3 className="text-lg font-black text-white">Giriş Yapmalısınız</h3>
          <p className="text-xs text-gray-400 mt-2">Profilinizi ve cüzdan geçmişinizi görüntüleyebilmek için lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  // Get active user listings
  const userListings = listings.filter(l => l.sellerId === currentUser.id);

  // Seller Evaluation Calculations: total sales, score, satisfaction ratio, review list
  const sellerReviews = reviews.filter(r => r.sellerId === currentUser.id);
  const totalSellerSales = sellerReviews.length; 
  const averageSellerRating = sellerReviews.length > 0 
    ? parseFloat((sellerReviews.reduce((acc, current) => acc + current.rating, 0) / sellerReviews.length).toFixed(1))
    : 5.0;
  const positiveSellerReviewsCount = sellerReviews.filter(r => r.rating >= 4).length;
  const positiveSellerRatio = sellerReviews.length > 0
    ? Math.round((positiveSellerReviewsCount / sellerReviews.length) * 100)
    : 100;

  // Calculate live withdraw fees
  // Hafta içi -> 10 TL, Hafta sonu -> 15 TL işlem ücreti
  const now = new Date();
  const dayIndex = now.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = dayIndex === 0 || dayIndex === 6;
  const withdrawFee = isWeekend ? 15 : 10;
  const netWithdrawAmount = Math.max(0, withdrawAmount - withdrawFee);

  const formatDayName = (idx: number) => {
    const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    return days[idx];
  };

  // Read files as base64 utility
  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        showToast("Lütfen geçerli bir resim formatı (PNG, JPG, WEBP) seçin.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycIdCard || !kycSelfie || !kycDatedSelfie) {
      showToast("Lütfen kimlik doğrulama için 3 zorunlu fotoğrafı da ekleyin.", "error");
      return;
    }

    submitKycRequest(kycIdCard, kycSelfie, kycDatedSelfie);
    showToast("Kimlik doğrulama talebiniz alındı! Yönetici tarafından kısa sürede incelendikten sonra Güvenilir Satıcı rozetiniz verilecektir.", "success");
    setActiveTab("listings");
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || !withdrawIban.trim()) {
      showToast("Lütfen tüm alanları doldurun.", "error");
      return;
    }

    // IBAN check
    if (!withdrawIban.toUpperCase().startsWith("TR") || withdrawIban.replace(/\s+/g, "").length < 26) {
      showToast("Lütfen geçerli bir TR ile başlayan IBAN girin.", "error");
      return;
    }

    const res = submitWithdrawRequest(withdrawAmount, withdrawIban);
    if (res.success) {
      showToast(res.message, "success");
      setWithdrawAmount(0);
      setWithdrawIban("");
      setActiveTab("history");
    } else {
      showToast(res.message, "error");
    }
  };

  // Get user payments & withdraw histories
  const userPayments = payments.filter(p => p.userId === currentUser.id);
  const userWithdraws = withdraws.filter(w => w.userId === currentUser.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 font-sans" id="profile-page-wrapper">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SOL PANEL: Avatar, Rozet, Bakiye kartı */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative overflow-hidden text-center">
            
            {currentUser.isVerified && (
              <div className="absolute top-4 right-4 text-purple-400" title="Güvenilir Satıcı">
                <ShieldCheck size={20} className="animate-pulse" />
              </div>
            )}

            <img 
              src={currentUser.avatar} 
              alt={currentUser.username} 
              referrerPolicy="no-referrer"
              className="h-20 w-20 rounded-2xl mx-auto object-cover border-2 border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.15)] mb-4"
            />

            <h3 className="text-base font-black text-white flex items-center justify-center gap-1.5">
              <span>{currentUser.username}</span>
              {currentUser.isVerified && (
                <span className="rounded bg-purple-500/10 border border-purple-500/20 px-1 py-0.2 text-[8px] font-black text-purple-400">GÜVENİLİR</span>
              )}
            </h3>
            
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              {currentUser.role === "admin" ? "SİTE YÖNETİCİSİ" : "LORZISTORE ÜYESİ"}
            </p>

            <div className="mt-6 border-t border-gray-900 pt-5 space-y-4 text-left">
              <div>
                <span className="block text-[9px] text-gray-500 font-extrabold uppercase tracking-wider">Kayıt Tarihi</span>
                <span className="text-xs text-gray-300 font-semibold">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-[9px] text-gray-500 font-extrabold uppercase tracking-wider">KYC Kimlik Durumu</span>
                <span className={`text-xs font-bold ${
                  currentUser.kycStatus === "approved"
                    ? "text-emerald-400"
                    : currentUser.kycStatus === "pending"
                    ? "text-amber-500"
                    : currentUser.kycStatus === "rejected"
                    ? "text-rose-500"
                    : "text-gray-500"
                }`}>
                  {currentUser.kycStatus === "approved" && "Hesap Doğrulandı"}
                  {currentUser.kycStatus === "pending" && "Kontrol Ediliyor"}
                  {currentUser.kycStatus === "rejected" && "Reddedildi"}
                  {currentUser.kycStatus === "none" && "Doğrulanmamış Hesap"}
                </span>
              </div>
            </div>

          </div>

          {/* CÜZDAN DETAY PANELİ */}
          <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] space-y-4">
            <span className="block text-xs font-black text-white uppercase tracking-wider border-b border-gray-900 pb-2">Cüzdan Hesapları</span>
            
            {/* Yüklenen Bakiye */}
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-gray-500 font-bold block">YÜKLENEN BAKİYE</span>
                <span className="text-sm font-black text-emerald-400">{currentUser.balance.toLocaleString()} TL</span>
              </div>
              <button
                onClick={() => onNavigate("deposit")}
                className="rounded-lg bg-gray-900 border border-gray-850 hover:bg-gray-800 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Yükle"
              >
                <PlusIcon size={14} />
              </button>
            </div>

            {/* Satış Bakiyesi */}
            <div className="flex justify-between items-center text-xs pt-3 border-t border-gray-900/40">
              <div>
                <span className="text-[10px] text-gray-500 font-bold block">ÇEKİLEBİLİR KAZANÇ</span>
                <span className="text-sm font-black text-purple-400">{currentUser.salesBalance.toLocaleString()} TL</span>
              </div>
              {currentUser.salesBalance > 0 && (
                <button
                  onClick={() => setActiveTab("withdraw")}
                  className="rounded-lg bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 px-2.5 py-1.5 text-[10px] font-black text-purple-400 transition-colors cursor-pointer"
                >
                  Çek
                </button>
              )}
            </div>

            <p className="text-[9px] text-gray-500 font-bold leading-relaxed pt-2">
              ⚠️ Yüklenen bakiye komisyon kuralları gereğince çekilemez. Sadece dükkanınızdan yaptığınız satış kazançları çekilebilir.
            </p>
          </div>
        </div>

        {/* SAĞ PANEL: Dinamik Sekmeli alanlar */}
        <div className="lg:col-span-3 space-y-6" id="profile-tabs-pane">
          
          {/* Navigation Tab Header */}
          <div className="flex border-b border-gray-900 overflow-x-auto" id="profile-tabs">
            <button
              onClick={() => setActiveTab("listings")}
              className={`pb-3.5 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "listings"
                  ? "border-purple-500 text-purple-400 font-black"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              İlanlarım ({userListings.length})
            </button>
            <button
              onClick={() => setActiveTab("kyc")}
              className={`pb-3.5 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "kyc"
                  ? "border-purple-500 text-purple-400 font-black"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              Kimlik Doğrulama (KYC)
            </button>
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`pb-3.5 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "withdraw"
                  ? "border-purple-500 text-purple-400 font-black"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              Para Çekme (Havale)
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3.5 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "history"
                  ? "border-purple-500 text-purple-400 font-black"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              Para Geçmişi
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3.5 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "reviews"
                  ? "border-purple-500 text-purple-400 font-black"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              Mağaza Yorumları ({sellerReviews.length})
            </button>
          </div>

          {/* TAB CONTENT 1: Aktif İlanlarım listesi */}
          {activeTab === "listings" && (
            <div className="space-y-4" id="plist-listings">
              {userListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userListings.map(listing => (
                    <div 
                      key={listing.id}
                      className="rounded-2xl border border-gray-900 bg-gray-950/20 p-4 flex gap-3 relative overflow-hidden"
                    >
                      <img src={listing.images[0]} referrerPolicy="no-referrer" className="h-16 w-16 object-cover rounded-xl" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] text-purple-400 font-bold block">{listing.category} / {listing.subcategory}</span>
                        <h4 className="text-xs font-bold text-gray-200 truncate mt-0.5">{listing.title}</h4>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-sm font-black text-emerald-400">{listing.price} TL</span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase">{listing.stock} Stok</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-900 py-20 text-center text-gray-500">
                  <Grid size={36} className="mx-auto text-gray-850 mb-2" />
                  <span className="text-xs font-bold block">Henüz eklediğiniz bir ilan bulunmuyor.</span>
                  <button 
                    onClick={() => onNavigate("add-listing")}
                    className="mt-4 rounded-xl bg-purple-600/10 border border-purple-500/20 px-4 py-2 text-xs font-black text-purple-400 hover:bg-purple-600/20 transition-all cursor-pointer"
                  >
                    Hemen İlan Ekle
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT 2: KYC Kimlik Doğrulama */}
          {activeTab === "kyc" && (
            <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.15)] space-y-6">
              <div className="border-b border-gray-900 pb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
                  <ShieldCheck size={16} className="text-purple-400" />
                  <span>Güvenilir Satıcı Kimlik Doğrulama</span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 font-semibold">Tüm satış kollarında daha fazla kitleye hitap etmek ve para çekebilmek için kimliğinizi doğrulayın.</p>
              </div>

              {currentUser.kycStatus === "approved" ? (
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-5 text-center text-emerald-400 space-y-1">
                  <Check size={32} className="mx-auto" />
                  <span className="block text-sm font-black">Tebrikler, Kimliğiniz Doğrulandı!</span>
                  <p className="text-xs text-gray-400/80 leading-relaxed max-w-sm mx-auto">Hesabınız Güvenilir Satıcı statüsündedir. İlanlarınızda özel doğrulama rozeti görüntülenir.</p>
                </div>
              ) : currentUser.kycStatus === "pending" ? (
                <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-5 text-center text-amber-500 space-y-1">
                  <Clock size={32} className="mx-auto animate-pulse" />
                  <span className="block text-sm font-bold">Başvurunuz İnceleniyor</span>
                  <p className="text-xs text-gray-400/80 leading-relaxed max-w-sm mx-auto">Kimlik fotoğraflarınız Lorzi Store moderasyon ekibi tarafından kontrolden geçmektedir. En kısa sürede doğrulanacaktır.</p>
                </div>
              ) : (
                <form onSubmit={handleKycSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="kyc-uploaders-row">
                    
                    {/* 1. Kimlik Ön Yüzü */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-black text-gray-400 uppercase">1. KİMLİK ÖN YÜZÜ *</span>
                      <div 
                        onClick={() => idCardRef.current?.click()}
                        className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-805 bg-gray-900/30 hover:border-purple-500/30 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all overflow-hidden"
                      >
                        {kycIdCard ? (
                          <img src={kycIdCard} alt="Kimlik Ön" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Camera size={20} className="text-gray-600 mb-1.5" />
                            <span className="text-[10px] font-bold text-gray-500">Kimlik Ön Yüz Fotoğrafı</span>
                          </>
                        )}
                        <input type="file" ref={idCardRef} onChange={(e) => handleKycFileChange(e, setKycIdCard)} className="hidden" />
                      </div>
                    </div>

                    {/* 2. Selfie Fotoğrafı */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-black text-gray-400 uppercase">2. SELFIE FOTOĞRAFI *</span>
                      <div 
                        onClick={() => selfieRef.current?.click()}
                        className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-805 bg-gray-900/30 hover:border-purple-500/30 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all overflow-hidden"
                      >
                        {kycSelfie ? (
                          <img src={kycSelfie} alt="Selfie" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Camera size={20} className="text-gray-600 mb-1.5" />
                            <span className="text-[10px] font-bold text-gray-500">Selfie (Kendi Yüzünüz)</span>
                          </>
                        )}
                        <input type="file" ref={selfieRef} onChange={(e) => handleKycFileChange(e, setKycSelfie)} className="hidden" />
                      </div>
                    </div>

                    {/* 3. Tarih Yazılı Selfie */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-black text-gray-400 uppercase">3. TARİH YAZILI SELFIE *</span>
                      <div 
                        onClick={() => datedSelfieRef.current?.click()}
                        className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-805 bg-gray-900/30 hover:border-purple-500/30 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all overflow-hidden"
                      >
                        {kycDatedSelfie ? (
                          <img src={kycDatedSelfie} alt="Tarihli Selfie" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Camera size={20} className="text-gray-600 mb-1.5" />
                            <span className="text-[10px] font-bold text-gray-500">Kağıtta Günün Tarihi ve Selfie</span>
                          </>
                        )}
                        <input type="file" ref={datedSelfieRef} onChange={(e) => handleKycFileChange(e, setKycDatedSelfie)} className="hidden" />
                      </div>
                    </div>

                  </div>

                  <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-4 text-[10px] text-purple-400/80 leading-relaxed font-semibold">
                    💡 İstenilen fotoğraf formlarının net ve okunabilir olması gerekmektedir. Yüklenen fotoğraflar hiçbir durumda dış sunuculara aktarılmaz, local'inizde şifrelenir.
                  </div>

                  {currentUser.kycStatus === "rejected" && (
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-400 flex items-center gap-2">
                      <AlertTriangle size={15} />
                      <span>Önceki doğrulama talebiniz reddedilmiştir. Lütfen belgelerinizi güncelleyerek tekrar gönderiniz.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-black text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
                  >
                    Doğrulama Belgelerini Gönder
                  </button>

                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT 3: Para Çekme */}
          {activeTab === "withdraw" && (
            <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-6 shadow-[0_4px_15px_rgba(0,0,0,0.15)] space-y-6">
              
              <div className="border-b border-gray-900 pb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
                  <Wallet size={16} className="text-purple-400" />
                  <span>Cüzdan Para Çekme (IBAN Havale/EFT)</span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 font-semibold">Dükkanınızdan kazandığınız aktif satış bakiyelerini dilediğiniz kendi adınıza kayıtlı IBAN hesabına her an çekin.</p>
              </div>

              {!currentUser.isVerified ? (
                <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-5 text-center text-rose-400 space-y-3">
                  <AlertTriangle className="mx-auto" size={32} />
                  <span className="block text-sm font-black">Kimlik Doğrulama Gerekli</span>
                  <p className="text-xs text-gray-400/85 leading-relaxed max-w-sm mx-auto">Sadece kimliği doğrulanmış (Güvenilir Satıcı) üyelerimiz para çekebilmektedir. Lütfen öncelikle 'Kimlik Doğrulama (KYC)' sekmesinden başvurunuzu yapın.</p>
                  <button
                    onClick={() => setActiveTab("kyc")}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    KYC Doğrulama Yap
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-5">
                  
                  {/* Calendar day status logs info */}
                  <div className="rounded-xl border border-purple-500/15 bg-purple-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="block text-purple-400 font-black">Bugün: {formatDayName(dayIndex)} (Hafta {isWeekend ? "Sonu" : "İçi"})</span>
                      <p className="text-[10px] text-gray-500 font-bold">Hafta içi: 10 TL • Hafta sonu: 15 TL çekim ücreti uygulanır.</p>
                    </div>
                    
                    <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-black text-purple-400 border border-purple-500/20 shrink-0">
                      Çekilebilir Bakiye: {currentUser.salesBalance} TL
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Çekimek İstenen Tutar (TL) *</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-xs font-black">₺</span>
                        <input
                          type="number"
                          min={20}
                          max={currentUser.salesBalance}
                          required
                          value={withdrawAmount || ""}
                          onChange={(e) => setWithdrawAmount(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-3 pl-7 pr-4 text-xs md:text-sm text-white outline-none font-semibold transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Aktarılacak IBAN Numarası *</label>
                      <input
                        type="text"
                        placeholder="TR........................"
                        required
                        value={withdrawIban}
                        onChange={(e) => setWithdrawIban(e.target.value)}
                        className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-3 px-4 text-xs md:text-sm text-white outline-none font-semibold transition-all"
                      />
                    </div>

                  </div>

                  {/* Calculations Live breakdown */}
                  {withdrawAmount > 0 && (
                    <div className="rounded-xl border border-gray-900 bg-gray-950 px-4 py-3.5 space-y-2 text-xs font-semibold">
                      <div className="flex justify-between text-gray-400">
                        <span>Çekilen Tutar:</span>
                        <span>{withdrawAmount.toLocaleString()} TL</span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>İşlem Masrafı:</span>
                        <span>-{withdrawFee} TL</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 border-t border-gray-900 pt-2 font-black">
                        <span>Net Alacağınız Tutar:</span>
                        <span>{netWithdrawAmount.toLocaleString()} TL</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-xs font-black text-white shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] transition-all cursor-pointer"
                  >
                    Para Çekme Talebini Gönder
                  </button>

                </form>
              )}
            </div>
          )}

          {/* TAB CONTENT 4: Para Yükleme ve Çekme Geçmişi */}
          {activeTab === "history" && (
            <div className="space-y-6">
              
              {/* Para Yükleme Geçmişi */}
              <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 md:p-6 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                <span className="block text-xs font-black text-white uppercase tracking-wider mb-4">HAREKETLER / PARA YÜKLEMELERİM</span>
                
                {userPayments.length > 0 ? (
                  <div className="space-y-2" id="user-payments-list">
                    {userPayments.map(p => (
                      <div key={p.id} className="flex justify-between items-center bg-gray-900/40 border border-gray-900 rounded-xl p-3.5 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
                          <div>
                            <span className="font-bold text-gray-200">Bakiye Bildirimi: +{p.amount} TL</span>
                            <span className="block text-[10px] text-gray-500 mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black border uppercase ${
                          p.status === "approved"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : p.status === "rejected"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-450"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                          {p.status === "approved" && "ONAYLANDI"}
                          {p.status === "rejected" && "REDDEDİLDİ"}
                          {p.status === "pending" && "BEKLİYOR"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="block text-[11px] text-gray-600">Henüz para yükleme kaydınız bulunmuyor.</span>
                )}
              </div>

              {/* Para Çekme Geçmişi */}
              <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 md:p-6 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                <span className="block text-xs font-black text-white uppercase tracking-wider mb-4">HAREKETLER / PARA ÇEKMELERİM</span>
                
                {userWithdraws.length > 0 ? (
                  <div className="space-y-2" id="user-withdraws-list">
                    {userWithdraws.map(w => (
                      <div key={w.id} className="flex justify-between items-center bg-gray-900/40 border border-gray-900 rounded-xl p-3.5 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-purple-400"></div>
                          <div>
                            <span className="font-bold text-gray-200">IBAN Transferi: -{w.amount} TL</span>
                            <span className="block text-[10px] text-gray-500 mt-0.5">{new Date(w.createdAt).toLocaleDateString()} (Net Alınan: {w.netAmount} TL)</span>
                          </div>
                        </div>

                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black border uppercase ${
                          w.status === "approved"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : w.status === "rejected"
                            ? "bg-rose-500/10 border-rose-500/20 text-rose-450"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                          {w.status === "approved" && "ÖDENDİ"}
                          {w.status === "rejected" && "REDDEDİLDİ / İADE"}
                          {w.status === "pending" && "BEKLİYOR"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="block text-[11px] text-gray-600">Henüz para çekme kaydınız bulunmuyor.</span>
                )}
              </div>

            </div>
          )}

          {/* TAB CONTENT 5: Mağaza Değerlendirmeleri ve Son Yorumlar */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stat 1 */}
                <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                  <span className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mb-1">Toplam Satış</span>
                  <span className="text-2xl font-black text-purple-400 font-mono">{totalSellerSales} Adet</span>
                  <span className="block text-[9px] text-gray-600 mt-1">Bu mağazadan başarılı teslim edilen ticaretler</span>
                </div>
                {/* Stat 2 */}
                <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                  <span className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mb-1">Mağaza Puanı</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">{averageSellerRating} / 5</span>
                  <div className="flex justify-center items-center gap-1 mt-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={i + 1 <= Math.round(averageSellerRating) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-3.5 w-3.5"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                {/* Stat 3 */}
                <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 text-center shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                  <span className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mb-1">Olumlu Yorum Oranı</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">%{positiveSellerRatio}</span>
                  <span className="block text-[9px] text-gray-600 mt-1">4 ve 5 yıldızlı değerlendirmelerin oranı</span>
                </div>
              </div>

              {/* Son Yorumlar */}
              <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 md:p-6 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                <span className="block text-xs font-black text-white uppercase tracking-wider mb-4">GELEN YORUMLAR / GERİ BİLDİRİMLER ({sellerReviews.length})</span>
                
                {sellerReviews.length > 0 ? (
                  <div className="space-y-3.5">
                    {sellerReviews.map((rev) => (
                      <div key={rev.id} className="bg-gray-900/20 border border-gray-900/60 rounded-xl p-4 text-xs space-y-2.5">
                        <div className="flex justify-between items-start font-sans">
                          <div>
                            <span className="font-extrabold text-purple-400">@{rev.username}</span>
                            <span className="block text-[9px] text-gray-500 mt-0.5">{new Date(rev.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex gap-0.5 text-[#FFA800]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={i + 1 <= rev.rating ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="h-3 w-3"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed font-semibold">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-600">
                    <span className="block text-xs font-bold">Mağazanıza henüz hiç geri bildirim veya yorum yazılmamış.</span>
                    <p className="text-[10px] text-gray-600 mt-1">Süreci tamamlayan alıcılar Siparişlerim sekmesinden dükkanınızı puanlayabilir.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// Simple clean lucide plus icon substitute to ignore module bindings error
const PlusIcon = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
