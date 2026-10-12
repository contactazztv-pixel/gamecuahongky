export interface ContextualDialogue {
  intro: string[];
  happy: string[];
  warning: string[];
  angry: string[];
}

export const GENERIC_DIALOGUES: ContextualDialogue = {
  intro: [
    'Chào quán nha, cho mình gọi món quen thuộc!',
    'Quán ơi, hôm nay có món gì mới ngon không ạ?',
    'Làm cho mình một phần nóng hổi vừa thổi vừa ăn nha!',
    'Hôm nay đông khách quá, may mà mình ghé kịp!',
    'Cho một phần đặc biệt nhiều năng lượng nha bạn ơi!',
  ],
  happy: [
    'Ngon đỉnh nóc kịch trần luôn! Cảm ơn quán nha!',
    'Nóng hổi vừa miệng ghê, đúng hương vị cổng trường mình thích!',
    'Phục vụ nhanh thoăn thoắt luôn, 10 điểm không có nhưng!',
    'Mai mình rủ thêm bạn cùng bàn ghé ủng hộ quán tiếp!',
    'Tuyệt vời ông mặt trời! Tiền thừa quán khỏi thối lại nha!',
  ],
  warning: [
    'Quán ơi sắp tới giờ vào lớp rồi, ráng nhanh giúp mình xíu nha!',
    'Huhu chuông reo báo trước 5 phút rồi, hồi hộp quá!',
    'Sắp hết giờ nghỉ trưa rồi bạn ơi, cố lên nhé!',
  ],
  angry: [
    'Trễ giờ điểm danh mất rồi, mình phải chạy vào trường gấp thôi!',
    'Lâu quá bạn ơi, không kịp ăn rồi, tiếc thật sự...',
    'Thầy giám thị đang đóng cổng rồi, mình phải chạy vào đây!',
  ],
};

export const WEATHER_EVENT_DIALOGUES: Record<string, string[]> = {
  rainy: [
    'Mưa tầm tã thế này, ăn một phần nóng hổi ngắm mưa là chuẩn bài nhất!',
    'May mà quán có dù che rộng rãi, không là ướt sũng cả cặp sách rồi.',
    'Trời mưa lạnh lạnh, uống ly trà ấm hoặc ăn mì nóng thì còn gì bằng!',
  ],
  back_to_school: [
    'Khai giảng rộn ràng ghê, nhìn ai cũng tươi tắn quần áo mới!',
    'Đầu năm học mới, chúc quán buôn may bán đắt cả năm nhé!',
    'Năm học này mình quyết tâm săn học bổng và ghé quán mỗi ngày!',
  ],
  exam_stress: [
    'Học sinh tụi mình đang cày đề thi thử hoa cả mắt, cần đồ ngọt hồi máu gấp!',
    'Cầu trời đề thi vừa sức, giờ phải nạp năng lượng chiến đấu tiếp!',
    'Uống một ngụm trà mát lạnh thấy đầu óc tỉnh táo làm bài liền!',
  ],
  school_fair: [
    'Hội chợ trường đông vui như trẩy hội! Quán làm mỏi tay luôn nè!',
    'Các trường bạn kéo sang cổ vũ đông nghẹt cổng trường luôn rồi!',
    'Hôm nay xả láng ăn vặt, tiệm làm cho mình đủ combo luôn nha!',
  ],
  teachers_day: [
    'Hôm nay 20/11 cổng trường rực rỡ hoa tươi, không khí ấm áp quá!',
    'Chúc các thầy cô luôn vui khỏe, tiệm hôm nay làm đồ ngon đãi khách nha!',
  ],
};
