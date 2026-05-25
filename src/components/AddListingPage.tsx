import React, { useState, useRef } from "react";
import { useStore, calculateCommissionAndEarnings } from "../context/StoreContext";
import { CATEGORIES } from "../categories";
import { Upload, X, DollarSign, Calculator, HelpCircle, AlertTriangle, Plus, Sparkles, Check } from "lucide-react";

interface AddListingPageProps {
  onNavigate: (page: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export const AddListingPage: React.FC<AddListingPageProps> = ({ onNavigate, showToast }) => {
  const { addListing, currentUser } = useStore();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [stock, setStock] = useState<number>(1);
  const [deliveryTime, setDeliveryTime] = useState("Anında Teslim");
  const [images, setImages] = useState<string[]>([]);
  
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Financial commission auto-calculations
  const { commission, earnings } = calculateCommissionAndEarnings(price);

  const activeCategoryObj = CATEGORIES.find(c => c.name === category);

  // Read files and convert them to Base64 (avoid url links, real file upload)
  const processFiles = (files: FileList) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxFilesCount = 4;
    
    if (images.length + files.length > maxFilesCount) {
      showToast(`En fazla ${maxFilesCount} adet ilan görseli ekleyebilirsiniz.`, "error");
      return;
    }

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        showToast("Lütfen sadece JPEG, JPG, PNG veya WEBP türünde görseller yükleyin.", "error");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
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
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast("Lütfen önce giriş yapın.", "error");
      return;
    }

    if (!title.trim() || !description.trim() || price <= 0 || !category || !subcategory) {
      showToast("Lütfen tüm zorunlu alanları doldurun.", "error");
      return;
    }

    // If no images uploaded, map high-quality representative matching category cover
    let finalImages = [...images];
    if (finalImages.length === 0) {
      const matchCatObj = CATEGORIES.find(c => c.name === category);
      if (matchCatObj && matchCatObj.bgImage) {
        finalImages = [matchCatObj.bgImage];
      } else {
        finalImages = ["https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"];
      }
    }

    // Double check epin / top-up rules just in case
    const catCheck = CATEGORIES.find(c => c.name === category);
    if (catCheck?.isDisabled) {
      showToast("Epin ve Top-Up kategorilerinde ilan açma işlemi şu anda aktif değildir.", "error");
      return;
    }

    try {
      addListing({
        title,
        description,
        price,
        category,
        subcategory,
        stock,
        deliveryTime,
        images: finalImages
      });

      showToast("İlanınız başarıyla eklendi ve satışa açıldı!", "success");
      onNavigate("home");
    } catch (err: any) {
      showToast(err.message || "İlan eklenirken bir hata oluştu.", "error");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 font-sans" id="add-listing-page-wrapper">
      <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        
        {/* Header Title */}
        <div className="mb-8 border-b border-gray-900 pb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Plus size={18} />
            </div>
            <h2 className="text-xl font-black text-white">Yeni İlan Oluştur</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">Dijital hesap, boost ve ürününüzün detaylarını girerek hemen para kazanmaya başlayın.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title and description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">İlan Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Valorant Seçkin Hesap | Yağmacı Vandal..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-3 px-4 text-xs md:text-sm text-white outline-none transition-all placeholder:text-gray-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">Açıklama *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="İlanınızın içeriği, teslimat koşulları veya sunulan rütbe/bilgi detaylarını en az 10 karakter olacak şekilde detaylıca açıklayın..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 py-3 px-4 text-xs md:text-sm text-white outline-none transition-all placeholder:text-gray-600 font-semibold resize-none"
                />
              </div>
            </div>

            {/* Drag & Drop Real Image Uploader */}
            <div>
              <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">İlan Görselleri * (En Fazla 4 Adet)</label>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                  dragging
                    ? "border-purple-500 bg-purple-500/10 text-purple-300"
                    : "border-gray-800 bg-gray-900/40 hover:border-purple-500/30 text-gray-500 hover:text-gray-400"
                }`}
                id="image-drag-drop-box"
              >
                <Upload size={28} className="mb-2.5 text-purple-500/70" />
                <span className="block text-xs font-bold text-center">Dosyayı sürükleyip bırakın veya seçmek için tıklayın</span>
                <span className="block text-[10px] text-gray-600 mt-1">Sadece JPG, JPEG, PNG, WEBP desteklenir. Max 2MB</span>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Uploaded Images Preview list */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2.5 mt-4" id="images-preview-row">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group border border-gray-800">
                      <img src={img} alt={`Preview ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                      >
                        <X size={14} className="text-rose-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Core Fields Grid: Categories & Delivery Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-900 pt-6">
            
            {/* Category Selectors */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">Ana Kategori Seçin *</label>
                <select
                  required
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory(""); // reset child subcategory on parent change
                  }}
                  className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 py-3 px-4 text-xs md:text-sm text-white outline-none transition-all cursor-pointer"
                >
                  <option value="">Kategori Seçiniz</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name} disabled={cat.isDisabled}>
                      {cat.name} {cat.isDisabled ? " (Yakında)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategories Selector (Always mandatory) */}
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">Alt Kategori Seçin (Zorunlu) *</label>
                <select
                  required
                  disabled={!category}
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 py-3 px-4 text-xs md:text-sm text-white outline-none transition-all cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <option value="">Alt Kategori Seçiniz</option>
                  {activeCategoryObj?.subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock and delivery duration settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">Stok Adedi *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={stock}
                  onChange={(e) => setStock(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 py-3 px-4 text-xs md:text-sm text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-300 uppercase tracking-wider mb-2">Teslimat Süresi *</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full rounded-xl bg-gray-900 border border-gray-850 focus:border-purple-500 py-3 px-4 text-xs md:text-sm text-white outline-none transition-all cursor-pointer"
                >
                  <option value="Anında Teslim">Anında Teslim</option>
                  <option value="1 Saat">1 Saat</option>
                  <option value="2 Saat">2 Saat</option>
                  <option value="6 Saat">6 Saat</option>
                  <option value="12 Saat">12 Saat</option>
                  <option value="24 Saat">24 Saat</option>
                </select>
              </div>
            </div>

          </div>

          {/* Pricing with Commission Calculator Engine */}
          <div className="rounded-2xl border border-purple-500/10 bg-purple-500/5 p-5 md:p-6" id="commission-calculator-box">
            <h4 className="text-sm font-black text-white flex items-center gap-1.5 mb-2">
              <Calculator size={16} className="text-purple-400" />
              <span>Pazar Yeri Komisyon Hesaplayıcı</span>
            </h4>
            
            {/* Rules badge */}
            <div className="flex flex-wrap gap-2 text-[10px] text-purple-400 font-bold mb-5 bg-purple-500/10 px-3 py-1.5 rounded-lg w-max border border-purple-500/20">
              <span>ⓘ 15 TL Altı: sabit 1 TL komisyon</span>
              <span>•</span>
              <span>15 TL Üstü: %7 komisyon</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Satış Fiyatı (TL) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-xs font-bold">₺</span>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    required
                    value={price || ""}
                    onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full rounded-xl bg-gray-950 border border-purple-500/20 focus:border-purple-500 py-2.5 pl-7 pr-3 text-sm text-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">LorziStore Komisyonu</span>
                <div className="rounded-xl bg-gray-950/40 border border-gray-900 px-4 py-3 text-xs md:text-sm text-red-400 font-bold h-10.5 flex items-center justify-between">
                  <span>Komisyon Kesintisi:</span>
                  <span>- {commission.toLocaleString()} TL</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Net Kazanacağınız Tutar</span>
                <div className="rounded-xl bg-purple-500/10 border border-purple-500/30 px-4 py-3 text-xs md:text-sm text-emerald-400 font-extrabold h-10.5 flex items-center justify-between shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]">
                  <span>Cüzdana Eklenecek:</span>
                  <span>+ {earnings.toLocaleString()} TL</span>
                </div>
              </div>

            </div>
          </div>

          {/* Form Actions footer */}
          <div className="border-t border-gray-900 pt-6 flex gap-3" id="add-listing-actions">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex-1 rounded-xl border border-gray-850 py-3.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-900 transition-all cursor-pointer text-center"
            >
              İptal Et
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-xs font-extrabold text-white shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] hover:scale-[1.01] transition-all cursor-pointer"
            >
              İlanı Satışa Çıkar
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
