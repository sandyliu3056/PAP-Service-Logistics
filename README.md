# PAP Service Logistics Guide · 泛亞太區服務物流說明簡冊（網頁版）

Acer 泛亞太區（PAP）服務物流說明簡冊的網頁版：八篇、二十七章，加上資料查證紀錄附錄。內容、章節順序與版面依據《PAP Service Logistics Guide》簡冊（PDF）製作；網站為單一靜態頁面，可直接以 GitHub Pages 發布。

## 結構

```
index.html          由 build.py 產生的完整網頁（請勿手動編輯）
src/template.html   網頁外殼（標題列、篇章導覽、語言切換）
src/style.css       版面與配色（Caveat／Kalam／Patrick Hand／LXGW WenKai TC）
src/legacy.css      地圖與架構圖的樣式
src/app.js          導覽、語言模式、代碼資料庫與說明視窗、地圖、架構圖、料號工具、名詞說明、複習題
src/toc.json        篇與章的標題（中英）
src/ch/chNN.html    各章內容片段（寫法見 src/COMPONENTS.md）
src/widgets/*.html  由資料產生的表格與互動圖（架構圖、地圖、料號解析器、名詞說明、複習題、查證紀錄）
src/data/           glossary.json（名詞說明）、review.json（複習題）、ver_data.json 與 ver_sources.json（查證資料）
art/                簡冊中的插圖（工廠、倉庫、辦公大樓、服務中心、卡車、飛機、地球、工具等）
flags/              國旗（SVG）
fonts/              Caveat 與 Patrick Hand（SIL OFL）；Kalam 與 LXGW WenKai TC 由 Google Fonts 載入
world.js            世界地圖路徑
org.js              企業架構圖的節點與關係
verify.js           資料查證清單（由 tools/build_verify.py 產生）
VERIFICATION.md     資料查證清單（Markdown 版）
```

## 建置與檢查

```
python3 build.py                      # 組合 index.html；有缺漏時列出警告並以非零碼結束
python3 -I tools/checkfrag.py src/ch/ch05.html   # 檢查單一章節片段（標籤是否配對、雙語是否齊全、禁用字串）
python3 -I tools/build_verify.py      # 由 src/data 重新產生 verify.js 與 VERIFICATION.md
```

本機預覽：`python3 -m http.server 8765`，開啟 http://localhost:8765/ 。

## 語言

預設為雙語（英文在前、中文在後，與簡冊相同），可在右上角切換為僅中文或僅英文。內文中的代碼與縮寫（PAP、NS、ODM、SPL…）可點選，開啟定義、全稱、類別、來源與查證狀態。

## 資料來源與查證

公司與產業資料來自公開來源；組織與作業內容依據內部教材。每一條公開事實的來源與查證結果列於附錄「資料查證紀錄」與 `VERIFICATION.md`；僅有單一來源或來源互異者，依其狀態標示。本網站內容與原始文件不一致時，以原始文件為準。
