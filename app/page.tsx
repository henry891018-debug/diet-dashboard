"use client";

import { useMemo, useState } from "react";
import AddFoodModal, { type NewFood } from "@/components/AddFoodModal";
import EditFoodModal, { type EditedFood } from "@/components/EditFoodModal";
import IngredientCard from "@/components/IngredientCard";
import KibbleEditor from "@/components/KibbleEditor";
import NutritionSidebar, { type SelectedItem } from "@/components/NutritionSidebar";
import {
  createDefaultKibble,
  createInitialData,
  isProteinSection,
  makeUid,
  scaled,
} from "@/lib/ingredients";
import type {
  FoodTag,
  Ingredient,
  KibbleIngredient,
  SectionId,
  Totals,
} from "@/lib/types";

type Tab = "b" | "l";
type MainMode = "rice" | "kibble";

const KIBBLE_ID = "__kibble";

export default function Page() {
  const [tab, setTab] = useState<Tab>("b");
  const [data, setData] = useState<Record<SectionId, Ingredient[]>>(createInitialData);
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Record<string, true>>({});

  const [mainMode, setMainMode] = useState<MainMode>("rice");
  const [kibbleIngredients, setKibbleIngredients] = useState<KibbleIngredient[]>([]);
  const [kibbleResult, setKibbleResult] = useState<Totals | null>(null);
  const [kibbleSelected, setKibbleSelected] = useState(false);
  const [kibbleOpen, setKibbleOpen] = useState(false);

  const [addModal, setAddModal] = useState<{ open: boolean; section: SectionId | null }>({
    open: false,
    section: null,
  });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    section: SectionId | null;
    uid: string | null;
  }>({ open: false, section: null, uid: null });

  // uid -> {ing, section} 查表
  const lookup = useMemo(() => {
    const map = new Map<string, { ing: Ingredient; section: SectionId }>();
    (Object.keys(data) as SectionId[]).forEach((section) => {
      data[section].forEach((ing) => map.set(ing.uid, { ing, section }));
    });
    return map;
  }, [data]);

  const amountOf = (ing: Ingredient) => amounts[ing.uid] ?? ing.amount;
  const ratioOf = (ing: Ingredient) => (ing.amount ? amountOf(ing) / ing.amount : 0);

  // 合計 + 已選清單
  const { totals, items } = useMemo(() => {
    const t: Totals = { cal: 0, pro: 0, carb: 0, fat: 0, fiber: 0 };
    const list: SelectedItem[] = [];
    Object.keys(selected).forEach((uid) => {
      const entry = lookup.get(uid);
      if (!entry) return;
      const r = ratioOf(entry.ing);
      const s = scaled(entry.ing, r);
      t.cal += s.cal;
      t.pro += s.pro;
      t.carb += s.carb;
      t.fat += s.fat;
      t.fiber += s.fiber;
      list.push({ id: uid, name: entry.ing.name, pro: s.pro, cal: s.cal });
    });
    if (kibbleSelected && kibbleResult) {
      t.cal += kibbleResult.cal;
      t.pro += kibbleResult.pro;
      t.carb += kibbleResult.carb;
      t.fat += kibbleResult.fat;
      t.fiber += kibbleResult.fiber;
      list.push({ id: KIBBLE_ID, name: "Kibble", pro: kibbleResult.pro, cal: kibbleResult.cal });
    }
    return { totals: t, items: list };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, amounts, lookup, kibbleSelected, kibbleResult]);

  // ---- 食材操作 ----
  const toggle = (uid: string) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (next[uid]) delete next[uid];
      else next[uid] = true;
      return next;
    });

  const setAmount = (uid: string, value: number) =>
    setAmounts((prev) => ({ ...prev, [uid]: value }));

  const addFood = (section: SectionId, food: NewFood) => {
    const tag: FoodTag = isProteinSection(section) ? "蛋白質" : "自訂";
    const ing: Ingredient = { ...food, uid: makeUid(), tag };
    setData((prev) => ({ ...prev, [section]: [...prev[section], ing] }));
    setAddModal({ open: false, section: null });
  };

  const saveEdit = (section: SectionId, uid: string, edited: EditedFood) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].map((ing) =>
        ing.uid === uid ? { ...ing, ...edited, shrink: edited.shrink } : ing,
      ),
    }));
    setEditModal({ open: false, section: null, uid: null });
  };

  const deleteIng = (section: SectionId, uid: string) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].filter((ing) => ing.uid !== uid),
    }));
    setSelected((prev) => {
      const next = { ...prev };
      delete next[uid];
      return next;
    });
    setAmounts((prev) => {
      const next = { ...prev };
      delete next[uid];
      return next;
    });
  };

  const removeSelected = (id: string) => {
    if (id === KIBBLE_ID) {
      setKibbleSelected(false);
      return;
    }
    setSelected((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const clearAll = () => {
    setSelected({});
    setKibbleSelected(false);
  };

  const selectMain = (mode: MainMode) => {
    setMainMode(mode);
    if (mode === "rice") {
      setKibbleSelected(false);
    } else {
      // 切到 Kibble：取消白飯主食的選取
      setSelected((prev) => {
        const next = { ...prev };
        data["l-main-rice"].forEach((ing) => delete next[ing.uid]);
        return next;
      });
    }
  };

  const openKibbleEditor = () => {
    if (kibbleIngredients.length === 0) setKibbleIngredients(createDefaultKibble());
    setKibbleOpen(true);
  };

  const applyKibble = (t: Totals) => {
    setKibbleResult(t);
    setKibbleSelected(true);
    setKibbleOpen(false);
  };

  // ---- 渲染輔助 ----
  const editingIngredient =
    editModal.section && editModal.uid
      ? data[editModal.section].find((i) => i.uid === editModal.uid) ?? null
      : null;

  return (
    <div className="grid min-h-screen grid-cols-[1fr_260px]">
      <main className="p-6">
        <h1 className="mb-1 text-xl font-medium tracking-[-0.01em]">餐點規劃</h1>
        <p className="mb-6 text-xs text-muted">選擇食材，即時計算營養總覽</p>

        {/* 餐別切換 */}
        <div className="mb-6 flex w-fit gap-0.5 rounded-rad bg-border p-[3px]">
          <TabButton active={tab === "b"} onClick={() => setTab("b")}>
            早餐
          </TabButton>
          <TabButton active={tab === "l"} onClick={() => setTab("l")}>
            午餐
          </TabButton>
        </div>

        {/* 早餐 */}
        {tab === "b" && (
          <div>
            <Section label="主食">
              <Grid
                section="b-main"
                items={data["b-main"]}
                selected={selected}
                amountOf={amountOf}
                onToggle={toggle}
                onAmount={setAmount}
                onEdit={(uid) => setEditModal({ open: true, section: "b-main", uid })}
                onDelete={(uid) => deleteIng("b-main", uid)}
              />
            </Section>

            <Section
              label="蛋白質"
              onAdd={() => setAddModal({ open: true, section: "b-pro" })}
            >
              <Grid
                section="b-pro"
                items={data["b-pro"]}
                selected={selected}
                amountOf={amountOf}
                onToggle={toggle}
                onAmount={setAmount}
                onEdit={(uid) => setEditModal({ open: true, section: "b-pro", uid })}
                onDelete={(uid) => deleteIng("b-pro", uid)}
              />
            </Section>

            <Section
              label="飲品"
              onAdd={() => setAddModal({ open: true, section: "b-drink" })}
            >
              <Grid
                section="b-drink"
                items={data["b-drink"]}
                selected={selected}
                amountOf={amountOf}
                onToggle={toggle}
                onAmount={setAmount}
                onEdit={(uid) => setEditModal({ open: true, section: "b-drink", uid })}
                onDelete={(uid) => deleteIng("b-drink", uid)}
              />
            </Section>
          </div>
        )}

        {/* 午餐 */}
        {tab === "l" && (
          <div>
            <Section label="主食">
              {/* 白飯 / Kibble 選擇 */}
              <div className="mb-3 flex gap-2">
                <MainOption
                  active={mainMode === "rice"}
                  title="白飯"
                  sub="糙白米混合"
                  onClick={() => selectMain("rice")}
                />
                <MainOption
                  active={mainMode === "kibble"}
                  title="Kibble"
                  sub="自訂配方"
                  onClick={() => selectMain("kibble")}
                />
              </div>

              {mainMode === "rice" ? (
                <Grid
                  section="l-main-rice"
                  items={data["l-main-rice"]}
                  selected={selected}
                  amountOf={amountOf}
                  onToggle={toggle}
                  onAmount={setAmount}
                  onEdit={(uid) => setEditModal({ open: true, section: "l-main-rice", uid })}
                  onDelete={(uid) => deleteIng("l-main-rice", uid)}
                />
              ) : (
                <KibbleSummary
                  selected={kibbleSelected}
                  result={kibbleResult}
                  ingredients={kibbleIngredients}
                  onEdit={openKibbleEditor}
                />
              )}
            </Section>

            <Section
              label="主菜蛋白質"
              onAdd={() => setAddModal({ open: true, section: "l-pro" })}
            >
              <Grid
                section="l-pro"
                items={data["l-pro"]}
                selected={selected}
                amountOf={amountOf}
                onToggle={toggle}
                onAmount={setAmount}
                onEdit={(uid) => setEditModal({ open: true, section: "l-pro", uid })}
                onDelete={(uid) => deleteIng("l-pro", uid)}
              />
            </Section>

            <Section
              label="配菜"
              onAdd={() => setAddModal({ open: true, section: "l-side" })}
            >
              <Grid
                section="l-side"
                items={data["l-side"]}
                selected={selected}
                amountOf={amountOf}
                onToggle={toggle}
                onAmount={setAmount}
                onEdit={(uid) => setEditModal({ open: true, section: "l-side", uid })}
                onDelete={(uid) => deleteIng("l-side", uid)}
              />
            </Section>
          </div>
        )}
      </main>

      <NutritionSidebar
        totals={totals}
        items={items}
        onRemove={removeSelected}
        onClear={clearAll}
      />

      {/* Modals */}
      <AddFoodModal
        open={addModal.open}
        isProtein={addModal.section ? isProteinSection(addModal.section) : false}
        onClose={() => setAddModal({ open: false, section: null })}
        onAdd={(food) => addModal.section && addFood(addModal.section, food)}
      />
      <EditFoodModal
        open={editModal.open}
        isProtein={editModal.section ? isProteinSection(editModal.section) : false}
        ingredient={editingIngredient}
        onClose={() => setEditModal({ open: false, section: null, uid: null })}
        onSave={(food) =>
          editModal.section && editModal.uid && saveEdit(editModal.section, editModal.uid, food)
        }
      />
      <KibbleEditor
        open={kibbleOpen}
        ingredients={kibbleIngredients}
        onChange={setKibbleIngredients}
        onApply={applyKibble}
        onClose={() => setKibbleOpen(false)}
      />
    </div>
  );
}

// ---- 小元件 ----

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-rad-sm px-[18px] py-1.5 text-[13px] font-medium transition-all",
        active ? "bg-surface text-text shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-muted",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Section({
  label,
  onAdd,
  children,
}: {
  label: string;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted">
          {label}
        </span>
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1 rounded-rad-sm border-[0.5px] border-border bg-surface px-2.5 py-1 text-[11px] text-muted hover:border-accent hover:text-accent"
          >
            ＋ 新增
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Grid({
  section,
  items,
  selected,
  amountOf,
  onToggle,
  onAmount,
  onEdit,
  onDelete,
}: {
  section: SectionId;
  items: Ingredient[];
  selected: Record<string, true>;
  amountOf: (ing: Ingredient) => number;
  onToggle: (uid: string) => void;
  onAmount: (uid: string, value: number) => void;
  onEdit: (uid: string) => void;
  onDelete: (uid: string) => void;
}) {
  if (items.length === 0) {
    return <div className="py-3 text-center text-xs text-hint">點新增加入食材</div>;
  }
  const isProtein = isProteinSection(section);
  return (
    <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(148px,1fr))]">
      {items.map((ing) => (
        <IngredientCard
          key={ing.uid}
          ing={ing}
          selected={!!selected[ing.uid]}
          amount={amountOf(ing)}
          isProtein={isProtein}
          onToggle={() => onToggle(ing.uid)}
          onAmountChange={(v) => onAmount(ing.uid, v)}
          onEdit={() => onEdit(ing.uid)}
          onDelete={() => onDelete(ing.uid)}
        />
      ))}
    </div>
  );
}

function MainOption({
  active,
  title,
  sub,
  onClick,
}: {
  active: boolean;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={[
        "flex-1 cursor-pointer rounded-rad border px-3 py-2.5 transition-colors",
        active ? "border-accent bg-accent-l" : "border-border bg-surface hover:border-border2",
      ].join(" ")}
    >
      <div className="mb-0.5 text-[13px] font-medium">{title}</div>
      <div className="text-[11px] text-muted">{sub}</div>
    </div>
  );
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function KibbleSummary({
  selected,
  result,
  ingredients,
  onEdit,
}: {
  selected: boolean;
  result: Totals | null;
  ingredients: KibbleIngredient[];
  onEdit: () => void;
}) {
  const ready = selected && result;
  return (
    <div className="relative rounded-rad border border-border bg-surface p-3">
      <div className="mb-1 text-[13px] font-medium">Kibble 配方</div>
      <div className="text-[11px] text-muted">
        {ready ? ingredients.map((i) => i.name).join(" · ") : "尚未設定，點右上角編輯"}
      </div>

      {ready && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded bg-[#F1EFE8] px-[5px] py-0.5 text-[10px] text-[#444441]">
            {Math.round(result!.cal)} kcal
          </span>
          <span className="rounded bg-pro-l px-[5px] py-0.5 text-[10px] text-pro">
            {round1(result!.pro)}g 蛋白
          </span>
          <span className="rounded bg-amber-l px-[5px] py-0.5 text-[10px] text-amber">
            {round1(result!.carb)}g 碳水
          </span>
          <span className="rounded bg-warn-l px-[5px] py-0.5 text-[10px] text-warn">
            {round1(result!.fat)}g 脂肪
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={onEdit}
        className="absolute right-2.5 top-2.5 rounded-rad-sm border-[0.5px] border-border bg-transparent px-2.5 py-1 text-[11px] text-muted hover:border-accent hover:text-accent"
      >
        編輯配方
      </button>
    </div>
  );
}
