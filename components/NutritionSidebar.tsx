"use client";

import { useState } from "react";
import type { Totals } from "@/lib/types";

const round1 = (n: number) => Math.round(n * 10) / 10;

export interface SelectedItem {
  id: string;
  name: string;
  pro: number;
  cal: number;
  /** 目前份量（g）。Kibble 配方為 undefined（不可在此編輯重量）。 */
  amount?: number;
  unit?: string;
}

interface Props {
  totals: Totals;
  items: SelectedItem[];
  onRemove: (id: string) => void;
  onAmount: (id: string, value: number) => void;
  onClear: () => void;
}

export default function NutritionSidebar({
  totals,
  items,
  onRemove,
  onAmount,
  onClear,
}: Props) {
  const { cal, pro, carb, fat, fiber } = totals;
  const mx = Math.max(carb, fat, fiber, 1);
  const pct = (v: number) => `${Math.min(100, (v / mx) * 100)}%`;
  const [open, setOpen] = useState(false);

  return (
    <aside className="thin-scroll fixed inset-x-0 bottom-0 z-40 flex max-h-[78vh] flex-col gap-3 overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:sticky lg:inset-x-auto lg:bottom-auto lg:top-0 lg:h-screen lg:max-h-none lg:w-[260px] lg:gap-5 lg:rounded-none lg:border-l lg:border-t-0 lg:p-5 lg:shadow-none">
      {/* 手機：精簡合計列（點擊展開 / 收合） */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between lg:hidden"
      >
        <span className="flex items-baseline gap-3">
          <span className="text-xl font-medium">
            {Math.round(cal)}
            <span className="ml-0.5 text-[11px] text-muted">kcal</span>
          </span>
          <span className="text-xl font-medium text-pro">
            {round1(pro)}
            <span className="ml-0.5 text-[11px] text-muted">g 蛋白</span>
          </span>
        </span>
        <span className="text-[11px] text-muted">{open ? "收合 ▾" : "明細 ▸"}</span>
      </button>

      {/* 桌機：今日合計標題 + 大數字 */}
      <div className="hidden text-[11px] font-medium uppercase tracking-[0.06em] text-muted lg:block">
        今日合計
      </div>
      <div className="hidden grid-cols-2 gap-2.5 lg:grid">
        <div>
          <div className="text-[26px] font-medium leading-none">{Math.round(cal)}</div>
          <div className="mt-0.5 text-[11px] text-muted">熱量 kcal</div>
        </div>
        <div>
          <div className="text-[26px] font-medium leading-none text-pro">
            {round1(pro)}g
          </div>
          <div className="mt-0.5 text-[11px] text-muted">蛋白質</div>
        </div>
      </div>

      {/* 明細（手機收合時隱藏；桌機恆顯示） */}
      <div className={`${open ? "flex" : "hidden"} flex-col gap-3 lg:flex lg:gap-5`}>
      {/* 三大營養素進度條 */}
      <div className="flex flex-col gap-2">
        <MacroRow label="碳水" value={round1(carb)} width={pct(carb)} color="var(--carb)" />
        <MacroRow label="脂肪" value={round1(fat)} width={pct(fat)} color="var(--fat)" />
        <MacroRow label="纖維" value={round1(fiber)} width={pct(fiber)} color="var(--fiber)" />
      </div>

      {/* 已選食材 */}
      <div className="rounded-rad bg-bg p-3.5">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
          已選食材
        </div>
        <div className="flex max-h-[180px] flex-col gap-1 overflow-y-auto thin-scroll">
          {items.length === 0 ? (
            <div className="py-3 text-center text-xs text-hint">尚未選取</div>
          ) : (
            items.map((it) => (
              <div
                key={it.id}
                className="flex flex-col gap-1 border-b-[0.5px] border-border py-1.5 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex-1 truncate text-xs font-medium">{it.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(it.id)}
                    className="text-[15px] leading-none text-hint hover:text-warn"
                    aria-label="移除"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  {it.amount != null ? (
                    <>
                      <input
                        type="number"
                        min={0}
                        value={it.amount}
                        onChange={(e) => onAmount(it.id, parseFloat(e.target.value) || 0)}
                        className="w-14 rounded border-[0.5px] border-border bg-surface px-1.5 py-[2px] text-center text-[11px] focus:border-accent focus:outline-none"
                      />
                      <span className="text-[10px] text-muted">{it.unit}</span>
                    </>
                  ) : (
                    <span className="text-[10px] text-hint">配方</span>
                  )}
                  <span className="ml-auto text-[11px] text-pro">{round1(it.pro)}g 蛋白</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="w-full rounded-rad-sm border-[0.5px] border-border bg-transparent py-[7px] text-xs text-muted hover:bg-bg"
      >
        清除所有選取
      </button>

      <div className="text-[11px] leading-[1.7] text-muted">
        目標：蛋白質 120g+
        <br />
        熱量 900–1100 kcal
      </div>
      </div>
    </aside>
  );
}

function MacroRow({
  label,
  value,
  width,
  color,
}: {
  label: string;
  value: number;
  width: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-7 text-[11px] text-muted">{label}</span>
      <div className="h-1 flex-1 overflow-hidden rounded-sm bg-border">
        <div
          className="h-1 rounded-sm transition-[width] duration-300"
          style={{ width, background: color }}
        />
      </div>
      <span className="w-8 text-right text-[11px]">{value}g</span>
    </div>
  );
}
