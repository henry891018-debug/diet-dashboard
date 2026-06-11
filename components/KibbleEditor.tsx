"use client";

import { useState } from "react";
import { KIBBLE_BASE, kibbleTotals } from "@/lib/ingredients";
import type { KibbleIngredient, Totals } from "@/lib/types";

const round1 = (n: number) => Math.round(n * 10) / 10;

const emptyDraft = { name: "", amount: "", cal: "", pro: "", carb: "", fat: "", fiber: "" };

interface Props {
  open: boolean;
  ingredients: KibbleIngredient[];
  onChange: (ings: KibbleIngredient[]) => void;
  onApply: (totals: Totals) => void;
  onClose: () => void;
}

export default function KibbleEditor({
  open,
  ingredients,
  onChange,
  onApply,
  onClose,
}: Props) {
  // hooks 必須在任何 early return 之前呼叫
  const [draft, setDraft] = useState({ ...emptyDraft });

  if (!open) return null;

  const total = kibbleTotals(ingredients);
  const existing = new Set(ingredients.map((i) => i.name));
  const quick = KIBBLE_BASE.filter((b) => !existing.has(b.name));

  const setD = (key: keyof typeof emptyDraft, value: string) =>
    setDraft((d) => ({ ...d, [key]: value }));

  // 自訂新增：輸入每 100g 營養值，內部換算成每 g 儲存
  const addCustom = () => {
    const name = draft.name.trim();
    if (!name) return;
    const amount = parseFloat(draft.amount) || 100;
    const per = (v: string) => (parseFloat(v) || 0) / 100;
    onChange([
      ...ingredients,
      {
        name,
        unit: "g",
        amount,
        cal: per(draft.cal),
        pro: per(draft.pro),
        carb: per(draft.carb),
        fat: per(draft.fat),
        fiber: per(draft.fiber),
      },
    ]);
    setDraft({ ...emptyDraft });
  };

  const updateAmt = (idx: number, value: number) => {
    onChange(
      ingredients.map((ing, i) => (i === idx ? { ...ing, amount: value } : ing)),
    );
  };
  const removeIng = (idx: number) => {
    onChange(ingredients.filter((_, i) => i !== idx));
  };
  const addIng = (name: string) => {
    const base = KIBBLE_BASE.find((b) => b.name === name);
    if (!base) return;
    onChange([...ingredients, { ...base, amount: base.perUnit ? 1 : 80 }]);
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
            <div className="py-3 text-center text-xs text-hint">加入食材</div>
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

        {/* 快速加入 */}
        {quick.length > 0 && (
          <div className="mb-3">
            <div className="mb-1.5 text-[11px] text-muted">快速加入</div>
            <div className="flex flex-wrap gap-1.5">
              {quick.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => addIng(b.name)}
                  className="rounded-full border-[0.5px] border-border bg-surface px-2.5 py-1 text-[11px] text-muted hover:border-accent hover:text-accent"
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 新增其他食材（自訂） */}
        <div className="mb-3 rounded-rad-sm border border-border p-2.5">
          <div className="mb-1.5 text-[11px] text-muted">新增其他食材（每 100g 營養值）</div>
          <input
            className="mb-1 w-full rounded border-[0.5px] border-border bg-bg px-2 py-1 text-xs focus:border-accent focus:outline-none"
            placeholder="名稱"
            value={draft.name}
            onChange={(e) => setD("name", e.target.value)}
          />
          <div className="grid grid-cols-3 gap-1">
            <DraftInput placeholder="份量 g" value={draft.amount} onChange={(v) => setD("amount", v)} />
            <DraftInput placeholder="熱量" value={draft.cal} onChange={(v) => setD("cal", v)} />
            <DraftInput placeholder="蛋白" value={draft.pro} onChange={(v) => setD("pro", v)} />
            <DraftInput placeholder="碳水" value={draft.carb} onChange={(v) => setD("carb", v)} />
            <DraftInput placeholder="脂肪" value={draft.fat} onChange={(v) => setD("fat", v)} />
            <DraftInput placeholder="纖維" value={draft.fiber} onChange={(v) => setD("fiber", v)} />
          </div>
          <button
            type="button"
            onClick={addCustom}
            className="mt-1.5 w-full rounded-rad-sm border-[0.5px] border-accent bg-accent-l py-1.5 text-[11px] font-medium text-accent hover:bg-accent hover:text-white"
          >
            ＋ 加入食材
          </button>
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

function DraftInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border-[0.5px] border-border bg-bg px-2 py-1 text-center text-xs focus:border-accent focus:outline-none"
    />
  );
}
