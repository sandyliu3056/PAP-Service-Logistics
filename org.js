// 企業架構圖資料（index.html 的 2.1 讀取）。
// 節點：id、type（company 法人公司／region 區域／ro 區域辦公室／ns 國家子公司／unit 下轄單位／country 代管國家／team PAP 服務團隊單位／dept 總部單位／odm 外部代工廠／hsn HSN 公司／partner 服務夥伴／group 分組標題）、
//       code、zh、en、official（正式名稱）、logo、cc（ISO 國碼，與公司內部代碼分開）、region、ab（代碼說明 id）、role [中, 英]、flows [[中, 英, 頁面]]
// 連線：from、to、kind（own 組織隸屬／collab 跨部門協作／proc 採購流程／spin 分拆或整併）、label [中, 英]；樹狀的隸屬連線由 layout 產生。
window.PAP_ORG = (function () {
  var N = [
    { id: "acer", type: "company", code: "Acer", zh: "宏碁股份有限公司", en: "Acer Incorporated", official: "Acer Incorporated（宏碁股份有限公司）", logo: "acer", cc: "tw", sub: ["總部 HQ · 新北市汐止", "HQ · Xizhi, New Taipei"],
      role: ["品牌商（OBM）。總部（HQ）之下設有各區域、區域辦公室與國家子公司，並持有多家集團子公司。", "Brand owner (OBM). Under headquarters (HQ) sit the regions, regional offices and nation subsidiaries, plus the group subsidiaries it controls."],
      flows: [["SPL 定義流程（HQ/PM、QSBU/GCSD）", "SPL definition flow (HQ/PM, QSBU/GCSD)", "ops-spl"], ["全球區域", "Global regions", "org-global"]] },
    { id: "g-hq", type: "group", zh: "總部單位", en: "Headquarters units", role: ["SPL 定義流程中的總部單位。", "Headquarters units in the SPL definition flow."] },
    { id: "hqpm", type: "dept", code: "HQ/PM", zh: "總部 · 產品經理", en: "HQ · PM", ab: "pm", role: ["於 SPL 流程提供 Matrix table、AVL、MB/KB 料號與 carcass price。", "Provides the matrix table, AVL, MB/KB part numbers and the carcass price in the SPL flow."], flows: [["SPL 定義流程", "SPL definition flow", "ops-spl"]] },
    { id: "g-papteam", type: "group", zh: "PAP 服務團隊", en: "PAP service team", role: ["PAP 服務團隊由 QSBU 與 RO 組成：QSBU 規劃採購，RO 依規劃下單並負責營運；PAP 服務團隊之下是各國子公司（NS），負責當地銷售與服務。", "The PAP service team is QSBU and the RO: QSBU plans the buying, and the RO places the orders and runs operations. Below the PAP service team are the nation subsidiaries (NS), which handle local sales and service."], flows: [["PAP 服務團隊與主要職能", "The PAP service team and its functions", "ops-role"], ["業務脈絡", "Business context", "ops-context"]] },
    { id: "qsbu", type: "team", code: "QSBU", zh: "品質與服務事業單位", en: "Quality and Service Business Unit", ab: "qsbu", role: ["規劃採購：找供應商並簽約、訂定交易條款（例如 FOB）、議定價格與 MOQ（同一料號各 RO 相同）、與 ODM 提前備料、規劃服務模式。SPL 定義流程中負責 FRU 審查會議、申請料號、Markup Review、上傳 SPL 系統並發布 SPL 予各 RO。", "Plans the buying: finds suppliers and signs contracts, sets the terms (e.g. FOB), agrees price and MOQ (the same for every RO), arranges advance stocking with the ODM and designs service models. In the SPL flow it holds the FRU review, applies for part numbers, runs the markup review, uploads to the SPL system and releases the SPL to the ROs."], flows: [["PAP 服務團隊與主要職能", "The PAP service team and its functions", "ops-role"], ["SPL 定義流程", "SPL definition flow", "ops-spl"]] },
    { id: "gcsd", type: "dept", code: "GCSD", zh: "全球客戶服務單位", en: "Global Customer Service", ab: "gcsd", role: ["Acer 總部的全球客戶服務單位；SPL 定義流程中與 QSBU 同一泳道。", "Acer HQ's global customer-service unit; it shares a lane with QSBU in the SPL definition flow."], flows: [["SPL 定義流程", "SPL definition flow", "ops-spl"]] },
    { id: "csd", type: "dept", code: "CSD", zh: "CSD（據點統計單位）", en: "CSD (site statistics unit)", ab: "csd", role: ["Acer 總部的客服單位，負責 PAP 服務據點統計。", "Acer HQ's customer-service unit; compiles the PAP service-site statistics."], flows: [["據點分布", "Service footprint", "sites-map"]] },
    { id: "g-reg", type: "group", zh: "區域", en: "Regions", role: ["總部之下的五個區域辦公室（RO）：PA、EMEA、TWN、AAP、ACCN，2010 年以前各自獨立運作；TWN 與 AAP 後來合併為 PAP。", "The five regional offices (RO) under HQ: PA, EMEA, TWN, AAP and ACCN, which operated independently before 2010; TWN and AAP later merged into PAP."] },
    { id: "pa", type: "region", code: "PA", zh: "美洲 · US", en: "The Americas · US", region: "PA", ab: "pa", role: ["Acer 美洲區域。", "Acer's Americas region."] },
    { id: "emea", type: "region", code: "EMEA", zh: "歐洲、中東與非洲", en: "Europe, Middle East & Africa", region: "EMEA", ab: "emea", role: ["Acer 歐洲、中東與非洲區域；區域總部位於瑞士。", "Acer's Europe, Middle East and Africa region, with its regional headquarters in Switzerland."] },
    { id: "pap", type: "ro", code: "PAP", zh: "泛亞太區 · 區域辦公室（RO）", en: "Pan Asia Pacific · regional office (RO)", region: "PAP", ab: "pap", sub: ["由 TWN + AAP 整併（2016/2017）", "Formed from TWN + AAP (2016/2017)"],
      role: ["泛亞太區的區域辦公室，和 QSBU 一起組成 PAP 服務團隊，負責下單與營運：備品規劃與下單、採購／成本／庫存檢視、每月報告、中央倉、RMA、中央備品規劃、服務中心與客服中心支援、客戶滿意度；向 ODM 採購的料件加價賣給各國子公司，2026/12/1 起經由 HSN Group 供應。", "The regional office for Pan Asia Pacific; with QSBU it forms the PAP service team and places the orders and runs operations: spare-parts planning and ordering, PO/cost/inventory review, monthly reports, the central warehouse, RMA, central spare-parts planning, service-centre and call-centre support and customer satisfaction. Parts bought from the ODM are resold to the nation subsidiaries at a markup, through HSN Group from 1 December 2026."],
      flows: [["PAP 服務團隊與主要職能", "The PAP service team and its functions", "ops-role"], ["RO 的主要職能", "The RO's main functions", "ops-functions"], ["流程變更", "Process change", "hsn-change"]] },
    { id: "accn", type: "region", code: "ACCN", zh: "China · 中國", en: "China", region: "ACCN", cc: "cn", ab: "accn", role: ["中國區，與 PAP 同屬 HQ 轄下，獨立運作。", "The China region, a peer of PAP under HQ, operating independently."] },
    // 國家子公司（NS）
    { id: "assb", type: "ns", code: "ASSB", zh: "馬來西亞", en: "Malaysia", official: "Acer Sales & Services Sdn Bhd.", logo: "acer", cc: "my", region: "PAP", ab: "assb", role: ["馬來西亞國家子公司；2016/2017 年前為主導子公司，與海柏特共同營運；設有倉庫及 Uni-load。", "The Malaysia subsidiary; the lead subsidiary before 2016/2017, run jointly with HSN; has a warehouse and Uni-load."] },
    { id: "aca", type: "ns", code: "ACA", zh: "澳洲", en: "Australia", official: "Acer Computer Australia Pty. Ltd.", logo: "acer", cc: "au", region: "PAP", ab: "aca", role: ["澳洲國家子公司，代管紐西蘭（ACNZ）；設有倉庫及 Uni-load。", "The Australia subsidiary, covering New Zealand (ACNZ); has a warehouse and Uni-load."] },
    { id: "ail", type: "ns", code: "AIL", zh: "印度", en: "India", official: "Acer India (Pvt) Ltd.", logo: "acer", cc: "in", region: "PAP", ab: "ail", role: ["印度國家子公司，代管孟加拉；PAP 據點最多的國家；設有倉庫及 Uni-load。", "The India subsidiary, covering Bangladesh; the country with the most PAP sites; has a warehouse and Uni-load."] },
    { id: "ath", type: "ns", code: "ATH", zh: "泰國", en: "Thailand", official: "Acer Computer Co., Ltd.", logo: "acer", cc: "th", region: "PAP", ab: "ath", role: ["泰國國家子公司，代管中南半島；設有倉庫及 Uni-load。", "The Thailand subsidiary, covering Indo-china; has a warehouse and Uni-load."] },
    { id: "ain", type: "ns", code: "AIN", zh: "印尼", en: "Indonesia", official: "PT Acer Indonesia", logo: "acer", cc: "id", region: "PAP", ab: "ain", role: ["印尼國家子公司，代碼亦作 AIN (AMI)；設有倉庫及 Uni-load。", "The Indonesia subsidiary, also coded AIN (AMI); has a warehouse and Uni-load."] },
    { id: "avn", type: "ns", code: "AVN", zh: "越南", en: "Vietnam", official: "Acer Vietnam Co., Ltd.", logo: "acer", cc: "vn", region: "PAP", ab: "avn", role: ["越南國家子公司；設有倉庫。", "The Vietnam subsidiary; has a warehouse."] },
    { id: "ajc", type: "ns", code: "AJC", zh: "日本", en: "Japan", official: "Acer Japan Corp.", logo: "acer", cc: "jp", region: "PAP", ab: "ajc", role: ["日本國家子公司，並管理韓國（AKC）；設有倉庫。", "The Japan subsidiary, which also manages Korea (AKC); has a warehouse."] },
    { id: "akc", type: "ns", code: "AKC", zh: "韓國", en: "Korea", official: "Acer Asia Pacific（韓國辦公室）", logo: "acer", cc: "kr", region: "PAP", ab: "akc", role: ["韓國國家子公司，由 AJC 管轄；設有倉庫。", "The Korea subsidiary, managed by AJC; has a warehouse."] },
    { id: "afe", type: "ns", code: "AFE", zh: "香港", en: "Hong Kong", cc: "hk", region: "PAP", ab: "afe", role: ["PAP 國家子公司之一：香港子公司 Acer Computer (Far East) Limited，負責 Acer 品牌資訊產品銷售。", "One of the PAP subsidiaries: the Hong Kong subsidiary Acer Computer (Far East) Limited, which sells Acer-brand IT products."] },
    { id: "aphi", type: "ns", code: "APHI", zh: "菲律賓", en: "Philippines", official: "Acer Philippines, Inc.", logo: "acer", cc: "ph", region: "PAP", ab: "aphi", role: ["菲律賓國家子公司；設有倉庫。", "The Philippines subsidiary; has a warehouse."] },
    { id: "acs", type: "ns", code: "ACS", zh: "新加坡", en: "Singapore", official: "Acer Computer (Singapore) Pte. Ltd.", logo: "acer", cc: "sg", region: "PAP", ab: "acs", role: ["新加坡國家子公司，代管斯里蘭卡、蒙古與尼泊爾；設有倉庫及 Uni-load。", "The Singapore subsidiary, covering Sri Lanka, Mongolia and Nepal; has a warehouse and Uni-load."] },
    // 下轄單位與代管國家
    { id: "acnz", type: "unit", code: "ACNZ", zh: "紐西蘭", en: "New Zealand", official: "Acer Computer New Zealand Ltd.", logo: "acer", cc: "nz", region: "PAP", ab: "acnz", role: ["紐西蘭子公司，歸澳洲 ACA 管；設有倉庫。", "The New Zealand subsidiary under ACA; has a warehouse."] },
    { id: "bangladesh", type: "country", zh: "孟加拉", en: "Bangladesh", cc: "bd", region: "PAP", role: ["由印度（AIL）代管的國家；Q2 2025 有 10 處據點。", "A country covered by India (AIL); 10 sites in Q2 2025."] },
    { id: "indochina", type: "unit", zh: "中南半島", en: "Indo-china", region: "PAP", role: ["由泰國（ATH）代管的區域；泰國為中南半島備品中心。", "An area covered by Thailand (ATH); Thailand is the Indochina parts hub."] },
    { id: "ami", type: "unit", code: "AMI", zh: "印尼 Uni-load 組裝廠", en: "Indonesia Uni-load assembly", cc: "id", region: "PAP", ab: "ami", role: ["印尼當地組裝廠（Uni-load）的公司代碼，屬於印尼子公司 AIN。", "The company code of the local assembly plant (Uni-load) in Indonesia, part of the Indonesia subsidiary AIN."] },
    { id: "srilanka", type: "country", zh: "斯里蘭卡", en: "Sri Lanka", cc: "lk", region: "PAP", role: ["由新加坡（ACS）代管；Q2 2025 有 3 處據點。", "Covered by Singapore (ACS); 3 sites in Q2 2025."] },
    { id: "mongolia", type: "country", zh: "蒙古", en: "Mongolia", cc: "mn", region: "PAP", role: ["由新加坡（ACS）代管；Q2 2025 有 1 處據點。", "Covered by Singapore (ACS); 1 site in Q2 2025."] },
    { id: "nepal", type: "country", zh: "尼泊爾", en: "Nepal", cc: "np", region: "PAP", role: ["由新加坡（ACS）代管；Q2 2025 有 1 處據點。", "Covered by Singapore (ACS); 1 site in Q2 2025."] },
    // 集團子公司
    { id: "g-subs", type: "group", zh: "集團子公司（宏碁持股）", en: "Group subsidiaries (Acer-controlled)", role: ["宏碁內部創業後推動上市櫃之子公司。", "Internal ventures that Acer has taken public."] },
    { id: "hsn", type: "company", code: "HSN", zh: "海柏特", en: "Highpoint Service Network", official: "海柏特股份有限公司（Highpoint Service Network Corporation）· 6884", logo: "hsn", cc: "tw", ab: "hsn", sub: ["售後維修 · 2025/12 上櫃", "After-sales repair · TPEx 2025"],
      role: ["多品牌授權維修服務商，源自宏碁 1999 年之馬來西亞售後服務公司；2026/12/1 起 PAP 採購之料件經由 HSN Group 供應各國子公司。", "A multi-brand authorised repair provider that grew out of Acer's 1999 Malaysian after-sales company; from 1 December 2026 the parts PAP purchases are supplied to the nation subsidiaries through HSN Group."],
      flows: [["HSN 集團概述", "HSN Group overview", "hsn-about"], ["流程變更", "Process change", "hsn-change"]] },
    { id: "hsnm", type: "hsn", code: "HSNM", zh: "馬來西亞", en: "Malaysia", cc: "my", region: "PAP", ab: "hsnm", role: ["海柏特（HSN）在馬來西亞的維修公司，也是 Acer 在馬來西亞的官方服務商，設有 16 處服務中心。PAP 組織圖上畫在馬來西亞子公司 ASSB 的下面。", "HSN's repair company in Malaysia and Acer's official service provider there, with 16 service centres. The PAP organisation chart draws it under ASSB."] },
    { id: "hsnp", type: "hsn", code: "HSNP", zh: "菲律賓", en: "Philippines", cc: "ph", region: "PAP", ab: "hsnp", role: ["HSN Group 菲律賓公司，為 Acer 在菲律賓的 Master ASP。", "HSN Group's Philippine company and Acer's Master ASP in the Philippines."] },
    { id: "hsnt", type: "hsn", code: "HSNT", zh: "泰國", en: "Thailand", cc: "th", region: "PAP", ab: "hsnt", role: ["HSN Group 泰國公司；Rama 3 服務中心於 2025 年 9 月整修啟用。", "HSN Group's Thai company; its Rama 3 centre reopened in September 2025."] },
    { id: "hsni", type: "hsn", code: "HSNI", zh: "印尼", en: "Indonesia", cc: "id", region: "PAP", ab: "hsni", role: ["HSN Group 印尼公司。", "HSN Group's Indonesian company."] },
    { id: "hsnv", type: "hsn", code: "HSNV", zh: "越南", en: "Vietnam", cc: "vn", region: "PAP", ab: "hsnv", role: ["HSN Group 越南公司，2020 年 12 月設立。", "HSN Group's Vietnamese company, set up in December 2020."] },
    { id: "hsn-in", type: "hsn", code: "HSN + India", zh: "印度（規劃中）", en: "India (planned)", cc: "in", region: "PAP", planned: true, role: ["擴展規劃：規劃中。", "Expansion plan: planned."] },
    { id: "hsn-au", type: "hsn", code: "HSN + Australia", zh: "澳洲（規劃中）", en: "Australia (planned)", cc: "au", region: "PAP", planned: true, role: ["擴展規劃：規劃中。", "Expansion plan: planned."] },
    { id: "hsn-jp", type: "hsn", code: "HSN + Japan", zh: "日本（評估中）", en: "Japan (under evaluation)", cc: "jp", region: "PAP", planned: true, role: ["擴展規劃：評估中。", "Expansion plan: under evaluation."] },
    { id: "g-osubs", type: "group", zh: "其他子公司", en: "Other subsidiaries", role: ["宏碁持股之其他上市櫃或興櫃子公司。", "Acer's other listed or emerging-board subsidiaries."] },
    { id: "weblink", type: "company", code: "Weblink", zh: "展碁國際", en: "Weblink International", official: "展碁國際股份有限公司 · 6776", logo: "weblink", cc: "tw", role: ["3C 通路商，Acer 台灣總代理之一（下游通路）。", "A 3C distributor and one of Acer's general agents in Taiwan (downstream channel)."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "acsi", type: "company", code: "ACSI", zh: "安碁資訊", en: "Acer Cyber Security", official: "安碁資訊股份有限公司 · 6690", logo: "acsi", cc: "tw", ab: "acsi", role: ["資安監控（SOC）、檢測與顧問；宏碁持股 51.87%。", "Security monitoring (SOC), testing and consulting; 51.87% Acer-owned."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "aeb", type: "company", code: "AEB", zh: "宏碁資訊", en: "Acer e-Enabling Service Business", official: "宏碁資訊服務股份有限公司 · 6811", logo: "aeb", cc: "tw", ab: "aeb", role: ["雲端服務與軟體授權。", "Cloud services and software licensing."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "ast", type: "company", code: "AST", zh: "智聯服務", en: "Acer Synergy Tech", official: "智聯服務股份有限公司 · 6751", logo: "ast", cc: "tw", ab: "ast", role: ["資訊系統整合與維運。", "IT system integration and maintenance."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "aopen", type: "company", code: "AOpen", zh: "建碁", en: "AOpen", official: "建碁股份有限公司 · 3046", logo: "aopen", cc: "tw", role: ["工業電腦（IPC）與 AIoT；宏碁持股 40.55%。", "Industrial PCs (IPC) and AIoT; 40.55% Acer-owned."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "acergaming", type: "company", code: "Acer Gaming", zh: "宏碁遊戲", en: "Acer Gaming", official: "宏碁遊戲股份有限公司 · 6908", logo: "acergaming", cc: "tw", role: ["遊戲代理（PS5 台灣獨家代理）；宏碁持股 69.85%。", "Game distribution (exclusive PS5 agent in Taiwan); 69.85% Acer-owned."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "acergadget", type: "company", code: "Acer Gadget", zh: "倚天酷碁", en: "Acer Gadget", official: "倚天酷碁股份有限公司 · 2432", logo: "acergadget", cc: "tw", role: ["電競周邊與智慧裝置。", "Gaming peripherals and smart devices."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "acerpure", type: "company", code: "Acerpure", zh: "宏碁智新", en: "Acerpure", official: "宏碁智新股份有限公司 · 7794", logo: "acerpure", cc: "tw", role: ["Acerpure 品牌家電。", "Acerpure-brand appliances."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "acermedical", type: "company", code: "Acer Medical", zh: "宏碁智醫", en: "Acer Medical", official: "宏碁智醫股份有限公司 · 6857（興櫃）", logo: "acermedical", cc: "tw", role: ["AI 醫療影像軟體。", "AI medical-imaging software."], flows: [["公司介紹", "Company page", "corp-subs"]] },
    { id: "enfinitec", type: "company", code: "Enfinitec", zh: "Enfinitec（歐洲維修整新）", en: "Enfinitec (European repair and refurbishment)", official: "Enfinitec", logo: "enfinitec", region: "EMEA", role: ["Acer 2023 年成立之歐洲維修、整新與物流子公司，涵蓋 8 國，中心位於波蘭 Wrocław；列為亞太以外的對照。", "Acer's European repair, refurbishment and logistics subsidiary set up in 2023, covering eight countries with its hub in Wrocław, Poland; shown for comparison with Asia Pacific."], flows: [["服務夥伴", "Service partners", "corp-service"]] },
    // 泛宏碁集團（分拆後獨立）
    { id: "g-fam", type: "group", zh: "泛宏碁集團（分拆後獨立）", en: "The Acer family (independent since the split)", role: ["2000 年第二次再造分出的公司，現與宏碁無持股關係。", "Companies that emerged from the 2000 re-engineering; no longer held by Acer."] },
    { id: "benq", type: "company", code: "BenQ / Qisda", zh: "明基 BenQ／佳世達 Qisda", en: "BenQ / Qisda", official: "佳世達科技股份有限公司（2352）· 明基電通", logo: "benq", cc: "tw", role: ["原宏碁旗下明碁電腦；2001 年啟用 BenQ 品牌，2006 年宏碁出清持股，2007 年分為佳世達與 BenQ。", "Formerly Acer Peripherals; BenQ brand from 2001, Acer sold its stake in 2006, split into Qisda and BenQ in 2007."], flows: [["Acer 家族", "The Acer family", "corp-subs"]] },
    { id: "auo", type: "company", code: "AUO", zh: "友達光電", en: "AU Optronics", official: "友達光電股份有限公司 · 2409", logo: "auo", cc: "tw", ab: "auo", role: ["原宏碁集團之達碁科技；2001 年與聯友光電合併更名，現為獨立公司。", "Formerly the Acer group's Acer Display Technology; merged with Unipac in 2001 and now independent."], flows: [["Acer 家族", "The Acer family", "corp-subs"]] },
    // ODM 代工廠（外部）
    { id: "g-odm", type: "group", zh: "ODM 代工廠（外部）", en: "ODM manufacturers (external)", role: ["依 Acer 規格設計與生產的外部公司；備品亦由代工廠供應。", "External companies that design and build to Acer's specification; spare parts also come from them."] },
    { id: "compal", type: "odm", code: "Compal", zh: "仁寶電腦", en: "Compal Electronics", official: "仁寶電腦工業股份有限公司 · 2324", logo: "compal", cc: "tw", ab: "compal", role: ["Acer 的 ODM 代工廠：PAP 向它下採購單（PO）；在 SPL 流程中由它提供樣品、SPL 草稿與報價。", "An ODM for Acer: PAP places purchase orders with it, and it provides samples, the SPL draft and quotations in the SPL flow."], flows: [["仁寶 Compal", "Compal", "corp-compal"], ["PAP 採購", "PAP purchasing", "ops-role"]] },
    { id: "quanta", type: "odm", code: "Quanta", zh: "廣達電腦", en: "Quanta Computer", official: "廣達電腦股份有限公司 · 2382", logo: "quanta", cc: "tw", role: ["筆電 ODM；承接 Acer 筆電代工訂單。", "Notebook ODM; builds notebooks for Acer."], flows: [["製造合作夥伴", "Manufacturing partners", "corp-suppliers"]] },
    { id: "wistron", type: "odm", code: "Wistron", zh: "緯創資通", en: "Wistron Corporation", official: "緯創資通股份有限公司 · 3231", logo: "wistron", cc: "tw", role: ["2001 年自宏碁分立之代工廠；筆電 ODM，承接 Acer 筆電代工訂單。", "The manufacturer spun off from Acer in 2001; a notebook ODM that builds notebooks for Acer."], flows: [["製造合作夥伴", "Manufacturing partners", "corp-suppliers"]] },
    { id: "inventec", type: "odm", code: "Inventec", zh: "英業達", en: "Inventec Corporation", official: "英業達股份有限公司 · 2356", logo: "inventec", cc: "tw", role: ["筆電與伺服器製造；2006–2009 年取得 Acer 訂單，2010 年一度未獲訂單；2020 年 Acer 為其筆電客戶。", "Makes notebooks and servers; won Acer orders in 2006–2009 and was dropped in 2010; Acer was a notebook customer in 2020."], flows: [["製造合作夥伴", "Manufacturing partners", "corp-suppliers"]] },
    { id: "pegatron", type: "odm", code: "Pegatron", zh: "和碩聯合科技", en: "Pegatron Corporation", official: "和碩聯合科技股份有限公司 · 4938", logo: "pegatron", cc: "tw", role: ["2008 年自華碩分割；2010 年取得 Acer 筆電訂單。", "Split from Asus in 2008; took Acer notebook orders in 2010."], flows: [["製造合作夥伴", "Manufacturing partners", "corp-suppliers"]] },
    { id: "foxconn", type: "odm", code: "Foxconn", zh: "鴻海精密", en: "Hon Hai / Foxconn", official: "鴻海精密工業股份有限公司 · 2317", logo: "foxconn", cc: "tw", role: ["EMS 廠；與 Acer 的合作以桌機為主。", "An EMS provider; its work for Acer is mainly desktops."], flows: [["製造合作夥伴", "Manufacturing partners", "corp-suppliers"]] },
    // 服務夥伴
    { id: "g-svc", type: "group", zh: "服務夥伴", en: "Service partners", role: ["各國售後服務的外部夥伴。", "External partners in after-sales service."] },
    { id: "asp", type: "partner", code: "ASP", zh: "授權服務商", en: "Authorized service providers", ab: "asp", role: ["經 Acer 授權之外部服務商，提供收件服務，不具維修能力；PAP 全區 507 家。", "Authorised external providers that take in units but do not repair them; 507 across PAP."], flows: [["據點類型", "Site types", "sites-types"]] },
    { id: "f1", type: "partner", code: "F1 Info Solutions", zh: "F1 Info Solutions（印度）", en: "F1 Info Solutions (India)", cc: "in", region: "PAP", role: ["Flipkart 旗下維修連鎖，列於 Acer 印度官方服務網絡之授權服務夥伴。", "A Flipkart-owned repair chain, listed as an authorised service partner on Acer India's official support network."] }
  ];
  var E = [
    { from: "assb", to: "hsnm", kind: "collab", label: ["2016/2017 前共同營運", "Jointly run before 2016/2017"] },
    { from: "ajc", to: "akc", kind: "collab", label: ["AJC 管轄 AKC", "AJC manages AKC"] },
    { from: "acer", to: "benq", kind: "spin", label: ["2001 年分立", "Separated 2001"] },
    { from: "acer", to: "auo", kind: "spin", label: ["2001 年合併更名", "Merged and renamed 2001"] },
    { from: "acer", to: "wistron", kind: "spin", label: ["2001 年分立", "Spun off 2001"] },
    { from: "compal", to: "pap", kind: "proc", label: ["採購單（PO）→ 備品", "PO → spare parts"] },
    { from: "quanta", to: "acer", kind: "proc", label: ["代工訂單", "Orders"] },
    { from: "wistron", to: "acer", kind: "proc", label: ["代工訂單", "Orders"] },
    { from: "inventec", to: "acer", kind: "proc", label: ["2006–2009 年訂單；2020 年仍為客戶", "Orders 2006–2009; customer in 2020"] },
    { from: "pegatron", to: "acer", kind: "proc", label: ["2011 年訂單", "2011 orders"] },
    { from: "foxconn", to: "acer", kind: "proc", label: ["桌機代工", "Desktops"] },
    { from: "pap", to: "hsn", kind: "proc", label: ["2026/12/1 起料件經由 HSN Group", "Parts via HSN Group from 1 Dec 2026"] },
    { from: "hsn", to: "pap", kind: "proc", label: ["供應各 NS", "Supply to the NS"], toSpine: true },
    { from: "hqpm", to: "qsbu", kind: "collab", label: ["SPL 流程輸入", "SPL flow inputs"] },
    { from: "qsbu", to: "compal", kind: "collab", label: ["簽約、議定價格與 MOQ、提前備料", "Contracts, price and MOQ, advance stocking"] },
    { from: "qsbu", to: "pap", kind: "collab", label: ["採購規劃 · 發布 SPL", "Buying plan · SPL release"] },
    { from: "asp", to: "pap", kind: "collab", label: ["各國收件服務", "Take-in service in each country"], toSpine: true },
    { from: "f1", to: "ail", kind: "collab", label: ["授權服務夥伴", "Authorised service partner"] }
  ];
  var LAYOUT = {
    root: "acer",
    // 第二層：左側為外部（ODM、服務夥伴），右側為宏碁持股之子公司與泛宏碁集團，由宏碁沿右側連線
    band2: ["g-odm", "g-svc", "g-subs", "g-fam"],
    band2Parent: { "g-subs": "acer", "g-fam": "acer" },
    kids: {
      acer: { mode: "row", kids: ["g-hq", "g-reg"] },
      "g-hq": { mode: "list", kids: ["hqpm", "gcsd", "csd"] },
      "g-reg": { mode: "row", kids: ["pa", "emea", "g-papteam", "accn"] },
      "g-papteam": { mode: "row", kids: ["qsbu", "pap"] },
      pap: { mode: "cols", cols: 2, kids: ["assb", "aca", "ail", "ath", "ain", "avn", "ajc", "akc", "afe", "aphi", "acs"] },
      aca: { mode: "list", kids: ["acnz"] },
      ail: { mode: "list", kids: ["bangladesh"] },
      ath: { mode: "list", kids: ["indochina"] },
      ain: { mode: "list", kids: ["ami"] },
      acs: { mode: "list", kids: ["srilanka", "mongolia", "nepal"] },
      "g-subs": { mode: "row", kids: ["hsn", "g-osubs"] },
      hsn: { mode: "list", kids: ["hsnm", "hsnp", "hsnt", "hsni", "hsnv", "hsn-in", "hsn-au", "hsn-jp"] },
      "g-osubs": { mode: "list", kids: ["weblink", "acsi", "aeb", "ast", "aopen", "acergaming", "acergadget", "acerpure", "acermedical", "enfinitec"] },
      "g-fam": { mode: "list", kids: ["benq", "auo"], kind: "spin" },
      "g-odm": { mode: "list", kids: ["compal", "quanta", "wistron", "inventec", "pegatron", "foxconn"] },
      "g-svc": { mode: "list", kids: ["asp", "f1"] }
    }
  };
  var byId = {}, byCode = {};
  N.forEach(function (n) { byId[n.id] = n; if (n.code) byCode[n.code] = n.id; });
  return { nodes: N, edges: E, layout: LAYOUT, byId: byId, byCode: byCode };
})();
