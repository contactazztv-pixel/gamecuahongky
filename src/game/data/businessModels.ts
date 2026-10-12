import { BusinessModel } from '../types';

export const BUSINESS_MODELS: Record<string, BusinessModel> = {
  boba_tea: {
    id: 'boba_tea',
    name: 'Xe Đẩy Trà Sữa & Đồ Uống',
    tagline: 'Vị ngọt thanh mát gắn liền với những giờ ra chơi rộn rã',
    description:
      'Khởi nghiệp với chiếc xe đẩy inox lưu động, ủ sẵn những bình trà thơm phức và những mẻ trân châu dai mềm. Rất được các bạn học sinh nữ và nhóm bạn yêu thích ghé thăm vào mỗi giờ giải lao.',
    startingCash: 3500000, // 3.500.000 VNĐ
    difficulty: 'Dễ',
    themeColor: 'emerald',
    badgeText: 'Thịnh Hành Học Đường',
    iconName: 'CupSoda',
    perks: [
      'Biên lợi nhuận đồ uống cực cao (lên đến 65%).',
      'Giờ ra chơi và chiều tan học bùng nổ đơn hàng với tốc độ pha chế nhanh.',
      'Dễ thu hút nhóm học sinh đi cùng nhau tăng giá trị đơn.',
    ],
    drawbacks: [
      'Đá lạnh và thạch tươi dễ giảm chất lượng vào những ngày nắng gắt nếu không nâng cấp thùng giữ nhiệt.',
      'Buổi sáng sớm lượng khách ít hơn mô hình ăn sáng.',
    ],
    unlockedMenuIds: [
      'drink_tra_sua_truyen_thong',
      'drink_tra_dao_cam_sa',
      'drink_milo_dam_tran_chau',
    ],
    recommendedPlaystyle: 'Phù hợp người chơi thích tốc độ bán dồn dập, tích lũy vốn nhanh trong giờ giải lao ngắn.',
  },

  street_snack: {
    id: 'street_snack',
    name: 'Quầy Mì Cay & Đồ Ăn Vặt',
    tagline: 'Thế giới bánh tráng, xiên que thơm lừng góc phố tuổi thơ',
    description:
      'Góc quán vỉa hè với chiếc chảo chiên giòn rụm và thau trộn bánh tráng đậm đà vị muối tôm, sa tế. Cứ mỗi tiếng trống tan trường vang lên, các bạn học sinh lại xúm quanh hít hà mùi thơm.',
    startingCash: 2800000, // 2.800.000 VNĐ
    difficulty: 'Trung bình',
    themeColor: 'amber',
    badgeText: 'Hút Khách Chiều Tối',
    iconName: 'Flame',
    perks: [
      'Được học sinh cấp 2 & cấp 3 mê đắm vào giờ tan trường chiều (16:30 - 18:00).',
      'Vốn đầu tư ban đầu nhẹ nhàng, dễ xoay vòng tiền nhập hàng.',
      'Khách sẵn sàng chờ đợi lâu hơn nếu món ăn giòn nóng.',
    ],
    drawbacks: [
      'Tiêu hao nhiều dầu ăn và gia vị vặt; rủi ro cháy khét nếu thao tác vội.',
      'Cần vệ sinh quầy thường xuyên để duy trì điểm vệ sinh an toàn.',
    ],
    unlockedMenuIds: [
      'snack_banh_trang_tron_dac_biet',
      'snack_ca_vien_chien_nuoc_mam',
      'snack_mi_cay_mini_cap_2',
    ],
    recommendedPlaystyle: 'Dành cho người chơi thích sự nhộn nhịp, quản lý nguyên liệu tỉ mỉ và chiên xào hấp dẫn.',
  },

  breakfast_stall: {
    id: 'breakfast_stall',
    name: 'Quầy Ăn Sáng Bánh Mì & Xôi',
    tagline: 'Tiếp năng lượng cho ngày mới đến lớp tràn đầy hứng khởi',
    description:
      'Chiếc tủ kính sáng bóng bên cạnh thúng xôi lá chuối nóng hổi nghi ngút khói. Ổ bánh mì vàng ươm giòn rụm kẹp pate béo ngậy, chả lụa và dưa leo mát lành là lựa chọn số một của học sinh và thầy cô.',
    startingCash: 4200000, // 4.200.000 VNĐ
    difficulty: 'Thử thách',
    themeColor: 'rose',
    badgeText: 'Doanh Số Ổn Định',
    iconName: 'UtensilsCrossed',
    perks: [
      'Doanh thu cực kỳ dồi dào và ổn định vào sáng sớm (06:00 - 07:15).',
      'Được cả học sinh, phụ huynh và thầy cô giáo ủng hộ; tỷ lệ tip và đánh giá sao cao.',
      'Ít bị ế hàng vào buổi sáng nếu chuẩn bị số lượng hợp lý.',
    ],
    drawbacks: [
      'Áp lực thời gian rất gắt: khách vội đi học nên tính kiên nhẫn thấp hơn.',
      'Bánh mì dễ bị ỉu mềm nếu qua trưa; cần dậy chuẩn bị sớm.',
    ],
    unlockedMenuIds: [
      'breakfast_banh_mi_pate_cha_lua',
      'breakfast_xoi_bap_dau_phong',
      'breakfast_banh_mi_trung_op_la',
    ],
    recommendedPlaystyle: 'Dành cho người chơi thích sự kỷ luật, phục vụ thần tốc và phục vụ đa dạng lứa tuổi khách.',
  },
};
