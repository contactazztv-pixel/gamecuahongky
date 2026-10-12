/**
 * HỆ THỐNG CÔNG THỨC NẤU ĂN VÀ PHA CHẾ TẬP TRUNG
 * Quản lý công thức, nguyên liệu và các bước chế biến từng món cho game Tiệm Nhỏ Trước Cổng Trường
 */

import { RecipeRequirement } from '../types';

export interface CookingStepDef {
  stepIndex: number;
  title: string;
  instruction: string;
  actionLabel: string;
  ingredientId?: string;
  visualEffect?: 'pour' | 'stir' | 'boil' | 'fry' | 'pack' | 'garnish';
}

export interface DishRecipe {
  dishId: string;
  dishName: string;
  category: 'Đồ uống' | 'Ăn vặt' | 'Món no';
  businessModel: 'boba_tea' | 'street_snack' | 'breakfast_stall' | 'all';
  description: string;
  basePrice: number;
  baseCost: number;
  prepTimeSec: number;
  ingredients: RecipeRequirement[];
  steps: CookingStepDef[];
}

export const DISH_RECIPES: Record<string, DishRecipe> = {
  // ==================== NHÓM 1: ĐỒ UỐNG & TRÀ SỮA (BOBA TEA) ====================
  drink_tra_sua_truyen_thong: {
    dishId: 'drink_tra_sua_truyen_thong',
    dishName: 'Trà Sữa Truyền Thống',
    category: 'Đồ uống',
    businessModel: 'boba_tea',
    description: 'Trà đen ủ thơm ngát quyện sữa đặc béo ngọt, thêm trân châu đường đen dai dẻo.',
    basePrice: 15000,
    baseCost: 5500,
    prepTimeSec: 4,
    ingredients: [
      { ingredientId: 'tra_den', amount: 1 },
      { ingredientId: 'sua_dac', amount: 1 },
      { ingredientId: 'tran_chau_den', amount: 1 },
      { ingredientId: 'ly_ong_hut', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Ủ cốt trà thơm',
        instruction: 'Cho nước cốt trà đen vào bình lắc shaker',
        actionLabel: 'Rót cốt trà vào bình',
        ingredientId: 'tra_den',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Hòa quyện sữa béo',
        instruction: 'Thêm sữa đặc và khuấy tan đều',
        actionLabel: 'Thêm sữa & khuấy đều',
        ingredientId: 'sua_dac',
        visualEffect: 'stir',
      },
      {
        stepIndex: 3,
        title: 'Múc trân châu đường đen',
        instruction: 'Cho muỗng trân châu dẻo dai óng ánh mật mía vào đáy ly',
        actionLabel: 'Thêm trân châu đường đen',
        ingredientId: 'tran_chau_den',
        visualEffect: 'pour',
      },
      {
        stepIndex: 4,
        title: 'Đóng nắp & hoàn thành',
        instruction: 'Rót trà sữa vào ly nhựa, đậy nắp và cắm ống hút to',
        actionLabel: 'Đóng nắp & hoàn thành ly',
        ingredientId: 'ly_ong_hut',
        visualEffect: 'pack',
      },
    ],
  },

  drink_tra_dao_cam_sa: {
    dishId: 'drink_tra_dao_cam_sa',
    dishName: 'Trà Đào Cam Sả',
    category: 'Đồ uống',
    businessModel: 'boba_tea',
    description: 'Hương sả thanh khiết kết hợp vị cam vàng chua thanh và miếng đào ngâm giòn sựt.',
    basePrice: 18000,
    baseCost: 7000,
    prepTimeSec: 4,
    ingredients: [
      { ingredientId: 'tra_den', amount: 1 },
      { ingredientId: 'dao_ngam', amount: 1 },
      { ingredientId: 'chanh_tuoi_tac', amount: 1 },
      { ingredientId: 'ly_ong_hut', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Rót cốt trà thanh mát',
        instruction: 'Cho nước trà đen thơm dịu hương sả vào ly đá',
        actionLabel: 'Cho cốt trà sả',
        ingredientId: 'tra_den',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Vắt cam tắc tươi',
        instruction: 'Vắt nước cốt cam tươi tạo vị chua ngọt hài hòa',
        actionLabel: 'Vắt nước cam tắc',
        ingredientId: 'chanh_tuoi_tac',
        visualEffect: 'stir',
      },
      {
        stepIndex: 3,
        title: 'Gắp miếng đào giòn',
        instruction: 'Thêm những lát đào vàng ươm giòn rụm thơm lừng',
        actionLabel: 'Thêm miếng đào ngâm giòn',
        ingredientId: 'dao_ngam',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 4,
        title: 'Đóng ly hoàn tất',
        instruction: 'Đậy nắp ly nhựa và cắm ống hút phục vụ khách',
        actionLabel: 'Đóng ly hoàn tất',
        ingredientId: 'ly_ong_hut',
        visualEffect: 'pack',
      },
    ],
  },

  drink_milo_dam_tran_chau: {
    dishId: 'drink_milo_dam_tran_chau',
    dishName: 'Milo Dầm Khổng Lồ',
    category: 'Đồ uống',
    businessModel: 'boba_tea',
    description: 'Bột cacao milo đắng nhẹ rắc ngập tràn trên lớp sữa đá tuyết và trân châu mật mía.',
    basePrice: 20000,
    baseCost: 8000,
    prepTimeSec: 4,
    ingredients: [
      { ingredientId: 'bot_milo', amount: 1 },
      { ingredientId: 'sua_dac', amount: 1 },
      { ingredientId: 'tran_chau_den', amount: 1 },
      { ingredientId: 'ly_ong_hut', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Đáy trân châu dẻo',
        instruction: 'Múc lớp trân châu dẻo thơm ngập đáy ly',
        actionLabel: 'Cho trân châu vào ly',
        ingredientId: 'tran_chau_den',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Rót sữa đặc đá tuyết',
        instruction: 'Rót sữa đặc béo ngậy cùng đá bào mát lạnh',
        actionLabel: 'Thêm sữa đặc béo ngậy',
        ingredientId: 'sua_dac',
        visualEffect: 'stir',
      },
      {
        stepIndex: 3,
        title: 'Phủ bột Milo thơm nức',
        instruction: 'Rắc ngập tràn bột milo nguyên chất đậm đà',
        actionLabel: 'Rắc bột Milo ngập tràn',
        ingredientId: 'bot_milo',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 4,
        title: 'Hoàn thành ly Milo',
        instruction: 'Cắm ống hút to kèm muỗng múc topping',
        actionLabel: 'Hoàn thành & giao khách',
        ingredientId: 'ly_ong_hut',
        visualEffect: 'pack',
      },
    ],
  },

  drink_tra_chanh_con_duong: {
    dishId: 'drink_tra_chanh_con_duong',
    dishName: 'Trà Chanh Phố Nhỏ',
    category: 'Đồ uống',
    businessModel: 'boba_tea',
    description: 'Hương trà lài thơm ngát kết hợp nước cốt chanh tươi mát lạnh, giải nhiệt ngày hè cực đỉnh.',
    basePrice: 12000,
    baseCost: 4000,
    prepTimeSec: 3,
    ingredients: [
      { ingredientId: 'tra_lai', amount: 1 },
      { ingredientId: 'chanh_tuoi_tac', amount: 1 },
      { ingredientId: 'ly_ong_hut', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Rót trà lài thơm mát',
        instruction: 'Rót nước cốt trà hoa lài thanh khiết vào ly đá',
        actionLabel: 'Rót trà lài vào ly',
        ingredientId: 'tra_lai',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Vắt chanh tươi & khuấy',
        instruction: 'Vắt chanh tươi chua dịu và khuấy đều cùng đường cát',
        actionLabel: 'Vắt chanh tươi mát',
        ingredientId: 'chanh_tuoi_tac',
        visualEffect: 'stir',
      },
      {
        stepIndex: 3,
        title: 'Đóng ly hoàn tất',
        instruction: 'Đậy nắp ly và cắm ống hút hoàn thành ly trà',
        actionLabel: 'Đóng nắp ly phục vụ',
        ingredientId: 'ly_ong_hut',
        visualEffect: 'pack',
      },
    ],
  },

  // ==================== NHÓM 2: ĂN VẶT & MÌ CAY (STREET SNACK) ====================
  snack_banh_trang_tron_dac_biet: {
    dishId: 'snack_banh_trang_tron_dac_biet',
    dishName: 'Bánh Tráng Trộn Đặc Biệt',
    category: 'Ăn vặt',
    businessModel: 'street_snack',
    description: 'Bánh tráng sợi dẻo dai trộn sa tế tôm, bò khô, xoài chua, trứng cút và rau răm thơm lừng.',
    basePrice: 20000,
    baseCost: 7500,
    prepTimeSec: 4,
    ingredients: [
      { ingredientId: 'banh_trang_soi', amount: 1 },
      { ingredientId: 'bo_kho_xe', amount: 1 },
      { ingredientId: 'trung_cut', amount: 1 },
      { ingredientId: 'sa_te_tom', amount: 1 },
      { ingredientId: 'hop_giay_hop_nhua', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Cho bánh tráng sợi',
        instruction: 'Cho bánh tráng cắt sợi dẻo dai vào thau trộn inox',
        actionLabel: 'Cho bánh tráng vào thau',
        ingredientId: 'banh_trang_soi',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Trộn đều sốt sa tế tôm',
        instruction: 'Thêm sa tế tôm cay nồng, muối tôm và nước tắc chua ngọt',
        actionLabel: 'Thêm sốt sa tế & trộn đều',
        ingredientId: 'sa_te_tom',
        visualEffect: 'stir',
      },
      {
        stepIndex: 3,
        title: 'Thêm bò khô & trứng cút',
        instruction: 'Cho bò khô xé sợi cay cay, trứng cút bùi béo và rau răm',
        actionLabel: 'Thêm bò khô & trứng cút',
        ingredientId: 'bo_kho_xe',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 4,
        title: 'Đơm ra đĩa / đóng hộp',
        instruction: 'Cho bánh tráng trộn ra hộp kèm đôi đũa tre cho khách',
        actionLabel: 'Đóng hộp bánh tráng',
        ingredientId: 'hop_giay_hop_nhua',
        visualEffect: 'pack',
      },
    ],
  },

  snack_ca_vien_chien_nuoc_mam: {
    dishId: 'snack_ca_vien_chien_nuoc_mam',
    dishName: 'Cá Viên Chiên Nước Mắm',
    category: 'Ăn vặt',
    businessModel: 'street_snack',
    description: 'Cá viên, bò viên, tôm viên chiên phồng xóc nước mắm tỏi ớt kẹo sệt thơm nức vỉa hè.',
    basePrice: 25000,
    baseCost: 9500,
    prepTimeSec: 5,
    ingredients: [
      { ingredientId: 'ca_vien', amount: 1 },
      { ingredientId: 'dau_an', amount: 1 },
      { ingredientId: 'tuong_ot_tuong_den', amount: 1 },
      { ingredientId: 'hop_giay_hop_nhua', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Chiên cá viên ngập dầu',
        instruction: 'Cho xiên cá viên vào chảo dầu nóng chiên vàng phồng giòn',
        actionLabel: 'Thả cá viên vào chảo chiên',
        ingredientId: 'ca_vien',
        visualEffect: 'fry',
      },
      {
        stepIndex: 2,
        title: 'Đảo đều nước mắm tỏi ớt',
        instruction: 'Xóc sốt nước mắm tỏi ớt keo lại bám đều quanh từng viên chiên',
        actionLabel: 'Xóc sốt nước mắm thơm lừng',
        ingredientId: 'tuong_ot_tuong_den',
        visualEffect: 'stir',
      },
      {
        stepIndex: 3,
        title: 'Gắp ra mẹt kèm tương ớt',
        instruction: 'Cho viên chiên nóng hổi ra hộp kèm dưa leo và que xiên tre',
        actionLabel: 'Đóng hộp xiên que giòn rụm',
        ingredientId: 'hop_giay_hop_nhua',
        visualEffect: 'pack',
      },
    ],
  },

  snack_mi_cay_mini_cap_2: {
    dishId: 'snack_mi_cay_mini_cap_2',
    dishName: 'Mì Cay Hàn Quốc Cấp 2',
    category: 'Ăn vặt',
    businessModel: 'street_snack',
    description: 'Thố mì cay nước dùng kim chi cay nồng đậm đà, kèm xúc xích nướng và rau củ giòn ngọt.',
    basePrice: 28000,
    baseCost: 11000,
    prepTimeSec: 5,
    ingredients: [
      { ingredientId: 'mi_goi_han_quoc', amount: 1 },
      { ingredientId: 'xuc_xich_duc', amount: 1 },
      { ingredientId: 'sa_te_tom', amount: 1 },
      { ingredientId: 'hop_giay_hop_nhua', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Nấu sôi nước dùng kim chi',
        instruction: 'Đun sôi nước lèo đậm đà cay nồng trong thố đất',
        actionLabel: 'Đun sôi nước lèo kim chi',
        ingredientId: 'sa_te_tom',
        visualEffect: 'boil',
      },
      {
        stepIndex: 2,
        title: 'Thả vắt mì sợi to',
        instruction: 'Thả sợi mì dai vàng óng vào thố nấu chín tới',
        actionLabel: 'Thả mì gói vào nấu chín',
        ingredientId: 'mi_goi_han_quoc',
        visualEffect: 'boil',
      },
      {
        stepIndex: 3,
        title: 'Thêm topping xúc xích',
        instruction: 'Xếp xúc xích khía lát và rau cải kim chi lên trên',
        actionLabel: 'Thêm xúc xích & kim chi',
        ingredientId: 'xuc_xich_duc',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 4,
        title: 'Nhấc thố mì nóng hổi',
        instruction: 'Bưng thố mì bốc khói nghi ngút sẵn sàng phục vụ',
        actionLabel: 'Hoàn thành thố mì cay',
        ingredientId: 'hop_giay_hop_nhua',
        visualEffect: 'pack',
      },
    ],
  },

  // ==================== NHÓM 3: BỮA SÁNG & MÓN NO (BREAKFAST STALL) ====================
  breakfast_banh_mi_pate_cha_lua: {
    dishId: 'breakfast_banh_mi_pate_cha_lua',
    dishName: 'Bánh Mì Pate Chả Lụa',
    category: 'Món no',
    businessModel: 'breakfast_stall',
    description: 'Bánh mì nướng giòn rụm quẹt pate gan béo ngậy, chả lụa thơm lừng, dưa leo và nước sốt đậm đà.',
    basePrice: 18000,
    baseCost: 6500,
    prepTimeSec: 3,
    ingredients: [
      { ingredientId: 'banh_mi_o', amount: 1 },
      { ingredientId: 'pate_gan', amount: 1 },
      { ingredientId: 'cha_lua', amount: 1 },
      { ingredientId: 'rau_dua_leo', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Xẻ ổ bánh mì giòn rụm',
        instruction: 'Lấy ổ bánh mì nóng giòn và rạch một đường giữa thân bánh',
        actionLabel: 'Rạch bánh mì nóng giòn',
        ingredientId: 'banh_mi_o',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Quẹt lớp pate béo ngậy',
        instruction: 'Quẹt một lớp pate gan heo thơm nức mũi dọc lòng bánh',
        actionLabel: 'Quẹt pate gan béo ngậy',
        ingredientId: 'pate_gan',
        visualEffect: 'stir',
      },
      {
        stepIndex: 3,
        title: 'Kẹp chả lụa thái mỏng',
        instruction: 'Xếp những lát chả lụa truyền thống thơm phức vào bánh',
        actionLabel: 'Thêm chả lụa thơm lừng',
        ingredientId: 'cha_lua',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 4,
        title: 'Thêm rau dưa & rưới sốt',
        instruction: 'Cho dưa leo giòn, rau mùi và rưới nước sốt đậm đà',
        actionLabel: 'Thêm dưa leo sốt & gói giấy',
        ingredientId: 'rau_dua_leo',
        visualEffect: 'pack',
      },
    ],
  },

  breakfast_banh_mi_trung_op_la: {
    dishId: 'breakfast_banh_mi_trung_op_la',
    dishName: 'Bánh Mì Trứng Ốp La',
    category: 'Món no',
    businessModel: 'breakfast_stall',
    description: 'Trứng gà ốp la lòng đào chảy béo thơm, kẹp bánh mì giòn tan ăn sáng cực đã.',
    basePrice: 15000,
    baseCost: 5000,
    prepTimeSec: 3,
    ingredients: [
      { ingredientId: 'banh_mi_o', amount: 1 },
      { ingredientId: 'trung_ga', amount: 1 },
      { ingredientId: 'rau_dua_leo', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Chiên trứng ốp la lòng đào',
        instruction: 'Đập trứng gà vào chảo chiên lòng đào thơm béo xèo xèo',
        actionLabel: 'Chiên trứng ốp la lòng đào',
        ingredientId: 'trung_ga',
        visualEffect: 'fry',
      },
      {
        stepIndex: 2,
        title: 'Kẹp trứng vào bánh mì',
        instruction: 'Cho trứng ốp la nóng hổi vào ổ bánh mì vàng giòn',
        actionLabel: 'Kẹp trứng vào bánh mì',
        ingredientId: 'banh_mi_o',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 3,
        title: 'Thêm dưa leo sốt xì dầu',
        instruction: 'Rắc tiêu, rưới nước tương thơm và kẹp dưa leo tươi',
        actionLabel: 'Rưới sốt & gói bánh mì',
        ingredientId: 'rau_dua_leo',
        visualEffect: 'pack',
      },
    ],
  },

  breakfast_xoi_bap_dau_phong: {
    dishId: 'breakfast_xoi_bap_dau_phong',
    dishName: 'Xôi Bắp Đậu Phộng',
    category: 'Món no',
    businessModel: 'breakfast_stall',
    description: 'Gói xôi bắp dẻo thơm rắc đậu phộng rang giòn, mè rang và dừa nạo ngọt bùi.',
    basePrice: 15000,
    baseCost: 5000,
    prepTimeSec: 3,
    ingredients: [
      { ingredientId: 'gao_nep_thom', amount: 1 },
      { ingredientId: 'cha_lua', amount: 1 },
      { ingredientId: 'rau_dua_leo', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Múc xôi nóng bốc khói',
        instruction: 'Mở xửng hấp múc xôi nếp bắp dẻo thơm ra lá chuối',
        actionLabel: 'Múc xôi dẻo ra lá chuối',
        ingredientId: 'gao_nep_thom',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Rắc đậu phộng hành phi',
        instruction: 'Rắc đậu phộng rang muối đường bùi béo và hành phi giòn',
        actionLabel: 'Rắc đậu phộng & chả lụa',
        ingredientId: 'cha_lua',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 3,
        title: 'Gói lá chuối ấm nóng',
        instruction: 'Gói trọn phần xôi trong lá chuối xanh thơm phức',
        actionLabel: 'Gói lá chuối trao khách',
        ingredientId: 'rau_dua_leo',
        visualEffect: 'pack',
      },
    ],
  },

  // 11. Sữa Tươi Trân Châu Đường Đen
  drink_sua_tuoi_duong_den: {
    dishId: 'drink_sua_tuoi_duong_den',
    dishName: 'Sữa Tươi Trân Châu Đường Đen',
    category: 'Đồ uống',
    businessModel: 'boba_tea',
    description: 'Vệt đường đen sóng sánh quanh thành ly, sữa tươi thơm béo và trân châu nấu nóng mềm.',
    basePrice: 25000,
    baseCost: 9000,
    prepTimeSec: 5,
    ingredients: [
      { ingredientId: 'sua_tuoi', amount: 1 },
      { ingredientId: 'tran_chau_den', amount: 2 },
      { ingredientId: 'ly_ong_hut', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Đảo trân châu đường đen',
        instruction: 'Múc trân châu ấm nóng miết quanh thành ly tạo hoa văn hổ vằn',
        actionLabel: 'Miết trân châu đường đen',
        ingredientId: 'tran_chau_den',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Rót sữa tươi thanh trùng',
        instruction: 'Rót sữa tươi mát lạnh nguyên chất ngập tràn ly',
        actionLabel: 'Rót sữa tươi thanh trùng',
        ingredientId: 'sua_tuoi',
        visualEffect: 'pour',
      },
      {
        stepIndex: 3,
        title: 'Đóng nắp & hoàn tất',
        instruction: 'Đậy nắp vòm, dán sticker quán và trao khách',
        actionLabel: 'Đậy nắp ly hoàn tất',
        ingredientId: 'ly_ong_hut',
        visualEffect: 'pack',
      },
    ],
  },

  // 12. Trà Tắc Xí Muội Mật Ong
  drink_tra_tac_mat_ong: {
    dishId: 'drink_tra_tac_mat_ong',
    dishName: 'Trà Tắc Xí Muội Mật Ong',
    category: 'Đồ uống',
    businessModel: 'boba_tea',
    description: 'Vị tắc thơm nồng hòa quyện xí muội mằn mặn và mật ong dịu ngọt ngào.',
    basePrice: 14000,
    baseCost: 4800,
    prepTimeSec: 3,
    ingredients: [
      { ingredientId: 'tra_lai', amount: 1 },
      { ingredientId: 'chanh_tuoi_tac', amount: 1 },
      { ingredientId: 'sua_dac', amount: 1 },
      { ingredientId: 'ly_ong_hut', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Vắt tắc tươi mọng nước',
        instruction: 'Vắt nước cốt tắc tươi vào bình lắc trà lài',
        actionLabel: 'Vắt nước cốt tắc thơm',
        ingredientId: 'chanh_tuoi_tac',
        visualEffect: 'pour',
      },
      {
        stepIndex: 2,
        title: 'Hòa mật ong & cốt trà',
        instruction: 'Thêm mật ong ngọt dịu và trà lài thơm mát rồi lắc đều',
        actionLabel: 'Lắc đều cốt trà lài',
        ingredientId: 'tra_lai',
        visualEffect: 'stir',
      },
      {
        stepIndex: 3,
        title: 'Rót ly & cắm ống hút',
        instruction: 'Đổ ra ly nhựa đầy đá mát lạnh, đóng nắp cắm ống hút',
        actionLabel: 'Đóng nắp ly phục vụ',
        ingredientId: 'ly_ong_hut',
        visualEffect: 'pack',
      },
    ],
  },

  // 13. Nem Chua Rán Hà Nội
  snack_nem_chua_ran_ha_noi: {
    dishId: 'snack_nem_chua_ran_ha_noi',
    dishName: 'Nem Chua Rán Hà Nội',
    category: 'Ăn vặt',
    businessModel: 'street_snack',
    description: 'Nem chua tẩm bột chiên xù vàng rộm, dẻo dai bên trong béo bùi bên ngoài.',
    basePrice: 20000,
    baseCost: 7500,
    prepTimeSec: 4,
    ingredients: [
      { ingredientId: 'nem_chua_song', amount: 1 },
      { ingredientId: 'tuong_ot_mayo', amount: 1 },
      { ingredientId: 'que_xiên_hop_giay', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Lăn bột xù giòn tan',
        instruction: 'Lăn từng thanh nem qua lớp bột chiên xù vàng ươm',
        actionLabel: 'Lăn bột chiên xù',
        ingredientId: 'nem_chua_song',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 2,
        title: 'Chiên ngập dầu nóng giòn',
        instruction: 'Thả nem vào chảo dầu sôi sùng sục đến khi vàng ruộm',
        actionLabel: 'Chiên vàng ngập dầu',
        visualEffect: 'fry',
      },
      {
        stepIndex: 3,
        title: 'Rưới tương ớt & đóng hộp',
        instruction: 'Vớt ra hộp giấy, rưới tương ớt cay ngọt và cắm xiên tre',
        actionLabel: 'Rưới sốt đóng hộp giấy',
        ingredientId: 'tuong_ot_mayo',
        visualEffect: 'pack',
      },
    ],
  },

  // 14. Bánh Mì Ốp La Xúc Xích
  breakfast_banh_mi_op_la: {
    dishId: 'breakfast_banh_mi_op_la',
    dishName: 'Bánh Mì Ốp La Xúc Xích',
    category: 'Món no',
    businessModel: 'breakfast_stall',
    description: 'Trứng ốp la lòng đào béo ngậy kẹp bánh mì nướng giòn rụm cùng xúc xích rán.',
    basePrice: 18000,
    baseCost: 6500,
    prepTimeSec: 3,
    ingredients: [
      { ingredientId: 'o_banh_mi', amount: 1 },
      { ingredientId: 'trung_ga_vit', amount: 1 },
      { ingredientId: 'pate_gan', amount: 1 },
      { ingredientId: 'rau_dua_leo', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Ốp la trứng lòng đào',
        instruction: 'Đập trứng lên chảo nóng chiên vàng viền lòng đào sánh mịn',
        actionLabel: 'Chiên ốp la lòng đào',
        ingredientId: 'trung_ga_vit',
        visualEffect: 'fry',
      },
      {
        stepIndex: 2,
        title: 'Quét pa-tê bánh mì',
        instruction: 'Rạch ổ bánh mì giòn tan, quét lớp pa-tê gan béo ngậy',
        actionLabel: 'Quét pa-tê gan thơm lừng',
        ingredientId: 'pate_gan',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 3,
        title: 'Kẹp trứng & dưa leo',
        instruction: 'Xếp trứng ốp la, dưa leo giòn mát, chan nước sốt bánh mì',
        actionLabel: 'Kẹp dưa bọc giấy trao khách',
        ingredientId: 'rau_dua_leo',
        visualEffect: 'pack',
      },
    ],
  },

  // 15. Bánh Mì Pa-tê Chả Lụa
  breakfast_banh_mi_pate_cha: {
    dishId: 'breakfast_banh_mi_pate_cha',
    dishName: 'Bánh Mì Pa-tê Chả Lụa',
    category: 'Món no',
    businessModel: 'breakfast_stall',
    description: 'Bánh mì truyền thống ngập tràn pa-tê béo, chả lụa dày miếng và đồ chua thanh mát.',
    basePrice: 16000,
    baseCost: 5500,
    prepTimeSec: 3,
    ingredients: [
      { ingredientId: 'o_banh_mi', amount: 1 },
      { ingredientId: 'pate_gan', amount: 1 },
      { ingredientId: 'cha_lua', amount: 1 },
      { ingredientId: 'rau_dua_leo', amount: 1 },
    ],
    steps: [
      {
        stepIndex: 1,
        title: 'Nướng ổ bánh mì giòn rụm',
        instruction: 'Ủ bánh mì qua lò nướng cho vỏ giòn xốp thơm lừng',
        actionLabel: 'Nướng nóng ổ bánh mì',
        ingredientId: 'o_banh_mi',
        visualEffect: 'boil',
      },
      {
        stepIndex: 2,
        title: 'Quết pa-tê gan đậm đà',
        instruction: 'Quết lớp pa-tê gan mịn béo ngậy kín lòng ổ bánh',
        actionLabel: 'Quét pa-tê & sốt bơ trứng',
        ingredientId: 'pate_gan',
        visualEffect: 'garnish',
      },
      {
        stepIndex: 3,
        title: 'Xếp chả lụa & dưa ghém',
        instruction: 'Xếp những lát chả lụa dày, rắc tiêu thơm và dưa leo mát giòn',
        actionLabel: 'Gói giấy bánh mì hoàn tất',
        ingredientId: 'cha_lua',
        visualEffect: 'pack',
      },
    ],
  },
};

/**
 * Lấy công thức chi tiết cho một món
 */
export function getDishRecipe(dishId: string): DishRecipe | undefined {
  return DISH_RECIPES[dishId];
}

export interface IngredientCheckItem {
  ingredientId: string;
  name: string;
  unit: string;
  needed: number;
  available: number;
  missing: number;
  isSufficient: boolean;
}

export interface OrderIngredientCheckResult {
  canCook: boolean;
  totalMissingCount: number;
  ingredients: IngredientCheckItem[];
  missingIngredients: IngredientCheckItem[];
}

/**
 * Kiểm tra chi tiết từng nguyên liệu trong kho cho một đơn hàng cụ thể
 */
export function checkDetailedOrderIngredients(
  orderItems: { menuItemId: string; quantity: number }[],
  inventory: Record<string, number>,
  ingredientDb: Record<string, { name: string; unit: string }>
): OrderIngredientCheckResult {
  const neededMap: Record<string, number> = {};

  orderItems.forEach((item) => {
    const recipe = DISH_RECIPES[item.menuItemId];
    if (recipe) {
      recipe.ingredients.forEach((req) => {
        neededMap[req.ingredientId] = (neededMap[req.ingredientId] || 0) + req.amount * item.quantity;
      });
    }
  });

  const checkList: IngredientCheckItem[] = [];
  const missingList: IngredientCheckItem[] = [];
  let canCook = true;

  Object.entries(neededMap).forEach(([ingId, needed]) => {
    const available = inventory[ingId] || 0;
    const missing = Math.max(0, needed - available);
    const isSufficient = available >= needed;
    const ingMeta = ingredientDb[ingId] || { name: ingId, unit: 'phần' };

    const itemCheck: IngredientCheckItem = {
      ingredientId: ingId,
      name: ingMeta.name,
      unit: ingMeta.unit,
      needed,
      available,
      missing,
      isSufficient,
    };

    checkList.push(itemCheck);
    if (!isSufficient) {
      canCook = false;
      missingList.push(itemCheck);
    }
  });

  return {
    canCook,
    totalMissingCount: missingList.length,
    ingredients: checkList,
    missingIngredients: missingList,
  };
}
