"use client";

import { ingredientToKibble, kibbleTotals } from "@/lib/ingredients";
import type { Ingredient, KibbleIngredient, Totals } from "@/lib/types";

const round1 = (n: number) => Math.round(n * 10) / 10;

interface Props {
  open: boolean;
  ingredients: KibbleIngredient[];
  /** 可加入的食材來源：配菜區 */
  sideOptions: Ingredient[];
  onChange: (ings: KibbleIngredient[]) => void;
  onApply: (totals: Totals) => void;
  onClose: () => void;
}

export default function KibbleEditor({
  open,
  ingredients,
  sideOptions,
  onChange,
  onApply,
  onClose,
}: Props) {
  if (!open) return null;

  const total = kibbleTotals(ingredients);
  const existing = new Set(ingredients.map((i) => i.name));
  const available = sideOptions.filter((s) => !existing.has(s.name));

  const updateAmt = (idx: number, value: number) => {
    onChange(
      ingredients.map((ing, i) => (i === idx ? { ...ing, amount: value } : ing)),
    );
  };
  const removeIng = (idx: number) => {
    onChange(ingredients.filter((_, i) => i !== idx));
  };
  const addFromSide = (uid: string) => {
    const ing = sideOptions.find((s) => s.uid === uid);
    if (!ing) return;
    onChange([...ingredients, ingredientToKibble(ing)]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-[480px] max-w-[94vw] overflow-y-auto rounded-[14px] bg-surface p-6 thin-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-base font-medium">編輯 Kibble 配方</div>
        <div className="mb-3 text-xs text-muted">加入配方 Kibble 內含的食材與份量</div>

        {/* 配方食材清單 */}
        <div className="mb-3 flex flex-col gap-1.5">
          {ingredients.length === 0 ? (
            <div className="py-3 text-center text-xs text-hint">從下方選擇配菜加入</div>
          ) : (
            ingredients.map((ing, i) => (
              <div
                key={`${ing.name}-${i}`}
                className="flex items-center gap-2 rounded-rad-sm bg-bg px-2.5 py-2"
              >
                <span className="flex-1 text-[13px]">{ing.name}</span>
                <input
                  type="number"
                  min={0}
                  value={ing.amount}
                  onChange={(e) => updateAmt(i, parseFloat(e.target.value) || 0)}
                  className="w-14 rounded border-[0.5px] border-border bg-surface px-1.5 py-[3px] text-center text-xs"
                />
                <span className="min-w-[16px] text-[11px] text-muted">{ing.unit}</span>
                <span className="min-w-[36px] text-right text-[11px] text-pro">
                  {round1(ing.pro * ing.amount)}g
                </span>
                <span className="min-w-[44px] text-[11px] text-muted">
                  {Math.round(ing.cal * ing.amount)} kcal
                </span>
                <button
                  type="button"
                  onClick={() => removeIng(i)}
                  className="text-sm text-hint hover:text-warn"
                  aria-label="移除"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* 從配菜加入（下拉選擇，不需另建食材庫） */}
        <div className="mb-3">
          <div className="mb-1.5 text-[11px] text-muted">從配菜加入食材</div>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) addFromSide(e.target.value);
            }}
            className="w-full rounded-rad-sm border-[0.5px] border-border bg-bg px-2.5 py-2 text-[13px] focus:border-accent focus:outline-none"
          >
            <option value="" disabled>
              選擇配菜加入…
            </option>
            {available.map((s) => (
              <option key={s.uid} value={s.uid}>
                {s.name}
              </option>
            ))}
          </select>
          {available.length === 0 && (
            <div className="mt-1 text-[11px] text-hint">
              配菜都已加入（可到「配菜」區新增更多食材）
            </div>
          )}
        </div>

        <hr className="my-2.5 border-t-[0.5px] border-border" />

        {/* 本份合計 */}
        <div className="mb-1.5 text-[11px] font-medium text-muted">此份 Kibble 合計</div>
        <div className="flex flex-wrap gap-3 rounded-rad-sm bg-accent-l px-2.5 py-2">
          <span className="text-xs">
            <span className="font-medium">{Math.round(total.cal)}</span> kcal
          </span>
          <span className="text-xs text-pro">
            <span className="font-medium">{round1(total.pro)}</span>g 蛋白
          </span>
          <span className="text-xs">
            <span className="font-medium">{round1(total.carb)}</span>g 碳水
          </span>
          <span className="text-xs">
            <span className="font-medium">{round1(total.fat)}</span>g 脂肪
          </span>
          <span className="text-xs text-green">
            <span className="font-medium">{round1(total.fiber)}</span>g 纖維
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-rad-sm border-[0.5px] border-border px-3.5 py-2 text-[13px] text-muted"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => onApply(kibbleTotals(ingredients))}
            className="flex-1 rounded-rad-sm bg-accent py-2 text-[13px] font-medium text-white hover:bg-accent-d"
          >
            套用
          </button>
        </div>
      </div>
    </div>
  );
}
