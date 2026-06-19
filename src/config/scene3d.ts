import type { IconName } from '@/components/ui/AppIcon';

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

/**
 * Độ lùi của nhân vật theo trục Z (world): camera nhìn từ +Z vào -Z, nên giá
 * trị ÂM = lùi ra xa người xem (vào trong màn hình) → kéo nhân vật từ mép nước
 * lùi lên bờ cát. Tăng |giá trị| để lùi xa hơn; đổi dấu nếu lỡ lùi nhầm hướng.
 */
export const CHARACTER_BACK_OFFSET = -1.5;

/**
 * Hệ số kéo LÙI camera so với mức fit sát nhân vật (1.0 = ôm sát như cũ). Tăng
 * lên để camera lùi ra xa hơn → góc nhìn bắt đầu từ mép gần của mặt sàn 3D, thấy
 * được cả sàn trải ra trước mặt thay vì chỉ thấy mỗi nhân vật. Chỉnh số này cho
 * tới khi mép sàn lọt đúng cạnh khung hình.
 */
export const CAMERA_DISTANCE_SCALE = 2.0;

export interface FloorConfig {
  /** URL tĩnh tới file .glb của sàn. */
  url: string;
  /** Bề rộng footprint mong muốn (world units) → đủ lấp đầy màn hình. */
  footprint: number;
  /** Xoay sàn quanh trục đứng (radian) để khớp hướng cảnh. */
  rotationY: number;
  /**
   * Sàn phẳng: bỏ qua raycast dò cao độ (vốn dễ bắt trúng mái hiên/phần nhô của
   * cảnh khiến nhân vật đứng lửng) và cho nhân vật đứng thẳng mốc chân GROUND_Y.
   */
  flat?: boolean;
}

/** Thông số RIÊNG của từng mặt sàn. Thêm sàn mới = thêm 1 entry. */
export const FLOOR_CONFIGS: Record<string, FloorConfig> = {
  'Beach.glb': {
    url: '/Beach.glb',
    footprint: 18,
    rotationY: 0,
  },
  'Desert.glb': {
    url: '/Desert.glb',
    footprint: 18,
    rotationY: 0,
  },
  'Shop.glb': {
    url: '/Shop.glb',
    footprint: 18,
    rotationY: -Math.PI / 2,
    flat: true,
  },
};

export const FLOOR_OPTIONS = Object.keys(FLOOR_CONFIGS);

export const FLOOR_LABELS: Record<string, string> = {
  'Beach.glb': 'Bãi biển',
  'Desert.glb': 'Sa mạc',
  'Shop.glb': 'Cửa hàng',
};

export const FLOOR_ICONS: Record<string, IconName> = {
  'Beach.glb': 'beach',
  'Desert.glb': 'desert',
  'Shop.glb': 'shop',
};

export const DEFAULT_FLOOR: FloorConfig = FLOOR_CONFIGS['Beach.glb'];

/** Lấy config mặt sàn theo tên file, fallback về default nếu chưa khai báo. */
export function getFloorConfig(file: string): FloorConfig {
  return FLOOR_CONFIGS[file] ?? DEFAULT_FLOOR;
}

/**
 * Chiều cao hiển thị mục tiêu (world units) sau khi scale — mọi nhân vật canh
 * về mức này để khi đổi character không bị to/nhỏ lệch nhau. Suy từ char-1 gốc
 * (cao 4.791 × scale 1.2 ≈ 5.75).
 */
export const TARGET_CHARACTER_HEIGHT = 5.75;

export interface CharacterConfig {
  /**
   * Chiều cao bounding box GỐC của model (world units, đo từ file .glb chưa
   * scale). Lưu lại để suy ra scale = TARGET_CHARACTER_HEIGHT / boundingHeight
   * và để dễ canh lại khi đổi asset.
   */
  boundingHeight: number;
  /** Hệ số phóng to model (canh boundingHeight về TARGET_CHARACTER_HEIGHT). */
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
    boundingHeight: 4.791,
    scale: 1.2, // ≈ 5.75 / 4.791
    position: [-1.5, GROUND_Y, 0],
    armatureName: 'RobotArmature',
    rotationY: Math.PI / 2, // 90° về bên trái
  },
  'character-2.glb': {
    boundingHeight: 3.552,
    scale: 1.62, // ≈ 5.75 / 3.552
    position: [-1.5, GROUND_Y, 0],
    armatureName: null,
    rotationY: Math.PI / 2,
  },
  'character-3.glb': {
    boundingHeight: 3.176,
    scale: 1.81, // ≈ 5.75 / 3.176
    position: [-1.5, GROUND_Y, 0],
    armatureName: null,
    rotationY: Math.PI / 2,
  },
};

export const DEFAULT_CHARACTER: CharacterConfig = CHARACTER_CONFIGS['character-1.glb'];

/** Lấy config nhân vật theo tên file, fallback về default nếu chưa khai báo. */
export function getCharacterConfig(file: string): CharacterConfig {
  return CHARACTER_CONFIGS[file] ?? DEFAULT_CHARACTER;
}

/** Mức kích cỡ hiển thị của nhân vật. */
export type CharacterSize = 'large' | 'medium' | 'small';

/**
 * Hệ số phóng to nhân vật theo lựa chọn kích cỡ. Small = kích thước Large cũ
 * (1.0); mỗi mức lớn hơn = 1.5× mức liền dưới — Medium = Small × 1.5, Large =
 * Medium × 1.5 (≈ 2.25× Small). Hệ số này nhân vào config.scale.
 */
export const CHARACTER_SIZE_SCALES: Record<CharacterSize, number> = {
  small: 1,
  medium: 1.5,
  large: 2.25,
};

export const CHARACTER_SIZE_LABELS: Record<CharacterSize, string> = {
  large: 'Lớn',
  medium: 'Vừa',
  small: 'Nhỏ',
};

export const CHARACTER_SIZE_OPTIONS: CharacterSize[] = ['large', 'medium', 'small'];

/** Lấy hệ số scale theo mức kích cỡ, fallback về Large nếu chưa đặt. */
export function getCharacterSizeScale(size: CharacterSize | undefined): number {
  return CHARACTER_SIZE_SCALES[size ?? 'large'] ?? 1;
}
