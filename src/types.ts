export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  salesBalance: number;
  isVerified: boolean; // KYC onaylı / Güvenilir Satıcı
  kycStatus: "none" | "pending" | "approved" | "rejected";
  kycDetails?: {
    idCardImage: string;
    selfieImage: string;
    datedSelfieImage: string;
    submittedAt: string;
  };
  role: "admin" | "user";
  avatar: string;
  createdAt: string;
  isOnline: boolean;
  lastSeen: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  commission: number;
  earnings: number;
  category: string;
  subcategory: string;
  images: string[]; // Base64 strings representing uploaded images
  stock: number;
  deliveryTime: string; // e.g. "Anında Teslim", "2 Saat", "24 Saat"
  sellerId: string;
  sellerName: string;
  sellerVerified: boolean;
  isFeatured: boolean; // Doping: Öne Çıkan @ 1, 3, 7 gün
  isCarousel: boolean; // Doping: Vitrin İlanı
  bumpedAt?: string; // Doping: Yukarı Taşı
  createdAt: string;
  status: "active" | "sold" | "pending_doping" | "inactive";
  dopingType?: "none" | "featured" | "carousel";
  dopingUntil?: string;
  disabledCategory?: boolean; // Epin/Top-up gibi yakında satışı başlayacak olanlar için
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Chat {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount?: number;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  receiptImage: string; // Base64 dekont görseli
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  iban: string;
  fee: number;
  netAmount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  price: number;
  commission: number;
  earnings: number;
  status: "processing" | "completed" | "canceled";
  createdAt: string;
  deliveryCode: string;
}

export interface Review {
  id: string;
  orderId: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppState {
  users: User[];
  currentUser: User | null;
  listings: Listing[];
  chats: Chat[];
  messages: ChatMessage[];
  payments: PaymentRequest[];
  withdraws: WithdrawRequest[];
  orders: Order[];
  favorites: string[]; // Listing IDs
}
