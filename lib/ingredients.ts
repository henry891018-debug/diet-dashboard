import type { Ingredient, KibbleIngredient, SectionId, Totals } from "./types";

// ---- 唯一 ID 產生器 ----
let uidCounter = 0;
/**
 * 為每個食材產生唯一 ID。含時間戳記，確保重整載入舊資料後再新增食材時不會撞號
 * （否則計數器歸零會與已儲存的 ID 衝突）。
 */
export function makeUid(): string {
  const g = globalThis as { crypto?: { randomUUID?: () => string } };
  if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  uidCounter += 1;
  return `ing-${Date.now().toString(36)}-${uidCounter.toString(36)}`;
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
      // 糙米餅：網路查無標準值，以一般米餅概略值帶入，請依包裝標示調整
      { name: "糙米餅", amount: 15, unit: "g", cal: 384, pro: 7.5, carb: 82, fat: 2.8, fiber: 2.5, category: "主食" },
      { name: "全麥吐司", amount: 60, unit: "g", cal: 305, pro: 10, carb: 48, fat: 3.5, fiber: 6, category: "主食" },
    ]),
    "b-pro": withUid([
      { name: "雞胸肉", amount: 120, unit: "g", cal: 119, pro: 23.3, carb: 0, fat: 2.1, fiber: 0, category: "肉類", shrink: 0.82 },
      { name: "牛腱肉", amount: 125, unit: "g", cal: 139, pro: 19.8, carb: 0, fat: 6, fiber: 0, category: "肉類", shrink: 0.8 },
      { name: "全蛋", amount: 50, unit: "g", cal: 143, pro: 12.6, carb: 0.7, fat: 9.5, fiber: 0, category: "蛋類", pieceGram: 50, pieceUnit: "顆" },
      { name: "起司絲", amount: 25, unit: "g", cal: 300, pro: 21.6, carb: 2.5, fat: 24.6, fiber: 0, category: "乳製品" },
    ]),
    "b-drink": withUid([
      { name: "無糖豆漿", amount: 250, unit: "g", cal: 33, pro: 3.6, carb: 1.8, fat: 1.9, fiber: 0, category: "飲品" },
      { name: "美式咖啡", amount: 240, unit: "g", cal: 1, pro: 0.1, carb: 0, fat: 0, fiber: 0, category: "飲品" },
    ]),
    "l-main-rice": withUid([
      { name: "白米飯", amount: 175, unit: "g", cal: 130, pro: 2.4, carb: 28.7, fat: 0.2, fiber: 0.4, category: "主食" },
    ]),
    "l-pro": withUid([
      { name: "雞胸肉", amount: 150, unit: "g", cal: 119, pro: 23.3, carb: 0, fat: 2.1, fiber: 0, category: "肉類", shrink: 0.82 },
      { name: "鴨胸肉", amount: 150, unit: "g", cal: 140, pro: 20, carb: 0, fat: 6.5, fiber: 0, category: "肉類", shrink: 0.8 },
      { name: "牛里肌", amount: 150, unit: "g", cal: 180, pro: 20, carb: 0, fat: 10, fiber: 0, category: "肉類", shrink: 0.8 },
      { name: "鮭魚排", amount: 150, unit: "g", cal: 208, pro: 20.4, carb: 0, fat: 13.4, fiber: 0, category: "海鮮", shrink: 0.78 },
      { name: "鱸魚排", amount: 150, unit: "g", cal: 98, pro: 19.9, carb: 0.9, fat: 1.5, fiber: 0, category: "海鮮", shrink: 0.82 },
      { name: "豬梅花肉", amount: 150, unit: "g", cal: 207, pro: 18.9, carb: 0, fat: 14, fiber: 0, category: "肉類", shrink: 0.8 },
      { name: "牛腿肉", amount: 150, unit: "g", cal: 130, pro: 19.5, carb: 0, fat: 5, fiber: 0, category: "肉類", shrink: 0.82 },
      { name: "松阪豬", amount: 150, unit: "g", cal: 284, pro: 17.2, carb: 0, fat: 23.3, fiber: 0, category: "肉類", shrink: 0.8 },
    ]),
    "l-side": withUid([
      { name: "毛豆仁", amount: 100, unit: "g", cal: 120, pro: 14.6, carb: 9, fat: 5, fiber: 5, category: "豆製品" },
      { name: "蕈菇絲", amount: 100, unit: "g", cal: 20, pro: 2.6, carb: 3.1, fat: 0.5, fiber: 3.4, category: "菇類" },
      { name: "秋葵", amount: 80, unit: "g", cal: 36, pro: 2.1, carb: 7.5, fat: 0.2, fiber: 3.7, category: "葉菜類" },
      { name: "牛蒡絲", amount: 80, unit: "g", cal: 72, pro: 1.7, carb: 17.3, fat: 0.2, fiber: 3.3, category: "根莖類" },
      { name: "菠菜", amount: 80, unit: "g", cal: 23, pro: 2.9, carb: 3.6, fat: 0.4, fiber: 2.2, category: "葉菜類" },
      { name: "洋蔥", amount: 80, unit: "g", cal: 40, pro: 1.1, carb: 9.3, fat: 0.1, fiber: 1.7, category: "根莖類" },
      { name: "豆干", amount: 50, unit: "g", cal: 190, pro: 17, carb: 3, fat: 8.5, fiber: 0.8, category: "豆製品" },
      { name: "竹筍", amount: 80, unit: "g", cal: 28, pro: 2.6, carb: 5, fat: 0.1, fiber: 2.3, category: "根莖類" },
      { name: "木耳", amount: 80, unit: "g", cal: 38, pro: 1, carb: 6.5, fat: 0.2, fiber: 7.4, category: "菇類" },
      // ---- 使用者新增 ----
      { name: "茄子", amount: 80, unit: "g", cal: 25, pro: 1, carb: 6, fat: 0.2, fiber: 3, category: "茄果類" },
      { name: "番茄", amount: 80, unit: "g", cal: 18, pro: 0.9, carb: 3.9, fat: 0.2, fiber: 1.2, category: "茄果類" },
      { name: "甜椒", amount: 80, unit: "g", cal: 26, pro: 1, carb: 6, fat: 0.3, fiber: 2, category: "茄果類" },
      { name: "花椰菜", amount: 80, unit: "g", cal: 25, pro: 1.9, carb: 5, fat: 0.3, fiber: 2, category: "葉菜類" },
      { name: "高麗菜", amount: 80, unit: "g", cal: 25, pro: 1.3, carb: 5.8, fat: 0.1, fiber: 2.5, category: "葉菜類" },
      { name: "白菜", amount: 80, unit: "g", cal: 16, pro: 1.2, carb: 3.2, fat: 0.2, fiber: 1.2, category: "葉菜類" },
      { name: "地瓜葉", amount: 80, unit: "g", cal: 30, pro: 3.2, carb: 4.4, fat: 0.6, fiber: 3.3, category: "葉菜類" },
      { name: "羽衣甘藍", amount: 80, unit: "g", cal: 35, pro: 2.9, carb: 4.4, fat: 1.5, fiber: 4.1, category: "葉菜類" },
      { name: "空心菜", amount: 80, unit: "g", cal: 20, pro: 2.2, carb: 3.1, fat: 0.2, fiber: 2.1, category: "葉菜類" },
      { name: "小白菜", amount: 80, unit: "g", cal: 13, pro: 1.5, carb: 2.2, fat: 0.2, fiber: 1, category: "葉菜類" },
      { name: "馬鈴薯", amount: 100, unit: "g", cal: 77, pro: 2, carb: 17, fat: 0.1, fiber: 2.2, category: "根莖類" },
      { name: "胡蘿蔔", amount: 100, unit: "g", cal: 41, pro: 0.9, carb: 9.6, fat: 0.2, fiber: 2.8, category: "根莖類" },
      { name: "地瓜", amount: 100, unit: "g", cal: 86, pro: 1.6, carb: 20, fat: 0.1, fiber: 3, category: "根莖類" },
      { name: "南瓜", amount: 80, unit: "g", cal: 26, pro: 1, carb: 6.5, fat: 0.1, fiber: 0.5, category: "瓜類" },
      { name: "櫛瓜", amount: 80, unit: "g", cal: 17, pro: 1.2, carb: 3.1, fat: 0.3, fiber: 1, category: "瓜類" },
      { name: "絲瓜", amount: 80, unit: "g", cal: 17, pro: 1, carb: 4.4, fat: 0.2, fiber: 1, category: "瓜類" },
      { name: "大黃瓜", amount: 80, unit: "g", cal: 13, pro: 0.7, carb: 2.9, fat: 0.1, fiber: 0.9, category: "瓜類" },
      { name: "香菇", amount: 80, unit: "g", cal: 34, pro: 2.2, carb: 6.8, fat: 0.5, fiber: 2.5, category: "菇類" },
      { name: "鴻喜菇", amount: 80, unit: "g", cal: 20, pro: 2.6, carb: 3.1, fat: 0.5, fiber: 3.4, category: "菇類" },
      { name: "杏鮑菇", amount: 80, unit: "g", cal: 35, pro: 2.7, carb: 6, fat: 0.4, fiber: 2.7, category: "菇類" },
      { name: "蛋", amount: 50, unit: "g", cal: 143, pro: 12.6, carb: 0.7, fat: 9.5, fiber: 0, category: "蛋類", pieceGram: 50, pieceUnit: "顆" },
      { name: "板豆腐", amount: 100, unit: "g", cal: 88, pro: 8.5, carb: 6, fat: 3.4, fiber: 0.6, category: "豆製品" },
      { name: "雞蛋豆腐", amount: 100, unit: "g", cal: 79, pro: 6.4, carb: 2.8, fat: 4.8, fiber: 0, category: "豆製品" },
    ]),
  };
}

// ---- 計算工具 ----

/**
 * 將「每 100g」的食材（如配菜）轉成 Kibble 用的「每 g」食材。
 * Kibble 內部以每 g 儲存，方便乘以份量得到總量。
 */
export function ingredientToKibble(ing: Ingredient): KibbleIngredient {
  return {
    name: ing.name,
    unit: "g",
    amount: ing.amount,
    cal: ing.cal / 100,
    pro: ing.pro / 100,
    carb: ing.carb / 100,
    fat: ing.fat / 100,
    fiber: ing.fiber / 100,
  };
}

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
