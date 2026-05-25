export interface Category {
  id: string;
  name: string;
  subcategories: string[];
  isDisabled?: boolean; // VP, UC vb. Epin ve Top-Up kategorileri
  iconName: string; // Lucide icon name or alias
  gameCode: string;
  bgImage?: string; // High-quality actual game background representation URL
  itemCount?: string; // Mock visual density counter
  badgeText?: string; // "Popüler", "Sıcak", "Anında"
  glowColor?: string; // Tailored neon glows for ItemSatis visual fidelity
  brandGradient?: string; // Tailwind styling relative to game brands
}

export const CATEGORIES: Category[] = [
  {
    id: "valorant",
    name: "Valorant",
    gameCode: "VAL",
    iconName: "Shield",
    subcategories: ["Hesap", "Random Hesap", "Unranked Hesap", "Boost", "Skin"],
    bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    itemCount: "1,480 Aktif İlan",
    badgeText: "EN SEÇKİN REKABETÇİ",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(110,68,255,0.45)]",
    brandGradient: "from-purple-600/20 to-indigo-950/40"
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    gameCode: "PUBG",
    iconName: "Target",
    subcategories: ["Hesap", "Random Hesap", "Royale Pass"],
    bgImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    itemCount: "820 Aktif İlan",
    badgeText: "%100 GÜVENLİ TİCARET",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(244,114,182,0.45)]",
    brandGradient: "from-amber-600/20 to-red-950/40"
  },
  {
    id: "cs2",
    name: "CS2",
    gameCode: "CS2",
    iconName: "Sword",
    subcategories: ["Skin", "Knife", "Hesap", "Prime Hesap"],
    bgImage: "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=600&auto=format&fit=crop",
    itemCount: "2,150 Aktif İlan",
    badgeText: "VİTRİN BIÇAK PAZARI",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(249,115,22,0.45)]",
    brandGradient: "from-orange-600/20 to-slate-950/40"
  },
  {
    id: "lol",
    name: "League of Legends",
    gameCode: "LOL",
    iconName: "Sparkles",
    subcategories: ["LoL Hesap", "LoL Boost", "Random Hesap"],
    bgImage: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop",
    itemCount: "940 Aktif İlan",
    badgeText: "OTOMATİK TESLİMAT",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(14,165,233,0.45)]",
    brandGradient: "from-sky-600/20 to-blue-950/40"
  },
  {
    id: "mlbb",
    name: "Mobile Legends",
    gameCode: "MLBB",
    iconName: "Swords",
    subcategories: ["Hesap", "Boost"],
    bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    itemCount: "310 Aktif İlan",
    badgeText: "PREMİUM BOOST",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(234,179,8,0.45)]",
    brandGradient: "from-yellow-600/20 to-amber-950/40"
  },
  {
    id: "roblox",
    name: "Roblox",
    gameCode: "RBLX",
    iconName: "Grid",
    subcategories: ["Hesap", "Limited Item"],
    bgImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    itemCount: "670 Aktif İlan",
    badgeText: "DÜŞÜK KOMİSYON",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(34,197,94,0.45)]",
    brandGradient: "from-emerald-600/20 to-stone-950/40"
  },
  {
    id: "steam",
    name: "Steam",
    gameCode: "STEAM",
    iconName: "Gamepad",
    subcategories: ["Hesap", "Random Key", "Steam Gift"],
    bgImage: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=600&auto=format&fit=crop",
    itemCount: "1,120 Aktif İlan",
    badgeText: "%100 ANINDA KOD",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(59,130,246,0.45)]",
    brandGradient: "from-indigo-600/20 to-[#0A0E17]/50"
  },
  {
    id: "instagram",
    name: "Instagram",
    gameCode: "IG",
    iconName: "Instagram",
    subcategories: ["Hesap", "Takipçi", "Beğeni", "İzlenme"],
    bgImage: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop",
    itemCount: "2,450 Aktif İlan",
    badgeText: "INSTAGRAM GRADIENT",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(236,72,153,0.45)]",
    brandGradient: "from-pink-600/20 to-rose-950/40"
  },
  {
    id: "tiktok",
    name: "TikTok",
    gameCode: "TT",
    iconName: "Music",
    subcategories: ["Hesap", "Takipçi", "Beğeni", "İzlenme"],
    bgImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
    itemCount: "1,530 Aktif İlan",
    badgeText: "TÜRK ORGANİK",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(14,228,230,0.45)]",
    brandGradient: "from-cyan-600/20 to-red-950/40"
  },
  {
    id: "discord",
    name: "Discord",
    gameCode: "DC",
    iconName: "MessageCircle",
    subcategories: ["Sunucu", "Üye Çekimi", "Boost", "Token"],
    bgImage: "https://images.unsplash.com/photo-1611162616305-c6574679118a?q=80&w=600&auto=format&fit=crop",
    itemCount: "430 Aktif İlan",
    badgeText: "DISCORD BLUR",
    glowColor: "group-hover:shadow-[0_0_25px_rgba(99,102,241,0.45)]",
    brandGradient: "from-indigo-600/35 to-slate-950/40"
  },
  // KAPALI KATEGORİLER (EPIN / TOP-UP)
  {
    id: "val_vp",
    name: "Valorant VP",
    gameCode: "VAL_VP",
    iconName: "Coins",
    subcategories: ["115 VP", "485 VP", "925 VP", "1850 VP", "3400 VP", "7400 VP"],
    isDisabled: true
  },
  {
    id: "pubg_uc",
    name: "PUBG Mobile UC",
    gameCode: "PUBG_UC",
    iconName: "Coins",
    subcategories: ["60 UC", "325 UC", "660 UC", "1800 UC", "3850 UC", "8100 UC"],
    isDisabled: true
  },
  {
    id: "roblox_robux",
    name: "Robux",
    gameCode: "RBLX_RBX",
    iconName: "Gem",
    subcategories: ["400 Robux", "800 Robux", "1700 Robux", "4500 Robux", "10000 Robux"],
    isDisabled: true
  },
  {
    id: "lol_rp",
    name: "LoL RP",
    gameCode: "LOL_RP",
    iconName: "Crown",
    subcategories: ["200 RP", "575 RP", "1380 RP", "2850 RP", "5250 RP", "10000 RP"],
    isDisabled: true
  },
  {
    id: "mlbb_diamond",
    name: "Mobile Legends Elmas",
    gameCode: "MLBB_DM",
    iconName: "Gem",
    subcategories: ["50 Elmas", "250 Elmas", "500 Elmas", "1000 Elmas", "2500 Elmas"],
    isDisabled: true
  },
  {
    id: "steam_wallet",
    name: "Steam Cüzdan Kodu",
    gameCode: "STEAM_WL",
    iconName: "Wallet",
    subcategories: ["50 TL Cüzdan", "100 TL Cüzdan", "250 TL Cüzdan", "500 TL Cüzdan", "1000 TL Cüzdan"],
    isDisabled: true
  },
  {
    id: "discord_nitro",
    name: "Discord Nitro",
    gameCode: "DC_NITRO",
    iconName: "Zap",
    subcategories: ["Nitro Classic", "Nitro Boost", "1 Aylık Nitro", "1 Yıllık Nitro"],
    isDisabled: true
  },
  {
    id: "netflix_premium",
    name: "Netflix Premium",
    gameCode: "NFLX_PREM",
    iconName: "Tv",
    subcategories: ["1 Aylık Tanımlama", "Ortak Hesap", "Özel Profil"],
    isDisabled: true
  },
  {
    id: "spotify_premium",
    name: "Spotify Premium",
    gameCode: "SPTF_PREM",
    iconName: "Music",
    subcategories: ["1 Aylık Bireysel", "3 Aylık Bireysel", "Aile Planı Davet"],
    isDisabled: true
  }
];
