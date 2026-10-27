# PAP Service Logistics

PAP 服務物流內部訓練教材的網頁版整理（中文／English 可切換），介面沿用 [RMA 售後零件規劃平台](https://github.com/sandyliu3056/RMA)。

> 原教材每頁標示 **CONFIDENTIAL**，僅供內部訓練使用。數字與代碼由投影片照片轉錄，如有出入以原始檔為準。

## 內容

| 分頁 | 內容 |
|---|---|
| 總覽 | 手冊重點、料號範例、章節入口 |
| 組織 | Acer 全球區域、PAP 的 RO 與 11 個 NS |
| 服務據點 | CSD Q2 2025 服務據點地圖與各國數量、倉庫與 Uni-load |
| 代碼 | 每個國家子公司、區域、其他國家與據點類型的代碼說明 |
| 主要職能 | SP 規劃與下單、中央營運、PO/成本/庫存檢視、月報 |
| 系統 | RO／NS／ASP 使用的 PLM、PLS、GLS、CSS |
| SPL 流程 | Spare parts list definition flow（HQ/PM、QSBU/GCSD、ODM 泳道圖） |
| Service BOM | NPI 與 MP Service BOM、SOP、24 類備品 |
| 料號規則 | AA.BBBCD.EEE 拆解工具、AA 子類別對照表 |
| 縮寫 | 每個縮寫一張可展開的卡片：完整字、來源（教材／通用／推測／未提供）與詳細說明 |
| 自我測驗 | 12 題複習 |

內文中有橘色虛線底線的縮寫可以直接點開，看完整字與說明。右上角可切換語言、字型（手寫風／正黑體／等寬）與主題（棕金／深藍／墨綠），設定會記在瀏覽器裡。網址加上 `#sites`、`#pn` 等可以直接開到該分頁。

## 檔案

- `index.html`：整個網站（HTML、CSS、JavaScript 都在這裡）
- `map.js`：亞太區國家輪廓
- `flags/`：國旗圖示
- `favicon.svg`

純靜態網頁，不需要建置。用瀏覽器直接開 `index.html`，或在 GitHub 的 Settings → Pages 選 `main` 分支、根目錄即可發布。

## 來源與授權

- 地圖輪廓：[johan/world.geo.json](https://github.com/johan/world.geo.json)（Natural Earth 110m，公有領域），擷取自 RMA 專案的 `world.js`
- 國旗：[flag-icons](https://github.com/lipis/flag-icons)（MIT）
