"use client";

import type { Totals } from "@/lib/types";

const round1 = (n: number) => Math.round(n * 10) / 10;

export interface SelectedItem {
  id: string;
  name: string;
  pro: number;
  cal: number;
}

interface Props {
  totals: Totals;
  items: SelectedItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function NutritionSidebar({ totals, items, onRemove, onClear }: Props) {
  const { cal, pro, carb, fat, fiber } = totals;
  const mx = Math.max(carb, fat, fiber, 1);
  const pct = (v: number) => `${Math.min(100, (v / mx) * 100)}%`;

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] flex-col gap-5 overflow-y-auto border-l border-border bg-surface p-5 thin-scroll">
      <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
        今日合計
      </div>

      <div className="grid grid-cols-2 gap-2.5">
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
                className="flex items-center justify-between gap-2 border-b-[0.5px] border-border py-[3px] text-xs last:border-b-0"
              >
                <span className="flex-1 truncate">{it.name}</span>
                <span className="text-[11px] text-pro">{round1(it.pro)}g</span>
                <button
                  type="button"
                  onClick={() => onRemove(it.id)}
                  className="pl-1 text-[15px] leading-none text-hint hover:text-warn"
                  aria-label="移除"
                >
                  ×
                </button>
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
