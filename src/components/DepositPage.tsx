import React, { useState, useRef } from "react";
import { useStore } from "../context/StoreContext";
import { Upload, X, Wallet, Copy, Check, Info, FileText, AlertCircle, ShieldAlert } from "lucide-react";

interface DepositPageProps {
  onNavigate: (page: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export const DepositPage: React.FC<DepositPageProps> = ({ onNavigate, showToast }) => {
  const { submitPaymentRequest, currentUser } = useStore();
  const [amount, setAmount] = useState<number>(100);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ibanText = "TR270004600094888000257436";
  const nameText = "Münire Palancı";

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast("Panoya kopyalandı.", "success");
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const processFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      showToast("Lütfen sadece resim formatında (PNG, JPG, WEBP) dekont yükleyin.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setReceiptImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast("Giriş yapmalısınız.", "error");
      return;
    }

    if (amount <= 0) {
      showToast("Lütfen geçerli bir tutar girin.", "error");
      return;
    }

    if (!receiptImage) {
      showToast("Lütfen havale/EFT dekontunuzun bir fotoğrafını yükleyin.", "error");
      return;
    }

    submitPaymentRequest(amount, receiptImage);
    showToast("Ödeme bildiriminiz alındı! Lorzi Store finans birimi kontrollerinin ardından bakiye hesabınıza eklenecektir.", "success");
    onNavigate("profile");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 font-sans" id="deposit-page-wrapper">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* EFT - HAVALE IBAN BILGILERI */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase">
              <Info size={16} className="text-purple-400" />
              <span>Banka Havale Bilgileri</span>
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              Aşağıdaki banka hesabına dilediğiniz tutarda EFT veya Havale yapınız. Alıcı ismini eksiksiz yazdığınızdan emin olunuz.
            </p>

            <div className="space-y-4 border-t border-gray-900 pt-4">
              
              {/* Alıcı Adı */}
              <div className="rounded-xl bg-gray-900/40 border border-gray-900 p-3 flex justify-between items-center">
                <div>
                  <span className="block text-[9px] text-gray-500 font-extrabold uppercase">ALICI ADI SOYADI</span>
                  <span className="text-xs font-black text-gray-200">{nameText}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(nameText, "name")}
                  className="rounded-lg bg-gray-950 hover:bg-gray-900/60 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Kopyala"
                >
                  {copiedKey === "name" ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                </button>
              </div>

              {/* IBAN */}
              <div className="rounded-xl bg-gray-900/40 border border-gray-900 p-3 flex justify-between items-center">
                <div className="min-w-0">
                  <span className="block text-[9px] text-gray-500 font-extrabold uppercase">IBAN NUMARASI</span>
                  <span className="text-xs font-black text-purple-400 font-mono block truncate">TR27 0004 6000 9488 8000 2574 36</span>
                </div>
                <button
                  onClick={() => copyToClipboard(ibanText, "iban")}
                  className="rounded-lg bg-gray-950 hover:bg-gray-900/60 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Kopyala"
                >
                  {copiedKey === "iban" ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                </button>
              </div>

            </div>
          </div>

          {/* Secure trade banner */}
          <div className="rounded-2xl border border-dashed border-purple-500/20 bg-purple-500/5 p-5 flex gap-3.5">
            <ShieldAlert size={20} className="text-purple-400 shrink-0" />
            <div className="space-y-1">
              <span className="block text-xs font-bold text-gray-200">LorziStore Güvencesi</span>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Yüklediğiniz bakiyeler tamamen koruma altındadır. Haftanın 7 günü Lorzi Store güvence ve finans ekibi tarafından dakikalar içerisinde onaylanır.
              </p>
            </div>
          </div>
        </div>

        {/* ODEME BILDIRIM FORMU VE DEKONT */}
        <div className="md:col-span-3">
          <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-6 shadow-[0_4px_25px_rgba(0,0,0,0.25)]">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase mb-6">
              <Wallet size={16} className="text-purple-400" />
              <span>Bakiye Bildirim Formu</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Gönderilen Tutar (TL) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-xs font-black">₺</span>
                  <input
                    type="number"
                    min={1}
                    required
                    value={amount || ""}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-3 pl-7 pr-4 text-xs md:text-sm text-white outline-none transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Receipt File upload */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Dekont Görseli (Dosya Yükleme) *</label>
                
                {!receiptImage ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                      dragging
                        ? "border-purple-500 bg-purple-500/10 text-purple-300"
                        : "border-gray-800 bg-gray-900/30 hover:border-purple-500/20 text-gray-500 hover:text-gray-400"
                    }`}
                  >
                    <Upload size={24} className="mb-2 text-purple-500/70" />
                    <span className="block text-xs font-bold text-center">Dekont fotoğrafını sürükleyin veya seçin</span>
                    <span className="block text-[9px] text-gray-600 mt-1">Sadece PNG, JPG, JPEG veya WEBP. Link girmeyiniz.</span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-800 group bg-gray-900">
                    <img src={receiptImage} alt="Dekont" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => setReceiptImage(null)}
                        className="rounded-xl bg-rose-600 p-2 text-white hover:bg-rose-700 transition-colors"
                        title="Resmi Kaldır"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-xs font-black text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:scale-[1.01] transition-all cursor-pointer"
              >
                Ödemeyi Bildir ve Onaya Gönder
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
