import type {
  Ingredient,
  KibbleBase,
  KibbleIngredient,
  SectionId,
  Totals,
} from "./types";

// ---- 唯一 ID 產生器 ----
let uidCounter = 0;
/** 為每個食材產生穩定的唯一 ID（避免以陣列索引當 key 在刪除後錯位）。 */
export function makeUid(): string {
  uidCounter += 1;
  return `ing-${uidCounter}`;
}

// 內部建構工具：補上 uid
type RawIngredient = Omit<Ingredient, "uid">;
const withUid = (items: RawIngredient[]): Ingredient[] =>
  items.map((it) => ({ ...it, uid: makeUid() }));

/**
 * 各分區的預設食材資料。
 * cal/pro/carb/fat/fiber 為「每 100g 含量」；amount 為預設份量（公克）。
 * 卡片與合計 = 每 100g 值 × (份量 / 100)。
 */
export function createInitialData(): Record<SectionId, Ingredient[]> {
  return {
    "b-main": withUid([
      { name: "糙米餅", amount: 15, unit: "g", cal: 300, pro: 6.7, carb: 53.3, fat: 6.7, fiber: 3.3, tag: "主食" },
      { name: "全麥吐司", amount: 60, unit: "g", cal: 233, pro: 8.3, carb: 40, fat: 3.3, fiber: 5, tag: "主食" },
    ]),
    "b-pro": withUid([
      { name: "雞胸肉", amount: 120, unit: "g", cal: 108, pro: 23.3, carb: 0, fat: 2.5, fiber: 0, tag: "蛋白質", shrink: 0.82 },
      { name: "牛腱肉", amount: 125, unit: "g", cal: 210, pro: 20.8, carb: 0, fat: 13.6, fiber: 0, tag: "蛋白質", shrink: 0.8 },
      { name: "全蛋", amount: 50, unit: "g", cal: 144, pro: 12, carb: 0.8, fat: 10, fiber: 0, tag: "蛋白質", pieceGram: 50, pieceUnit: "顆" },
      { name: "起司絲", amount: 25, unit: "g", cal: 380, pro: 24, carb: 3.2, fat: 32, fiber: 0, tag: "蛋白質" },
    ]),
    "b-drink": withUid([
      { name: "無糖豆漿", amount: 250, unit: "g", cal: 14, pro: 1.4, carb: 0.3, fat: 0.8, fiber: 0, tag: "飲品" },
      { name: "美式咖啡", amount: 240, unit: "g", cal: 2, pro: 0.1, carb: 0, fat: 0, fiber: 0, tag: "飲品" },
    ]),
    "l-main-rice": withUid([
      { name: "白米飯", amount: 175, unit: "g", cal: 130, pro: 2.6, carb: 28, fat: 0.3, fiber: 0.3, tag: "主食" },
    ]),
    "l-pro": withUid([
      { name: "雞胸肉", amount: 150, unit: "g", cal: 110, pro: 20.7, carb: 0, fat: 2.7, fiber: 0, tag: "蛋白質", shrink: 0.82 },
      { name: "鴨胸肉", amount: 150, unit: "g", cal: 140, pro: 14.7, carb: 0, fat: 8.7, fiber: 0, tag: "蛋白質", shrink: 0.8 },
      { name: "牛里肌", amount: 150, unit: "g", cal: 133, pro: 17.3, carb: 0, fat: 7.3, fiber: 0, tag: "蛋白質", shrink: 0.8 },
      { name: "鮭魚排", amount: 150, unit: "g", cal: 147, pro: 16, carb: 0, fat: 8.7, fiber: 0, tag: "蛋白質", shrink: 0.78 },
      { name: "鱸魚排", amount: 150, unit: "g", cal: 83, pro: 17.3, carb: 0, fat: 1.3, fiber: 0, tag: "蛋白質", shrink: 0.82 },
      { name: "豬梅花肉", amount: 150, unit: "g", cal: 173, pro: 14.7, carb: 0.7, fat: 12, fiber: 0, tag: "蛋白質", shrink: 0.8 },
      { name: "牛腿肉", amount: 150, unit: "g", cal: 140, pro: 16, carb: 0, fat: 7.3, fiber: 0, tag: "蛋白質", shrink: 0.82 },
      { name: "松阪豬", amount: 150, unit: "g", cal: 187, pro: 12, carb: 0, fat: 15.3, fiber: 0, tag: "蛋白質", shrink: 0.8 },
    ]),
    "l-side": withUid([
      { name: "毛豆仁", amount: 100, unit: "g", cal: 76, pro: 8, carb: 2, fat: 4, fiber: 0.3, tag: "豆類" },
      { name: "蕈菇絲", amount: 100, unit: "g", cal: 10, pro: 0.2, carb: 2, fat: 0, fiber: 2.2, tag: "蔬菜" },
      { name: "秋葵", amount: 80, unit: "g", cal: 30, pro: 2.5, carb: 5, fat: 0.3, fiber: 3.3, tag: "蔬菜" },
      { name: "牛蒡絲", amount: 80, unit: "g", cal: 65, pro: 1.9, carb: 12.5, fat: 0.1, fiber: 5.1, tag: "蔬菜" },
      { name: "菠菜", amount: 80, unit: "g", cal: 25, pro: 2.3, carb: 3.8, fat: 0.3, fiber: 3.5, tag: "蔬菜" },
      { name: "洋蔥", amount: 80, unit: "g", cal: 40, pro: 1, carb: 8.8, fat: 0.1, fiber: 1.4, tag: "蔬菜" },
      { name: "豆干", amount: 50, unit: "g", cal: 96, pro: 22, carb: 0, fat: 1, fiber: 0, tag: "蛋白質" },
      { name: "竹筍", amount: 80, unit: "g", cal: 27.5, pro: 3.1, carb: 3.8, fat: 0.3, fiber: 2.3, tag: "蔬菜" },
      { name: "木耳", amount: 80, unit: "g", cal: 25, pro: 1.5, carb: 5, fat: 0.1, fiber: 4, tag: "蔬菜" },
    ]),
  };
}

/** Kibble 編輯器「快速加入」可選的基底食材（每單位營養值）。 */
export const KIBBLE_BASE: KibbleBase[] = [
  { name: "白米飯", unit: "g", cal: 1.3, pro: 0.027, carb: 0.28, fat: 0.003, fiber: 0.004 },
  { name: "全蛋", unit: "顆", cal: 72, pro: 6, carb: 0.4, fat: 5, fiber: 0, perUnit: true },
  { name: "毛豆仁", unit: "g", cal: 1.2, pro: 0.117, carb: 0.085, fat: 0.054, fiber: 0.04 },
  { name: "青花菜", unit: "g", cal: 0.34, pro: 0.025, carb: 0.065, fat: 0.004, fiber: 0.026 },
  { name: "胡蘿蔔", unit: "g", cal: 0.41, pro: 0.009, carb: 0.096, fat: 0.002, fiber: 0.028 },
  { name: "菠菜", unit: "g", cal: 0.23, pro: 0.029, carb: 0.036, fat: 0.004, fiber: 0.022 },
  { name: "蕈菇絲", unit: "g", cal: 0.1, pro: 0.002, carb: 0.02, fat: 0, fiber: 0.022 },
];

/** Kibble 編輯器首次開啟時的預設配方。 */
export function createDefaultKibble(): KibbleIngredient[] {
  return [
    { name: "白米飯", unit: "g", amount: 175, cal: 1.3, pro: 0.027, carb: 0.28, fat: 0.003, fiber: 0.004 },
    { name: "全蛋", unit: "顆", amount: 1, cal: 72, pro: 6, carb: 0.4, fat: 5, fiber: 0, perUnit: true },
    { name: "毛豆仁", unit: "g", amount: 60, cal: 1.2, pro: 0.117, carb: 0.085, fat: 0.054, fiber: 0.04 },
    { name: "青花菜", unit: "g", amount: 80, cal: 0.34, pro: 0.025, carb: 0.065, fat: 0.004, fiber: 0.026 },
    { name: "胡蘿蔔", unit: "g", amount: 50, cal: 0.41, pro: 0.009, carb: 0.096, fat: 0.002, fiber: 0.028 },
  ];
}

// ---- 計算工具 ----

/** 依比例縮放某食材的營養值（ratio = 實際份量 / 100，因數值以每 100g 計）。 */
export function scaled(ing: Ingredient, ratio: number): Totals {
  return {
    cal: ing.cal * ratio,
    pro: ing.pro * ratio,
    carb: ing.carb * ratio,
    fat: ing.fat * ratio,
    fiber: ing.fiber * ratio,
  };
}

/** 計算一份 Kibble 配方的總營養值。 */
export function kibbleTotals(ings: KibbleIngredient[]): Totals {
  return ings.reduce<Totals>(
    (acc, ing) => ({
      cal: acc.cal + ing.cal * ing.amount,
      pro: acc.pro + ing.pro * ing.amount,
      carb: acc.carb + ing.carb * ing.amount,
      fat: acc.fat + ing.fat * ing.amount,
      fiber: acc.fiber + ing.fiber * ing.amount,
    }),
    { cal: 0, pro: 0, carb: 0, fat: 0, fiber: 0 },
  );
}

/** 蛋白質分區（生/熟重換算 + 顯示生重欄位）。 */
export function isProteinSection(section: SectionId): boolean {
  return section === "b-pro" || section === "l-pro";
}
