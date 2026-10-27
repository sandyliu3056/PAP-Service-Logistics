# PAP Service Logistics

PAP 服務物流組織與作業介紹網站（中文／English），版型沿用 [RMA 售後零件規劃平台](https://github.com/sandyliu3056/RMA)。

> 本網站內容屬公司內部資料（**CONFIDENTIAL**），請勿對外散布；資料以原始文件為準。

## 網站架構

| 主頁 | 子頁 |
|---|---|
| 網站介紹（首頁） | 網站在介紹什麼、PAP 服務物流的工作、各章內容與使用方式 |
| 1 總覽 | 區域地圖、重點數字、組織定位與供應流程 |
| 2 企業介紹 | 2.1 企業關係 · 2.2 宏碁 Acer · 2.3 海柏特 HSN · 2.4 仁寶 Compal · 2.5 ODM 與 OEM · 2.6 相關報導 |
| 3 組織 | 3.1 全球區域 · 3.2 全球據點 · 3.3 PAP 組織 · 3.4 組織要點 |
| 4 服務據點 | 4.1 據點分布 · 4.2 倉庫與 Uni-load · 4.3 標案與 Uni-load · 4.4 據點類型 |
| 5 HSN 集團 | 5.1 概要 · 5.2 各國公司 · 5.3 流程調整 |
| 6 作業流程 | 6.1 團隊職責 · 6.2 主要職能 · 6.3 系統 · 6.4 SPL 定義流程 · 6.5 Service BOM |
| 7 料號 | 7.1 命名規則 · 7.2 料號解析 · 7.3 子類別對照 |
| 8 代碼與縮寫 | 8.1 子公司代碼 · 8.2 區域代碼 · 8.3 其他國家與單位 · 8.4 HSN 代碼 · 8.5 縮寫說明 |
| 9 重點複習 | 18 題 |

- 右上角可切換中文／English、字型與主題（預設土色，另有綠色、藍色），設定會記在瀏覽器裡。
- 3.2 全球據點依「Acer Around the World」據點名錄整理，地圖可切換全球、歐洲、亞太檢視。
- 2 企業介紹之沿革與業務資料取自公開網路資料（查詢日期 2026 年 10 月），各頁列有資料來源；與內部文件不一致時，以內部文件為準。
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
