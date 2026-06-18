/**
 * Cấu hình sân khấu 3D — TÁCH RIÊNG thông số của MẶT SÀN và CHARACTER để khi
 * thay sàn mới hoặc nhân vật mới (rồi mix với nhau) không bị lệch/cụt/lỗi xoay.
 *
 * Quy ước chung:
 * - GROUND_Y là MỐC MẶT ĐẤT chung. Mặt sàn canh bề mặt của nó về mốc này, và
 *   nhân vật đặt chân ở mốc này. Nhờ vậy mọi cặp (sàn, nhân vật) đều gặp nhau
 *   đúng một mặt phẳng, không cần chỉnh tay lại mỗi lần đổi asset.
 */

/** Mốc mặt đất chung cho cả sàn lẫn nhân vật (world Y). */
export const GROUND_Y = -1;

export interface FloorConfig {
  /** URL tĩnh tới file .glb của sàn. */
  url: string;
  /** Bề rộng footprint mong muốn (world units) → đủ lấp đầy màn hình. */
  footprint: number;
  /** Xoay sàn quanh trục đứng (radian) để khớp hướng cảnh. */
  rotationY: number;
}

/** Thông số RIÊNG của từng mặt sàn. Thêm sàn mới = thêm 1 entry. */
export const FLOOR_CONFIGS: Record<string, FloorConfig> = {
  'Beach.glb': {
    url: '/Beach.glb',
    footprint: 18,
    rotationY: 0,
  },
};

export const DEFAULT_FLOOR: FloorConfig = FLOOR_CONFIGS['Beach.glb'];

export interface CharacterConfig {
  /** Hệ số phóng to model. */
  scale: number;
  /** Vị trí gốc của model; Y nên = GROUND_Y để chân chạm sàn. */
  position: [number, number, number];
  /**
   * Tên node armature (bộ xương) để xoay hướng đứng. Bắt buộc xoay ở armature
   * (không xoay group ngoài) với rig có skinned mesh tách rời (vd bàn tay),
   * nếu không tay sẽ bị xoay gấp đôi. Để null nếu muốn xoay cả group ngoài.
   */
  armatureName: string | null;
  /** Góc xoay hướng đứng quanh trục ĐỨNG của thế giới (radian). */
  rotationY: number;
}

/** Thông số RIÊNG của từng nhân vật. Thêm nhân vật mới = thêm 1 entry. */
export const CHARACTER_CONFIGS: Record<string, CharacterConfig> = {
  'character-1.glb': {
    scale: 1.2,
    position: [0, GROUND_Y, 0],
    armatureName: 'RobotArmature',
    rotationY: Math.PI / 2, // 90° về bên trái
  },
};

export const DEFAULT_CHARACTER: CharacterConfig = CHARACTER_CONFIGS['character-1.glb'];

/** Lấy config nhân vật theo tên file, fallback về default nếu chưa khai báo. */
export function getCharacterConfig(file: string): CharacterConfig {
  return CHARACTER_CONFIGS[file] ?? DEFAULT_CHARACTER;
}
