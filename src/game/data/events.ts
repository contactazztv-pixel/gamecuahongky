import { SeasonalEvent } from '../types';

export const SCHOOL_SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'event_back_to_school',
    name: 'Mùa Tựu Trường & Khai Giảng',
    badge: 'Khai Giảng Rộn Rã',
    description: 'Năm học mới bắt đầu! Học sinh và phụ huynh nô nức đến trường, nhu cầu ăn sáng và giải khát bùng nổ.',
    icon: 'Backpack',
    startDay: 1,
    endDay: 3,
    effects: {
      trafficMultiplier: 1.35, // Lượng khách tăng 35%
      tipMultiplier: 1.25,     // Tiền tip tăng 25%
      patienceMultiplier: 1.1, // Khách vui vẻ, kiên nhẫn hơn 10%
      boostCategories: ['Món no', 'Đồ uống'],
      boostMultiplier: 1.4,
      dialogueMood: 'back_to_school',
    },
    associatedQuestId: 'quest_event_back_to_school',
  },
  {
    id: 'event_midterm_exam',
    name: 'Mùa Thi Giữa Kỳ Căng Thẳng',
    badge: 'Mùa Thi Căng Thẳng',
    description: 'Học sinh tập trung cao độ ôn bài, cần nhiều đồ ngọt giải nhiệt và đồ ăn khuya lấy sức.',
    icon: 'GraduationCap',
    startDay: 8,
    endDay: 11,
    effects: {
      trafficMultiplier: 1.15,
      tipMultiplier: 1.3,      // Học sinh hào phóng bo tip khi được phục vụ nhanh
      patienceMultiplier: 0.85,// Học sinh hơi vội vàng đi ôn thi
      boostCategories: ['Đồ uống', 'Ăn vặt'],
      boostMultiplier: 1.5,
      dialogueMood: 'exam_stress',
    },
    associatedQuestId: 'quest_event_exam_support',
  },
  {
    id: 'event_school_fair',
    name: 'Hội Chợ Ẩm Thực Cổng Trường',
    badge: 'Hội Chợ Tưng Bừng',
    description: 'Trường tổ chức ngày hội văn hóa thanh niên! Khách học sinh từ các trường lân cận kéo sang rất đông.',
    icon: 'PartyPopper',
    startDay: 6,
    endDay: 7,
    repeatIntervalDays: 14, // Lặp lại sau mỗi 2 tuần vào cuối tuần
    effects: {
      trafficMultiplier: 1.6,  // Khách tăng 60%
      tipMultiplier: 1.35,
      patienceMultiplier: 1.0,
      boostCategories: ['Ăn vặt', 'Đồ uống'],
      boostMultiplier: 1.6,
      dialogueMood: 'school_fair',
    },
    associatedQuestId: 'quest_event_fair_master',
  },
  {
    id: 'event_teachers_day',
    name: 'Tri Ân Ngày Nhà Giáo 20/11',
    badge: 'Hoa Tươi 20/11',
    description: 'Cổng trường ngập tràn hoa tươi và quà tặng. Thầy cô giáo và học sinh cũ ghé quán ôn lại kỷ niệm xưa.',
    icon: 'Award',
    startDay: 15,
    endDay: 17,
    effects: {
      trafficMultiplier: 1.4,
      tipMultiplier: 1.5,
      patienceMultiplier: 1.25,
      boostCategories: ['Đồ uống', 'Món no'],
      boostMultiplier: 1.3,
      dialogueMood: 'teachers_day',
    },
    associatedQuestId: 'quest_event_teacher_appreciation',
  },
  {
    id: 'event_rainy_day',
    name: 'Cơn Mưa Rào Tuổi Học Trò',
    badge: 'Mưa Rào Bất Chợt',
    description: 'Cơn mưa rào trút xuống cổng trường. Khách ghé vào trú mưa và tìm kiếm những món ăn ấm nóng, giòn rụm.',
    icon: 'CloudRain',
    startDay: 4,
    endDay: 4, // Có thể kích hoạt ngẫu nhiên theo thời tiết
    effects: {
      trafficMultiplier: 0.9,  // Khách ít đi lại hơn một chút
      tipMultiplier: 1.2,      // Nhưng rất biết ơn vì có chỗ trú mưa
      patienceMultiplier: 1.15,
      boostCategories: ['Món no', 'Ăn vặt'],
      boostMultiplier: 1.5,
      weather: 'rainy',
      dialogueMood: 'rainy_day',
    },
    associatedQuestId: 'quest_event_rainy_warmth',
  },
];
