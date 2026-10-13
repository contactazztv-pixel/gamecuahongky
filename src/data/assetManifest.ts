/**
 * ASSET MANIFEST & REGISTRY
 * Quản lý tập trung ánh xạ ID món ăn, khách hàng, mô hình quầy hàng, nguyên liệu và thời tiết
 * Đảm bảo 100% tài nguyên có hình ảnh minh họa vector và cơ chế fallback an toàn.
 */

export interface AssetMeta {
  id: string;
  name: string;
  category: 'dish' | 'character' | 'shop' | 'ingredient' | 'background' | 'decoration' | 'icon';
  componentType: 'DishIllustration' | 'CharacterAvatar' | 'IngredientIcon' | 'StallIllustration' | 'Scene';
  fallbackEmoji: string;
  imageUrl?: string;
  description?: string;
}

export const ASSET_MANIFEST: Record<string, AssetMeta> = {
  // ==================== BỐI CẢNH NỀN TRƯỜNG HỌC ====================
  school_gate_morning: {
    id: 'school_gate_morning',
    name: 'Cổng Trường Buổi Sáng',
    category: 'background',
    componentType: 'Scene',
    fallbackEmoji: '🏫',
    imageUrl: '/assets/backgrounds/school_gate_morning.jpg',
    description: 'Cổng trường THPT sáng rực rỡ, hoa phượng đỏ nở rộ, học sinh áo trắng đạp xe.',
  },
  school_gate_sunset: {
    id: 'school_gate_sunset',
    name: 'Cổng Trường Giờ Tan Học Hoàng Hôn',
    category: 'background',
    componentType: 'Scene',
    fallbackEmoji: '🌇',
    imageUrl: '/assets/backgrounds/school_gate_sunset.jpg',
    description: 'Ánh nắng hoàng hôn cam ấm áp rọi xuống cổng trường giờ tan học náo nhiệt.',
  },

  // ==================== MÔ HÌNH QUẦY HÀNG ====================
  boba_tea: {
    id: 'boba_tea',
    name: 'Xe Đẩy Trà Sữa & Đồ Uống',
    category: 'shop',
    componentType: 'StallIllustration',
    fallbackEmoji: '🧋',
    imageUrl: '/assets/shops/stall_boba_tea.jpg',
    description: 'Xe đẩy inox pastel dễ thương với bạt che màu đào, máy dập nắp và bình ủ trà sữa thơm lừng.',
  },
  street_snack: {
    id: 'street_snack',
    name: 'Gánh Hàng Ăn Vặt & Mì',
    category: 'shop',
    componentType: 'StallIllustration',
    fallbackEmoji: '🍢',
    imageUrl: '/assets/shops/stall_street_snack.jpg',
    description: 'Gánh hàng ăn vặt vỉa hè với chảo chiên cá viên xèo xèo, thau trộn bánh tráng và quầy gia vị rực rỡ.',
  },
  breakfast_stall: {
    id: 'breakfast_stall',
    name: 'Quầy Ăn Sáng Bánh Mì & Xôi',
    category: 'shop',
    componentType: 'StallIllustration',
    fallbackEmoji: '🥖',
    imageUrl: '/assets/shops/stall_breakfast.jpg',
    description: 'Tủ kính gỗ ấm cúng xếp đầy ổ bánh mì vàng giòn, nồi xôi bốc khói nghi ngút và khay pate béo ngậy.',
  },

  // ==================== ICON VẬT PHẨM & TIỀN TỆ ====================
  coin_gold: {
    id: 'coin_gold',
    name: 'Đồng Xu Vàng',
    category: 'icon',
    componentType: 'IngredientIcon',
    fallbackEmoji: '🪙',
    imageUrl: '/assets/icons/coin_gold.jpg',
    description: 'Đồng xu vàng lấp lánh biểu tượng doanh thu may mắn.',
  },

  // ==================== 12 KHÁCH QUEN HỌC ĐƯỜNG ====================
  student_an_grade6: {
    id: 'student_an_grade6',
    name: 'Bé An (Lớp 6)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👧',
    imageUrl: '/assets/characters/student_an.jpg',
  },
  student_nam_grade11: {
    id: 'student_nam_grade11',
    name: 'Hoàng Nam (Lớp 11)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👦',
    imageUrl: '/assets/characters/student_nam.jpg',
  },
  student_nam_senior: {
    id: 'student_nam_senior',
    name: 'Hoàng Nam (Lớp 12)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👦',
    imageUrl: '/assets/characters/student_nam.jpg',
  },
  duo_mai_linh_grade12: {
    id: 'duo_mai_linh_grade12',
    name: 'Mai & Linh (Lớp 12)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👭',
  },
  student_mai_linh_duo: {
    id: 'student_mai_linh_duo',
    name: 'Mai & Linh (Lớp 12)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👭',
  },
  teacher_nghia_physics: {
    id: 'teacher_nghia_physics',
    name: 'Thầy Nghĩa (Vật Lý)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👨‍🏫',
  },
  teacher_nghia: {
    id: 'teacher_nghia',
    name: 'Thầy Nghĩa (Giám Thị)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👨‍🏫',
  },
  teacher_lan_literature: {
    id: 'teacher_lan_literature',
    name: 'Cô Lan (Ngữ Văn)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👩‍🏫',
  },
  security_bac_tu: {
    id: 'security_bac_tu',
    name: 'Bác Tư (Bảo Vệ)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👴',
  },
  neighbor_bac_tu: {
    id: 'neighbor_bac_tu',
    name: 'Bác Tư (Bảo Vệ)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👴',
  },
  athlete_minh_basketball: {
    id: 'athlete_minh_basketball',
    name: 'Minh (Bóng Rổ)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '🏀',
  },
  student_minh_sport: {
    id: 'student_minh_sport',
    name: 'Minh (Bóng Rổ)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '🏀',
  },
  artist_vy_arts: {
    id: 'artist_vy_arts',
    name: 'Vy (CLB Mỹ Thuật)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '🎨',
  },
  student_vy_art: {
    id: 'student_vy_art',
    name: 'Vy (CLB Mỹ Thuật)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '🎨',
  },
  parent_co_thao: {
    id: 'parent_co_thao',
    name: 'Cô Thảo (Phụ Huynh)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👩',
  },
  parent_co_lan: {
    id: 'parent_co_lan',
    name: 'Cô Lan (Phụ Huynh)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '👩',
  },
  gamer_khoa_cs: {
    id: 'gamer_khoa_cs',
    name: 'Khoa (Tin Học)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '💻',
  },
  student_khoa_nerd: {
    id: 'student_khoa_nerd',
    name: 'Khoa (Tin Học)',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '💻',
  },
  shipper_anh_ba: {
    id: 'shipper_anh_ba',
    name: 'Anh Ba Shipper',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '🛵',
  },
  dancer_kpop_crew: {
    id: 'dancer_kpop_crew',
    name: 'Nhóm Nhảy K-Pop',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '💃',
  },
  student_nhom_nhay: {
    id: 'student_nhom_nhay',
    name: 'Nhóm Nhảy K-Pop',
    category: 'character',
    componentType: 'CharacterAvatar',
    fallbackEmoji: '💃',
  },

  // ==================== CÁC MÓN ĂN CHỦ LỰC ====================
  drink_tra_sua_truyen_thong: {
    id: 'drink_tra_sua_truyen_thong',
    name: 'Trà Sữa Truyền Thống',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🧋',
    imageUrl: '/assets/foods/dish_boba_tea.jpg',
  },
  drink_tra_sua_tran_chau_duong_den: {
    id: 'drink_tra_sua_tran_chau_duong_den',
    name: 'Trà Sữa Đường Đen',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🧋',
    imageUrl: '/assets/foods/dish_boba_tea.jpg',
  },
  drink_sua_tuoi_tran_chau_duong_den: {
    id: 'drink_sua_tuoi_tran_chau_duong_den',
    name: 'Sữa Tươi Trân Châu Đường Đen',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🥛',
    imageUrl: '/assets/foods/dish_boba_tea.jpg',
  },
  drink_milo_dam_tran_chau: {
    id: 'drink_milo_dam_tran_chau',
    name: 'Milo Dầm Khổng Lồ',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍨',
    imageUrl: '/assets/foods/dish_boba_tea.jpg',
  },
  drink_tra_dao_cam_sa: {
    id: 'drink_tra_dao_cam_sa',
    name: 'Trà Đào Cam Sả',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍑',
    imageUrl: '/assets/ingredients/ingredient_cup.jpg',
  },
  drink_tra_chanh_con_duong: {
    id: 'drink_tra_chanh_con_duong',
    name: 'Trà Chanh Phố Nhỏ',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍋',
    imageUrl: '/assets/ingredients/ingredient_cup.jpg',
  },
  drink_tra_tac_mat_ong: {
    id: 'drink_tra_tac_mat_ong',
    name: 'Trà Tắc Xí Muội Mật Ong',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍯',
    imageUrl: '/assets/ingredients/ingredient_cup.jpg',
  },
  drink_tra_sua_matcha_dau_do: {
    id: 'drink_tra_sua_matcha_dau_do',
    name: 'Trà Sữa Matcha Đậu Đỏ',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍵',
    imageUrl: '/assets/foods/dish_boba_tea.jpg',
  },
  drink_tra_vai_hoa_lai: {
    id: 'drink_tra_vai_hoa_lai',
    name: 'Trà Vải Hoa Lài',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🌸',
    imageUrl: '/assets/ingredients/ingredient_cup.jpg',
  },
  snack_banh_trang_tron_dac_biet: {
    id: 'snack_banh_trang_tron_dac_biet',
    name: 'Bánh Tráng Trộn Đặc Biệt',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🥗',
    imageUrl: '/assets/foods/dish_banh_trang.jpg',
  },
  snack_banh_trang_cuon_sot_bo: {
    id: 'snack_banh_trang_cuon_sot_bo',
    name: 'Bánh Tráng Cuốn Sốt Bơ',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🌯',
    imageUrl: '/assets/foods/dish_banh_trang.jpg',
  },
  snack_banh_trang_nuong_da_lat: {
    id: 'snack_banh_trang_nuong_da_lat',
    name: 'Bánh Tráng Nướng Đà Lạt',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍕',
    imageUrl: '/assets/foods/dish_banh_trang.jpg',
  },
  snack_ca_vien_chien_mam_toi: {
    id: 'snack_ca_vien_chien_mam_toi',
    name: 'Cá Viên Chiên Mắm Tỏi',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍢',
    imageUrl: '/assets/ingredients/ingredient_sausage.jpg',
  },
  snack_khoai_tay_lac_pho_mai: {
    id: 'snack_khoai_tay_lac_pho_mai',
    name: 'Khoai Tây Lắc Phô Mai',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍟',
    imageUrl: '/assets/ingredients/ingredient_sausage.jpg',
  },
  snack_xuc_xich_loc_xoay: {
    id: 'snack_xuc_xich_loc_xoay',
    name: 'Xúc Xích Đức Lốc Xoáy',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🌭',
    imageUrl: '/assets/ingredients/ingredient_sausage.jpg',
  },
  snack_mi_cay_hai_san_kim_chi: {
    id: 'snack_mi_cay_hai_san_kim_chi',
    name: 'Mì Cay Hàn Quốc 7 Cấp Độ',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍜',
    imageUrl: '/assets/ingredients/ingredient_noodles.jpg',
  },
  snack_mi_tron_top_mo_trung_long_dao: {
    id: 'snack_mi_tron_top_mo_trung_long_dao',
    name: 'Mì Trộn Tóp Mỡ Trứng Lòng Đào',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍜',
    imageUrl: '/assets/ingredients/ingredient_noodles.jpg',
  },
  breakfast_banh_mi_pate_cha_lua: {
    id: 'breakfast_banh_mi_pate_cha_lua',
    name: 'Bánh Mì Pate Chả Lụa',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🥖',
    imageUrl: '/assets/foods/dish_banh_mi.jpg',
  },
  breakfast_banh_mi_trung_op_la: {
    id: 'breakfast_banh_mi_trung_op_la',
    name: 'Bánh Mì Trứng Ốp La',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍳',
    imageUrl: '/assets/foods/dish_banh_mi.jpg',
  },
  breakfast_banh_mi_que_hai_phong: {
    id: 'breakfast_banh_mi_que_hai_phong',
    name: 'Bánh Mì Que Hải Phòng',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🥖',
    imageUrl: '/assets/foods/dish_banh_mi.jpg',
  },
  breakfast_banh_mi_xiu_mai_da_lat: {
    id: 'breakfast_banh_mi_xiu_mai_da_lat',
    name: 'Bánh Mì Xíu Mại Đà Lạt',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🥖',
    imageUrl: '/assets/foods/dish_banh_mi.jpg',
  },
  breakfast_banh_mi_thit_nuong: {
    id: 'breakfast_banh_mi_thit_nuong',
    name: 'Bánh Mì Thịt Nướng Sả',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🥖',
    imageUrl: '/assets/foods/dish_banh_mi.jpg',
  },
  breakfast_xoi_bap_hanh_phi: {
    id: 'breakfast_xoi_bap_hanh_phi',
    name: 'Xôi Bắp Nếp Hành Phi',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍙',
    imageUrl: '/assets/ingredients/ingredient_sugar.jpg',
  },
  breakfast_com_ga_xoi_mo: {
    id: 'breakfast_com_ga_xoi_mo',
    name: 'Cơm Gà Xối Mỡ Da Giòn',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍗',
    imageUrl: '/assets/ingredients/ingredient_beef.jpg',
  },
  breakfast_xoi_man_thap_cam: {
    id: 'breakfast_xoi_man_thap_cam',
    name: 'Xôi Mặn Thập Cẩm',
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍱',
    imageUrl: '/assets/ingredients/ingredient_beef.jpg',
  },
};

/**
 * Lấy metadata asset theo ID với cơ chế fallback thông minh
 */
export function getAssetMeta(id: string): AssetMeta {
  if (ASSET_MANIFEST[id]) {
    return ASSET_MANIFEST[id];
  }

  // Fallback an toàn
  return {
    id,
    name: id,
    category: 'dish',
    componentType: 'DishIllustration',
    fallbackEmoji: '🍲',
    description: 'Món quà vặt học đường ngon miệng',
  };
}

/**
 * Lấy đường dẫn ảnh thực tế cho món ăn nếu có
 */
export function getDishImageUrl(dishId: string): string | undefined {
  return ASSET_MANIFEST[dishId]?.imageUrl;
}

/**
 * Lấy đường dẫn ảnh chân dung cho nhân vật nếu có
 */
export function getCharacterImageUrl(characterId: string): string | undefined {
  return ASSET_MANIFEST[characterId]?.imageUrl;
}

/**
 * Lấy đường dẫn ảnh quầy hàng cho mô hình nếu có
 */
export function getShopImageUrl(shopId: string): string | undefined {
  return ASSET_MANIFEST[shopId]?.imageUrl;
}
