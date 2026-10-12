/**
 * CẤU HÌNH TRỌNG TÂM CỦA GAME (Single Source of Truth)
 * Cho phép đổi tên game, phiên bản và thông tin phát triển
 * mà không cần phải chỉnh sửa nhiều file trong toàn bộ dự án.
 */

export interface GameMetadata {
  /** Tên đầy đủ của trò chơi */
  title: string;
  /** Tên viết tắt dùng cho mobile hoặc icon */
  shortTitle: string;
  /** Khẩu hiệu / Phụ đề */
  tagline: string;
  /** Phiên bản game hiện tại */
  version: string;
  /** Phiên bản dữ liệu lưu (schema version) dùng để kiểm tra tính tương thích */
  saveSchemaVersion: number;
  /** Tên nhà phát triển / Đội ngũ */
  developer: string;
  /** Mô tả ngắn gọn */
  description: string;
  /** Đơn vị tiền tệ */
  currencyUnit: string;
  /** Ký hiệu tiền tệ */
  currencySymbol: string;
  /** Năm phát hành */
  releaseYear: number;
}

export const GAME_CONFIG: GameMetadata = {
  title: "Tiệm Nhỏ Trước Cổng Trường",
  shortTitle: "Tiệm Nhỏ",
  tagline: "Gói trọn ký ức tuổi học trò trong từng hương vị",
  version: "1.3.0",
  saveSchemaVersion: 3,
  developer: "Indie School Studio",
  description: "Trò chơi mô phỏng quản lý quầy ăn vặt, trà sữa và bữa sáng trước cổng trường học Việt Nam.",
  currencyUnit: "VNĐ",
  currencySymbol: "đ",
  releaseYear: 2026,
};
