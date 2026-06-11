"use client";

import { useEffect, useState } from "react";

const UNITS = ["g", "ml"];

export interface NewFood {
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
  onClose: () => void;
  onAdd: (food: NewFood) => void;
}

const emptyForm = {
  name: "",
  amount: "",
  unit: "g",
  cal: "",
  pro: "",
  carb: "",
  fat: "",
  fiber: "",
  shrink: "",
};

export default function AddFoodModal({ open, isProtein, onClose, onAdd }: Props) {
  const [form, setForm] = useState({ ...emptyForm });

  // 每次開啟時重置
  useEffect(() => {
    if (open) setForm({ ...emptyForm });
  }, [open]);

  if (!open) return null;

  const set = (key: keyof typeof emptyForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function confirmAdd() {
    const name = form.name.trim();
    if (!name) return;
    const food: NewFood = {
      name,
      amount: parseFloat(form.amount) || 100,
      unit: form.unit,
      cal: parseFloat(form.cal) || 0,
      pro: parseFloat(form.pro) || 0,
      carb: parseFloat(form.carb) || 0,
      fat: parseFloat(form.fat) || 0,
      fiber: parseFloat(form.fiber) || 0,
    };
    const sh = parseFloat(form.shrink);
    if (isProtein && sh) food.shrink = sh;
    onAdd(food);
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
        <div className="mb-4 text-base font-medium">新增食材</div>
        <div className="mb-3 text-[11px] text-muted">輸入食材名稱與營養值</div>

        <Field label="名稱">
          <input
            className="modal-input"
            placeholder="食材名稱"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>

        <div className="mb-2.5 grid grid-cols-2 gap-2">
          <Field label="預設份量 (g)">
            <input
              className="modal-input"
              type="number"
              placeholder="100"
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
          <Field label="縮水率（熟重後重量 / 生重，如 0.8）">
            <input
              className="modal-input"
              type="number"
              step="0.01"
              placeholder="0.80"
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
            onClick={confirmAdd}
            className="flex-1 rounded-rad-sm bg-accent py-2 text-[13px] font-medium text-white hover:bg-accent-d"
          >
            加入
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
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}
