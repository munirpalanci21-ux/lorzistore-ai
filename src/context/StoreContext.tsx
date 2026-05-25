import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Listing, Chat, ChatMessage, PaymentRequest, WithdrawRequest, Order, Review } from "../types";
import { CATEGORIES } from "../categories";

interface StoreContextType {
  users: User[];
  currentUser: User | null;
  listings: Listing[];
  chats: Chat[];
  messages: ChatMessage[];
  payments: PaymentRequest[];
  withdraws: WithdrawRequest[];
  orders: Order[];
  favorites: string[];
  reviews: Review[];
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (username: string, email: string) => { success: boolean; message: string };
  logout: () => void;
  addListing: (listing: Omit<Listing, "id" | "sellerId" | "sellerName" | "sellerVerified" | "createdAt" | "status" | "isFeatured" | "isCarousel">) => string;
  buyListing: (listingId: string) => { success: boolean; message: string };
  toggleFavorite: (listingId: string) => void;
  sendMessage: (receiverId: string, receiverName: string, content: string, listingId: string, listingTitle: string, listingImage?: string) => void;
  submitPaymentRequest: (amount: number, receiptImage: string) => void;
  submitWithdrawRequest: (amount: number, iban: string) => { success: boolean; message: string };
  submitKycRequest: (idCard: string, selfie: string, datedSelfie: string) => void;
  applyDoping: (listingId: string, dopingType: "featured" | "carousel" | "bump", price: number) => { success: boolean; message: string };
  markMessagesAsRead: (chatId: string) => void;
  addReview: (orderId: string, listingId: string, sellerId: string, rating: number, comment: string) => { success: boolean; message: string };
  
  // Admin Methods
  approvePayment: (id: string) => void;
  rejectPayment: (id: string) => void;
  approveWithdraw: (id: string) => void;
  rejectWithdraw: (id: string) => void;
  approveKyc: (userId: string) => void;
  rejectKyc: (userId: string) => void;
  deleteListing: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CURRENT_USER_EMAIL_KEY = "lorzistore_current_user_email";

// Helper function to calculate commission and earnings
// 15 TL altı satış -> sabit 1 TL komisyon
// 15 TL üstü satış -> %7 komisyon
export const calculateCommissionAndEarnings = (price: number) => {
  let commission = 0;
  if (price < 15) {
    commission = 1;
  } else {
    commission = Math.round(price * 0.07 * 100) / 100;
  }
  const earnings = Math.round((price - commission) * 100) / 100;
  return { commission, earnings };
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users state
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("lorzistore_users");
    if (saved) return JSON.parse(saved);

    // Initial users
    const initialUsers: User[] = [
      {
        id: "admin",
        username: "LorziStore",
        email: "munirpalanci21@gmail.com",
        balance: 10000,
        salesBalance: 5000,
        isVerified: true,
        kycStatus: "approved",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        createdAt: "2026-01-01T00:00:00Z",
        isOnline: true,
        lastSeen: new Date().toISOString()
      },
      {
        id: "user1",
        username: "KozmikSatici",
        email: "cosmic@example.com",
        balance: 350,
        salesBalance: 1250,
        isVerified: true,
        kycStatus: "approved",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        createdAt: "2026-02-15T12:00:00Z",
        isOnline: true,
        lastSeen: new Date().toISOString()
      },
      {
        id: "user2",
        username: "LorzciCan",
        email: "can@example.com",
        balance: 50,
        salesBalance: 0,
        isVerified: false,
        kycStatus: "none",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop",
        createdAt: "2026-03-10T15:30:00Z",
        isOnline: false,
        lastSeen: new Date(Date.now() - 3600000 * 3).toISOString() // 3 saat önce
      },
      {
        id: "user3",
        username: "ValorantPro",
        email: "valopro@example.com",
        balance: 0,
        salesBalance: 4200,
        isVerified: true,
        kycStatus: "approved",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=200&auto=format&fit=crop",
        createdAt: "2026-03-20T18:45:00Z",
        isOnline: true,
        lastSeen: new Date().toISOString()
      }
    ];
    return initialUsers;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedEmail = localStorage.getItem(CURRENT_USER_EMAIL_KEY);
    if (savedEmail) {
      const savedUsersStr = localStorage.getItem("lorzistore_users");
      if (savedUsersStr) {
        const uList: User[] = JSON.parse(savedUsersStr);
        const match = uList.find(u => u.email === savedEmail);
        if (match) return match;
      }
    }
    return null;
  });

  // Listings state
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem("lorzistore_listings");
    if (saved) return JSON.parse(saved);

    // Initial marketplace listings
    const initialListings: Listing[] = [
      {
        id: "lst1",
        title: "Valorant Seçkin Hesap | 45 Skin | Yağmacı + Asil Set",
        description: "Hesap tamamen bana aittir, mail güvencesi ile devredilecektir. İçerisinde Yağmacı Vandal, Asil Vandal, Ejder Ateşi Operatör, Yağmacı Bıçak ve toplam 45 adet skin bulunmaktadır. Rank Diamond 2. Hiçbir ceza geçmişi yoktur.",
        price: 450,
        commission: 31.5,
        earnings: 418.5,
        category: "Valorant",
        subcategory: "Hesap",
        images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"],
        stock: 1,
        deliveryTime: "Anında Teslim",
        sellerId: "user1",
        sellerName: "KozmikSatici",
        sellerVerified: true,
        isFeatured: true, // Öne Çıkarılmış
        isCarousel: true, // Vitrin İlanı
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: "active"
      },
      {
        id: "lst2",
        title: "VALORANT RANK BOOST | Radiant Garantili Hızlı İşlem",
        description: "Profesyonel kadromuz ile hesabınızı dilediğiniz rütbeye hızla yükseltiyoruz. Fiyat maç başıdır. Duo olarak oynama seçeneğimiz mevcuttur. Güvenli ve gizli teslimat. Detaylar için mesaj atabilirsiniz.",
        price: 55,
        commission: 3.85,
        earnings: 51.15,
        category: "Valorant",
        subcategory: "Boost",
        images: ["https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop"],
        stock: 99,
        deliveryTime: "1 Saat",
        sellerId: "user3",
        sellerName: "ValorantPro",
        sellerVerified: true,
        isFeatured: true,
        isCarousel: false,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: "active"
      },
      {
        id: "lst3",
        title: "CS2 M9 Bayonet Doppler (Phase 4) - Aşınmış Görünüm",
        description: "Çok temiz Doppler Phase 4. Float değeri 0.02. Gerçek cs severlerin bayılacağı özel renk dağılımı. Anında takas teklifi olarak gönderilir. Steam koruması devrede.",
        price: 6500,
        commission: 455,
        earnings: 6045,
        category: "CS2",
        subcategory: "Knife",
        images: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop"],
        stock: 1,
        deliveryTime: "Anında Teslim",
        sellerId: "user1",
        sellerName: "KozmikSatici",
        sellerVerified: true,
        isFeatured: false,
        isCarousel: true, // Vitrin İlanı
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        status: "active"
      },
      {
        id: "lst4",
        title: "PUBG Mobile 75 Seviye Hesap | Buz Diyarı M416 (Max)",
        description: "Fatih çerçeveli, Buz diyarı M416 son seviye, Cehennem ateşi kaskı mevcut. Toplamda 25 destansı kıyafet setleri bulunuyor. Bağlantılar temiz, ilk sahibiyim. Sosyal medya hesabı doğrudan teslim edilecektir.",
        price: 1800,
        commission: 126,
        earnings: 1674,
        category: "PUBG Mobile",
        subcategory: "Hesap",
        images: ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop"],
        stock: 1,
        deliveryTime: "2 Saat",
        sellerId: "user2",
        sellerName: "LorzciCan",
        sellerVerified: false,
        isFeatured: false,
        isCarousel: false,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        status: "active"
      },
      {
        id: "lst5",
        title: "Instagram 10.000 Organik Türk Takipçi Paketi",
        description: "LorziStore kalitesiyle tamamen gerçek, aktif ve Türk takipçiler profilinize gönderilir. Şifre kesinlikle İSTENMEZ. Sadece kullanıcı adınız yeterlidir. %10 telafi garantilidir.",
        price: 99,
        commission: 6.93,
        earnings: 92.07,
        category: "Instagram",
        subcategory: "Takipçi",
        images: ["https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop"],
        stock: 500,
        deliveryTime: "1 Saat",
        sellerId: "user1",
        sellerName: "KozmikSatici",
        sellerVerified: true,
        isFeatured: true,
        isCarousel: true,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: "active"
      },
      {
        id: "lst6",
        title: "Süper Kaliteli Valorant Random Hesap (Bıçak Garantili)",
        description: "Minimum 1 Bıçak garantili, rütbesiz veya rütbeli random hesap. Mail onaysız olarak gelir, üstünüze alabilirsiniz. Şansınıza çok değerli desenler ve rütbeler çıkabilir.",
        price: 29,
        commission: 2.03,
        earnings: 26.97,
        category: "Valorant",
        subcategory: "Random Hesap",
        images: ["https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=600&auto=format&fit=crop"],
        stock: 50,
        deliveryTime: "Anında Teslim",
        sellerId: "user3",
        sellerName: "ValorantPro",
        sellerVerified: true,
        isFeatured: false,
        isCarousel: true,
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        status: "active"
      },
      {
        id: "lst7",
        title: "LoL Handlevel 30 Seviye Unranked Safe Esports Hesap | 45.000+ Mavi Öz",
        description: "Hesap tamamen el ile kasılmıştır, hiçbir 3. parti yazılım kullanılmamıştır. İlk mail şifresi ile birlikte hemen otomatik teslim edilir. İçerisinde 45.000 Mavi Öz vardır, dilediğiniz şampiyonları anında açıp rütbeli maçlara başlayabilirsiniz.",
        price: 120,
        commission: 8.4,
        earnings: 111.6,
        category: "League of Legends",
        subcategory: "LoL Hesap",
        images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"],
        stock: 20,
        deliveryTime: "Anında Teslim",
        sellerId: "user1",
        sellerName: "KozmikSatici",
        sellerVerified: true,
        isFeatured: true,
        isCarousel: true,
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        status: "active"
      },
      {
        id: "lst8",
        title: "Roblox Blox Fruits Max Level [YENİ] Venom & Light & Buddha Hesap",
        description: "Blox Fruits oyununda 2550 Maksimum seviye süper hesap. Venom, Light ve efsanevi Buddha meyveleri kalıcı olarak açılmıştır. E-posta adresi doğrulanmamıştır, doğrudan kendi mailinizi ekleyip güvenle şifreyi devralabilirsiniz.",
        price: 180,
        commission: 12.6,
        earnings: 167.4,
        category: "Roblox",
        subcategory: "Hesap",
        images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop"],
        stock: 1,
        deliveryTime: "Anında Teslim",
        sellerId: "user2",
        sellerName: "LorzciCan",
        sellerVerified: false,
        isFeatured: false,
        isCarousel: true,
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        status: "active"
      },
      {
        id: "lst9",
        title: "Steam Random VIP Key [Garantili minimum 100 TL Değerinde Premium Oyun]",
        description: "Lorzi Store özel seçkisiyle, kütüphanenize ekleyeceğiniz kodlarda kesinlikle ucuz veya çöp oyunlar yoktur! Tamamen AAA veya son dönemin sevilen popüler indie oyunlarından biri çıkmaktadır. Global anahtarlar olup anında aktif edilebilir.",
        price: 15,
        commission: 1.05,
        earnings: 13.95,
        category: "Steam",
        subcategory: "Random Key",
        images: ["https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop"],
        stock: 150,
        deliveryTime: "Anında Teslim",
        sellerId: "user1",
        sellerName: "KozmikSatici",
        sellerVerified: true,
        isFeatured: true,
        isCarousel: false,
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        status: "active"
      },
      {
        id: "lst10",
        title: "TikTok 5.000 Takipçili Türk Canlı Yayını Aktif Güvenli Hesap",
        description: "Takipçilerinin tamamı organik Türk kullanıcılardan oluşmaktadır. Canlı yayın butonu aktiftir ve yayın açılmaya hazırdır. Herhangi bir telif veya topluluk cezası bulunmamaktadır. İlk mailiyle devredilecektir.",
        price: 295,
        commission: 20.65,
        earnings: 274.35,
        category: "TikTok",
        subcategory: "Hesap",
        images: ["https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=600&auto=format&fit=crop"],
        stock: 1,
        deliveryTime: "2 Saat",
        sellerId: "user3",
        sellerName: "ValorantPro",
        sellerVerified: true,
        isFeatured: false,
        isCarousel: false,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        status: "active"
      }
    ];
    return initialListings;
  });

  // Chats & Messages State
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem("lorzistore_chats");
    return saved ? JSON.parse(saved) : [
      {
        id: "chat_user1_user2",
        buyerId: "user2",
        buyerName: "LorzciCan",
        sellerId: "user1",
        sellerName: "KozmikSatici",
        listingId: "lst1",
        listingTitle: "Valorant Seçkin Hesap | 45 Skin | Yağmacı + Asil Set",
        lastMessage: "Hesapta kaç tane bıçak vardı acaba?",
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 1
      }
    ];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("lorzistore_messages");
    return saved ? JSON.parse(saved) : [
      {
        id: "msg1",
        chatId: "chat_user1_user2",
        senderId: "user2",
        senderName: "LorzciCan",
        receiverId: "user1",
        content: "Selamlar, Valorant ilanıyla ilgileniyorum.",
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        read: true
      },
      {
        id: "msg2",
        chatId: "chat_user1_user2",
        senderId: "user1",
        senderName: "KozmikSatici",
        receiverId: "user2",
        content: "Aleykümselam buyrun, sorunuz varsa yanıtlayabilirim.",
        createdAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
        read: true
      },
      {
        id: "msg3",
        chatId: "chat_user1_user2",
        senderId: "user2",
        senderName: "LorzciCan",
        receiverId: "user1",
        content: "Hesapta kaç tane bıçak vardı acaba?",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ];
  });

  // Payments (Bakiye Yükleme) State
  const [payments, setPayments] = useState<PaymentRequest[]>(() => {
    const saved = localStorage.getItem("lorzistore_payments");
    return saved ? JSON.parse(saved) : [];
  });

  // Withdraws (Para Çekme) State
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>(() => {
    const saved = localStorage.getItem("lorzistore_withdraws");
    return saved ? JSON.parse(saved) : [];
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("lorzistore_orders");
    return saved ? JSON.parse(saved) : [];
  });

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("lorzistore_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("lorzistore_reviews");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "rev1",
        orderId: "ord_mock1",
        listingId: "lst1",
        sellerId: "user1",
        buyerId: "user2",
        buyerName: "LorzciCan",
        rating: 5,
        comment: "Mükemmel hizmet! Hesap jet hızıyla teslim edildi. Güvenle alışveriş yapabilirsiniz.",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "rev2",
        orderId: "ord_mock2",
        listingId: "lst2",
        sellerId: "user3",
        buyerId: "user1",
        buyerName: "KozmikSatici",
        rating: 5,
        comment: "Çok profesyonel oyuncu, boost işlemini anında bitirdi.",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("lorzistore_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("lorzistore_listings", JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem("lorzistore_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("lorzistore_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("lorzistore_payments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("lorzistore_withdraws", JSON.stringify(withdraws));
  }, [withdraws]);

  useEffect(() => {
    localStorage.setItem("lorzistore_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("lorzistore_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("lorzistore_reviews", JSON.stringify(reviews));
  }, [reviews]);

  // Auth Functions
  const login = (email: string, password: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Admin login bypass
    if (trimmedEmail === "munirpalanci21@gmail.com" && password === "admin123") {
      let adminUser = users.find(u => u.email === "munirpalanci21@gmail.com");
      if (!adminUser) {
        adminUser = {
          id: "admin",
          username: "LorziStore",
          email: "munirpalanci21@gmail.com",
          balance: 10000,
          salesBalance: 5000,
          isVerified: true,
          kycStatus: "approved",
          role: "admin",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
          createdAt: "2026-01-01T00:00:00Z",
          isOnline: true,
          lastSeen: new Date().toISOString()
        };
        setUsers(prev => [adminUser!, ...prev.filter(u => u.id !== "admin")]);
      } else {
        // online flag
        setUsers(prev => prev.map(u => u.id === "admin" ? { ...u, isOnline: true } : u));
      }
      setCurrentUser({ ...adminUser, isOnline: true });
      localStorage.setItem(CURRENT_USER_EMAIL_KEY, "munirpalanci21@gmail.com");
      return { success: true, message: "Yönetici girişi başarılı!" };
    }

    const matched = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!matched) {
      // Create user if not exists for easy testing, or allow users to register.
      // But we will follow normal check first, to be secure.
      return { success: false, message: "Kullanıcı bulunamadı. Lütfen kayıt olun." };
    }

    // Since mock password isn't complicated in our system, we allow match.
    // If it's a known user, we log in
    setUsers(prev => prev.map(u => u.id === matched.id ? { ...u, isOnline: true } : u));
    setCurrentUser({ ...matched, isOnline: true });
    localStorage.setItem(CURRENT_USER_EMAIL_KEY, matched.email);
    return { success: true, message: `Hoş geldiniz, ${matched.username}!` };
  };

  const register = (username: string, email: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !trimmedEmail) {
      return { success: false, message: "Lütfen tüm alanları doldurun." };
    }

    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: "Bu e-posta adresi zaten kayıtlı." };
    }

    if (users.some(u => u.username.toLowerCase() === trimmedUsername.toLowerCase())) {
      return { success: false, message: "Bu kullanıcı adı zaten alınmış." };
    }

    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      username: trimmedUsername,
      email: trimmedEmail,
      balance: 0,
      salesBalance: 0,
      isVerified: false,
      kycStatus: "none",
      role: trimmedEmail === "munirpalanci21@gmail.com" ? "admin" : "user",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedUsername)}`,
      createdAt: new Date().toISOString(),
      isOnline: true,
      lastSeen: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_EMAIL_KEY, trimmedEmail);
    return { success: true, message: "Hesabınız başarıyla oluşturuldu!" };
  };

  const logout = () => {
    if (currentUser) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, isOnline: false, lastSeen: new Date().toISOString() } : u));
    }
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
  };

  // Listings functions
  const addListing = (listingData: Omit<Listing, "id" | "sellerId" | "sellerName" | "sellerVerified" | "createdAt" | "status" | "isFeatured" | "isCarousel">) => {
    if (!currentUser) throw new Error("Giriş yapmanız gerekmektedir.");

    const id = "lst_" + Math.random().toString(36).substr(2, 9);
    const { commission, earnings } = calculateCommissionAndEarnings(listingData.price);

    const newListing: Listing = {
      ...listingData,
      id,
      commission,
      earnings,
      sellerId: currentUser.id,
      sellerName: currentUser.username,
      sellerVerified: currentUser.isVerified,
      createdAt: new Date().toISOString(),
      status: "active",
      isFeatured: false,
      isCarousel: false
    };

    setListings(prev => [newListing, ...prev]);
    return id;
  };

  const buyListing = (listingId: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: "Lütfen satın almak için giriş yapın." };

    const listing = listings.find(l => l.id === listingId);
    if (!listing) return { success: false, message: "İlan bulunamadı." };

    if (listing.status !== "active") return { success: false, message: "Bu ilan şu anda aktif değil veya satıldı." };
    if (listing.stock <= 0) return { success: false, message: "Bu ürünün stoku kalmadı." };

    if (listing.sellerId === currentUser.id) {
      return { success: false, message: "Kendi ilanınızı satın alamazsınız." };
    }

    if (currentUser.balance < listing.price) {
      return { success: false, message: `Yetersiz bakiye. Tutar: ${listing.price} TL. Bakiyeniz: ${currentUser.balance} TL. Lütfen bakiye yükleyin.` };
    }

    // Deduct user balance
    const updatedUser = { ...currentUser, balance: currentUser.balance - listing.price };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Update listing stock or status
    const newStock = listing.stock - 1;
    const isSoldOut = newStock <= 0;
    
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return {
          ...l,
          stock: newStock,
          status: isSoldOut ? "sold" as const : "active" as const
        };
      }
      return l;
    }));

    // Add revenue to Seller's sales balance
    setUsers(prev => prev.map(u => {
      if (u.id === listing.sellerId) {
        return {
          ...u,
          salesBalance: u.salesBalance + listing.earnings
        };
      }
      return u;
    }));

    // Create Order
    const randomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    const newOrder: Order = {
      id: "ord_" + Math.random().toString(36).substr(2, 9),
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      buyerId: currentUser.id,
      buyerName: currentUser.username,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      price: listing.price,
      commission: listing.commission,
      earnings: listing.earnings,
      status: "completed", // anında teslimat marketplace
      createdAt: new Date().toISOString(),
      deliveryCode: `LORZI-${randomCode}`
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send automated message from system or seller about order details
    const automatedMessage = `Merhaba! ${listing.title} ilanını başarıyla satın aldınız. Ürününüz hazır! Teslimat Kodunuz: LORZI-${randomCode}. Bizimle iletişime geçtiğiniz için teşekkür ederiz.`;
    sendMessage(listing.sellerId, listing.sellerName, automatedMessage, listing.id, listing.title, listing.images[0]);

    return { success: true, message: `Satın alma işlemi başarılı! Satıcıya mesaj gönderildi ve bakiye aktarıldı. Kod: LORZI-${randomCode}` };
  };

  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => {
      if (prev.includes(listingId)) {
        return prev.filter(id => id !== listingId);
      } else {
        return [...prev, listingId];
      }
    });
  };

  // Messaging functions
  const sendMessage = (receiverId: string, receiverName: string, content: string, listingId: string, listingTitle: string, listingImage?: string) => {
    if (!currentUser) return;

    // Chat ID generation formula (order lexicographically to avoid duplication)
    const sortedIds = [currentUser.id, receiverId].sort();
    const chatId = `chat_${sortedIds[0]}_${sortedIds[1]}`;

    // Check if chat room already exists
    const chatExists = chats.find(c => c.id === chatId);

    const messageId = "msg_" + Math.random().toString(36).substr(2, 9);
    const newMsg: ChatMessage = {
      id: messageId,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Update or Create Chat Room
    if (chatExists) {
      setChats(prev => prev.map(c => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: content,
            updatedAt: new Date().toISOString(),
            unreadCount: (c.unreadCount || 0) + 1
          };
        }
        return c;
      }));
    } else {
      const newChat: Chat = {
        id: chatId,
        buyerId: currentUser.id === sortedIds[0] ? currentUser.id : receiverId,
        buyerName: currentUser.id === sortedIds[0] ? currentUser.username : receiverName,
        sellerId: currentUser.id === sortedIds[1] ? currentUser.id : receiverId,
        sellerName: currentUser.id === sortedIds[1] ? currentUser.username : receiverName,
        listingId,
        listingTitle,
        listingImage,
        lastMessage: content,
        updatedAt: new Date().toISOString(),
        unreadCount: 1
      };
      setChats(prev => [newChat, ...prev]);
    }

    setMessages(prev => [...prev, newMsg]);
  };

  const markMessagesAsRead = (chatId: string) => {
    if (!currentUser) return;
    setMessages(prev => prev.map(m => m.chatId === chatId && m.receiverId === currentUser.id ? { ...m, read: true } : m));
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  };

  // Financial request submissions
  const submitPaymentRequest = (amount: number, receiptImage: string) => {
    if (!currentUser) return;

    const newPayment: PaymentRequest = {
      id: "pay_" + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      username: currentUser.username,
      amount,
      receiptImage,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setPayments(prev => [newPayment, ...prev]);
  };

  const submitWithdrawRequest = (amount: number, iban: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: "Giriş yapmalısınız." };
    if (!currentUser.isVerified) return { success: false, message: "Sadece kimliği doğrulanmış (Güvenli Satıcı) kullanıcılar para çekme talebi gönderebilir." };
    
    if (currentUser.salesBalance < amount) {
      return { success: false, message: `Yetersiz satış bakiyesi. Çekilebilir bakiye: ${currentUser.salesBalance} TL.` };
    }

    // Hafta içi -> 10 TL, Hafta sonu -> 15 TL işlem ücreti
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6; // Pazar veya Cumartesi
    const fee = isWeekend ? 15 : 10;
    const netAmount = amount - fee;

    if (netAmount <= 0) {
      return { success: false, message: `Girilen tutar işlem ücretinden (${fee} TL) yüksek olmalıdır.` };
    }

    // Deduct user's sales balance first (lock it for pending withdraw)
    const updatedUser = { ...currentUser, salesBalance: currentUser.salesBalance - amount };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    const newWithdraw: WithdrawRequest = {
      id: "wdr_" + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      username: currentUser.username,
      amount,
      iban,
      fee,
      netAmount,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setWithdraws(prev => [newWithdraw, ...prev]);
    return { success: true, message: "Para çekme talebiniz alındı! Yönetici onayının ardından IBAN hesabınıza aktarılacaktır." };
  };

  const submitKycRequest = (idCard: string, selfie: string, datedSelfie: string) => {
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      kycStatus: "pending",
      kycDetails: {
        idCardImage: idCard,
        selfieImage: selfie,
        datedSelfieImage: datedSelfie,
        submittedAt: new Date().toISOString()
      }
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const addReview = (orderId: string, listingId: string, sellerId: string, rating: number, comment: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: "Yorum yapmak için giriş yapmalısınız." };

    if (reviews.some(r => r.orderId === orderId)) {
      return { success: false, message: "Bu sipariş için zaten yorum yapmışsınız." };
    }

    const newReview: Review = {
      id: "rev_" + Math.random().toString(36).substr(2, 9),
      orderId,
      listingId,
      sellerId,
      buyerId: currentUser.id,
      buyerName: currentUser.username,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setReviews(prev => [newReview, ...prev]);

    // Send automated message as notification to host/seller
    const textMsg = `[SİSTEM BİLDİRİMİ] ${currentUser.username} isimli alıcı siparişiniz (${orderId.toUpperCase()}) için ${rating} yıldızlı bir yorum bıraktı! Yorum: "${comment}"`;
    sendMessage(sellerId, "Müşteri Değerlendirmesi", textMsg, listingId, "Yeni Yorum Alındı");

    return { success: true, message: "Yorumunuz ve değerlendirmeniz satıcıya başarıyla aktarıldı!" };
  };

  // Doping System
  const applyDoping = (listingId: string, dopingType: "featured" | "carousel" | "bump", price: number): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: "Giriş yapmalısınız." };

    if (currentUser.balance < price) {
      return { success: false, message: `Yetersiz bakiye. Doping ücreti: ${price} TL. Bakiyeniz: ${currentUser.balance} TL.` };
    }

    const listing = listings.find(l => l.id === listingId);
    if (!listing) return { success: false, message: "İlan bulunamadı." };

    // Update user balance
    const updatedUser = { ...currentUser, balance: currentUser.balance - price };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Apply doping to listing
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        if (dopingType === "featured") {
          return {
            ...l,
            isFeatured: true,
            dopingType: "featured" as const,
            dopingUntil: new Date(Date.now() + 3600000 * 24 * 7).toISOString() // default 7 days for convenience
          };
        } else if (dopingType === "carousel") {
          return {
            ...l,
            isCarousel: true,
            dopingType: "carousel" as const,
            dopingUntil: new Date(Date.now() + 3600000 * 24 * 3).toISOString()
          };
        } else if (dopingType === "bump") {
          return {
            ...l,
            bumpedAt: new Date().toISOString()
          };
        }
      }
      return l;
    }));

    return { success: true, message: "Doping başarıyla uygulandı! İlanınız öne çıkarıldı." };
  };

  // Admin Panel Actions
  const approvePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;

    // Update payment request status
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));

    // Credit user's loading balance
    setUsers(prev => prev.map(u => {
      if (u.id === payment.userId) {
        const updated = { ...u, balance: u.balance + payment.amount };
        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  const rejectPayment = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p));
  };

  const approveWithdraw = (id: string) => {
    setWithdraws(prev => prev.map(w => w.id === id ? { ...w, status: "approved" } : w));
    // Since salesBalance was already deducted when submitting, we don't need to deduct it again.
  };

  const rejectWithdraw = (id: string) => {
    const withdraw = withdraws.find(w => w.id === id);
    if (!withdraw) return;

    setWithdraws(prev => prev.map(w => w.id === id ? { ...w, status: "rejected" } : w));

    // Refund user's sales balance
    setUsers(prev => prev.map(u => {
      if (u.id === withdraw.userId) {
        const updated = { ...u, salesBalance: u.salesBalance + withdraw.amount };
        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  const approveKyc = (userId: string) => {
    // Approve user kyc status and make them verified
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, kycStatus: "approved" as const, isVerified: true };
        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));

    // Update their listings to show they are verified
    setListings(prev => prev.map(l => l.sellerId === userId ? { ...l, sellerVerified: true } : l));
  };

  const rejectKyc = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, kycStatus: "rejected" as const, isVerified: false };
        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        users,
        currentUser,
        listings,
        chats,
        messages,
        payments,
        withdraws,
        orders,
        favorites,
        reviews,
        login,
        register,
        logout,
        addListing,
        buyListing,
        toggleFavorite,
        sendMessage,
        submitPaymentRequest,
        submitWithdrawRequest,
        submitKycRequest,
        applyDoping,
        markMessagesAsRead,
        addReview,
        approvePayment,
        rejectPayment,
        approveWithdraw,
        rejectWithdraw,
        approveKyc,
        rejectKyc,
        deleteListing
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
