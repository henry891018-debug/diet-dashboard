# Diet Dashboard

將 HTML mockup 轉成的 Next.js（App Router）+ TypeScript + Tailwind CSS 餐點規劃儀表板。

選擇早／午餐食材，即時計算熱量與三大營養素；支援份量調整、生／熟重換算、Kibble 自訂配方，以及手動新增／編輯食材。純前端，無任何外部 API 或費用。

## 架構

```
app/
  layout.tsx           根佈局
  page.tsx             主頁面（狀態與互動邏輯的協調者）
  globals.css          Tailwind + 全域樣式
components/
  IngredientCard.tsx   食材卡片：勾選、份量調整、生/熟重換算
  KibbleEditor.tsx     Kibble 配方編輯 modal
  NutritionSidebar.tsx 右側即時合計欄
  AddFoodModal.tsx     新增食材 modal（手動輸入）
  EditFoodModal.tsx    編輯食材 modal
lib/
  ingredients.ts       所有食材預設資料與計算工具
  types.ts             共用型別
```

## 本機執行

```bash
npm install
npm run dev
```

開啟 http://localhost:3000

正式版（先 build 再啟動）：

```bash
npm run build
npm start
```

## 部署到 Vercel

最簡單的方式是透過 GitHub：

1. 把 `diet-dashboard/` 這個資料夾推到一個 GitHub repo。
2. 到 [vercel.com](https://vercel.com) 用 GitHub 登入 → **Add New… → Project** → 選這個 repo。
3. 若 `diet-dashboard` 不是 repo 的根目錄，在匯入設定的 **Root Directory** 選擇 `diet-dashboard`；Framework 會自動偵測為 Next.js。
4. 按 **Deploy**。之後每次 push 都會自動重新部署。

或用 Vercel CLI：`npm i -g vercel`，在 `diet-dashboard/` 內執行 `vercel`。

不需要設定任何環境變數。

## 備註

- 食材的營養值以「預設份量的總量」儲存，調整份量時依比例換算。
- Kibble 配方的食材營養值以「每單位」（每 g 或每顆）儲存。
- 預設食材的中文名稱由原始 mockup 還原；可直接在介面上編輯。
