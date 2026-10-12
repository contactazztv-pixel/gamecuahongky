import { TimePeriod, WeatherType } from '@/game/types';
import { GAME_CONFIG } from '@/game/config/gameMeta';

/**
 * Định dạng tiền tệ theo quy chuẩn Việt Nam
 */
export function formatCurrency(amount: number, short = false): string {
  if (short && amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1).replace('.0', '')}tr ${GAME_CONFIG.currencySymbol}`;
  }
  if (short && amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k ${GAME_CONFIG.currencySymbol}`;
  }
  return `${amount.toLocaleString('vi-VN')} ${GAME_CONFIG.currencySymbol}`;
}

/**
 * Lấy tên gọi và thông tin của các khung thời gian trong ngày
 */
export function getTimePeriodInfo(period: TimePeriod): {
  label: string;
  timeRange: string;
  badgeColor: string;
  description: string;
} {
  switch (period) {
    case 'before_school':
    case 'morning_prep':
      return {
        label: 'Sáng Sớm Điểm Tâm',
        timeRange: '06:00 - 07:15',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        description: 'Bánh mì nướng giòn, xôi nóng bốc khói. Học sinh và phụ huynh ghé mua vội trước giờ trống.',
      };
    case 'school_rush':
    case 'recess_rush':
      return {
        label: 'Giờ Ra Chơi Rộn Rã',
        timeRange: '09:15 - 09:45',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
        description: 'Hồi trống tùng tùng vang lên! Học sinh ùa ra mua trà sữa mát lạnh và bánh tráng trộn.',
      };
    case 'school_hours':
      return {
        label: 'Trong Giờ Học Yên Ắng',
        timeRange: 'Giờ Lên Lớp',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        description: 'Trường học đang vào tiết học. Thời điểm tuyệt vời để sơ chế, đun nước và nhập thêm nguyên liệu.',
      };
    case 'noon_break':
      return {
        label: 'Tan Học Trưa / Bán Trú',
        timeRange: '11:30 - 12:30',
        badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        description: 'Bóng râm dưới tán phượng vĩ che mát, học sinh bán trú ghé ăn trưa và uống nước đào cam sả.',
      };
    case 'dismissal_rush':
    case 'afternoon_bell':
      return {
        label: 'Tan Trường Chiều (Đông Nhất!)',
        timeRange: '16:30 - 17:45',
        badgeColor: 'bg-red-100 text-red-800 border-red-300',
        description: 'Cổng trường mở toang! Mùi cá viên chiên, mì cay và tiếng cười ríu rít bao trùm góc phố.',
      };
    case 'evening_chill':
      return {
        label: 'Xế Chiều Phố Nhỏ',
        timeRange: '17:45 - 18:45',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
        description: 'Ánh hoàng hôn buông xuống, các nhóm bạn học thêm ghé uống nước và ăn quà vặt nhẹ nhàng.',
      };
    case 'day_end':
      return {
        label: 'Đóng Quán & Tổng Kết',
        timeRange: '19:00',
        badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
        description: 'Dọn dẹp quầy sạch bóng, kiểm đếm sổ thu chi và chuẩn bị sẵn sàng cho ngày mới.',
      };
    default:
      return {
        label: 'Giờ Mở Quán',
        timeRange: 'Trong Ngày',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        description: 'Tiệm nhỏ phục vụ tận tình.',
      };
  }
}

/**
 * Chuyển đổi số thứ tự thành thứ trong tuần
 */
export function getDayOfWeekLabel(dayOfWeek: number): string {
  if (dayOfWeek === 8) return 'Chủ Nhật';
  return `Thứ ${dayOfWeek}`;
}

/**
 * Thông tin thời tiết
 */
export function getWeatherInfo(weather: WeatherType): {
  label: string;
  iconText: string;
  note: string;
} {
  switch (weather) {
    case 'sunny':
      return {
        label: 'Nắng Ấm Rực Rỡ',
        iconText: '☀️',
        note: 'Học sinh rất thích mua đồ uống giải khát mát lạnh.',
      };
    case 'cool_breeze':
      return {
        label: 'Gió Mát Dễ Chịu',
        iconText: '🍃',
        note: 'Thời tiết tuyệt vời để đứng tán gẫu vỉa hè.',
      };
    case 'rainy':
      return {
        label: 'Mưa Rào Mùa Hạ',
        iconText: '🌧️',
        note: 'Món nóng như mì cay, bánh mì giòn bán chạy hơn.',
      };
    case 'exam_season':
      return {
        label: 'Mùa Thi Học Kỳ',
        iconText: '📚',
        note: 'Học sinh mua nhiều món bổ dưỡng nạp năng lượng ôn bài.',
      };
  }
}
