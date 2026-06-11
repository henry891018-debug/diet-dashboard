"use client";

import { useEffect, useState } from "react";
import type { Ingredient } from "@/lib/types";

const UNITS = ["g", "ml", "顆", "碗", "份"];

/** 編輯後回傳的欄位（不含 uid / tag，由父層保留）。 */
export interface EditedFood {
  name: string;
  amount: number;
  unit: string;
  cal: number;
  pro: number;
  carb: number;
  fat: number;
  fiber: number;
  shrink?: number;
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
    cal: "",
    pro: "",
    carb: "",
    fat: "",
    fiber: "",
    shrink: "",
  });

  // 帶入被編輯的食材
  useEffect(() => {
    if (open && ingredient) {
      setForm({
        name: ingredient.name,
        amount: String(ingredient.amount),
        unit: ingredient.unit,
        cal: String(ingredient.cal),
        pro: String(ingredient.pro),
        carb: String(ingredient.carb),
        fat: String(ingredient.fat),
        fiber: String(ingredient.fiber),
        shrink: ingredient.shrink != null ? String(ingredient.shrink) : "",
      });
    }
  }, [open, ingredient]);

  if (!open || !ingredient) return null;

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function confirmEdit() {
    const food: EditedFood = {
      name: form.name.trim() || ingredient!.name,
      amount: parseFloat(form.amount) || ingredient!.amount,
      unit: form.unit,
      cal: parseFloat(form.cal) || 0,
      pro: parseFloat(form.pro) || 0,
      carb: parseFloat(form.carb) || 0,
      fat: parseFloat(form.fat) || 0,
      fiber: parseFloat(form.fiber) || 0,
    };
    const sh = parseFloat(form.shrink);
    if (sh) food.shrink = sh;
    onSave(food);
  }

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

        <div className="mb-2.5 grid grid-cols-2 gap-2">
          <Field label="預設份量">
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
          <NumField label="熱量 kcal" value={form.cal} onChange={(v) => set("cal", v)} />
          <NumField label="蛋白質 g" value={form.pro} onChange={(v) => set("pro", v)} />
          <NumField label="碳水 g" value={form.carb} onChange={(v) => set("carb", v)} />
          <NumField label="脂肪 g" value={form.fat} onChange={(v) => set("fat", v)} />
          <NumField label="纖維 g" value={form.fiber} onChange={(v) => set("fiber", v)} />
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
