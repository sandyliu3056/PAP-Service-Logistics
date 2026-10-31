# ACER PAP SERVICE LOGISTICS

認識 Acer 與泛亞太區（PAP）服務物流的內部教材網站，英文為主、中文為輔；版型沿用 [RMA 售後零件規劃平台](https://github.com/sandyliu3056/RMA)。

> 本網站內容屬公司內部資料，請勿對外散布；資料以原始文件為準。

## 網站架構

首頁為資訊導覽：簡介、全站搜尋、八章入口（每章的說明與各節）、附錄、章節架構圖與快速導覽（縮寫查詢、實際作業案例、圖表分類、常用主題）。

| 章 | 各節 |
|---|---|
| 第 01 章 基礎概念（Fundamentals） | 1-1 物流（Logistics） · 1-2 供應鏈（Supply Chain） · 1-3 服務物流（Service Logistics） · 1-4 備用零件（Spare Parts） · 1-5 FRU · 1-6 SPL |
| 第 02 章 宏碁與集團企業（Acer & Its Family of Companies） | 2-1 宏碁沿革（Acer History） · 2-2 泛宏碁集團（Acer Group） · 2-3 集團子公司（Group Companies） · 2-4 營運模式（Business Models） |
| 第 03 章 產業生態系（Industry Ecosystem） | 3-1 OEM、ODM、EMS、OBM（OEM, ODM, EMS, OBM） · 3-2 主要角色與關係（Main Players） · 3-3 ODM：仁寶（ODM: Compal） · 3-4 供應商（Suppliers） · 3-5 服務合作夥伴（Service Providers） |
| 第 04 章 PAP 組織（PAP Organisation） | 4-1 總部（HQ） · 4-2 區域辦公室（RO） · 4-3 國家子公司（NS） · 4-4 服務據點（Service Footprint） · 4-5 PAP 組織架構（PAP Organisation） · 4-6 海柏特集團（HSN Group） · 4-7 海柏特與 PAP（HSN Group and PAP） · 4-8 供應流程變更（Supply-Flow Change） · 4-9 組織關係（Organisation Relationships） |
| 第 05 章 備品生命週期（Service Parts Lifecycle） | 5-1 料號規則（Part Numbers） · 5-2 料號解析（Decoding） · 5-3 代碼總覽（Code Reference） · 5-4 FRU 審查（FRU Review） · 5-5 SPL 定義流程（SPL Flow） · 5-6 服務料表（Service BOM） · 5-7 EOL、LTB、PPB（EOL, LTB, PPB） · 5-8 生命週期（Lifecycle） |
| 第 06 章 規劃與採購（Planning & Procurement） | 6-1 需求規劃（Demand Planning） · 6-2 需求預測（Forecast） · 6-3 採購（Procurement） · 6-4 採購單（Purchase Order） · 6-5 MOQ 與 MPQ（MOQ and MPQ） · 6-6 供應商管理（Supplier Management） |
| 第 07 章 庫存與營運（Inventory & Operations） | 7-1 庫存管理（Inventory Management） · 7-2 倉儲作業（Warehouse Operations） · 7-3 零件分配（Parts Allocation） · 7-4 庫存老化（Inventory Ageing） · 7-5 待料（HFP） |
| 第 08 章 系統與報表（Systems & Reports） | 8-1 系統（Systems） · 8-2 GCSD · 8-3 營運報告（Operational Reports） · 8-4 績效指標（KPI） |
| 附錄 A 縮寫字典（Acronym Dictionary） | A-1 縮寫字典（Acronym Dictionary） · A-2 售後服務名詞（Key Service Terms） |
| 附錄 B 複習與速查（Review & Quick Reference） | B-1 複習題（Review Questions） · B-2 速查表（Quick Reference） |

## 每一章的版面

章號、英文章名（上）與中文章名（下）、本章簡介 → 麵包屑與各節按鈕（Section Navigation）→ 各節內文與圖表 → 本章名詞（Key Terms）→ 相關主題（Related Topics，依各章之間的交叉連結自動產生）→ 上一章／下一章。

## 功能

- 語言：英文與中文完全分開顯示，右上角切換——選 English 整站只顯示英文，選中文只顯示中文；預設英文，選擇記在瀏覽器裡。
- 全站搜尋：標題列與首頁都有搜尋框，可搜尋各節與區塊的標題、內文，以及縮寫；結果標示章節編號，點選後直接捲到該處。
- 側邊欄：寬螢幕（1100px 以上）左側列出所有章節，目前這一章展開各節並標示捲到的位置；較窄時改用上方分頁與單列可橫向捲動的節按鈕。
- 縮寫字典（附錄 A）：依 A–Z 排列，欄位為縮寫、英文全稱、中文名稱、說明與相關章節；可用縮寫、英文全稱或中文名稱搜尋，也可依類別篩選或按字母跳轉。資料在 `index.html` 的 `AB` 陣列，說明視窗、本章名詞與字典都用同一份資料，定義全站一致。
- 文章中的縮寫都可點選；每一章第一次出現時，會在後面補上英文全稱（中文段落補中文名稱），文字裡已寫出全稱時不重複。
- 圖表分類：每張架構圖或流程圖上方都有類別標籤：A 組織架構、B 供應鏈流程、C 備品流程、D 企業關係；首頁「圖表分類」列出全部圖表。組織上下級一律用虛線（管理關係），實線箭頭只用在零件的流向。
- 實際作業案例（7-5）：「A Customer Is Waiting for a Replacement Mainboard」，從客人送修，到 ODM 生產、備品採購、中央倉、區域分配、當地倉庫、運輸與服務中心七個環節。
- 待確認：教材之間互相矛盾、或教材未載明的資料，以琥珀色「待確認／To be confirmed」標籤註明，不自行推測。
- 尚未生效的流程（2026 年 12 月 1 日起經由 HSN Group 供應）以虛線框與「尚未生效」標籤和現行流程區分。
- 英文統一使用英式拼寫（organisation、centre、ageing、authorised）；系統或報表代碼（如 502/503 aging）與公司名稱維持原文。
- 每章有自己的主題色（`NAV` 中的 `col`、`tint`、`ink`）；字型與主題可在右上角切換，設定記在瀏覽器裡。
- 網址加上節或區塊代碼可直接開啟，例如 `#org-pap`、`#ref-terms`、`#blk-case-chain`；改版前的代碼會自動對應到新位置（`ALIAS`）。
- 3-2 的企業架構圖可切換「組織架構／集團與夥伴」兩個視圖，可縮放、拖曳，點選節點看詳細資訊；資料在 `org.js`。
- 公司 logo：放入 `logos/<代號>.svg|png` 即自動顯示（見 `logos/README.md`）。

## 檔案

- `index.html`：網站本體（HTML、CSS、JavaScript；代碼資料庫 `AB`）
- `org.js`：企業架構圖的節點、連線與版面資料
- `world.js`：世界地圖輪廓
- `vendor/rough.js`：手繪線條（[rough.js](https://github.com/rough-stuff/rough) 4.6.6，MIT，授權見 `vendor/rough-LICENSE.txt`），用於架構圖與各流程圖的方框、連線與箭頭
- `flags/`：國旗圖示；`logos/`：公司 logo
- `favicon.svg`
- `middleware.js`、`vercel.json`：登入保護與標頭設定

純靜態網頁，不需要建置，由 Vercel 從 `main` 分支發布。

- `middleware.js`：整個網站需要登入（帳號 `sandy`，程式裡只存密碼的 SHA-256 雜湊值）。
- `vercel.json`：不讓搜尋引擎收錄、不讓共用快取保存內容。
- 不要再開 GitHub Pages：GitHub Pages 無法設密碼，內容會公開。repo 也請維持私人（Private）。

## 來源與授權

- 地圖輪廓：[johan/world.geo.json](https://github.com/johan/world.geo.json)（Natural Earth 110m，公有領域）
- 國旗：[flag-icons](https://github.com/lipis/flag-icons)（MIT）
