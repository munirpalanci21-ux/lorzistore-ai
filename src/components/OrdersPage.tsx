import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { ShoppingBag, ArrowLeft, ShieldCheck, ExternalLink, HelpCircle, Star } from "lucide-react";

interface OrdersPageProps {
  onNavigate: (page: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate, showToast }) => {
  const { orders, currentUser, reviews, addReview } = useStore();
  const [ratingOrderId, setRatingOrderId] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState("");

  const handlePublishReview = (orderId: string, listingId: string, sellerId: string) => {
    if (!ratingComment.trim()) {
      showToast("Lütfen bir değerlendirme yorumu yazın.", "error");
      return;
    }

    const res = addReview(orderId, listingId, sellerId, ratingStars, ratingComment);
    if (res.success) {
      showToast(res.message, "success");
      setRatingOrderId(null);
      setRatingStars(5);
      setRatingComment("");
    } else {
      showToast(res.message, "error");
    }
  };

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center font-sans">
        <div className="rounded-2xl border border-gray-900 bg-gray-950/40 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          <ShoppingBag className="mx-auto text-purple-500 mb-4 animate-bounce" size={40} />
          <h3 className="text-lg font-black text-white">Giriş Yapmalısınız</h3>
          <p className="text-xs text-gray-400 mt-2">Sipariş geçmişinizi görebilmek ve satın aldığınız kodları takip edebilmek için lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  // Filter orders where current user is the buyer or the seller
  const buyerOrders = orders.filter(o => o.buyerId === currentUser.id);
  const sellerOrders = orders.filter(o => o.sellerId === currentUser.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 font-sans" id="orders-page-wrapper">
      
      <div className="mb-8 flex items-center justify-between border-b border-gray-900 pb-5">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="text-purple-400 h-5 w-5" />
            <span>Sipariş ve Satışlarım</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">Bu sayfada yaptığınız alımları ve dükkanınızdan gerçekleşen dijital satışları takip edebilirsiniz.</p>
        </div>
        
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-1.5 rounded-xl border border-gray-850 bg-gray-900/40 hover:bg-gray-900 px-3.5 py-2 text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Alışverişe Dön</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="orders-dual-grid">
        
        {/* ALDIĞIM ÜRÜNLER (BUYER ORDERS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-900/40 border border-gray-900 p-4 rounded-xl">
            <span className="text-xs font-black text-white block">SATIN ALDIKLARIM</span>
            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[9px] font-black text-purple-400 border border-purple-500/20">
              {buyerOrders.length} İşlem
            </span>
          </div>

          {buyerOrders.length > 0 ? (
            <div className="space-y-4" id="buyer-orders-list">
              {buyerOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 shadow-[0_4px_15px_rgba(0,0,0,0.15)] space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-1.5 w-16 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block">SİPARİŞ KODU</span>
                      <span className="text-xs font-black text-white">{order.id.toUpperCase()}</span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block">ÜCRET</span>
                      <span className="text-sm font-black text-emerald-400">{order.price.toLocaleString()} TL</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-900 py-3 flex gap-3 items-center">
                    <div className="h-12 w-16 rounded-lg bg-gray-900 border border-gray-850 overflow-hidden flex items-center justify-center shrink-0">
                      {order.listingImage ? (
                        <img src={order.listingImage} alt={order.listingTitle} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={18} className="text-gray-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-gray-200 truncate leading-tight">{order.listingTitle}</h4>
                      <span className="text-[10px] text-purple-400 block mt-1 font-bold">Satıcı: @{order.sellerName}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/30 p-3 rounded-xl border border-gray-900/60">
                    <div>
                      <span className="text-[10px] text-gray-500 font-black block">GÜVENLİ TESLİMAT KODUNUZ</span>
                      <span className="text-xs font-black text-purple-400 font-mono tracking-wider">{order.deliveryCode}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 self-start sm:self-auto">
                      <ShieldCheck size={12} />
                      <span>Teslimat Tamamlandı</span>
                    </div>
                  </div>

                  {/* Evaluating / Comments Section */}
                  {(() => {
                    const existingReview = reviews.find(r => r.orderId === order.id);
                    if (existingReview) {
                      return (
                        <div className="p-3.5 rounded-xl bg-purple-950/10 border border-purple-500/10 text-xs">
                          <div className="flex items-center gap-1 text-[#FFA800] mb-1">
                            {Array.from({ length: existingReview.rating }).map((_, i) => (
                              <Star key={i} size={11} fill="#FFA800" stroke="none" />
                            ))}
                            <span className="text-[10px] text-gray-500 ml-1">Değerlendirmeniz</span>
                          </div>
                          <p className="text-gray-300 italic font-medium">"{existingReview.comment}"</p>
                        </div>
                      );
                    } else if (ratingOrderId === order.id) {
                      return (
                        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80 space-y-3">
                          <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">Siparişi Puanla & Değerlendir</span>
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: 5 }).map((_, i) => {
                              const starPos = i + 1;
                              return (
                                <button
                                  key={i}
                                  onClick={() => setRatingStars(starPos)}
                                  className="text-[#FFA800] hover:scale-110 transition-transform cursor-pointer"
                                  type="button"
                                >
                                  <Star size={16} fill={starPos <= ratingStars ? "#FFA800" : "none"} />
                                </button>
                              );
                            })}
                            <span className="text-xs text-gray-400 font-bold ml-1">{ratingStars}/5 Yıldız</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={ratingComment}
                              onChange={(e) => setRatingComment(e.target.value)}
                              placeholder="Teslimat hızı, iletişim ve ürün hakkında yorumunuz..."
                              className="flex-1 bg-gray-950 border border-gray-850 rounded-xl px-3 py-2 text-xs text-gray-200 outline-none focus:border-purple-500"
                            />
                            <button
                              onClick={() => handlePublishReview(order.id, order.listingId, order.sellerId)}
                              className="rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-black text-white cursor-pointer transition-colors"
                              type="button"
                            >
                              Yayınla
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex justify-end">
                          <button
                            onClick={() => setRatingOrderId(order.id)}
                            className="flex items-center gap-1 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600 hover:text-white text-[10px] font-black tracking-wide uppercase text-purple-400 px-3.5 py-2 transition-all cursor-pointer"
                            type="button"
                          >
                            <Star size={12} fill="currentColor" />
                            <span>Siparişi Değerlendir</span>
                          </button>
                        </div>
                      );
                    }
                  })()}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-900 py-16 text-center text-gray-500">
              <span className="text-xs font-bold block">Henüz satın alınmış ilanınız bulunmuyor.</span>
            </div>
          )}
        </div>

        {/* SATTIĞIM ÜRÜNLER (SELLER ORDERS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-900/40 border border-gray-900 p-4 rounded-xl">
            <span className="text-xs font-black text-white block">SATIŞLARIM</span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black text-emerald-400 border border-emerald-500/20">
              {sellerOrders.length} İşlem
            </span>
          </div>

          {sellerOrders.length > 0 ? (
            <div className="space-y-4" id="seller-orders-list">
              {sellerOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-gray-900 bg-gray-950/40 p-5 shadow-[0_4px_15px_rgba(0,0,0,0.15)] space-y-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block">İŞLEM KODU</span>
                      <span className="text-xs font-black text-white">{order.id.toUpperCase()}</span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block">NET KAZANCINIZ</span>
                      <span className="text-sm font-black text-emerald-400">+{order.earnings.toLocaleString()} TL</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-900 py-3 flex gap-3 items-center">
                    <div className="h-12 w-16 rounded-lg bg-gray-900 border border-gray-850 overflow-hidden flex items-center justify-center shrink-0">
                      {order.listingImage ? (
                        <img src={order.listingImage} alt={order.listingTitle} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={18} className="text-gray-700" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-gray-200 truncate leading-tight">{order.listingTitle}</h4>
                      <span className="text-[10px] text-purple-400 block mt-1 font-bold">Alıcı: @{order.buyerName}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/30 p-3 rounded-xl border border-gray-900/60">
                    <div>
                      <span className="text-[10px] text-gray-500 font-black block">İŞLEM DETAYI</span>
                      <span className="text-[11px] text-gray-400 block mt-0.5">Komisyon: -{order.commission} TL Kesildi</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 self-start sm:self-auto">
                      <ShieldCheck size={12} />
                      <span>Tamamlandı, Bakiye Aktarıldı</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-900 py-16 text-center text-gray-500">
              <span className="text-xs font-bold block">Henüz dükkanınızdan gerçekleşen satış bulunmuyor.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
