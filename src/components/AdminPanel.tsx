import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  Wallet, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Image,
  AlertTriangle,
  UserCheck,
  Percent,
  Compass
} from "lucide-react";

interface AdminPanelProps {
  onNavigate: (page: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate, showToast }) => {
  const { 
    users, 
    listings, 
    payments, 
    withdraws, 
    currentUser, 
    approvePayment, 
    rejectPayment,
    approveWithdraw,
    rejectWithdraw,
    approveKyc,
    rejectKyc,
    deleteListing
  } = useStore();

  const [panelTab, setPanelTab] = useState<"kyc" | "payments" | "withdraws" | "listings" | "users">("kyc");
  const [userQuery, setUserQuery] = useState("");
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Security Wall: Check if active user is really admin (munirpalanci21@gmail.com)
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center font-sans">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-rose-400">
          <ShieldAlert className="mx-auto mb-4 animate-bounce" size={40} />
          <h3 className="text-lg font-black">YETKİSİZ ERİŞİM</h3>
          <p className="text-xs text-gray-400 mt-2">Bu sayfayı yalnızca yönetici (munirpalanci21@gmail.com) görüntüleyebilir.</p>
        </div>
      </div>
    );
  }

  // Filters for lists
  const pendingKycUsers = users.filter(u => u.kycStatus === "pending");
  const pendingPayments = payments.filter(p => p.status === "pending");
  const pendingWithdraws = withdraws.filter(w => w.status === "pending");

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 font-sans" id="admin-panel-wrapper">
      
      {/* Admin Title Board */}
      <div className="mb-8 border-b border-gray-900 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="text-red-500 fill-red-500/10 h-5 w-5" />
            <span>LorziStore Yönetici Paneli</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Hoş geldiniz, Sayın Yönetici. Marketplace süreçlerini, bakiye hareketleri ve kimlik doğrulamalarını buradan kontrol edebilirsiniz.</p>
        </div>
        
        {/* Stats Summary Bento pills */}
        <div className="flex gap-2.5">
          <span className="rounded-xl bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 text-[10px] font-bold text-purple-400">
            Bekleyen KYC: {pendingKycUsers.length}
          </span>
          <span className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 text-[10px] font-bold text-amber-400">
            Bekleyen Yükleme: {pendingPayments.length}
          </span>
          <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 text-[10px] font-bold text-emerald-400">
            Bekleyen Çekim: {pendingWithdraws.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* PANEL SIDEBAR NAVIGATION tabs */}
        <div className="lg:col-span-1 space-y-2" id="admin-tabs">
          <button
            onClick={() => setPanelTab("kyc")}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-xs font-bold border transition-all cursor-pointer ${
              panelTab === "kyc"
                ? "bg-purple-600/15 border-purple-500/30 text-purple-400 font-extrabold"
                : "bg-gray-950/40 border-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            <span>Kimlik (KYC) Onayları</span>
            {pendingKycUsers.length > 0 && (
              <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[8px] font-black text-white shrink-0">
                {pendingKycUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setPanelTab("payments")}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-xs font-bold border transition-all cursor-pointer ${
              panelTab === "payments"
                ? "bg-purple-600/15 border-purple-500/30 text-purple-400 font-extrabold"
                : "bg-gray-950/40 border-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            <span>Bakiye Dekont Onayları</span>
            {pendingPayments.length > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[8px] font-black text-gray-950 shrink-0">
                {pendingPayments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setPanelTab("withdraws")}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-xs font-bold border transition-all cursor-pointer ${
              panelTab === "withdraws"
                ? "bg-purple-600/15 border-purple-500/30 text-purple-400 font-extrabold"
                : "bg-gray-950/40 border-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            <span>Para Çekme Talepleri</span>
            {pendingWithdraws.length > 0 && (
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[8px] font-black text-white shrink-0">
                {pendingWithdraws.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setPanelTab("listings")}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-xs font-bold border transition-all cursor-pointer ${
              panelTab === "listings"
                ? "bg-purple-600/15 border-purple-500/30 text-purple-400 font-extrabold"
                : "bg-gray-950/40 border-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            <span>İlan Yönetimi ({listings.length})</span>
          </button>

          <button
            onClick={() => setPanelTab("users")}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-xs font-bold border transition-all cursor-pointer ${
              panelTab === "users"
                ? "bg-purple-600/15 border-purple-500/30 text-purple-400 font-extrabold"
                : "bg-gray-950/40 border-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            <span>Kullanıcı Yönetimi ({users.length})</span>
          </button>
        </div>

        {/* SAĞ PANEL: Seçili Sekmeye Göre Detay */}
        <div className="lg:col-span-3 space-y-6" id="admin-details-pane">
          
          {/* TAB 1: KYC Onay Bekleme Listeleri */}
          {panelTab === "kyc" && (
            <div className="space-y-4">
              <span className="block text-xs font-black text-white uppercase tracking-widest bg-gray-900/40 p-3.5 rounded-xl border border-gray-900">Kullanıcı KYC Başvuruları</span>
              
              {pendingKycUsers.length > 0 ? (
                <div className="space-y-4" id="kyc-approval-list">
                  {pendingKycUsers.map(u => (
                    <div 
                      key={u.id}
                      className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 space-y-4"
                    >
                      <div className="flex justify-between items-center border-b border-gray-900 pb-3">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} referrerPolicy="no-referrer" className="h-9 w-9 rounded-xl object-cover" />
                          <div>
                            <span className="block text-xs font-black text-gray-200">@{u.username}</span>
                            <span className="block text-[10px] text-gray-500">{u.email}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">Doğrulama Bekliyor</span>
                      </div>

                      {/* Document photo views */}
                      {u.kycDetails && (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <span className="block text-[9px] text-gray-500 font-black">1. KİMLİK ÖN YÜZÜ</span>
                            <div 
                              onClick={() => setViewingImage(u.kycDetails!.idCardImage)}
                              className="aspect-[4/3] rounded-lg border border-gray-850 bg-gray-900 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity"
                            >
                              <img src={u.kycDetails.idCardImage} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="block text-[9px] text-gray-500 font-black">2. SELFIE</span>
                            <div 
                              onClick={() => setViewingImage(u.kycDetails!.selfieImage)}
                              className="aspect-[4/3] rounded-lg border border-gray-850 bg-gray-900 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity"
                            >
                              <img src={u.kycDetails.selfieImage} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="block text-[9px] text-gray-500 font-black">3. TARİHLİ SELFIE</span>
                            <div 
                              onClick={() => setViewingImage(u.kycDetails!.datedSelfieImage)}
                              className="aspect-[4/3] rounded-lg border border-gray-850 bg-gray-900 overflow-hidden cursor-pointer hover:opacity-85 transition-opacity"
                            >
                              <img src={u.kycDetails.datedSelfieImage} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2.5 justify-end border-t border-gray-900 pt-3">
                        <button
                          onClick={() => {
                            rejectKyc(u.id);
                            showToast("Doğrulama başvurusu reddedildi.", "success");
                          }}
                          className="rounded-xl border border-gray-855 px-4 py-2 text-xs font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
                        >
                          Talebi Reddet
                        </button>
                        <button
                          onClick={() => {
                            approveKyc(u.id);
                            showToast(`${u.username} kimliği doğrulandı! Güvenilir Satıcı rozeti tanımlandı.`, "success");
                          }}
                          className="rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-2 text-xs font-black text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)] mb-0.5"
                        >
                          Kimliği Onayla (Rozet Ver)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-850 py-20 text-center text-gray-550">
                  <span className="text-xs font-bold block">Onay bekleyen kimlik doğrulama talebi bulunmuyor.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Bakiye Dekont ve Yükleme Onay listesi */}
          {panelTab === "payments" && (
            <div className="space-y-4">
              <span className="block text-xs font-black text-white uppercase tracking-widest bg-gray-900/40 p-3.5 rounded-xl border border-gray-900">Bakiye Bildirim Dekontları</span>
              
              {pendingPayments.length > 0 ? (
                <div className="space-y-4" id="payments-approval-list">
                  {pendingPayments.map(pay => (
                    <div 
                      key={pay.id}
                      className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 flex flex-col sm:flex-row gap-5 justify-between sm:items-center"
                    >
                      <div className="flex gap-3.5 items-start">
                        {/* Receipt previews */}
                        <div 
                          onClick={() => setViewingImage(pay.receiptImage)}
                          className="h-20 w-16 rounded-xl border border-gray-800 bg-gray-900 overflow-hidden cursor-pointer shrink-0"
                          title="Dekontu Büyüt"
                        >
                          <img src={pay.receiptImage} className="h-full w-full object-cover" />
                        </div>
                        
                        <div className="space-y-1">
                          <span className="block text-sm font-black text-white">Yükleme Bildirimi: +{pay.amount} TL</span>
                          <span className="block text-xs font-bold text-purple-400">Gönderen: @{pay.username}</span>
                          <span className="block text-[10px] text-gray-500">{new Date(pay.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 sm:self-auto self-end">
                        <button
                          onClick={() => {
                            rejectPayment(pay.id);
                            showToast("Ödeme bildirimi reddedildi.", "success");
                          }}
                          className="rounded-xl border border-gray-800 p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Reddet"
                        >
                          <X size={15} />
                        </button>
                        <button
                          onClick={() => {
                            approvePayment(pay.id);
                            showToast(`${pay.username} hesabına ${pay.amount} TL başarıyla yüklendi!`, "success");
                          }}
                          className="rounded-xl bg-purple-650 hover:bg-purple-700 px-4 py-2.5 text-xs font-black text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.25)] flex items-center gap-1.5"
                        >
                          <Check size={14} />
                          <span>Dekontu Onayla</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-850 py-20 text-center text-gray-550">
                  <span className="text-xs font-bold block">Onay bekleyen bakiye bildirim dekontu bulunmuyor.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Para Çekme (IBAN Transferi) Onayları */}
          {panelTab === "withdraws" && (
            <div className="space-y-4">
              <span className="block text-xs font-black text-white uppercase tracking-widest bg-gray-900/40 p-3.5 rounded-xl border border-gray-900">Para Çekim Talepleri (Havale)</span>
              
              {pendingWithdraws.length > 0 ? (
                <div className="space-y-4" id="withdraws-approval-list">
                  {pendingWithdraws.map(w => (
                    <div 
                      key={w.id}
                      className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 flex flex-col md:flex-row gap-5 justify-between md:items-center"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">Çekilen: -{w.amount} TL</span>
                          <span className="text-xs text-purple-400 font-bold bg-purple-500/5 border border-purple-500/15 px-2 py-0.2 rounded-lg">Net Alıcı: {w.netAmount} TL</span>
                        </div>
                        <span className="block text-xs text-gray-400">Alıcı Üye: @{w.username}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-500 font-bold">IBAN DURUM:</span>
                          <span className="text-xs font-mono font-bold text-gray-300 select-all">{w.iban}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 self-end md:self-auto">
                        <button
                          onClick={() => {
                            rejectWithdraw(w.id);
                            showToast("Para çekme talebi reddedildi, bakiye iade edildi.", "success");
                          }}
                          className="rounded-xl border border-gray-800 p-2.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Talebi İptal Et/Reddet"
                        >
                          <X size={15} />
                        </button>
                        <button
                          onClick={() => {
                            approveWithdraw(w.id);
                            showToast(`${w.username} için IBAN transferi ödendi olarak kaydedildi!`, "success");
                          }}
                          className="rounded-xl bg-purple-600 hover:bg-purple-700 px-4.5 py-2.5 text-xs font-black text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                        >
                          <Check size={14} />
                          <span>Gönderildi Olarak İşaretle</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-850 py-20 text-center text-gray-550">
                  <span className="text-xs font-bold block">Onay bekleyen para çekme talebi bulunmuyor.</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: İlan Yönetimi ve Temizleme */}
          {panelTab === "listings" && (
            <div className="space-y-4">
              <span className="block text-xs font-black text-white uppercase tracking-widest bg-gray-900/40 p-3.5 rounded-xl border border-gray-900">Marketplace Aktif İlanlar</span>
              
              <div className="space-y-2.5" id="admin-listings-rows">
                {listings.map(listing => (
                  <div 
                    key={listing.id}
                    className="rounded-xl border border-gray-900 bg-gray-950/20 p-3.5 flex justify-between items-center gap-4"
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <img src={listing.images[0]} referrerPolicy="no-referrer" className="h-10 w-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] text-purple-400 font-bold block uppercase">{listing.category} / {listing.subcategory}</span>
                        <h4 className="text-xs font-bold text-gray-200 truncate">{listing.title}</h4>
                        <span className="text-[10px] text-gray-500">Satıcı: @{listing.sellerName} | Fiyat: {listing.price} TL</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        deleteListing(listing.id);
                        showToast("İlan sistemden kaldırıldı.", "success");
                      }}
                      className="rounded-lg p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors shrink-0"
                      title="İlanı Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Kullanıcı Yönetimi */}
          {panelTab === "users" && (
            <div className="space-y-4">
              <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-900 flex justify-between items-center gap-4">
                <span className="text-xs font-black text-white uppercase tracking-widest">Tüm Kayıtlar</span>
                
                <div className="relative w-48 md:w-64">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-gray-500">
                    <Search size={13} />
                  </span>
                  <input
                    type="text"
                    placeholder="Müşteri ara..."
                    value={userQuery}
                    onChange={e => setUserQuery(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg py-1.5 pl-7 pr-3 text-[11px] text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2" id="admin-users-list">
                {filteredUsers.map(u => (
                  <div key={u.id} className="rounded-xl border border-gray-900 bg-gray-950/20 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex gap-2.5 items-center">
                      <img src={u.avatar} referrerPolicy="no-referrer" className="h-8 w-8 rounded-xl object-cover" />
                      <div>
                        <span className="text-xs font-extrabold text-gray-200 block">@{u.username}</span>
                        <span className="text-[10px] text-gray-500 block">{u.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 text-left sm:text-right">
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">Yüklenen</span>
                        <span className="text-xs font-black text-emerald-400">{u.balance.toLocaleString()} TL</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">Satış Kazancı</span>
                        <span className="text-xs font-black text-purple-400">{u.salesBalance.toLocaleString()} TL</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">Rol</span>
                        <span className={`text-[10px] font-bold ${u.role === 'admin' ? "text-red-400" : "text-gray-400"}`}>{u.role.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FULLSIZE IMAGE LIGHTBOX PREVIEWER */}
      {viewingImage && (
        <div 
          onClick={() => setViewingImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out backdrop-blur-sm"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-gray-900 bg-gray-950">
            <img src={viewingImage} referrerPolicy="no-referrer" className="max-w-full max-h-[85vh] object-contain" />
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 rounded-xl bg-black/60 p-2 text-white hover:bg-black/90 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
