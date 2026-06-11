// 共用型別定義

/** 餐別分區 ID */
export type SectionId =
  | "b-main" // 早餐 - 主食
  | "b-pro" // 早餐 - 蛋白質
  | "b-drink" // 早餐 - 飲品
  | "l-main-rice" // 午餐 - 白飯主食
  | "l-pro" // 午餐 - 主菜蛋白質
  | "l-side"; // 午餐 - 配菜

/** 食材標籤（決定卡片標籤顏色） */
export type FoodTag = "主食" | "蛋白質" | "飲品" | "豆類" | "蔬菜" | "自訂";

/** 單一食材。cal/pro/carb/... 為「每 100g 含量」；amount 為預設份量（公克）。 */
export interface Ingredient {
  uid: string;
  name: string;
  /** 預設份量（公克） */
  amount: number;
  unit: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  fiber: number;
  tag: FoodTag;
  /** 縮水率＝熟重 / 生重（肉類約 0.78–0.85）。僅蛋白質類使用。 */
  shrink?: number;
  /** 單顆/單份重量（公克）。設定後，編輯時會額外顯示「每顆」營養值（如全蛋）。 */
  pieceGram?: number;
  /** 單顆單位顯示文字（如「顆」）。 */
  pieceUnit?: string;
}

/** Kibble 快速加入清單的基底食材。數值為「每單位」（每 g 或每顆）。 */
export interface KibbleBase {
  name: string;
  unit: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  fiber: number;
  /** true 表示數值以「每顆」計（amount 為顆數），否則以「每 g」計。 */
  perUnit?: boolean;
}

/** Kibble 配方內的一筆食材（基底 + 份量）。 */
export interface KibbleIngredient extends KibbleBase {
  amount: number;
}

/** 營養合計 */
export interface Totals {
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  fiber: number;
}
