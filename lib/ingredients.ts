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

/** 各分區的預設食材資料。 */
export function createInitialData(): Record<SectionId, Ingredient[]> {
  return {
    "b-main": withUid([
      { name: "糙米餅 6片", amount: 1, unit: "份", cal: 45, pro: 1, carb: 8, fat: 1, fiber: 0.5, tag: "主食" },
      { name: "全麥吐司", amount: 2, unit: "片", cal: 140, pro: 5, carb: 24, fat: 2, fiber: 3, tag: "主食" },
    ]),
    "b-pro": withUid([
      { name: "雞胸肉", amount: 120, unit: "g", cal: 130, pro: 28, carb: 0, fat: 3, fiber: 0, tag: "蛋白質", shrink: 0.82 },
      { name: "牛腱肉", amount: 125, unit: "g", cal: 263, pro: 26, carb: 0, fat: 17, fiber: 0, tag: "蛋白質", shrink: 0.8 },
      { name: "全蛋", amount: 1, unit: "顆", cal: 72, pro: 6, carb: 0.4, fat: 5, fiber: 0, tag: "蛋白質" },
      { name: "起司絲", amount: 25, unit: "g", cal: 95, pro: 6, carb: 0.8, fat: 8, fiber: 0, tag: "蛋白質" },
    ]),
    "b-drink": withUid([
      { name: "無糖豆漿", amount: 250, unit: "ml", cal: 35, pro: 3.5, carb: 0.8, fat: 2, fiber: 0, tag: "飲品" },
      { name: "美式咖啡", amount: 240, unit: "ml", cal: 5, pro: 0.3, carb: 0, fat: 0, fiber: 0, tag: "飲品" },
    ]),
    "l-main-rice": withUid([
      { name: "糙白米混合飯", amount: 175, unit: "g", cal: 228, pro: 5, carb: 49, fat: 0.5, fiber: 1.5, tag: "主食" },
    ]),
    "l-pro": withUid([
      { name: "雞胸肉", amount: 150, unit: "g", cal: 165, pro: 31, carb: 0, fat: 4, fiber: 0, tag: "蛋白質", shrink: 0.82 },
      { name: "鴨胸肉", amount: 150, unit: "g", cal: 210, pro: 22, carb: 0, fat: 13, fiber: 0, tag: "蛋白質", shrink: 0.8 },
      { name: "牛里肌", amount: 150, unit: "g", cal: 200, pro: 26, carb: 0, fat: 11, fiber: 0, tag: "蛋白質", shrink: 0.8 },
      { name: "鮭魚排", amount: 150, unit: "g", cal: 220, pro: 24, carb: 0, fat: 13, fiber: 0, tag: "蛋白質", shrink: 0.78 },
      { name: "鱸魚排", amount: 150, unit: "g", cal: 125, pro: 26, carb: 0, fat: 2, fiber: 0, tag: "蛋白質", shrink: 0.82 },
      { name: "豬梅花肉", amount: 150, unit: "g", cal: 260, pro: 22, carb: 1, fat: 18, fiber: 0, tag: "蛋白質", shrink: 0.8 },
      { name: "牛腿肉", amount: 150, unit: "g", cal: 210, pro: 24, carb: 0, fat: 11, fiber: 0, tag: "蛋白質", shrink: 0.82 },
      { name: "松阪豬", amount: 150, unit: "g", cal: 280, pro: 18, carb: 0, fat: 23, fiber: 0, tag: "蛋白質", shrink: 0.8 },
    ]),
    "l-side": withUid([
      { name: "毛豆仁", amount: 100, unit: "g", cal: 76, pro: 8, carb: 2, fat: 4, fiber: 0.3, tag: "豆類" },
      { name: "蕈菇絲", amount: 100, unit: "g", cal: 10, pro: 0.2, carb: 2, fat: 0, fiber: 2.2, tag: "蔬菜" },
      { name: "秋葵", amount: 80, unit: "g", cal: 24, pro: 2, carb: 4, fat: 0.2, fiber: 2.6, tag: "蔬菜" },
      { name: "牛蒡絲", amount: 80, unit: "g", cal: 52, pro: 1.5, carb: 10, fat: 0.1, fiber: 4.1, tag: "蔬菜" },
      { name: "菠菜", amount: 80, unit: "g", cal: 20, pro: 1.8, carb: 3, fat: 0.2, fiber: 2.8, tag: "蔬菜" },
      { name: "洋蔥", amount: 80, unit: "g", cal: 32, pro: 0.8, carb: 7, fat: 0.1, fiber: 1.1, tag: "蔬菜" },
      { name: "豆干", amount: 50, unit: "g", cal: 48, pro: 11, carb: 0, fat: 0.5, fiber: 0, tag: "蛋白質" },
      { name: "竹筍", amount: 80, unit: "g", cal: 22, pro: 2.5, carb: 3, fat: 0.2, fiber: 1.8, tag: "蔬菜" },
      { name: "木耳", amount: 80, unit: "g", cal: 20, pro: 1.2, carb: 4, fat: 0.1, fiber: 3.2, tag: "蔬菜" },
    ]),
  };
}

/** Kibble 編輯器「快速加入」可選的基底食材（每單位營養值）。 */
export const KIBBLE_BASE: KibbleBase[] = [
  { name: "糙白米混合飯", unit: "g", cal: 1.3, pro: 0.029, carb: 0.28, fat: 0.003, fiber: 0.009 },
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
    { name: "糙白米混合飯", unit: "g", amount: 175, cal: 1.3, pro: 0.029, carb: 0.28, fat: 0.003, fiber: 0.009 },
    { name: "全蛋", unit: "顆", amount: 1, cal: 72, pro: 6, carb: 0.4, fat: 5, fiber: 0, perUnit: true },
    { name: "毛豆仁", unit: "g", amount: 60, cal: 1.2, pro: 0.117, carb: 0.085, fat: 0.054, fiber: 0.04 },
    { name: "青花菜", unit: "g", amount: 80, cal: 0.34, pro: 0.025, carb: 0.065, fat: 0.004, fiber: 0.026 },
    { name: "胡蘿蔔", unit: "g", amount: 50, cal: 0.41, pro: 0.009, carb: 0.096, fat: 0.002, fiber: 0.028 },
  ];
}

// ---- 計算工具 ----

/** 依比例縮放某食材的營養值（ratio = 實際份量 / 預設份量）。 */
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
