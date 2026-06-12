"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, type FoodCategory } from "@/lib/categories";
import type { Ingredient } from "@/lib/types";

const UNITS = ["g", "ml"];

const round1 = (n: number) => Math.round(n * 10) / 10;

/** 編輯後回傳的欄位（不含 uid，由父層保留）。 */
export interface EditedFood {
  name: string;
  amount: number;
  unit: string;
  category: FoodCategory;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  fiber: number;
  shrink?: number;
  pieceGram?: number;
  pieceUnit?: string;
}

interface Props {
  open: boolean;
  isProtein: boolean;
  ingredient: Ingredient | null;
  onClose: () => void;
  onSave: (food: EditedFood) => void;
}

export default function EditFoodModal({
  open,
  isProtein,
  ingredient,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    unit: "g",
    category: "其他",
    cal: "",
    pro: "",
    carb: "",
    fat: "",
    fiber: "",
    shrink: "",
    pieceGram: "",
    pieceUnit: "",
  });

  // 帶入被編輯的食材
  useEffect(() => {
    if (open && ingredient) {
      setForm({
        name: ingredient.name,
        amount: String(ingredient.amount),
        unit: ingredient.unit,
        category: ingredient.category,
        cal: String(ingredient.cal),
        pro: String(ingredient.pro),
        carb: String(ingredient.carb),
        fat: String(ingredient.fat),
        fiber: String(ingredient.fiber),
        shrink: ingredient.shrink != null ? String(ingredient.shrink) : "",
        pieceGram: ingredient.pieceGram != null ? String(ingredient.pieceGram) : "",
        pieceUnit: ingredient.pieceUnit ?? "",
      });
    }
  }, [open, ingredient]);

  if (!open || !ingredient) return null;

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function confirmEdit() {
    const pu = form.pieceUnit.trim();
    const pg = parseFloat(form.pieceGram);
    const food: EditedFood = {
      name: form.name.trim() || ingredient!.name,
      amount: parseFloat(form.amount) || ingredient!.amount,
      unit: form.unit,
      category: form.category as FoodCategory,
      cal: parseFloat(form.cal) || 0,
      pro: parseFloat(form.pro) || 0,
      carb: parseFloat(form.carb) || 0,
      fat: parseFloat(form.fat) || 0,
      fiber: parseFloat(form.fiber) || 0,
      // 數量單位：兩者都有才啟用，否則清除
      pieceUnit: pu && pg > 0 ? pu : undefined,
      pieceGram: pu && pg > 0 ? pg : undefined,
    };
    const sh = parseFloat(form.shrink);
    if (sh) food.shrink = sh;
    onSave(food);
  }

  const pieceGram = parseFloat(form.pieceGram) || 0;
  const pieceFactor = pieceGram / 100;
  const num = (s: string) => parseFloat(s) || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-[420px] max-w-[94vw] overflow-y-auto rounded-[14px] bg-surface p-6 thin-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-base font-medium">編輯食材</div>

        <Field label="名稱">
          <input
            className="modal-input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>

        <Field label="分類">
          <select
            className="modal-input"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <div className="mb-2.5 grid grid-cols-2 gap-2">
          <Field label="預設份量 (g)">
            <input
              className="modal-input"
              type="number"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
          </Field>
          <Field label="單位">
            <select
              className="modal-input"
              value={form.unit}
              onChange={(e) => set("unit", e.target.value)}
            >
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </Field>
        </div>

        {isProtein && (
          <Field label="縮水率">
            <input
              className="modal-input"
              type="number"
              step="0.01"
              value={form.shrink}
              onChange={(e) => set("shrink", e.target.value)}
            />
          </Field>
        )}

        <div className="grid grid-cols-3 gap-2">
          <NumField label="熱量 kcal/100g" value={form.cal} onChange={(v) => set("cal", v)} />
          <NumField label="蛋白質 g/100g" value={form.pro} onChange={(v) => set("pro", v)} />
          <NumField label="碳水 g/100g" value={form.carb} onChange={(v) => set("carb", v)} />
          <NumField label="脂肪 g/100g" value={form.fat} onChange={(v) => set("fat", v)} />
          <NumField label="纖維 g/100g" value={form.fiber} onChange={(v) => set("fiber", v)} />
        </div>

        {/* 數量單位（選填）：例如 1 顆 = N 公克，卡片可用數量輸入取代秤重 */}
        <div className="mt-3 rounded-rad-sm border border-border p-2.5">
          <div className="mb-2 text-[11px] font-medium text-muted">數量單位（選填）</div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted">單位名稱</span>
            <input
              value={form.pieceUnit}
              onChange={(e) => set("pieceUnit", e.target.value)}
              placeholder="顆 / 片 / 條…"
              className="w-16 rounded border-[0.5px] border-border bg-bg px-2 py-1 text-center text-xs focus:border-accent focus:outline-none"
            />
            <span className="ml-1 text-[11px] text-muted">每{form.pieceUnit || "單位"}重量 (g)</span>
            <input
              type="number"
              min={0}
              value={form.pieceGram}
              onChange={(e) => set("pieceGram", e.target.value)}
              className="w-16 rounded border-[0.5px] border-border bg-bg px-2 py-1 text-center text-xs focus:border-accent focus:outline-none"
            />
          </div>
          {form.pieceUnit.trim() && pieceGram > 0 && (
            <>
              <div className="mb-1 mt-2 text-[11px] text-muted">
                每{form.pieceUnit.trim()}（{pieceGram}g）約：
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded bg-[#F1EFE8] px-[5px] py-0.5 text-[10px] text-[#444441]">
                  {Math.round(num(form.cal) * pieceFactor)} kcal
                </span>
                <span className="rounded bg-pro-l px-[5px] py-0.5 text-[10px] text-pro">
                  {round1(num(form.pro) * pieceFactor)}g 蛋白
                </span>
                <span className="rounded bg-amber-l px-[5px] py-0.5 text-[10px] text-amber">
                  {round1(num(form.carb) * pieceFactor)}g 碳水
                </span>
                <span className="rounded bg-warn-l px-[5px] py-0.5 text-[10px] text-warn">
                  {round1(num(form.fat) * pieceFactor)}g 脂肪
                </span>
              </div>
            </>
          )}
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
            onClick={confirmEdit}
            className="flex-1 rounded-rad-sm bg-accent py-2 text-[13px] font-medium text-white hover:bg-accent-d"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <div className="mb-[3px] text-[11px] text-muted">{label}</div>
      {children}
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <input
        className="modal-input"
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
