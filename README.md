# PAP Service Logistics

PAP 服務物流組織與作業介紹網站（中文／English），版型沿用 [RMA 售後零件規劃平台](https://github.com/sandyliu3056/RMA)。

> 本網站內容屬公司內部資料（**CONFIDENTIAL**），請勿對外散布；資料以原始文件為準。

## 網站架構

| 主頁 | 子頁 |
|---|---|
| 1 總覽 | 區域地圖、重點數字、網站架構 |
| 2 組織 | 2.1 全球區域 · 2.2 PAP 組織 · 2.3 團隊架構 · 2.4 組織要點 |
| 3 服務據點 | 3.1 據點分布 · 3.2 倉庫與 Uni-load · 3.3 標案與 Uni-load · 3.4 據點類型 |
| 4 HSN 集團 | 4.1 概要 · 4.2 各國公司 · 4.3 流程調整 |
| 5 作業 | 5.1 團隊職責 · 5.2 主要職能 · 5.3 系統 · 5.4 SPL 定義流程 · 5.5 Service BOM |
| 6 料號 | 6.1 命名規則 · 6.2 料號解析 · 6.3 子類別對照 |
| 7 代碼與縮寫 | 7.1 子公司代碼 · 7.2 區域代碼 · 7.3 其他國家與單位 · 7.4 HSN 代碼 · 7.5 縮寫說明 |
| 8 重點複習 | 19 題 |

- 右上角可切換中文／English、字型與主題（綠色／藍色／土色），設定會記在瀏覽器裡。
- 內文中以虛線標示的縮寫可點選，查看全稱與說明。
- 網址加上子頁代碼可直接開啟該頁，例如 `#org-pap`、`#ref-abbr`。

## 檔案

- `index.html`：網站本體（HTML、CSS、JavaScript）
- `world.js`：世界地圖輪廓
- `flags/`：國旗圖示
- `favicon.svg`

純靜態網頁，不需要建置。在 GitHub 的 Settings → Pages 選 `main` 分支、根目錄即可發布。

## 來源與授權

- 地圖輪廓：[johan/world.geo.json](https://github.com/johan/world.geo.json)（Natural Earth 110m，公有領域）
- 國旗：[flag-icons](https://github.com/lipis/flag-icons)（MIT）
