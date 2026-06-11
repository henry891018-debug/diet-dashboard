"use client";

import type { FoodTag, Ingredient } from "@/lib/types";

/** 標籤 → 顏色 class */
function tagClass(tag: FoodTag): string {
  switch (tag) {
    case "蛋白質":
      return "bg-pro-l text-pro";
    case "主食":
      return "bg-amber-l text-amber";
    case "豆類":
      return "bg-purple-l text-purple";
    case "蔬菜":
      return "bg-green-l text-green";
    default:
      return "bg-bg text-muted";
  }
}

const round1 = (n: number) => Math.round(n * 10) / 10;

interface Props {
  ing: Ingredient;
  selected: boolean;
  /** 目前輸入框顯示的份量 */
  amount: number;
  /** 是否為蛋白質卡片（顯示生重欄位 + 熟重換算） */
  isProtein: boolean;
  onToggle: () => void;
  onAmountChange: (value: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function IngredientCard({
  ing,
  selected,
  amount,
  isProtein,
  onToggle,
  onAmountChange,
  onEdit,
  onDelete,
}: Props) {
  // 數值以每 100g 計，故實際含量 = 值 × (份量 / 100)
  const ratio = amount / 100;

  return (
    <div
      onClick={onToggle}
      className={[
        "group relative select-none cursor-pointer rounded-rad border p-2.5 transition-colors",
        selected
          ? "border-accent bg-accent-l"
          : "border-border bg-surface hover:border-border2",
      ].join(" ")}
    >
      {/* 勾選圈 */}
      <div
        className={[
          "absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent transition-opacity",
          selected ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <svg viewBox="0 0 12 12" className="h-[9px] w-[9px] fill-none stroke-white stroke-[2.5]">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      </div>

      {/* 編輯 / 刪除（hover 顯示；選取時往左讓開勾選圈） */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={[
          "absolute top-1.5 flex gap-[3px] opacity-0 transition-opacity group-hover:opacity-100",
          selected ? "right-7" : "right-1.5",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={onEdit}
          className="flex h-5 w-5 items-center justify-center rounded bg-border text-[11px] text-muted hover:bg-border2"
          aria-label="編輯"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-5 w-5 items-center justify-center rounded bg-border text-[11px] text-muted hover:bg-[#FCEBEB] hover:text-warn"
          aria-label="刪除"
        >
          ✕
        </button>
      </div>

      <span
        className={`mb-[5px] inline-block rounded-full px-1.5 py-px text-[10px] ${tagClass(ing.tag)}`}
      >
        {ing.tag}
      </span>

      <div className="mb-1 pr-5 text-[15px] font-semibold leading-snug text-text">
        {ing.name}
      </div>

      {/* 份量輸入 */}
      <div className="mb-0.5 flex items-center gap-1">
        {isProtein && <span className="min-w-[24px] text-[10px] text-muted">生重</span>}
        <input
          type="number"
          min={0}
          value={amount}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          className="w-11 rounded border-[0.5px] border-border bg-transparent px-1 py-px text-center text-xs"
        />
        <span className="text-[10px] text-muted">{ing.unit}</span>
      </div>

      {/* 熟重換算（僅蛋白質且有縮水率） */}
      {isProtein && ing.shrink ? (
        <div className="mb-1.5 text-[10px] text-hint">
          熟重約 {Math.round(amount * ing.shrink)}
          {ing.unit}
        </div>
      ) : null}

      {/* 營養 chips */}
      <div className="grid grid-cols-2 gap-[3px]">
        <span className="rounded bg-[#F1EFE8] px-[5px] py-0.5 text-center text-[10px] text-[#444441]">
          {Math.round(ing.cal * ratio)} kcal
        </span>
        <span className="rounded bg-pro-l px-[5px] py-0.5 text-center text-[10px] text-pro">
          {round1(ing.pro * ratio)}g 蛋白
        </span>
        <span className="rounded bg-amber-l px-[5px] py-0.5 text-center text-[10px] text-amber">
          {round1(ing.carb * ratio)}g 碳水
        </span>
        <span className="rounded bg-warn-l px-[5px] py-0.5 text-center text-[10px] text-warn">
          {round1(ing.fat * ratio)}g 脂肪
        </span>
      </div>
    </div>
  );
}
