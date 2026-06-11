// 食材分類：作為卡片左上角標籤，也供配菜區下拉篩選使用。
// 可自由增減此清單，新分類會自動出現在卡片下拉與篩選器中。
export const CATEGORIES = [
  "主食",
  "肉類",
  "海鮮",
  "蛋類",
  "乳製品",
  "豆製品",
  "葉菜類",
  "根莖類",
  "菇類",
  "瓜類",
  "茄果類",
  "飲品",
  "其他",
] as const;

export type FoodCategory = (typeof CATEGORIES)[number];

// 每個分類的標籤配色（背景 / 文字）
const COLORS: Record<FoodCategory, { bg: string; color: string }> = {
  主食: { bg: "#FAEEDA", color: "#BA7517" },
  肉類: { bg: "#FAF0EB", color: "#B5450B" },
  海鮮: { bg: "#E8F2FA", color: "#1D6FA4" },
  蛋類: { bg: "#FBF3D9", color: "#A07A12" },
  乳製品: { bg: "#FCEEF4", color: "#B23A6B" },
  豆製品: { bg: "#EEEDFE", color: "#534AB7" },
  葉菜類: { bg: "#EAF3DE", color: "#3B6D11" },
  根莖類: { bg: "#F3ECD9", color: "#8A6D1E" },
  菇類: { bg: "#EFEAE2", color: "#6B5B43" },
  瓜類: { bg: "#E6F4EE", color: "#1F7A5A" },
  茄果類: { bg: "#FBEAEA", color: "#C0392B" },
  飲品: { bg: "#F1EFE8", color: "#7A7870" },
  其他: { bg: "#F1EFE8", color: "#5B5A54" },
};

const FALLBACK = { bg: "#F1EFE8", color: "#5B5A54" };

export function categoryColor(category: string): { bg: string; color: string } {
  return COLORS[category as FoodCategory] ?? FALLBACK;
}
