const KEY = "retailos-unified-brief-v5-i18n";
const page = document.body.dataset.page || "dashboard";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = p => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const number = value => Number(String(value || "0").replace(/[^0-9.-]/g, "")) || 0;
const BROWSER_LOCALES = { en:"en-US", ru:"ru-RU", uz:"uz-UZ" };
const localeCode = () => BROWSER_LOCALES[state?.locale] || BROWSER_LOCALES.en;
const money = value => `${new Intl.NumberFormat(localeCode(), {maximumFractionDigits:0}).format(Math.round(Number(value || 0)))} ${tr("currency.symbol")}`;
const formatDate = (value, withTime=true) => new Intl.DateTimeFormat(localeCode(), withTime
  ? {day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}
  : {day:"2-digit",month:"short",year:"numeric"}).format(new Date(value));
const today = () => formatDate(Date.now());

const icons = {
  dashboard:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  checkout:'<path d="M3 4h2l2 10h11l2-7H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/>',
  sales:'<path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  catalog:'<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
  import:'<path d="M12 16V4m-5 5 5-5 5 5M4 20h16"/>',
  suppliers:'<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  inventory:'<path d="M4 4h16v5H4zM4 13h16v7H4z"/><path d="M8 9v4M16 9v4"/>',
  transfer:'<path d="M7 7h13m0 0-4-4m4 4-4 4M17 17H4m0 0 4-4m-4 4 4 4"/>',
  clients:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.2a4 4 0 0 1 0 7.6"/>',
  reports:'<path d="M4 19V5M4 19h16m-13-4 4-4 3 3 5-7"/>',
  configuration:'<circle cx="12" cy="12" r="3"/><path d="M19 15a2 2 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a2 2 0 0 0-2-.4 2 2 0 0 0-1.2 1.6v.2h-4V21a2 2 0 0 0-1.2-1.6 2 2 0 0 0-2 .4l-.1.1-2.8-2.8.1-.1a2 2 0 0 0 .4-2A2 2 0 0 0 2 13.8H2v-4h.2A2 2 0 0 0 3.8 8a2 2 0 0 0-.4-2l-.1-.1 2.8-2.8.1.1a2 2 0 0 0 2 .4A2 2 0 0 0 9.4 2H9v-.2h4V2a2 2 0 0 0 1.2 1.6 2 2 0 0 0 2-.4l.1-.1 2.8 2.8-.1.1a2 2 0 0 0-.4 2 2 2 0 0 0 1.6 1.2h.2v4h-.2A2 2 0 0 0 19 15Z"/>',
  drafts:'<path d="M5 3h10l4 4v14H5z"/><path d="M14 3v5h5M8 13h8M8 17h6"/>',
  returns:'<path d="M9 7 5 11l4 4"/><path d="M5 11h9a5 5 0 0 1 5 5v2"/>',
  holds:'<path d="M7 4v16M17 4v16"/><path d="M10 7h4v10h-4z"/>',
  shift:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  "cash-operations":'<path d="M4 6h14a2 2 0 0 1 2 2v10H4z"/><path d="M4 6V5a2 2 0 0 1 2-2h11v3M15 12h5"/>',
  "register-history":'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', plus:'<path d="M12 5v14M5 12h14"/>', x:'<path d="m6 6 12 12M18 6 6 18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"/>', more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  check:'<path d="m5 12 4 4L19 6"/>', alert:'<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4m0 3h.01"/>',
  "chevron-left":'<path d="m15 18-6-6 6-6"/>', "chevron-right":'<path d="m9 18 6-6-6-6"/>', "chevron-up":'<path d="m18 15-6-6-6 6"/>',
  "chevrons-left":'<path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/>', "chevrons-right":'<path d="m13 7 5 5-5 5M6 7l5 5-5 5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
  profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  coffee:'<path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 10h1a3 3 0 0 1 0 6h-1M7 4v1m4-1v1m4-1v1"/>',
  beauty:'<path d="M9 3h6v4H9zM8 7h8l2 4v9H6v-9l2-4Z"/><path d="M9 14h6"/>',
  bag:'<path d="M4 8h16l-1 12H5L4 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  package:'<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>',
  "export":'<path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/>',
  loader:'<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.more}</svg>`;
const nav = ["dashboard","checkout","drafts","returns","holds","sales","catalog","import","suppliers","inventory","transfer","clients","shift","cash-operations","register-history","reports","configuration"];
const primaryNav = ["dashboard","checkout","catalog","inventory","clients","reports"];
const secondaryNav = nav.filter(item=>!primaryNav.includes(item));
const labels = { inventory:"Inventory", transfer:"Transfer", drafts:"Drafts", returns:"Returns", holds:"Holds", shift:"Cash Shift", "cash-operations":"Cash Operations", "register-history":"Register History" };
const tr = (key, vars={}) => {
  const dictionary=window.NOVA_LOCALES?.[state?.locale] || window.NOVA_LOCALES?.en || {};
  const fallback=window.NOVA_LOCALES?.en || {};
  const value=dictionary[key] ?? fallback[key] ?? labels[key] ?? key;
  return String(value).replace(/\{(\w+)\}/g, (_,name)=>vars[name] ?? `{${name}}`);
};
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let phraseCache={locale:"",exact:new Map(),templates:[],replacements:[]};

function buildPhraseCache() {
  if (phraseCache.locale===state.locale) return phraseCache;
  const locales=window.NOVA_LOCALES || {},target=locales[state.locale] || locales.en || {};
  const exact=new Map(),templates=[];
  Object.keys(locales.en || {}).filter(key=>!key.startsWith("__")).forEach(key=>{
    const translated=target[key] ?? locales.en[key];
    Object.values(locales).forEach(dictionary=>{
      const source=dictionary?.[key];
      if (typeof source!=="string" || !source) return;
      if (!source.includes("{")) exact.set(source,translated);
      else {
        const names=[];
        const pattern=escapeRegExp(source).replace(/\\\{(\w+)\\\}/g,(_,name)=>{
          names.push(name);
          return "(.+?)";
        });
        templates.push({regex:new RegExp(`^${pattern}$`,"u"),names,target:translated,weight:source.replace(/\{[^}]+\}/g,"").length});
      }
    });
  });
  templates.sort((a,b)=>b.weight-a.weight);
  const replacements=[...exact.entries()]
    .filter(([source,target])=>source!==target && source.length>2 && !source.includes("{"))
    .sort((a,b)=>b[0].length-a[0].length);
  phraseCache={locale:state.locale,exact,templates,replacements};
  return phraseCache;
}

function localizeText(value) {
  const leading=value.match(/^\s*/)?.[0] || "",trailing=value.match(/\s*$/)?.[0] || "";
  const source=value.trim();
  if (!source) return value;
  const {exact,templates}=buildPhraseCache();
  if (exact.has(source)) return `${leading}${exact.get(source)}${trailing}`;
  if (source.includes(" · ")) {
    const localized=source.split(" · ").map(part=>localizeText(part).trim());
    return `${leading}${[...new Set(localized)].join(" · ")}${trailing}`;
  }
  for (const separator of [" → ",", "]) {
    if (!source.includes(separator)) continue;
    const parts=source.split(separator);
    if (parts.every(part=>exact.has(part.trim()))) {
      return `${leading}${parts.map(part=>exact.get(part.trim())).join(separator)}${trailing}`;
    }
  }
  for (const template of templates) {
    const match=source.match(template.regex);
    if (!match) continue;
    const vars=Object.fromEntries(template.names.map((name,index)=>[name,match[index+1]]));
    return `${leading}${String(template.target).replace(/\{(\w+)\}/g,(_,name)=>vars[name]===undefined?"":localizeText(vars[name]).trim()).trim()}${trailing}`;
  }
  return value;
}

function localizeHtml(html) {
  return html
    .replace(/>([^<>]+)</g,(_,text)=>`>${localizeText(text)}<`)
    .replace(/\b(placeholder|title|aria-label)="([^"]*)"/g,(_,attribute,text)=>`${attribute}="${localizeText(text)}"`);
}

function seed() {
  const branches = [{id:"b1",name:"Downtown Store"},{id:"b2",name:"Airport Kiosk"},{id:"b3",name:"Salon Corner"}];
  const rows = [
    ["Espresso","ROS-0001","4780010001","Drinks","Coffee Trade",25000,15500,40,18],
    ["Cappuccino","ROS-0002","4780010002","Drinks","Coffee Trade",38000,23500,35,12],
    ["Sparkling Water 330ml","ROS-0003","4780010003","Drinks","Fresh Foods",12000,7200,5,16],
    ["Matcha Syrup","ROS-0004","4780010004","Drinks","Tea Imports",85000,52000,3,8],
    ["White Sneakers","ROS-0005","4780010005","Sneakers","Urban Kicks",790000,490000,14,4],
    ["Sneaker Cleaner Kit","ROS-0006","4780010006","Sneakers","Urban Kicks",150000,90000,2,5],
    ["Shoe Laces","ROS-0007","4780010007","Sneakers","Shoe Hub",30000,15000,3,20],
    ["Classic Haircut","ROS-0008","4780010008","Beauty","In-house",120000,0,999,999],
    ["Sneakers Cleaning","ROS-0009","4780010009","Services","In-house",250000,0,999,999],
    ["Shampoo 500ml","ROS-0010","4780010010","Beauty","Beauty World",120000,70000,22,9],
    ["Face Cream","ROS-0011","4780010011","Beauty","Beauty World",180000,105000,0,6],
    ["Coffee Beans 1kg","ROS-0012","4780010012","Groceries","Coffee Co.",210000,135000,25,11]
  ];
  const products = rows.map((r, n) => ({ id:`p${n+1}`, name:r[0], sku:r[1], barcode:r[2], category:r[3], supplier:r[4], price:r[5], cost:r[6], stockByBranch:{b1:r[7], b2:r[8], b3:Math.max(0, Math.floor(r[7]/2))}, unit:r[7] > 100 ? "service" : "pcs", fiscalCode:`TASNIF-${7200+n}`, status:r[7] === 0 ? "Неактивный" : "Активный", favorite:n < 6 }));
  const suppliers = [
    {id:"s1",name:"Coffee Trade",contact:"Aziz Karimov",phone:"+998 90 123 4501",balance:0,status:"Активный"},
    {id:"s2",name:"Beauty World",contact:"Malika Saidova",phone:"+998 90 123 4502",balance:1450000,status:"Долг"},
    {id:"s3",name:"Urban Kicks",contact:"Timur Lee",phone:"+998 90 123 4503",balance:3000000,status:"Долг"},
    {id:"s4",name:"Tea Imports",contact:"Iroda Nur",phone:"+998 90 123 4504",balance:0,status:"Активный"}
  ];
  const purchaseOrders = [
    {id:"PO-2408",supplier:"Urban Kicks",branchId:"b1",status:"Принят",ordered:12500000,received:9200000,remaining:3300000,progress:74,lines:18,date:"2024-05-20"},
    {id:"PO-2409",supplier:"Beauty World",branchId:"b1",status:"Оформлен",ordered:5400000,received:0,remaining:5400000,progress:32,lines:9,date:"2024-05-21"},
    {id:"PO-2410",supplier:"Tea Imports",branchId:"b2",status:"Оплачен",ordered:2800000,received:2800000,remaining:0,progress:100,lines:6,date:"2024-05-18"}
  ];
  const clients = ["Emily Carter","James Anderson","Sophia Martinez","Liam Thompson","Olivia Brown","Noah Wilson"].map((name,n)=>({id:`c${n+1}`,name,phone:`+998 90 555 ${1100+n}`,total:(n+2)*620000,debt:n===1?450000:n===5?200000:0,prepayment:n===2?750000:n===3?300000:0,loyalty:["Gold","Silver","VIP","Silver","Gold","Bronze"][n],lastVisit:`2024-05-${20-n}`,history:[]}));
  const employees = ["Liam Johnson","Emma Davis","Noah Wilson","Olivia Brown"].map((name,n)=>({id:`e${n+1}`,name,role:["Owner","Manager","Cashier","Cashier"][n],status:"Active"}));
  const payments = ["Cash","Card","QR","Transfer"];
  const sales = Array.from({length:42},(_,n)=>{const p=products[n%products.length],qty=1+n%3,total=p.price*qty;return{id:`sale${n+1}`,receipt:`R-${10480+n}`,date:new Date(2024,4,20-n%9,9+n%8,n*7%60).toISOString(),branchId:branches[(n+Math.floor(n/products.length))%branches.length].id,cashier:employees[n%employees.length].name,customer:clients[n%clients.length].name,items:[{id:p.id,name:p.name,qty,price:p.price}],subtotal:total,discount:n%7===0?total*.05:0,tax:total*.12,total:Math.round(total*1.12),payment:payments[n%4],fiscalized:n%5!==0,fiscalId:n%5!==0?`FISC-${88000+n}`:"",profit:(p.price-p.cost)*qty,status:"Completed"};});
  return {
    branches, branchId:"b1", products, suppliers, purchaseOrders, clients, employees, sales, cart:[],
    register:{open:false,cashierId:"",openingAmount:0,openedAt:"",expectedCash:0},
    config:{theme:"light",locale:"en",currency:"UZS",fiscalization:true,online:true,fiscalPending:0,qr:true,debtPostsOn:"accepted",disputedStocktakeMode:"movement-after-scan",reservedStockPolicy:"include-held"},
    receiptDiscount:0,payment:"Cash",customerId:"c1",search:"",category:"All",catalogStatus:"All",clientFilter:"All",importRows:[],
    dashboardPeriod:"today",dashboardGroup:"hour",dashboardStoreIds:branches.map(branch=>branch.id),
    dashboardDateFrom:"",dashboardDateTo:"",dashboardStoreMenuOpen:false,dashboardDateMenuOpen:false,
    dashboardCalendarYear:new Date().getFullYear(),dashboardCalendarMonth:new Date().getMonth(),
    dashboardCalendarMenuSide:"",dashboardCalendarMenuType:"",
    dashboardDateDraftFrom:"",dashboardDateDraftTo:"",dashboardDatePicking:"start",
    sidebarCollapsed:false,profileMenuOpen:false,checkoutMobileView:"products",
    importHistory:[
      {id:"IMP-104",status:"Проверяется",date:"2024-05-20",rows:128,fixed:88,errors:7,progress:69},
      {id:"IMP-103",status:"Успешно",date:"2024-05-19",rows:64,fixed:64,errors:0,progress:100},
      {id:"IMP-102",status:"Отменён",date:"2024-05-18",rows:32,fixed:9,errors:11,progress:28}
    ],
    stockMoves:[
      {product:"Sparkling Water 330ml",branchId:"b1",type:"Поступление",qty:24,date:"2024-05-20",user:"Liam Johnson"},
      {product:"White Sneakers",branchId:"b1",type:"Продажа",qty:-1,date:"2024-05-20",user:"Emma Davis"},
      {product:"Matcha Syrup",branchId:"b1",type:"Корректировка",qty:3,date:"2024-05-19",user:"Liam Johnson"}
    ],
    stocktakes:[
      {id:"INV-331",type:"Частичная",branchId:"b1",status:"В процессе",progress:58,expected:96,scanned:56,missing:7,surplus:3,newItems:2,reserved:4,date:"2024-05-20"},
      {id:"INV-330",type:"Полная",branchId:"b2",status:"Завершён",progress:100,expected:144,scanned:144,missing:4,surplus:6,newItems:1,reserved:0,date:"2024-05-12"}
    ],
    transfers:[
      {id:"TR-512",from:"b1",to:"b2",status:"Отправлен",progress:62,lines:8,qty:34,date:"2024-05-20"},
      {id:"TR-511",from:"b2",to:"b3",status:"Принят",progress:100,lines:5,qty:18,date:"2024-05-18"}
    ],
    registerMode:"full",
    entitlementBundles:{
      basic:{cash_shift:false,cash_operations:false,fiscalization:false,shift_close_count:false,register_history:false},
      full:{cash_shift:true,cash_operations:true,fiscalization:true,shift_close_count:true,register_history:true}
    },
    orgEntitlements:{cash_shift:true,cash_operations:true,fiscalization:true,shift_close_count:true,register_history:true},
    registerEntitlements:{cash_shift:true,cash_operations:true,fiscalization:true,shift_close_count:true,register_history:true},
    drafts:[
      {id:"DR-1047",branchId:"b1",registerId:"REG-01",cashierId:"e1",customerId:"c2",status:"Черновик",createdAt:"2024-05-20T08:12:00.000Z",updatedAt:"2024-05-20T10:24:00.000Z",lines:[{id:"p10",name:"Shampoo 500ml",price:120000,qty:2,discount:0},{id:"p6",name:"Sneaker Cleaner Kit",price:150000,qty:1,discount:0}]},
      {id:"DR-1044",branchId:"b1",registerId:"REG-01",cashierId:"e1",customerId:"c1",status:"Черновик",createdAt:"2024-05-19T12:40:00.000Z",updatedAt:"2024-05-19T13:02:00.000Z",lines:[{id:"p4",name:"Matcha Syrup",price:85000,qty:1,discount:0}]}
    ],
    currentDraftId:"",
    holds:[
      {id:"HD-301",branchId:"b1",registerId:"REG-01",customerId:"c2",status:"Активна",createdAt:"2024-05-08T09:00:00.000Z",depositRemaining:300000,lines:[{id:"p5",name:"White Sneakers",price:790000,qty:2}]},
      {id:"HD-304",branchId:"b1",registerId:"REG-01",customerId:"c5",status:"Активна",createdAt:"2024-05-17T15:20:00.000Z",depositRemaining:100000,lines:[{id:"p10",name:"Shampoo 500ml",price:120000,qty:1},{id:"p11",name:"Face Cream",price:180000,qty:1}]}
    ],
    customerTransactions:[
      {id:"CTX-1",customerId:"c2",holdId:"HD-301",type:"hold_prepayment",amount:300000,actor:"Liam Johnson",createdAt:"2024-05-08T09:00:00.000Z"},
      {id:"CTX-2",customerId:"c5",holdId:"HD-304",type:"hold_prepayment",amount:100000,actor:"Liam Johnson",createdAt:"2024-05-17T15:20:00.000Z"},
      {id:"CTX-3",customerId:"c3",type:"deposit_in",amount:750000,actor:"Emma Davis",createdAt:"2024-05-12T10:00:00.000Z"},
      {id:"CTX-4",customerId:"c4",type:"deposit_in",amount:300000,actor:"Emma Davis",createdAt:"2024-05-14T10:00:00.000Z"}
    ],
    returns:[
      {id:"RT-203",type:"Возврат",originalSaleId:"sale2",branchId:"b1",registerId:"REG-01",shiftId:"SH-092",customerId:"c2",linesIn:[{id:"p2",name:"Cappuccino",price:38000,qty:1}],linesOut:[],settlement:-38000,settlementMethod:"Cash",actor:"Emma Davis",createdAt:"2024-05-19T16:12:00.000Z",immutable:true}
    ],
    cashOperations:[
      {id:"CO-401",shiftId:"SH-092",registerId:"REG-01",branchId:"b1",type:"Внесение",amount:250000,reason:"Additional change float",actor:"Emma Davis",createdAt:"2024-05-19T10:15:00.000Z"},
      {id:"CO-402",shiftId:"SH-092",registerId:"REG-01",branchId:"b1",type:"Инкассация",amount:500000,reason:"Evening pickup",actor:"Emma Davis",createdAt:"2024-05-19T18:20:00.000Z"}
    ],
    moneyMovements:[
      {id:"MM-1",direction:"in",type:"cash_operation",method:"Cash",amount:250000,actor:"Emma Davis",registerId:"REG-01",shiftId:"SH-092",createdAt:"2024-05-19T10:15:00.000Z"},
      {id:"MM-2",direction:"out",type:"cash_operation",method:"Cash",amount:500000,actor:"Emma Davis",registerId:"REG-01",shiftId:"SH-092",createdAt:"2024-05-19T18:20:00.000Z"}
    ],
    registerHistory:[
      {id:"SH-092",registerId:"REG-01",branchId:"b1",openedBy:"Emma Davis",openedAt:"2024-05-19T08:55:00.000Z",openingFloat:750000,closedBy:"Emma Davis",closedAt:"2024-05-19T20:12:00.000Z",status:"Закрыта",closeCount:{expectedTotal:3410000,countedTotal:3390000,variance:-20000,lines:[{currency:"UZS",amount:3390000,rate:1,converted:3390000}]}},
      {id:"SH-091",registerId:"REG-01",branchId:"b1",openedBy:"Noah Wilson",openedAt:"2024-05-18T09:02:00.000Z",openingFloat:900000,closedBy:"Noah Wilson",closedAt:"2024-05-18T19:44:00.000Z",status:"Закрыта",closeCount:{expectedTotal:4235000,countedTotal:4240000,variance:5000,lines:[{currency:"UZS",amount:4240000,rate:1,converted:4240000}]}}
    ],
    cashUi:{returnSaleId:"sale1",returnQty:{},exchangeIds:[],settlementMethod:"Cash",operationType:"Внесение",selectedShiftId:"SH-092"},
    columns:["name","sku","barcode","category","supplier","price","cost","stock","fiscalCode","status"]
  };
}

let state;
try { state = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { state = seed(); }
function ensureData() {
  const fresh = seed();
  Object.keys(fresh).forEach(k => { if (state[k] === undefined) state[k] = fresh[k]; });
  state.config ||= fresh.config;
  state.branches ||= fresh.branches;
  state.branchId ||= "b1";
  state.products.forEach((p, i) => {
    if (!p.stockByBranch) p.stockByBranch = { b1:p.stock ?? fresh.products[i % fresh.products.length].stockByBranch.b1, b2:fresh.products[i % fresh.products.length].stockByBranch.b2, b3:0 };
    p.status ||= "Активный";
  });
  state.sales.forEach(s => {
    s.branchId ||= "b1";
    s.registerId ||= "REG-01";
    s.shiftId ||= "";
  });
  if (state.dashboardBranchSeedVersion!==2) {
    state.sales.forEach((sale,index)=>{sale.branchId=state.branches[(index+Math.floor(index/fresh.products.length))%state.branches.length].id;});
    state.dashboardBranchSeedVersion=2;
  }
  state.register.id ||= "REG-01";
  state.register.branchId ||= state.branchId;
  state.cashUi ||= fresh.cashUi;
  // TODO(owner-decision) D-3.1: supplier debt is posted when an order becomes "Принят" until owner confirms a different accounting moment.
  state.config.debtPostsOn ||= "accepted";
  // TODO(owner-decision) D-4.1: movements after item scan are shown as disputed lines until owner confirms the final reconciliation rule.
  state.config.disputedStocktakeMode ||= "movement-after-scan";
  // TODO(owner-decision) D-4.2 revision: expected stock includes held goods because they remain physically on hand.
  state.config.reservedStockPolicy ||= "include-held";
  // TODO(owner-decision) D-K1: Basic mode prints a visibly non-fiscal sales slip.
  // TODO(owner-decision) D-K2: Full mode requires an open shift before selling.
  // TODO(owner-decision) D-K3: foreign currency is accepted only as a shift-close count line.
  // TODO(owner-decision) D-K4: partial hold redemption is enabled.
}
ensureData();
state.locale = window.RETAILOS_LOCALE || state.locale || state.config.locale || "en";
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
save();

const branch = id => state.branches.find(b => b.id === id) || state.branches[0];
const currentBranch = () => branch(state.branchId);
const stockOf = p => Number(p.stockByBranch?.[state.branchId] ?? 0);
const capabilityKeys = ["cash_shift","cash_operations","fiscalization","shift_close_count","register_history"];
const isEnabled = key => capabilityKeys.includes(key) && state.orgEntitlements?.[key] === true && state.registerEntitlements?.[key] === true;
const activeShift = () => state.register.open ? state.register : null;
const heldQty = pid => state.holds.filter(h=>h.branchId===state.branchId&&h.status==="Активна").reduce((sum,h)=>sum+h.lines.filter(l=>l.id===pid).reduce((n,l)=>n+l.qty,0),0);
const availableStock = p => p.unit==="service" ? 999 : stockOf(p)-heldQty(p.id);
const customerBalance = id => state.customerTransactions.filter(t=>t.customerId===id).reduce((sum,t)=>sum+t.amount,0);
const cashier = () => state.employees.find(e => e.id === state.register.cashierId)?.name || "—";
const totals = () => { const subtotal=state.cart.reduce((s,i)=>s+i.price*i.qty*(1-(i.discount||0)/100),0), discount=subtotal*(state.receiptDiscount||0)/100, base=subtotal-discount, tax=isEnabled("fiscalization")&&state.config.fiscalization?base*.12:0; return {subtotal,discount,tax,total:Math.round(base+tax)}; };
const statusClass = text => /долг|out|error|short|refund|ошибка|неактив/i.test(text) ? "danger" : /low|pending|partial|queue|низ|провер|оформ|отправ|заблок/i.test(text) ? "warning" : /paid|valid|completed|credit|closed|актив|успеш|принят|оплачен|заверш/i.test(text) ? "positive" : "info";
const badge = text => `<span class="badge ${statusClass(text)}">${statusClass(text)==="warning" || statusClass(text)==="danger" ? icon("alert") : icon("check")}${text}</span>`;
const progress = value => `<span class="progress"><i style="width:${Math.max(0, Math.min(100, value))}%"></i><b>${value}%</b></span>`;
const header = (title, desc, actions = "") => `<header class="page-header"><div><h1>${title}</h1><p>${desc}</p></div><div class="actions">${actions}</div></header>`;
const field = (name,label,value="",type="text",moneyField=false) => `<label>${label}<span class="${moneyField?"money-input":""}"><input class="input" name="${name}" type="${type}" value="${value}" ${moneyField?'inputmode="numeric"':''}>${moneyField?"<b>сум</b>":""}</span></label>`;
const select = (name,label,items,selected="") => `<label>${label}<select class="select" name="${name}">${items.map(i=>{const [v,l]=Array.isArray(i)?i:[i,i];return `<option value="${v}" ${v===selected?"selected":""}>${l}</option>`}).join("")}</select></label>`;
const photo = p => `<span class="product-thumb">${p.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span>`;
const personPhoto = name => `<span class="customer-avatar">${name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span>`;
const productVisual = p => {
  const visual=p.unit==="service"?"beauty":p.category==="Drinks"||p.category==="Groceries"?"coffee":p.category==="Sneakers"?"bag":"package";
  return `<span class="product-visual">${icon(visual)}</span>`;
};

function dashboardDateValue(date) {
  const local=new Date(date.getTime()-date.getTimezoneOffset()*60000);
  return local.toISOString().slice(0,10);
}

function dashboardPresetRange(period) {
  const end=new Date();
  end.setHours(12,0,0,0);
  const start=new Date(end);
  if (period==="yesterday") {
    start.setDate(start.getDate()-1);
    end.setDate(end.getDate()-1);
  } else if (period==="week") start.setDate(start.getDate()-6);
  else if (period==="month") start.setDate(start.getDate()-29);
  else if (period==="year") start.setFullYear(start.getFullYear()-1),start.setDate(start.getDate()+1);
  return {from:dashboardDateValue(start),to:dashboardDateValue(end)};
}

function dashboardRange(period=state.dashboardPeriod||"today") {
  if (period==="custom"&&state.dashboardDateFrom&&state.dashboardDateTo) return {from:state.dashboardDateFrom,to:state.dashboardDateTo};
  return dashboardPresetRange(period);
}

function dashboardRangeDays(range) {
  const from=new Date(`${range.from}T12:00:00`),to=new Date(`${range.to}T12:00:00`);
  return Math.max(1,Math.round((to-from)/86400000)+1);
}

function dashboardGroupingOptions(period,range=dashboardRange(period)) {
  if (period==="today"||period==="yesterday") return ["hour"];
  if (period==="week") return ["day","hour"];
  if (period==="month") return ["day","week"];
  if (period==="year") return ["month","week"];
  const days=dashboardRangeDays(range);
  if (days<=2) return ["hour","day"];
  if (days<=45) return ["day","week"];
  if (days<=180) return ["day","week","month"];
  return ["week","month"];
}

function dashboardSelectedStoreIds() {
  const all=state.branches.map(branch=>branch.id);
  const selected=(state.dashboardStoreIds||all).filter(id=>all.includes(id));
  return selected.length?selected:all;
}

function dashboardStoreLabel(selected) {
  if (selected.length===state.branches.length) return tr("dashboard.allStores");
  if (selected.length===1) return branch(selected[0]).name;
  return tr("dashboard.storesSelected",{count:selected.length});
}

function dashboardDateLabel(range) {
  const options={day:"2-digit",month:"short",year:"numeric"};
  const from=new Intl.DateTimeFormat(localeCode(),options).format(new Date(`${range.from}T12:00:00`));
  const to=new Intl.DateTimeFormat(localeCode(),options).format(new Date(`${range.to}T12:00:00`));
  return range.from===range.to?from:`${from} – ${to}`;
}

function dashboardCalendarMonth(year,month,side,selection) {
  const weekStart=state.locale==="en"?0:1;
  const first=new Date(year,month,1),offset=(first.getDay()-weekStart+7)%7,start=new Date(year,month,1-offset);
  const monthNames=Array.from({length:12},(_,index)=>new Intl.DateTimeFormat(localeCode(),{month:"short"}).format(new Date(2026,index,1)));
  const weekDays=Array.from({length:7},(_,index)=>new Intl.DateTimeFormat(localeCode(),{weekday:"short"}).format(new Date(2026,0,4+weekStart+index)));
  const years=Array.from({length:12},(_,index)=>year-5+index),menuOpen=state.dashboardCalendarMenuSide===side,menuType=state.dashboardCalendarMenuType;
  const titleMonth=monthNames[month].endsWith(".")?monthNames[month]:`${monthNames[month]}.`;
  const menu=menuOpen?`<div class="calendar-title-menu open ${menuType==="year"?"year-menu":"month-menu"}" role="menu">${menuType==="year"?years.map(value=>`<button type="button" class="${value===year?"active":""}" data-calendar-year-choice="${value}" data-calendar-side="${side}">${value}</button>`).join(""):monthNames.map((name,index)=>`<button type="button" class="${index===month?"active":""}" data-calendar-month-choice="${index}" data-calendar-side="${side}">${name}</button>`).join("")}</div>`:"";
  const controls=`<div class="calendar-title"><button type="button" data-calendar-title="month" data-calendar-side="${side}" aria-label="${tr("dashboard.selectMonth")}" aria-expanded="${menuOpen&&menuType==="month"}">${titleMonth}</button><button type="button" data-calendar-title="year" data-calendar-side="${side}" aria-label="${tr("dashboard.selectYear")}" aria-expanded="${menuOpen&&menuType==="year"}">${year}</button>${menu}</div>`;
  const backward=side==="left"?`<div class="calendar-arrows"><button data-calendar-nav="year" data-step="-1" title="${tr("dashboard.previousYear")}" aria-label="${tr("dashboard.previousYear")}">${icon("chevrons-left")}</button><button data-calendar-nav="month" data-step="-1" title="${tr("dashboard.previousMonth")}" aria-label="${tr("dashboard.previousMonth")}">${icon("chevron-left")}</button></div>`:"";
  const forward=side==="right"?`<div class="calendar-arrows"><button data-calendar-nav="month" data-step="1" title="${tr("dashboard.nextMonth")}" aria-label="${tr("dashboard.nextMonth")}">${icon("chevron-right")}</button><button data-calendar-nav="year" data-step="1" title="${tr("dashboard.nextYear")}" aria-label="${tr("dashboard.nextYear")}">${icon("chevrons-right")}</button></div>`:"";
  const todayValue=dashboardDateValue(new Date());
  const days=Array.from({length:42},(_,index)=>{
    const date=new Date(start);
    date.setDate(start.getDate()+index);
    const value=dashboardDateValue(date),outside=date.getMonth()!==month,isStart=value===selection.from,isEnd=value===selection.to,inRange=selection.from&&selection.to&&value>selection.from&&value<selection.to;
    const classes=["calendar-day",outside?"outside":"",value===todayValue?"today":"",inRange?"in-range":"",isStart?"range-start":"",isEnd?"range-end":""].filter(Boolean).join(" ");
    return `<button class="${classes}" data-calendar-date="${value}" aria-label="${formatDate(value,false)}" aria-pressed="${isStart||isEnd}"><span>${date.getDate()}</span></button>`;
  }).join("");
  return `<section class="range-calendar"><header>${backward}${controls}${forward}</header><div class="calendar-weekdays">${weekDays.map(day=>`<span>${day}</span>`).join("")}</div><div class="calendar-days">${days}</div></section>`;
}

function dashboardCalendarPicker(range) {
  const base=new Date(Number(state.dashboardCalendarYear),Number(state.dashboardCalendarMonth),1),next=new Date(base.getFullYear(),base.getMonth()+1,1);
  const selection={from:state.dashboardDateDraftFrom||range.from,to:state.dashboardDateDraftTo};
  return `<div class="calendar-pair">${dashboardCalendarMonth(base.getFullYear(),base.getMonth(),"left",selection)}${dashboardCalendarMonth(next.getFullYear(),next.getMonth(),"right",selection)}</div>`;
}

function dashboardSalesSeries(period,revenue,group,range) {
  const days=dashboardRangeDays(range);
  const multiplier={yesterday:.86,today:1,week:6.4,month:26,year:295}[period]??Math.max(.75,days*.92);
  const count=group==="hour"?(days>2?14:12):group==="day"?Math.min(15,Math.max(2,days)):group==="week"?Math.min(14,Math.max(2,Math.ceil(days/7))):Math.min(12,Math.max(2,Math.ceil(days/30)));
  const weights=Array.from({length:count},(_,index)=>Math.max(4,18+index*1.25+Math.sin((index+1)*1.4)*5+Math.cos((index+2)*.72)*2.5));
  const total=Math.max(1,Math.round(revenue*multiplier)),weightTotal=weights.reduce((sum,value)=>sum+value,0);
  const values=weights.map(value=>Math.round(total*value/weightTotal));
  values[values.length-1]+=total-values.reduce((sum,value)=>sum+value,0);
  const start=new Date(`${range.from}T00:00:00`),end=new Date(`${range.to}T23:00:00`);
  const labels=weights.map((_,index)=>{
    const ratio=count===1?0:index/(count-1),date=new Date(start.getTime()+(end-start)*ratio);
    const options=group==="hour"
      ? (days===1?{hour:"2-digit",minute:"2-digit"}:{weekday:"short",hour:"2-digit"})
      : group==="month"?{month:"short",year:"2-digit"}:{day:"numeric",month:"short"};
    return new Intl.DateTimeFormat(localeCode(),options).format(date);
  });
  return {period,group,range,multiplier,total,values,labels};
}

function smoothChartPath(points) {
  return points.slice(1).reduce((path,point,index)=>{
    const previous=points[index],mid=(previous.x+point.x)/2;
    return `${path} C ${mid.toFixed(1)} ${previous.y.toFixed(1)}, ${mid.toFixed(1)} ${point.y.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  },`M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`);
}

function dashboardSalesChart(series,grouping) {
  const left=34,right=866,top=30,bottom=270;
  const max=Math.max(...series.values)*1.12;
  const points=series.values.map((value,index)=>({x:left+(right-left)*(index/(series.values.length-1)),y:bottom-(value/max)*(bottom-top),value,label:series.labels[index]}));
  const line=smoothChartPath(points),area=`${line} L ${right} ${bottom} L ${left} ${bottom} Z`;
  const axisIndexes=[0,Math.floor((points.length-1)/2),points.length-1];
  return `<article class="dash-card sales-area-card">
    <header class="sales-area-header">
      <div><h2>${tr("dashboard.salesOverview")}</h2><p>${tr("dashboard.salesOverviewHelp")}</p></div>
      <div class="sales-area-actions">${grouping}<div class="sales-period-total"><small>${tr("dashboard.totalForPeriod")}</small><strong>${money(series.total)}</strong></div></div>
    </header>
    <div class="sales-chart-plot" data-sales-chart>
      <svg viewBox="0 0 900 310" preserveAspectRatio="none" role="img" aria-label="${tr("dashboard.salesChartLabel")}">
        <defs><linearGradient id="salesAreaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%"/><stop offset="100%"/></linearGradient></defs>
        <path class="sales-chart-grid" d="M34 90H866M34 180H866M34 270H866"/>
        <path class="sales-chart-area" d="${area}"/>
        <path class="sales-chart-line" d="${line}"/>
        <line class="sales-chart-guide" x1="0" x2="0" y1="28" y2="270"/>
        <circle class="sales-chart-point" cx="0" cy="0" r="6"/>
        ${points.map((point,index)=>`<circle class="sales-chart-anchor" data-chart-index="${index}" data-label="${encodeURIComponent(point.label)}" data-value="${point.value}" cx="${point.x}" cy="${point.y}" r="1"/>`).join("")}
        <g class="sales-chart-labels">${axisIndexes.map(index=>`<text x="${points[index].x}" y="300" text-anchor="${index===0?"start":index===points.length-1?"end":"middle"}">${series.labels[index]}</text>`).join("")}</g>
        <rect class="sales-chart-hitbox" x="0" y="0" width="900" height="280"/>
      </svg>
      <div class="sales-chart-tooltip" role="status" aria-live="polite"><span></span><strong></strong></div>
    </div>
  </article>`;
}

function shell(content) {
  document.documentElement.dataset.theme = state.config.theme || "light";
  return `<div class="app"><aside class="sidebar"><a class="brand" href="dashboard.html"><span class="brand-mark">R</span><strong>Retail OS</strong></a><nav>${nav.map(n=>`<a class="nav-link ${page===n?"active":""}" href="${n}.html">${icon(n)}<span>${tr(n)}</span></a>`).join("")}</nav><div class="trust-footer"><div><span class="dot ${state.config.online?"ok":"bad"}"></span>${state.config.online?tr("online"):tr("offline")}</div><div>${badge(state.config.fiscalPending?`Fiscal: ${state.config.fiscalPending} pending`:tr("fiscalUpToDate"))}</div><div>${badge(state.register.open?`Register open · ${cashier()}`:tr("registerClosed"))}</div></div></aside><section class="workspace"><header class="topbar"><label class="global-search">${icon("search")}<input placeholder="${tr("search")}"></label><select id="branch" class="select compact branch-select">${state.branches.map(b=>`<option value="${b.id}" ${b.id===state.branchId?"selected":""}>${b.name}</option>`).join("")}</select><div class="trust-top"><span><i class="dot ${state.config.online?"ok":"bad"}"></i>${state.config.online?tr("online"):tr("offline")}</span><span>Fiscal: ${state.config.fiscalPending?`${state.config.fiscalPending} pending`:"up to date"}</span><span>${state.register.open?`Register · ${cashier()}`:"Register closed"}</span></div><select id="locale" class="select compact"><option value="en" ${state.locale==="en"?"selected":""}>EN</option><option value="ru" ${state.locale==="ru"?"selected":""}>RU</option><option value="uz" ${state.locale==="uz"?"selected":""}>UZ</option></select><button class="icon-button" data-action="theme" title="Toggle theme">${icon(state.config.theme==="dark"?"sun":"moon")}</button><span class="avatar">LJ</span></header><main>${content}</main></section></div><div id="modal-root"></div>`;
}

function dashboard() {
  const period=state.dashboardPeriod||"today",range=dashboardRange(period),selectedStores=dashboardSelectedStoreIds();
  const groupingOptions=dashboardGroupingOptions(period,range),group=groupingOptions.includes(state.dashboardGroup)?state.dashboardGroup:groupingOptions[0];
  const networkRecent=state.sales.slice(0,30),recent=networkRecent.filter(sale=>selectedStores.includes(sale.branchId||"b1"));
  const baseRevenue=recent.reduce((sum,sale)=>sum+sale.total,0),baseProfit=recent.reduce((sum,sale)=>sum+sale.profit,0),baseOrders=recent.length;
  const series=dashboardSalesSeries(period,baseRevenue,group,range);
  const revenue=series.total,orders=Math.max(1,Math.round(baseOrders*series.multiplier)),profit=Math.round(baseProfit*series.multiplier),avg=revenue/orders;
  const comparison={yesterday:"6.1",today:"18.2",week:"12.4",month:"8.7",year:"14.6",custom:"7.3"}[period]||"7.3";
  const lowStock=state.products.flatMap(product=>product.unit==="service"?[]:selectedStores.map(storeId=>({product,storeId,stock:Number(product.stockByBranch?.[storeId]??0)}))).filter(item=>item.stock<6).sort((a,b)=>a.stock-b.stock).slice(0,5);
  const storeWeights={b1:[1,.72,.58,.82,.64],b2:[1.18,.42,.36,.61,1.12],b3:[.34,1.38,1.24,1.08,.28]};
  const periodModifiers=period==="week"?[1,1.08,.92,1.2,.88]:period==="month"?[.94,1.18,1.12,.86,1.28]:period==="year"?[1.12,.96,1.2,.9,1.08]:[1,1,1,1,1];
  const topItems=["White Sneakers","Sneakers Cleaning","Classic Haircut","Shampoo 500ml","Cappuccino"].map((name,index)=>{
    const selectedWeight=selectedStores.reduce((sum,id)=>sum+(storeWeights[id]?.[index]||0),0);
    const networkWeight=state.branches.reduce((sum,store)=>sum+(storeWeights[store.id]?.[index]||0),0);
    const storeShare=networkWeight?selectedWeight/networkWeight:1;
    return {name,value:Math.round([5920000,3250000,2160000,1450000,980000][index]*series.multiplier*storeShare*periodModifiers[index])};
  }).sort((a,b)=>b.value-a.value);
  const kpis=[[tr("dashboard.periodRevenue"),money(revenue),tr("dashboard.comparison",{value:comparison})],[tr("dashboard.periodOrders"),orders,tr("dashboard.ordersInPeriod")],[tr("dashboard.periodAverage"),money(avg),tr("dashboard.averageHelp")],[tr("dashboard.periodProfit"),money(profit),tr("dashboard.profitHelp")]];
  const periodPicker=`<div class="dashboard-period-picker" role="group" aria-label="${tr("dashboard.periodLabel")}">${[["yesterday","dashboard.periodYesterday"],["today","dashboard.periodToday"],["week","dashboard.periodWeek"],["month","dashboard.periodMonth"],["year","dashboard.periodYear"]].map(([value,key])=>`<button class="${period===value?"active":""}" data-dashboard-period="${value}" aria-pressed="${period===value}">${tr(key)}</button>`).join("")}</div>`;
  const allStoresSelected=selectedStores.length===state.branches.length;
  const storeFilter=`<div class="dashboard-filter-control dashboard-store-control">
    <button class="dashboard-filter-button" data-action="dashboard-stores" aria-label="${tr("dashboard.storeFilter")}" aria-expanded="${state.dashboardStoreMenuOpen===true}">${icon("inventory")}<span><small>${tr("dashboard.storeFilter")}</small><strong>${dashboardStoreLabel(selectedStores)}</strong></span>${icon("chevron-up")}</button>
    <div class="dashboard-filter-popover store-filter-popover ${state.dashboardStoreMenuOpen?"open":""}">
      <label class="dashboard-check-row"><input type="checkbox" name="dashboard-store" value="all" ${allStoresSelected?"checked":""}><span><strong>${tr("dashboard.allStores")}</strong><small>${tr("dashboard.allStoresHelp")}</small></span></label>
      ${state.branches.map(store=>`<label class="dashboard-check-row"><input type="checkbox" name="dashboard-store" value="${store.id}" ${selectedStores.includes(store.id)?"checked":""}><span><strong>${store.name}</strong><small>${tr("dashboard.includeStore")}</small></span></label>`).join("")}
    </div>
  </div>`;
  const grouping=`<label class="dashboard-group-control chart-group-control"><span>${tr("dashboard.groupBy")}</span><select id="dashboard-grouping" aria-label="${tr("dashboard.groupBy")}">${groupingOptions.map(value=>`<option value="${value}" ${value===group?"selected":""}>${tr(`dashboard.group${value[0].toUpperCase()}${value.slice(1)}`)}</option>`).join("")}</select></label>`;
  const dateFilter=`<div class="dashboard-filter-control dashboard-date-control">
    <button class="dashboard-filter-button ${period==="custom"?"active":""}" data-action="dashboard-dates" title="${tr("dashboard.dateRange")}" aria-label="${tr("dashboard.dateRange")}: ${dashboardDateLabel(range)}" aria-expanded="${state.dashboardDateMenuOpen===true}">${icon("calendar")}<span><strong>${dashboardDateLabel(range)}</strong></span>${icon("chevron-up")}</button>
    <div class="dashboard-filter-popover date-filter-popover ${state.dashboardDateMenuOpen?"open":""}">${dashboardCalendarPicker(range)}</div>
  </div>`;
  const selectedStocktakes=state.stocktakes.filter(item=>selectedStores.includes(item.branchId));
  return shell(`<section class="dashboard-module">
    <header class="page-header dashboard-header"><div><h1>${tr("dashboard")}</h1><p>${tr("dashboard.workspaceSubtitle")}</p></div><div class="actions dashboard-header-actions">${storeFilter}<a class="button primary" href="checkout.html">${icon("checkout")}${tr("dashboard.newSale")}</a></div></header>
    <section class="dash-kpi-grid">${kpis.map(k=>`<article class="dash-kpi-card"><div class="dash-kpi-top"><span>${k[0]}</span></div><strong>${k[1]}</strong><small>${k[2]}</small></article>`).join("")}</section>
    <section class="dashboard-analytics-toolbar" aria-label="${tr("dashboard.analyticsFilters")}">${periodPicker}${dateFilter}</section>
    <section class="dash-main-grid">${dashboardSalesChart(series,grouping)}<aside class="dash-card dash-alerts"><header><div><h2>${tr("dashboard.lowStock")}</h2><p>${tr("dashboard.lowStockHelp")}</p></div><a href="inventory.html">${tr("dashboard.openInventory")}</a></header>${lowStock.map(item=>`<div class="dash-alert-row"><span class="dash-alert-icon ${item.stock===0?"error":"warning"}">${icon("alert")}</span><div><strong>${item.product.name}</strong><small>${branch(item.storeId).name} · ${item.product.supplier}</small></div><b>${item.stock}</b></div>`).join("") || `<div class="empty">${icon("check")}<strong>${tr("dashboard.noLowStock")}</strong><span>${tr("dashboard.stockHealthy")}</span></div>`}</aside></section>
    <section class="dash-secondary-grid"><article class="dash-card"><header><div><h2>${tr("dashboard.quickActions")}</h2></div></header><div class="dash-action-grid"><a href="checkout.html">${icon("checkout")}${tr("dashboard.newSale")}</a><a href="catalog.html">${icon("plus")}${tr("dashboard.createProduct")}</a><a href="suppliers.html">${icon("suppliers")}${tr("dashboard.purchaseOrder")}</a><a href="transfer.html">${icon("transfer")}${tr("transfer")}</a></div></article><article class="dash-card"><header><div><h2>${tr("dashboard.topProducts")}</h2><p>${tr("dashboard.topProductsHelp")}</p></div></header><div class="dash-bars">${topItems.map(item=>`<div><span>${item.name}</span><i style="--w:${Math.max(18,Math.round(item.value/topItems[0].value*100))}%"></i><b>${money(item.value)}</b></div>`).join("")}</div></article><article class="dash-card"><header><div><h2>${tr("dashboard.inventoryProgress")}</h2><p>${tr("dashboard.inventoryProgressHelp")}</p></div></header>${selectedStocktakes.length?selectedStocktakes.slice(0,2).map(x=>`<div class="inventory-mini-row"><span>${x.id} · ${x.type}</span>${badge(x.status)}${progress(x.progress)}</div>`).join(""):`<div class="empty compact-empty">${icon("inventory")}<strong>${tr("dashboard.noInventory")}</strong><span>${tr("dashboard.noInventoryHelp")}</span></div>`}</article></section>
  </section>`);
}

function checkout() {
  const t=totals(), filtered=state.products.filter(p=>`${p.name} ${p.sku} ${p.barcode} ${p.category} ${p.supplier}`.toLowerCase().includes(state.search.toLowerCase()) && (state.category==="All" || state.category==="Favorites" && p.favorite || p.category===state.category)).slice(0,18);
  return shell(`<h1 class="sr-only">${tr("checkout")}</h1><section class="register-strip ${state.register.open?"open":"closed"}"><div><strong>${state.register.open?`Register open · ${cashier()}`:tr("registerClosed")}</strong><small>${currentBranch().name} · ${state.register.open?`Expected ${money(state.register.expectedCash)}`:"Open before selling"}</small></div><button class="${state.register.open?"button secondary":"button primary"}" data-action="${state.register.open?"close-register":"open-register"}">${state.register.open?tr("closeRegister"):tr("openRegister")}</button></section><div class="checkout"><section class="catalog-well"><div class="scanner-row"><label class="search">${icon("search")}<input id="product-search" value="${state.search}" placeholder="Name, SKU, barcode, supplier"><kbd>/</kbd></label><label class="scanner"><input id="scanner" placeholder="Scan barcode and press Enter" autofocus></label></div><div class="chips">${["All","Favorites","Drinks","Sneakers","Beauty","Services"].map(c=>`<button class="chip ${state.category===c?"active":""}" data-category="${c}">${c}</button>`).join("")}</div><div class="products">${filtered.map(p=>`<button class="product" data-add="${p.id}"><span>${p.name[0]}</span><strong>${p.name}</strong><b>${money(p.price)}</b><small>${p.unit==="service"?"Service":`${stockOf(p)} in stock`}</small></button>`).join("")}</div></section><aside class="payment-panel"><section class="checkout-fields">${select("customer","Customer",state.clients.map(c=>[c.id,`${c.name} · Debt ${money(c.debt)} · Credit ${money(c.prepayment)}`]),state.customerId)}${field("discount","Discount %",state.receiptDiscount,"text")}<div>${badge(state.config.fiscalization?(state.config.online?"Fiscalized on payment":"Will fiscalize when online"):"Fiscalization disabled")}</div></section><section class="basket">${state.cart.length?state.cart.map(i=>`<div class="basket-item"><div><strong>${i.name}</strong><small>${money(i.price)}</small></div><div><button data-minus="${i.id}">−</button><b>${i.qty}</b><button data-plus="${i.id}">+</button><button data-remove="${i.id}">×</button></div></div>`).join(""):`<div class="empty">${icon("checkout")}<strong>Basket is empty</strong><span>Scan or tap a product to begin.</span></div>`}</section><footer class="pay-footer"><dl><div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div><div><dt>Discount</dt><dd>${money(t.discount)}</dd></div><div><dt>Tax</dt><dd>${money(t.tax)}</dd></div><div class="total"><dt>Total</dt><dd>${money(t.total)}</dd></div></dl><div class="payments">${["Cash","Card","QR","Transfer","Debt","Prepayment"].map(p=>`<button class="${state.payment===p?"active":""}" data-payment="${p}">${p}</button>`).join("")}</div><button class="button primary pay" data-action="pay" ${!state.register.open||!state.cart.length?"disabled":""}>${tr("pay")} ${money(t.total)}</button></footer></aside></div>`);
}

function sales() {
  return shell(`${header(tr("sales"),"Receipts, payments, fiscal status and cashier trace.",'<button class="button secondary">Export</button>')}<div class="table-wrap"><table><thead><tr><th>Receipt</th><th>Date</th><th>Customer</th><th>Cashier</th><th>Payment</th><th>Total</th><th>Fiscal</th><th>Action</th></tr></thead><tbody>${state.sales.slice(0,25).map(s=>`<tr><td>${s.receipt}</td><td>${formatDate(s.date)}</td><td>${s.customer}</td><td>${s.cashier}</td><td>${s.payment}</td><td>${money(s.total)}</td><td>${badge(s.fiscalized?"Fiscalized":"Pending")}</td><td><button class="row-icon" data-sale="${s.id}">${icon("more")}</button></td></tr>`).join("")}</tbody></table></div>`);
}

function catalog() {
  const items = state.products.filter(p => state.catalogStatus === "All" || p.status === state.catalogStatus);
  const filters=[["All",tr("common.all")],["Активный",tr("status.active")],["Неактивный",tr("status.inactive")]];
  return shell(`<section class="backoffice-view">${header(tr("catalog.title"),tr("catalog.description"),`<button class="button secondary" data-action="print-tags">${tr("catalog.printTags")}</button><button class="button secondary" data-action="tasnif">${tr("catalog.quickTasnif")}</button><button class="button primary" data-action="add-product">${icon("plus")}${tr("catalog.createProduct")}</button>`)}<div class="module-toolbar" role="toolbar"><div class="chips data-tabs" aria-label="${tr("common.status")}">${filters.map(([value,label])=>`<button class="chip ${state.catalogStatus===value?"active":""}" data-catalog-status="${value}" aria-pressed="${state.catalogStatus===value}">${label}</button>`).join("")}</div><span class="branch-chip">${icon("inventory")}${currentBranch().name}</span></div><div class="table-wrap data-table"><table><thead><tr><th>${tr("catalog.item")}</th><th>Barcode</th><th>${tr("common.category")}</th><th>${tr("common.supplier")}</th><th>${tr("catalog.salePrice")}</th><th>${tr("catalog.cost")}</th><th>${tr("catalog.stockBalance")}</th><th>${tr("common.status")}</th><th>${tr("common.action")}</th></tr></thead><tbody>${items.length?items.map(p=>`<tr><td><span class="table-entity">${photo(p)}<span><strong>${p.name}</strong><small>${p.sku} · ${p.fiscalCode}</small></span></span></td><td>${p.barcode}</td><td>${p.category}</td><td>${p.supplier}</td><td>${money(p.price)}</td><td>${money(p.cost)}</td><td class="${stockOf(p)<6&&p.unit!=="service"?"money-warning":""}">${p.unit==="service"?"—":stockOf(p)}</td><td>${badge(p.status)}</td><td><button class="row-icon" data-product="${p.id}" aria-label="${tr("catalog.editProduct")}">${icon("more")}</button></td></tr>`).join(""):`<tr><td colspan="9"><div class="empty">${icon("catalog")}<strong>${tr("catalog.noProducts")}</strong><span>${tr("catalog.noProductsHelp")}</span></div></td></tr>`}</tbody></table></div></section>`);
}

function imports() {
  const rows = state.importRows;
  return shell(`${header("Import","Файловый импорт и ручной ввод со сканером: проверка, ошибки, подтверждение и история.",'<button class="button secondary">Download template</button><button class="button primary" data-action="mock-import">Upload file</button>')}<section class="module-grid two"><article class="card upload"><h2>File import</h2><p>Mock .xlsx validation with required fields: name, barcode, supply price and sale price.</p><button class="button primary" data-action="mock-import">Choose mock file</button></article><article class="card"><h2>Manual + scanner</h2><div class="scanner-row single"><label class="scanner"><input id="import-scanner" placeholder="Scan unknown barcode and press Enter"></label></div><div class="stats"><div><span>Rows</span><b>${rows.length}</b></div><div><span>Valid</span><b class="money-positive">${rows.filter(r=>!r.errors.length).length}</b></div><div><span>Errors</span><b class="money-danger">${rows.filter(r=>r.errors.length).length}</b></div></div><button class="button secondary" data-action="validate-import">Retry validation</button><button class="button primary" data-action="import-valid">Import valid rows</button></article></section><section class="module-grid two"><article class="card"><header><div><h2>Current validation</h2><small>Progress is fixed rows divided by total rows.</small></div></header><div class="table-wrap"><table><thead><tr><th>Name</th><th>SKU</th><th>Barcode</th><th>Sale price</th><th>Supply price</th><th>Stock</th><th>Validation</th></tr></thead><tbody>${rows.length?rows.map((r,n)=>`<tr><td contenteditable data-import="${n}:name">${r.name}</td><td>${r.sku}</td><td contenteditable data-import="${n}:barcode">${r.barcode}</td><td contenteditable data-import="${n}:price">${r.price}</td><td contenteditable data-import="${n}:cost">${r.cost}</td><td contenteditable data-import="${n}:stock">${r.stock}</td><td>${r.errors.length?badge(r.errors.join(", ")):badge("Успешно")}</td></tr>`).join(""):`<tr><td colspan="7"><div class="empty">${icon("import")}<strong>No import session</strong><span>Upload the mock spreadsheet to preview rows.</span></div></td></tr>`}</tbody></table></div></article><article class="card"><header><div><h2>Import history</h2><small>Фильтры по статусу и дате в прототипе показаны как состояния.</small></div></header>${state.importHistory.map(h=>`<div class="history-row"><span><strong>${h.id}</strong><small>${formatDate(h.date,false)} · ${h.rows} rows · ${h.errors} errors</small></span>${badge(h.status)}${progress(h.progress)}<button class="button secondary">Print tags</button></div>`).join("")}</article></section>`);
}

function suppliers() {
  return shell(`${header("Purchase Orders / Suppliers","Заказы поставщикам: Оформлен → Принят → Оплачен / Возврат.",'<button class="button primary" data-action="supplier-order">Create PO</button>')}<section class="module-grid three">${state.suppliers.map(s=>`<article class="card"><header><div><h2>${s.name}</h2><small>${s.contact} · ${s.phone}</small></div>${badge(s.status)}</header><div class="metric"><span>Settlement</span><b class="${s.balance?"money-danger":""}">${money(s.balance)}</b></div><div class="metric"><span>Products</span><b>${state.products.filter(p=>p.supplier===s.name).length}</b></div><button class="button secondary" data-supplier="${s.id}">Open profile</button></article>`).join("")}</section><div class="table-wrap po-table"><table><thead><tr><th>Order</th><th>Supplier</th><th>Branch</th><th>Status</th><th>Lines</th><th>Progress</th><th>Ordered</th><th>Received</th><th>Remaining</th><th>Action</th></tr></thead><tbody>${state.purchaseOrders.map(o=>`<tr><td>${o.id}</td><td>${o.supplier}</td><td>${branch(o.branchId).name}</td><td>${badge(o.status)}</td><td>${o.lines}</td><td>${progress(o.progress)}</td><td>${money(o.ordered)}</td><td>${money(o.received)}</td><td class="${o.remaining?"money-danger":""}">${money(o.remaining)}</td><td><button class="row-icon" data-po="${o.id}">${icon("more")}</button></td></tr>`).join("")}</tbody></table></div>`);
}

function inventoryLegacy() {
  const items = state.products.filter(p => p.unit !== "service");
  const low = items.filter(p => stockOf(p) > 0 && stockOf(p) < 6).length;
  const out = items.filter(p => stockOf(p) === 0).length;
  const active = state.stocktakes[0];
  return shell(`${header("Inventory / Stocktake","Инвентаризация, движение товаров и остатки всегда считаются по товару и филиалу.",'<button class="button secondary" data-action="stock-adjust">Stock Adjustment</button><button class="button primary" data-action="start-stocktake">Start Inventory</button>')}<section class="kpis"><article class="card"><span>Total items</span><strong>${items.length}</strong><small>${currentBranch().name}</small></article><article class="card"><span>Low stock</span><strong class="money-warning">${low}</strong><small>semantic warning</small></article><article class="card"><span>Out of stock</span><strong class="money-danger">${out}</strong><small>semantic problem</small></article><article class="card"><span>Incoming stock</span><strong>3</strong><small>purchase orders</small></article></section><section class="module-grid inventory-layout"><article class="card"><header><div><h2>Active stocktake</h2><small>${active.id} · ${active.type} · ${branch(active.branchId).name}</small></div>${badge(active.status)}</header><div class="reserved-warning">${icon("alert")}Reserved stock is excluded from expected stock by default. Review reserved orders before completion.</div><div class="stocktake-counters"><div><span>Expected</span><b>${active.expected}</b></div><div><span>Scanned</span><b>${active.scanned}</b></div><div><span>Missing</span><b class="money-danger">${active.missing}</b></div><div><span>Surplus</span><b class="money-positive">${active.surplus}</b></div><div><span>New</span><b>${active.newItems}</b></div><div><span>Reserved</span><b class="money-warning">${active.reserved}</b></div></div>${progress(active.progress)}<div class="scanner-row single"><label class="scanner"><input id="stocktake-scanner" placeholder="Scan barcode or enter qty + Enter"></label></div><div class="chips">${["Сканированные","Недостача","Излишек","Новые","Все","Спорные"].map((x,n)=>`<button class="chip ${n===0?"active":""}">${x}</button>`).join("")}</div></article><article class="card"><header><div><h2>Completion values</h2><small>Shortage and surplus at supply and sale price.</small></div></header><div class="metric"><span>Shortage at supply</span><b class="money-danger">${money(845000)}</b></div><div class="metric"><span>Shortage at sale</span><b class="money-danger">${money(1290000)}</b></div><div class="metric"><span>Surplus at supply</span><b class="money-positive">${money(315000)}</b></div><div class="metric"><span>Surplus at sale</span><b class="money-positive">${money(520000)}</b></div><button class="button secondary">Pause / lock</button><button class="button primary">Complete stocktake</button></article></section><section class="module-grid two"><article class="card"><header><div><h2>Stock levels</h2><small>Stock product x branch.</small></div></header><div class="table-wrap"><table><thead><tr><th>Item</th><th>Category</th><th>Stock</th><th>Status</th><th>Supplier</th><th>Last update</th><th>Action</th></tr></thead><tbody>${items.map(p=>`<tr><td>${photo(p)} ${p.name}</td><td>${p.category}</td><td class="${stockOf(p)===0?"money-danger":stockOf(p)<6?"money-warning":""}">${stockOf(p)}</td><td>${badge(stockOf(p)===0?"Out of Stock":stockOf(p)<6?"Low":"In Stock")}</td><td>${p.supplier}</td><td>20 мая 2024</td><td><button class="button secondary">Adjust</button></td></tr>`).join("")}</tbody></table></div></article><article class="card"><header><div><h2>Movement log</h2><small>Offline writes queue locally and sync later.</small></div></header>${state.stockMoves.map(m=>`<div class="history-row"><span><strong>${m.product}</strong><small>${branch(m.branchId).name} · ${m.type} · ${m.user}</small></span><b class="${m.qty<0?"money-danger":"money-positive"}">${m.qty>0?"+":""}${m.qty}</b><small>${m.date}</small></div>`).join("")}<h2 class="section-title">Stocktake list</h2>${state.stocktakes.map(x=>`<div class="history-row"><span><strong>${x.id}</strong><small>${x.type} · ${branch(x.branchId).name}</small></span>${badge(x.status)}${progress(x.progress)}</div>`).join("")}</article></section>`);
}

function transfer() {
  const draftRows = state.products.filter(p=>p.unit!=="service").slice(0,5);
  return shell(`${header("Transfer","Перемещение между филиалами: same-branch blocked, source stock protected, offline-first send/receive.",'<button class="button secondary">Import rows</button><button class="button primary" data-action="create-transfer">Create transfer</button>')}<section class="card transfer-builder"><div class="transfer-route">${select("from","Source branch",state.branches.map(b=>[b.id,b.name]),"b1")}${select("to","Destination branch",state.branches.map(b=>[b.id,b.name]),"b2")}<div class="scanner-row single"><label class="scanner"><input id="transfer-scanner" placeholder="Scan item for transfer"></label></div></div><div class="stats"><div><span>Lines</span><b>${draftRows.length}</b></div><div><span>Total qty</span><b>24</b></div><div><span>Progress</span><b>62%</b></div></div><div class="table-wrap"><table><thead><tr><th>Item</th><th>Sender stock</th><th>Send qty</th><th>Receiver stock</th><th>Status</th></tr></thead><tbody>${draftRows.map((p,n)=>`<tr><td>${photo(p)} ${p.name}</td><td>${p.stockByBranch.b1}</td><td>${[4,6,3,2,9][n]}</td><td>${p.stockByBranch.b2}</td><td>${badge(p.stockByBranch.b1<[4,6,3,2,9][n]?"Blocked":"Ready")}</td></tr>`).join("")}</tbody></table></div><div class="actions transfer-actions"><button class="button secondary">Save draft</button><button class="button primary">Send transfer</button><button class="button secondary">Receive in destination</button></div></section><section class="module-grid two"><article class="card"><header><div><h2>Transfer history</h2><small>Отправлен decreases source stock; Принят increases destination stock.</small></div></header>${state.transfers.map(t=>`<div class="history-row"><span><strong>${t.id}</strong><small>${branch(t.from).name} → ${branch(t.to).name} · ${t.qty} pcs · ${t.date}</small></span>${badge(t.status)}${progress(t.progress)}</div>`).join("")}</article><article class="card"><header><div><h2>Offline queue</h2><small>Writes complete locally first, then sync when online.</small></div></header><div class="empty">${icon(state.config.online?"check":"alert")}<strong>${state.config.online?"No queued transfer writes":"2 writes waiting for sync"}</strong><span>Trust Layer remains only in the global status area.</span></div></article></section>`);
}

function clients() {
  const active=state.clientFilter||"All",rows=state.clients.filter(c=>active==="All"||active==="Debt"&&c.debt>0||active==="Prepayment"&&c.prepayment>0);
  const filters=[["All",tr("clients.allCustomers")],["Debt",tr("debt")],["Prepayment",tr("prepayment")]];
  return shell(`<section class="backoffice-view">${header(tr("clients"),tr("clients.description"),`<button class="button primary" data-action="add-client">${icon("plus")}${tr("clients.add")}</button>`)}<div class="module-toolbar" role="toolbar"><div class="chips data-tabs" aria-label="${tr("clients.balanceFilter")}">${filters.map(([value,label])=>`<button class="chip ${active===value?"active":""}" data-client-filter="${value}" aria-pressed="${active===value}">${label}</button>`).join("")}</div><span class="branch-chip">${icon("dashboard")}${tr("clients.allStores")}</span></div><div class="table-wrap data-table"><table><thead><tr><th>${tr("common.customer")}</th><th>${tr("common.phone")}</th><th>${tr("clients.totalSpent")}</th><th>${tr("debt")}</th><th>${tr("prepayment")}</th><th>${tr("clients.loyalty")}</th><th>${tr("clients.lastVisit")}</th><th>${tr("common.action")}</th></tr></thead><tbody>${rows.length?rows.map(c=>`<tr><td><span class="table-entity">${personPhoto(c.name)}<span><strong>${c.name}</strong><small>${c.history.length} ${tr("clients.receipts")}</small></span></span></td><td>${c.phone}</td><td>${money(c.total)}</td><td class="${c.debt?"money-danger":""}">${money(c.debt)}</td><td class="${c.prepayment?"money-positive":""}">${money(c.prepayment)}</td><td>${c.loyalty}</td><td>${formatDate(c.lastVisit,false)}</td><td><button class="row-icon" data-client="${c.id}" aria-label="${tr("clients.openProfile")}">${icon("more")}</button></td></tr>`).join(""):`<tr><td colspan="8"><div class="empty">${icon("clients")}<strong>${tr("clients.noResults")}</strong><span>${tr("clients.noResultsHelp")}</span></div></td></tr>`}</tbody></table></div></section>`);
}

function reportChartPaths(values) {
  const left=48,right=712,top=44,bottom=250;
  const revenue=values,cost=values.map((value,index)=>Math.round(value*(.56+Math.sin(index*.8)*.035))),profit=values.map((value,index)=>Math.max(0,value-cost[index]));
  const max=Math.max(...revenue)*1.12;
  const pathFor=series=>smoothChartPath(series.map((value,index)=>({x:left+(right-left)*(index/(series.length-1)),y:bottom-(value/max)*(bottom-top)})));
  return {revenue:pathFor(revenue),cost:pathFor(cost),profit:pathFor(profit)};
}

function reports() {
  const period=state.dashboardPeriod||"today",range=dashboardRange(period),selectedStores=dashboardSelectedStoreIds(),source=state.sales.slice(0,30).filter(sale=>selectedStores.includes(sale.branchId||"b1"));
  const groupOptions=dashboardGroupingOptions(period,range),group=groupOptions.includes(state.dashboardGroup)?state.dashboardGroup:groupOptions[0],baseRevenue=source.reduce((sum,sale)=>sum+sale.total,0),baseProfit=source.reduce((sum,sale)=>sum+sale.profit,0),series=dashboardSalesSeries(period,baseRevenue,group,range);
  const revenue=series.total,profit=Math.round(baseProfit*series.multiplier),orders=Math.max(1,Math.round(source.length*series.multiplier)),lowStock=state.products.flatMap(product=>product.unit==="service"?[]:selectedStores.map(storeId=>Number(product.stockByBranch?.[storeId]??0))).filter(stock=>stock<6).length,debt=state.clients.reduce((sum,client)=>sum+client.debt,0),prepay=state.clients.reduce((sum,client)=>sum+client.prepayment,0),supplierBalance=state.suppliers.reduce((sum,supplier)=>sum+supplier.balance,0),paths=reportChartPaths(series.values);
  const topItems=[["White Sneakers",5920000],["Sneakers Cleaning",3250000],["Classic Haircut",2160000],["Shampoo 500ml",1450000],["Cappuccino",980000]].map(([name,value])=>[name,Math.round(value*series.multiplier*selectedStores.length/state.branches.length)]);
  const periodPicker=`<div class="dashboard-period-picker report-period-picker" role="group" aria-label="${tr("dashboard.periodLabel")}">${[["yesterday","dashboard.periodYesterday"],["today","dashboard.periodToday"],["week","dashboard.periodWeek"],["month","dashboard.periodMonth"],["year","dashboard.periodYear"]].map(([value,key])=>`<button class="${period===value?"active":""}" data-dashboard-period="${value}" aria-pressed="${period===value}">${tr(key)}</button>`).join("")}</div>`;
  const payments=[["Card",45,"var(--data-1)"],["Cash",30,"var(--data-2)"],["QR",15,"var(--data-3)"],["Transfer",10,"var(--data-4)"]];
  return shell(`<section class="reports-module">${header(tr("reports"),tr("reports.operationalDescription"),`<button class="button primary">${tr("reports.export")}</button>`)}<section class="report-kpi-grid"><article class="report-kpi"><span>${tr("reports.totalRevenue")}</span><strong>${money(revenue)}</strong><small>${tr("reports.selectedPeriod")}</small></article><article class="report-kpi"><span>${tr("dashboard.orders")}</span><strong>${orders}</strong><small>${tr("dashboard.completedReceipts")}</small></article><article class="report-kpi"><span>${tr("dashboard.grossProfit")}</span><strong>${money(profit)}</strong><small>${tr("reports.selectedPeriod")}</small></article><article class="report-kpi"><span>${tr("dashboard.lowStock")}</span><strong class="money-warning">${lowStock}</strong><small>${tr("reports.requiresReview")}</small></article></section><section class="report-main-grid"><article class="report-card report-line-card"><header><div><h2>${tr("reports.salesByDay")}</h2><p>${tr("reports.salesSeriesHelp")}</p></div><strong>${money(revenue)}</strong></header><svg viewBox="0 0 760 300" role="img" aria-label="${tr("reports.salesByDay")}"><path class="report-grid" d="M48 56h664M48 116h664M48 176h664M48 236h664"/><path class="report-line revenue" d="M48 250C112 206 152 232 212 170S340 196 402 128 494 94 548 94 612 88 666 52 712 40"/><path class="report-line cost" d="M48 250C126 238 174 218 236 204S350 210 430 184 520 160 612 150 676 124 712 118"/><path class="report-line profit" d="M48 266C124 254 196 244 270 232S384 226 456 208 580 196 712 172"/></svg><div class="report-legend"><span><i style="background:var(--data-1)"></i>${tr("reports.revenue")}</span><span><i style="background:var(--data-2)"></i>${tr("reports.cost")}</span><span><i style="background:var(--data-3)"></i>${tr("reports.profit")}</span></div></article><aside class="report-card report-attention"><header><div><h2>${tr("reports.attention")}</h2><p>${tr("reports.attentionHelp")}</p></div></header><div class="report-alert semantic-debt"><span>${tr("debt")}</span><strong>${money(debt)}</strong><small>${tr("reports.customersOwe")}</small></div><div class="report-alert semantic-positive"><span>${tr("prepayment")}</span><strong>${money(prepay)}</strong><small>${tr("reports.customerCredit")}</small></div><div class="report-alert semantic-warning"><span>${tr("reports.supplierBalance")}</span><strong>${money(supplierBalance)}</strong><small>${tr("reports.unpaidOrders")}</small></div></aside></section><section class="report-secondary-grid"><article class="report-card"><header><div><h2>${tr("reports.topItems")}</h2><p>${tr("reports.rankedBySales")}</p></div></header><div class="report-bars">${topItems.map(item=>`<div><span>${item[0]}</span><i style="--w:${Math.round(item[1]/topItems[0][1]*100)}%"></i><b>${money(item[1])}</b></div>`).join("")}</div></article><article class="report-card payment-card"><header><div><h2>${tr("reports.paymentMethods")}</h2><p>${tr("reports.paymentShare")}</p></div></header><div class="report-donut"></div><div class="report-payments">${payments.map(([name,value,color])=>`<div><span><i style="background:${color}"></i>${tr(`payment.${name.toLowerCase()}`)}</span><b>${value}%</b></div>`).join("")}</div></article><article class="report-card"><header><div><h2>${tr("reports.cashierPerformance")}</h2><p>${tr("reports.cashierHelp")}</p></div></header><div class="table-wrap"><table><thead><tr><th>${tr("common.operator")}</th><th>${tr("dashboard.orders")}</th><th>${tr("sales")}</th><th>${tr("dashboard.avgReceipt")}</th><th>${tr("reports.trend")}</th></tr></thead><tbody>${[["Liam Johnson",68,2580000,37940,"+18.2%"],["Emma Davis",42,1640000,39050,"+12.5%"],["Noah Wilson",16,600000,37500,"+5.3%"]].map(c=>`<tr><td>${c[0]}</td><td>${c[1]}</td><td>${money(c[2])}</td><td>${money(c[3])}</td><td><span class="report-trend up">${c[4]}</span></td></tr>`).join("")}</tbody></table></div></article></section></section>`);
}

function configuration() {
  return shell(`${header(tr("configuration"),"Theme, language, branch rules, fiscalization and permissions.",'<button class="button primary" data-action="add-employee">'+icon("plus")+'Add Employee</button>')}<section class="config-grid"><article class="card"><h2>System preferences</h2><div class="toggle-row"><span>Dark theme</span><button class="toggle ${state.config.theme==="dark"?"on":""}" data-action="theme"></button></div><div class="toggle-row"><span>Fiscalization enabled</span><button class="toggle ${state.config.fiscalization?"on":""}" data-action="fiscal"></button></div><div class="toggle-row"><span>Online simulation</span><button class="toggle ${state.config.online?"on":""}" data-action="online"></button></div><label>Language<select class="select" id="locale-config"><option value="en" ${state.locale==="en"?"selected":""}>English</option><option value="ru" ${state.locale==="ru"?"selected":""}>Русский</option><option value="uz" ${state.locale==="uz"?"selected":""}>O'zbek</option></select></label></article><article class="card"><h2>Inventory decisions</h2><div class="metric"><span>Debt posts on</span><b>${state.config.debtPostsOn}</b></div><div class="metric"><span>Disputed movement rule</span><b>${state.config.disputedStocktakeMode}</b></div><div class="metric"><span>Reserved stock policy</span><b>${state.config.reservedStockPolicy}</b></div></article><article class="card permissions"><h2>Cashier permissions</h2><div class="table-wrap"><table><thead><tr><th>Module</th><th>View</th><th>Create</th><th>Edit</th><th>Delete</th><th>Export</th><th>Configure</th></tr></thead><tbody>${nav.map(n=>`<tr><td>${tr(n)}</td>${["View","Create","Edit","Delete","Export","Configure"].map((p,i)=>`<td><input class="checkbox" type="checkbox" ${i===0||n==="checkout"&&i<2?"checked":""}></td>`).join("")}</tr>`).join("")}</tbody></table></div></article></section>`);
}

function inventory() {
  return inventoryLegacy().replace(
    "Reserved stock is excluded from expected stock by default. Review reserved orders before completion.",
    "Held goods stay in physical expected stock and are shown separately, preventing phantom surplus."
  ).replace('<section class="module-grid two">','<section class="module-grid two inventory-backoffice">');
}

function cashStatus(status) {
  const key={
    "Черновик":"status.draft","Draft":"status.draft",
    "Проведён":"status.completed","Completed":"status.completed",
    "Удалён":"status.deleted","Deleted":"status.deleted",
    "Активна":"status.active","Активный":"status.active","Active":"status.active",
    "Выкуплена":"status.redeemed","Redeemed":"status.redeemed",
    "Отменена":"status.cancelled","Отменён":"status.cancelled","Cancelled":"status.cancelled",
    "Открыта":"status.open","Open":"status.open",
    "Закрыта":"status.closed","Closed":"status.closed",
    "Возврат":"status.return","Return":"status.return",
    "Обмен":"status.exchange","Exchange":"status.exchange",
    "Внесение":"operation.income","Cash income":"operation.income",
    "Выплата":"operation.expense","Cash expense":"operation.expense",
    "Инкассация":"operation.collection","Collection":"operation.collection"
  }[status];
  return key ? tr(key) : localizeText(status);
}

function cashGate(pageName) {
  const map = {shift:"cash_shift","cash-operations":"cash_operations","register-history":"register_history"};
  return map[pageName] || "";
}

function explicitMoney(value) {
  if (value > 0) return tr("template.customerPays",{amount:money(value)});
  if (value < 0) return tr("template.storePays",{amount:money(Math.abs(value))});
  return tr("returns.evenExchange");
}

function saveCurrentDraft(showToast=false) {
  if (!state.cart.length) {
    if (showToast) toast("Add an item before saving a draft","danger");
    return;
  }
  let draft=state.drafts.find(d=>d.id===state.currentDraftId&&d.status==="Черновик");
  if (!draft) {
    draft={id:`DR-${1050+state.drafts.length}`,branchId:state.branchId,registerId:"REG-01",cashierId:state.register.cashierId||"e1",customerId:state.customerId,status:"Черновик",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),lines:[]};
    state.drafts.unshift(draft);
    state.currentDraftId=draft.id;
  }
  draft.lines=state.cart.map(i=>({...i}));
  draft.customerId=state.customerId;
  draft.updatedAt=new Date().toISOString();
  save();
  if (showToast) toast("Draft saved locally");
}

function movement(direction,type,amount,method="Cash",shiftId=state.register.shiftId||"") {
  state.moneyMovements.unshift({id:uid("MM"),direction,type,amount,method,actor:cashier()==="—"?"Liam Johnson":cashier(),registerId:"REG-01",shiftId,createdAt:new Date().toISOString()});
}

function expectedCash(shiftId=state.register.shiftId) {
  const archived=state.registerHistory.find(s=>s.id===shiftId);
  const opening=state.register.open&&state.register.shiftId===shiftId?state.register.openingAmount:(archived?.openingFloat||0);
  return opening+state.moneyMovements.filter(m=>m.shiftId===shiftId&&m.method==="Cash").reduce((sum,m)=>sum+(m.direction==="in"?m.amount:-m.amount),0);
}

function varianceLabel(value) {
  if (value===0) return tr("shift.balanced");
  return value>0?tr("template.drawerOver",{amount:money(value)}):tr("template.drawerShort",{amount:money(Math.abs(value))});
}

function customerById(id) {
  return state.clients.find(c=>c.id===id);
}

function cashShellNav() {
  const link=n=>{
    const gate=cashGate(n),disabled=gate&&!isEnabled(gate);
    const label=tr(n),tooltip=label.replace(/"/g,"&quot;"),body=`${icon(n)}<span>${label}</span>`;
    return disabled
      ? `<span class="nav-link disabled" data-sidebar-tooltip="${tooltip}" aria-label="${tr("nav.notEnabled",{module:label})}">${body}</span>`
      : `<a class="nav-link ${page===n?"active":""}" href="${n}.html" data-sidebar-tooltip="${tooltip}">${body}</a>`;
  };
  const moreLabel=tr("nav.more").replace(/"/g,"&quot;");
  return `${primaryNav.map(link).join("")}<details class="nav-more" ${secondaryNav.includes(page)?"open":""}><summary data-sidebar-tooltip="${moreLabel}">${icon("more")}<span>${tr("nav.more")}</span></summary><div>${secondaryNav.map(link).join("")}</div></details>`;
}

function shell(content) {
  document.documentElement.dataset.theme=state.config.theme||"light";
  const pending=state.config.fiscalPending||0;
  const healthy=state.config.online&&pending===0;
  const collapsed=state.sidebarCollapsed===true,profileOpen=state.profileMenuOpen===true;
  const sidebarLabel=tr(collapsed?"profile.expandSidebar":"profile.collapseSidebar");
  return `<div class="app ${collapsed?"sidebar-collapsed":""}">
    <aside class="sidebar">
      <a class="brand" href="dashboard.html"><span class="brand-mark">R</span><strong>Retail OS</strong></a>
      <button class="sidebar-toggle" data-action="toggle-sidebar" title="${sidebarLabel}" aria-label="${sidebarLabel}" aria-expanded="${!collapsed}">${icon(collapsed?"chevron-right":"chevron-left")}</button>
      <nav>${cashShellNav()}</nav>
      <div class="sidebar-footer">
        <div class="register-context"><small>${tr("shell.currentRegister")}</small><strong>${currentBranch().name}</strong><span>${state.register.open?tr("shell.shiftOpen",{shift:state.register.shiftId,cashier:cashier()}):tr("checkout.noShiftOpen")}</span></div>
        <div class="profile-shell">
          <div class="profile-popover ${profileOpen?"open":""}" aria-hidden="${!profileOpen}">
            <div class="profile-popover-head"><span class="profile-avatar">LJ</span><span><strong>Liam Johnson</strong><small>${tr("role.owner")}</small></span></div>
            <div class="profile-status system-health ${healthy?"healthy":"attention"}" title="${healthy?tr("system.readyHelp"):tr("system.attentionHelp")}"><i class="dot ${healthy?"ok":"bad"}"></i><span>${healthy?tr("system.ready"):tr("system.attention")}</span></div>
            <label class="profile-setting"><span>${tr("common.language")}</span><select id="locale" class="select compact" aria-label="${tr("common.language")}"><option value="en" ${state.locale==="en"?"selected":""}>EN</option><option value="ru" ${state.locale==="ru"?"selected":""}>RU</option><option value="uz" ${state.locale==="uz"?"selected":""}>UZ</option></select></label>
            <button class="profile-setting" data-action="theme" title="${tr("common.toggleTheme")}">${icon(state.config.theme==="dark"?"sun":"moon")}<span>${tr("profile.appearance")}</span></button>
            <a class="profile-setting" href="configuration.html">${icon("configuration")}<span>${tr("profile.settings")}</span>${icon("chevron-right")}</a>
          </div>
          <button class="sidebar-profile" data-action="profile-menu" aria-label="${tr("profile.title")}" aria-expanded="${profileOpen}">
            <span class="profile-avatar">LJ</span>
            <span class="sidebar-profile-copy"><strong>Liam Johnson</strong><small>${tr("role.owner")}</small></span>
            ${icon("chevron-up")}
          </button>
        </div>
      </div>
    </aside>
    <section class="workspace"><main>${content}</main></section>
  </div><div id="sidebar-tooltip" class="sidebar-tooltip" role="tooltip" aria-hidden="true"></div><div id="modal-root"></div>`;
}

function checkout() {
  const t=totals();
  const filtered=state.products.filter(p=>`${p.name} ${p.sku} ${p.barcode} ${p.category} ${p.supplier}`.toLowerCase().includes(state.search.toLowerCase())&&(state.category==="All"||state.category==="Favorites"&&p.favorite||p.category===state.category)).slice(0,18);
  const cartUnits=state.cart.reduce((sum,item)=>sum+item.qty,0),mobileView=state.checkoutMobileView==="cart"?"cart":"products";
  const shiftEnabled=isEnabled("cash_shift"),needsShift=shiftEnabled&&!state.register.open;
  const fiscalizationDisabled=!isEnabled("fiscalization")||!state.config.fiscalization;
  const branchOptions=state.branches.map(item=>`<option value="${item.id}" ${item.id===state.branchId?"selected":""}>${item.name}</option>`).join("");
  const categoryLabels={All:tr("common.all"),Favorites:tr("filter.favorites"),Drinks:tr("category.drinks"),Sneakers:tr("category.sneakers"),Beauty:tr("category.beauty"),Services:tr("category.services")};
  const operationalStatus=`<section class="checkout-operational-status ${needsShift?"unavailable":"ready"}" aria-live="polite"><div class="checkout-status-copy"><span class="checkout-readiness"><i></i>${tr(needsShift?"checkout.saleUnavailable":"checkout.registerReady")}</span><span class="checkout-status-separator">·</span><label class="checkout-active-store"><span class="sr-only">${tr("checkout.activeStore")}</span><select id="branch" aria-label="${tr("checkout.activeStore")}">${branchOptions}</select></label><span class="checkout-status-separator">·</span><span class="checkout-shift-state">${tr(needsShift?"checkout.shiftClosedCompact":shiftEnabled?"checkout.shiftOpenCompact":"checkout.shiftNotRequired")}</span></div>${needsShift?`<a href="shift.html">${tr("checkout.openShiftAction")}</a>`:""}</section>`;
  return shell(`<h1 class="sr-only">${tr("checkout")}</h1>
    ${operationalStatus}
    <nav class="checkout-mobile-tabs" aria-label="${tr("checkout.mobileView")}"><button class="${mobileView==="products"?"active":""}" data-cash-action="checkout-view" data-view="products" aria-pressed="${mobileView==="products"}">${icon("catalog")}<span>${tr("checkout.productsTab")}</span></button><button class="${mobileView==="cart"?"active":""}" data-cash-action="checkout-view" data-view="cart" aria-pressed="${mobileView==="cart"}">${icon("checkout")}<span>${tr("checkout.currentSale")}</span><b>${cartUnits}</b></button></nav>
    <div class="checkout" data-mobile-view="${mobileView}"><section class="catalog-well"><header class="checkout-section-head"><div><h2>${tr("checkout.productsTab")}</h2><span>${tr("checkout.results",{count:filtered.length})}</span></div></header><div class="scanner-row smart"><label class="search smart-search">${icon("search")}<input id="product-search" value="${state.search}" placeholder="${tr("checkout.smartSearch")}" autocomplete="off" autofocus><kbd>/</kbd></label></div><div class="chips checkout-categories">${["All","Favorites","Drinks","Sneakers","Beauty","Services"].map(c=>`<button class="chip ${state.category===c?"active":""}" data-category="${c}" aria-pressed="${state.category===c}">${categoryLabels[c]}</button>`).join("")}</div><div class="products">${filtered.length?filtered.map(p=>{const cartQty=state.cart.find(item=>item.id===p.id)?.qty||0,stock=availableStock(p),stockState=p.unit==="service"?"service":stock<=0?"out":stock<6?"low":"available";return `<button class="product ${cartQty?"in-cart":""}" data-add="${p.id}" ${stock<=0?"disabled":""} aria-label="${p.name}, ${money(p.price)}${cartQty?`, ${tr("checkout.inCart",{count:cartQty})}`:""}">${productVisual(p)}${cartQty?`<span class="product-cart-count">${cartQty}</span>`:""}<strong>${p.name}</strong><b>${money(p.price)}</b><small class="stock-label ${stockState}">${p.unit==="service"?tr("common.service"):stock<=0?tr("status.outOfStock"):tr("checkout.stockAvailable",{count:stock})}${heldQty(p.id)?` · ${tr("checkout.heldCount",{count:heldQty(p.id)})}`:""}</small></button>`}).join(""):`<div class="empty checkout-no-results">${icon("search")}<strong>${tr("checkout.noProductsFound")}</strong><span>${tr("checkout.noProductsFoundHelp")}</span></div>`}</div></section>
    <aside class="payment-panel"><header class="cart-header"><div><h2>${tr("checkout.currentSale")}</h2><span>${tr("checkout.cartSummary",{count:cartUnits})}</span></div><strong>${money(t.total)}</strong></header><section class="checkout-fields">${select("customer",tr("common.customer"),state.clients.map(c=>[c.id,`${c.name} · ${tr("debt")} ${money(c.debt)} · ${tr("prepayment")} ${money(customerBalance(c.id))}`]),state.customerId)}${field("discount",tr("checkout.discountPercent"),state.receiptDiscount,"text")}</section><section class="basket">${state.cart.length?state.cart.map(i=>`<div class="basket-item"><div class="basket-copy"><strong>${i.name}</strong><small>${tr("checkout.unitPrice",{price:money(i.price)})}</small></div><strong class="line-total">${money(i.price*i.qty)}</strong><div class="quantity-control"><button data-cash-action="cart-minus" data-id="${i.id}" aria-label="${tr("checkout.decreaseQuantity")}">−</button><b>${i.qty}</b><button data-cash-action="cart-plus" data-id="${i.id}" aria-label="${tr("checkout.increaseQuantity")}">+</button><button class="remove" data-cash-action="cart-remove" data-id="${i.id}" aria-label="${tr("checkout.removeItem")}">${icon("x")}</button></div></div>`).join(""):`<div class="empty checkout-empty-cart">${icon("checkout")}<strong>${tr("checkout.emptyBasket")}</strong><span>${tr("checkout.emptyBasketHelp")}</span></div>`}</section><footer class="pay-footer"><dl><div><dt>${tr("checkout.subtotal")}</dt><dd>${money(t.subtotal)}</dd></div><div><dt>${tr("common.discount")}</dt><dd>${money(t.discount)}</dd></div><div><dt>${tr("common.tax")}</dt><dd>${money(t.tax)}</dd></div><div class="total"><dt>${tr("common.total")}</dt><dd>${money(t.total)}</dd></div></dl><div class="payments">${["Cash","Card","QR","Transfer","Debt","Prepayment"].map(p=>`<button class="${state.payment===p?"active":""}" data-payment="${p}" aria-pressed="${state.payment===p}">${tr(`payment.${p.toLowerCase()}`)}</button>`).join("")}</div><div class="basket-secondary"><button class="button secondary" data-cash-action="save-draft" ${state.cart.length?"":"disabled"}>${icon("drafts")}${tr("checkout.saveDraft")}</button><button class="button secondary" data-cash-action="hold-cart" ${state.cart.length?"":"disabled"}>${icon("holds")}${tr("checkout.placeOnHold")}</button></div><div class="checkout-pay-row ${fiscalizationDisabled?"has-warning":""}">${fiscalizationDisabled?`<p class="nonfiscal-payment-warning">${icon("alert")}<span>${tr("checkout.nonFiscalPaymentWarning")}</span></p>`:""}<button class="button primary pay" data-cash-action="pay" ${needsShift||!state.cart.length?"disabled":""}>${tr("pay")} ${money(t.total)}</button></div></footer></aside></div>`);
}

function drafts() {
  const rows=state.drafts.filter(d=>d.branchId===state.branchId&&d.status==="Черновик").sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
  const total=rows.reduce((sum,d)=>sum+d.lines.reduce((n,l)=>n+l.price*l.qty,0),0);
  return shell(`${header(tr("drafts"),"Crash-safe baskets saved locally on this register.",'<a class="button primary" href="checkout.html">'+icon("plus")+'New sale</a>')}
    <section class="kpis cash-kpis"><article class="card"><span>Open drafts</span><strong>${rows.length}</strong><small>This branch and register</small></article><article class="card"><span>Items waiting</span><strong>${rows.reduce((s,d)=>s+d.lines.reduce((n,l)=>n+l.qty,0),0)}</strong><small>Stock is not reserved</small></article><article class="card"><span>Draft value</span><strong>${money(total)}</strong><small>Informational only</small></article><article class="card"><span>Recovery</span><strong>Local-first</strong><small>Survives restart</small></article></section>
    <div class="table-wrap cash-table"><table><thead><tr><th>Draft</th><th>Customer</th><th>Items</th><th>Value</th><th>Last saved</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows.map(d=>{const c=customerById(d.customerId),value=d.lines.reduce((s,l)=>s+l.price*l.qty,0);return `<tr><td><strong>${d.id}</strong><small>${formatDate(d.createdAt)}</small></td><td>${c?.name||"Walk-in"}</td><td>${d.lines.reduce((s,l)=>s+l.qty,0)}</td><td>${money(value)}</td><td>${formatDate(d.updatedAt)}</td><td>${badge(cashStatus(d.status))}</td><td><button class="button secondary" data-cash-action="open-draft" data-id="${d.id}">Continue</button><button class="row-icon" data-cash-action="delete-draft" data-id="${d.id}">${icon("x")}</button></td></tr>`}).join("")||`<tr><td colspan="7"><div class="empty">${icon("drafts")}<strong>No open drafts</strong><span>Unfinished baskets will appear here automatically.</span></div></td></tr>`}</tbody></table></div>`);
}

function returns() {
  const sales=state.sales.filter(s=>(s.branchId||"b1")===state.branchId);
  const sale=sales.find(s=>s.id===state.cashUi.returnSaleId)||sales[0];
  if (sale) state.cashUi.returnSaleId=sale.id;
  const returned=sale?sale.items.map(i=>({...i,qty:number(state.cashUi.returnQty[i.id])})).filter(i=>i.qty>0):[];
  const replacements=(state.cashUi.exchangeIds||[]).map(id=>state.products.find(p=>p.id===id)).filter(Boolean).map(p=>({id:p.id,name:p.name,price:p.price,qty:1}));
  const returnTotal=returned.reduce((s,l)=>s+l.price*l.qty,0),replacementTotal=replacements.reduce((s,l)=>s+l.price*l.qty,0),settlement=replacementTotal-returnTotal;
  return shell(`${header(tr("returns"),"Receipt-linked returns and exchanges with explicit settlement direction.",isEnabled("fiscalization")?badge("Fiscal return enabled"):badge("Non-fiscal document"))}
    <div class="cash-layout"><section class="cash-stack">
      <article class="card"><header><div><h2>1. Original sale</h2><small>Returns without the original sale are not available in MVP.</small></div></header><label>Receipt<select class="select" id="cash-return-sale">${sales.map(s=>`<option value="${s.id}" ${s.id===sale?.id?"selected":""}>${s.receipt} · ${money(s.total)} · ${formatDate(s.date,false)}</option>`).join("")}</select></label>${sale?`<div class="cash-summary"><div><span>Customer</span><strong>${sale.customer}</strong></div><div><span>Payment</span><strong>${sale.payment}</strong></div><div><span>Sale total</span><strong>${money(sale.total)}</strong></div></div>`:""}</article>
      <article class="card"><header><div><h2>2. Items coming back</h2><small>Quantity cannot exceed the original sold quantity.</small></div><strong>${money(returnTotal)}</strong></header><div class="cash-lines">${sale?.items.map(i=>{const already=state.returns.filter(r=>r.originalSaleId===sale.id).flatMap(r=>r.linesIn).filter(l=>l.id===i.id).reduce((s,l)=>s+l.qty,0),max=Math.max(0,i.qty-already);return `<div class="cash-line"><div><strong>${i.name}</strong><small>${money(i.price)} · ${max} returnable</small></div><strong>${money(i.price*(number(state.cashUi.returnQty[i.id])||0))}</strong><input class="input compact-number" type="number" min="0" max="${max}" value="${number(state.cashUi.returnQty[i.id])}" data-return-qty="${i.id}"></div>`}).join("")||""}</div></article>
      <article class="card"><header><div><h2>3. Replacement items</h2><small>Leave empty for a straight refund.</small></div><strong>${money(replacementTotal)}</strong></header><div class="cash-add-row"><select class="select" id="cash-exchange-product">${state.products.filter(p=>availableStock(p)>0).map(p=>`<option value="${p.id}">${p.name} · ${money(p.price)}</option>`).join("")}</select><button class="button secondary" data-cash-action="add-exchange">${icon("plus")}Add</button></div><div class="cash-lines">${replacements.map(p=>`<div class="cash-line"><div><strong>${p.name}</strong><small>${money(p.price)}</small></div><strong>${money(p.price)}</strong><button class="row-icon" data-cash-action="remove-exchange" data-id="${p.id}">${icon("x")}</button></div>`).join("")}</div></article>
    </section><aside class="cash-stack"><article class="card sticky-card"><header><div><h2>Settlement</h2><small>New items minus returned items.</small></div></header><div class="settlement-box ${settlement<0?"danger":settlement>0?"info":""}"><span>Who pays whom</span><strong>${explicitMoney(settlement)}</strong></div>${settlement<0?`<label>Payout method<select id="cash-settlement-method" class="select"><option value="Cash" ${state.cashUi.settlementMethod==="Cash"?"selected":""}>Pay cash</option><option value="Deposit" ${state.cashUi.settlementMethod==="Deposit"?"selected":""}>Credit customer deposit</option></select></label>`:""}<div class="cash-notice info">${icon("check")}<div><strong>Shared ledgers</strong><span>Processing writes stock movements and an attributed money transaction.</span></div></div><button class="button primary full-width" data-cash-action="process-return" ${!returned.length?"disabled":""}>Process ${replacements.length?"exchange":"return"}</button></article>
      <article class="card"><header><div><h2>Recent returns</h2><small>Completed records are immutable.</small></div></header>${state.returns.slice(0,4).map(r=>`<div class="cash-history-row"><div><strong>${r.id} · ${cashStatus(r.type)}</strong><small>${formatDate(r.createdAt)} · ${r.actor}</small></div><b>${explicitMoney(r.settlement)}</b></div>`).join("")}</article></aside></div>`);
}

function holds() {
  const rows=state.holds.filter(h=>h.branchId===state.branchId).sort((a,b)=>a.status==="Активна"&&b.status!=="Активна"?-1:a.status!==b.status?1:new Date(a.createdAt)-new Date(b.createdAt));
  const active=rows.filter(h=>h.status==="Активна"),units=active.reduce((s,h)=>s+h.lines.reduce((n,l)=>n+l.qty,0),0),liability=active.reduce((s,h)=>s+h.depositRemaining,0);
  return shell(`${header(tr("holds"),"Indefinite customer holds with physical and available stock kept distinct.",'<button class="button primary" data-cash-action="new-hold">'+icon("plus")+'Create hold</button>')}
    <section class="kpis cash-kpis"><article class="card"><span>Active holds</span><strong>${active.length}</strong><small>No automatic expiry</small></article><article class="card"><span>Units set aside</span><strong>${units}</strong><small>Still physically on hand</small></article><article class="card"><span>Deposit liability</span><strong>${money(liability)}</strong><small>Money owed to customers</small></article><article class="card"><span>Oldest hold</span><strong>${active.length?Math.floor((Date.now()-Math.min(...active.map(h=>new Date(h.createdAt))))/86400000)+" days":"None"}</strong><small>Manual review</small></article></section>
    <div class="cash-notice info">${icon("check")}<div><strong>Stock rule</strong><span>Available to sell = physical on hand − active held quantity. Stocktake expected quantity still includes held goods.</span></div></div>
    <div class="table-wrap cash-table"><table><thead><tr><th>Customer / hold</th><th>Items</th><th>Age</th><th>Deposit</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows.map(h=>{const c=customerById(h.customerId);return `<tr><td><strong>${c?.name||"Unknown"}</strong><small>${h.id}</small></td><td>${h.lines.reduce((s,l)=>s+l.qty,0)} · ${h.lines.map(l=>l.name).join(", ")}</td><td>${Math.max(0,Math.floor((Date.now()-new Date(h.createdAt))/86400000))} days</td><td>${money(h.depositRemaining)}</td><td>${badge(cashStatus(h.status))}</td><td>${h.status==="Активна"?`<button class="button secondary" data-cash-action="redeem-hold" data-id="${h.id}">Redeem</button><button class="row-icon" data-cash-action="cancel-hold" data-id="${h.id}">${icon("x")}</button>`:badge("Read-only")}</td></tr>`}).join("")}</tbody></table></div>
    <section class="card hold-stock-card"><header><div><h2>Branch stock impact</h2><small>Physical stock includes held units.</small></div></header><div class="cash-stock-grid">${state.products.filter(p=>p.unit!=="service"&&stockOf(p)>0).slice(0,8).map(p=>`<article><span class="product-thumb">${p.name[0]}</span><div><strong>${p.name}</strong><small>Physical ${stockOf(p)} · Held ${heldQty(p.id)}</small></div><b>${availableStock(p)} available</b></article>`).join("")}</div></section>`);
}

function shift() {
  if (!isEnabled("cash_shift")) return shell(cashLocked("Cash Shift","cash_shift"));
  if (!state.register.open) return shell(`${header(tr("shift"),"Open a responsible cash-handling session with a known starting float.")}
    <div class="cash-layout"><section class="card cash-empty-hero"><div>${icon("shift")}<h2>No shift is open</h2><p>Full-mode sales and cash operations require an attributed shift.</p><form id="cash-open-shift" class="form-grid">${select("cashier","Cashier",state.employees.filter(e=>e.status==="Active").map(e=>[e.id,e.name]),"e1")}${field("amount","Opening cash",1000000,"text",true)}<button class="button primary">Open shift</button></form></div></section><aside class="card"><header><div><h2>Opening records</h2><small>Captured automatically.</small></div></header><div class="receipt-grid"><span>Register</span><strong>Front Register 01</strong><span>Branch</span><strong>${currentBranch().name}</strong><span>Canonical status</span><strong>Открыта</strong><span>Offline behavior</span><strong>Save locally, sync later</strong></div></aside></div>`);
  const expected=expectedCash();
  return shell(`${header(tr("shift"),"Live responsibility, drawer expectation and immutable close reconciliation.",'<button class="button primary" data-cash-action="close-shift">Count & close shift</button>')}
    <section class="card shift-hero"><div><span class="shift-icon">${icon("shift")}</span><div><h2>Shift ${state.register.shiftId} is open</h2><small>${cashier()} · ${formatDate(state.register.openedIso||Date.now())}</small></div></div>${badge(cashStatus("Открыта"))}</section>
    <section class="kpis cash-kpis"><article class="card"><span>Opening float</span><strong>${money(state.register.openingAmount)}</strong><small>Known starting cash</small></article><article class="card"><span>Cash received</span><strong>${money(state.moneyMovements.filter(m=>m.shiftId===state.register.shiftId&&m.method==="Cash"&&m.direction==="in").reduce((s,m)=>s+m.amount,0))}</strong><small>All money-in records</small></article><article class="card"><span>Cash paid out</span><strong>${money(state.moneyMovements.filter(m=>m.shiftId===state.register.shiftId&&m.method==="Cash"&&m.direction==="out").reduce((s,m)=>s+m.amount,0))}</strong><small>Refunds and operations</small></article><article class="card"><span>Expected drawer</span><strong>${money(expected)}</strong><small>Updates immediately</small></article></section>
    <div class="cash-layout"><section class="card"><header><div><h2>Expected cash calculation</h2><small>Every balance change has a matching movement.</small></div></header><div class="reconcile"><div><span>Opening float</span><strong>${money(state.register.openingAmount)}</strong></div><div><span>Cash in</span><strong class="money-positive">${money(state.moneyMovements.filter(m=>m.shiftId===state.register.shiftId&&m.method==="Cash"&&m.direction==="in").reduce((s,m)=>s+m.amount,0))}</strong></div><div><span>Cash out</span><strong class="money-danger">${money(state.moneyMovements.filter(m=>m.shiftId===state.register.shiftId&&m.method==="Cash"&&m.direction==="out").reduce((s,m)=>s+m.amount,0))}</strong></div><div class="total"><span>Expected in drawer</span><strong>${money(expected)}</strong></div></div></section><aside class="card"><header><div><h2>Shift controls</h2><small>All actions stay attached to this shift.</small></div></header><div class="cash-stack"><a class="button secondary full-width" href="cash-operations.html">Record cash operation</a><a class="button secondary full-width" href="checkout.html">Return to checkout</a><div class="cash-notice info">${icon("check")}<div><strong>Offline-ready</strong><span>Shift actions complete locally and sync later.</span></div></div></div></aside></div>`);
}

function cashOperations() {
  if (!isEnabled("cash_operations")) return shell(cashLocked("Cash Operations","cash_operations"));
  if (!state.register.open) return shell(`${header(tr("cash-operations"),"Record non-sale money entering or leaving the drawer.")}<section class="card cash-empty-hero"><div>${icon("cash-operations")}<h2>An open shift is required</h2><p>Income, expense and collection must belong to a responsible shift.</p><a class="button primary" href="shift.html">Open shift</a></div></section>`);
  const rows=state.cashOperations.filter(o=>o.shiftId===state.register.shiftId);
  return shell(`${header(tr("cash-operations"),`Shift ${state.register.shiftId} · amount, type and reason only.`,badge("Открыта · Open"))}
    <div class="cash-layout"><section class="card"><header><div><h2>New cash operation</h2><small>Direction is stated in words, never only by sign.</small></div></header><form id="cash-operation-form" class="cash-stack"><div class="operation-types">${[["Внесение","Money enters drawer"],["Выплата","Money leaves drawer"],["Инкассация","Cash pickup leaves drawer"]].map(([type,copy])=>`<button type="button" class="${state.cashUi.operationType===type?"active":""}" data-cash-action="operation-type" data-type="${type}"><strong>${cashStatus(type)}</strong><small>${copy}</small></button>`).join("")}</div><input type="hidden" name="type" value="${state.cashUi.operationType}"><div class="form-grid">${field("amount","Amount",0,"text",true)}${field("reason","Reason","")}</div><div class="cash-notice ${state.cashUi.operationType==="Внесение"?"info":"warning"}">${icon("alert")}<div><strong>${state.cashUi.operationType==="Внесение"?"Money enters the drawer":"Money leaves the drawer"}</strong><span>This ${state.cashUi.operationType==="Внесение"?"increases":"decreases"} expected cash immediately.</span></div></div><button class="button primary">Record operation</button></form></section>
    <aside class="card"><header><div><h2>Shift activity</h2><small>Most recent first.</small></div><strong>${money(expectedCash())}</strong></header>${rows.map(o=>`<div class="cash-history-row"><div><strong>${cashStatus(o.type)}</strong><small>${o.reason} · ${formatDate(o.createdAt)}</small></div><b class="${o.type==="Внесение"?"money-positive":"money-danger"}">${o.type==="Внесение"?"Drawer receives":"Drawer pays out"} ${money(o.amount)}</b></div>`).join("")||`<div class="empty">${icon("cash-operations")}<strong>No cash operations</strong><span>Non-sale drawer movements will appear here.</span></div>`}</aside></div>`);
}

function registerHistory() {
  if (!isEnabled("register_history")) return shell(cashLocked("Register History","register_history"));
  const rows=state.registerHistory.filter(s=>s.branchId===state.branchId),selected=rows.find(s=>s.id===state.cashUi.selectedShiftId)||rows[0];
  if (selected) state.cashUi.selectedShiftId=selected.id;
  const ops=selected?state.cashOperations.filter(o=>o.shiftId===selected.id):[];
  return shell(`${header(tr("register-history"),"Read-only shifts, cash movements, returns, counts and variance.",badge(`${rows.length} shifts`))}
    <div class="history-layout"><section class="table-wrap"><table><thead><tr><th>Shift</th><th>Opened</th><th>Closed</th><th>Operator</th><th>Status</th><th>Variance</th><th></th></tr></thead><tbody>${rows.map(s=>`<tr><td><strong>${s.id}</strong><small>Front Register 01</small></td><td>${formatDate(s.openedAt)}</td><td>${s.closedAt?formatDate(s.closedAt):"—"}</td><td>${s.openedBy}</td><td>${badge(cashStatus(s.status))}</td><td>${s.closeCount?varianceLabel(s.closeCount.variance):"Not counted"}</td><td><button class="row-icon" data-cash-action="select-shift" data-id="${s.id}">${icon("more")}</button></td></tr>`).join("")||`<tr><td colspan="7"><div class="empty">${icon("register-history")}<strong>No shift history</strong></div></td></tr>`}</tbody></table></section>
    ${selected?`<aside class="card sticky-card"><header><div><h2>Shift ${selected.id}</h2><small>${cashStatus(selected.status)} · immutable</small></div>${badge("Read-only")}</header><div class="receipt-grid"><span>Opening float</span><strong>${money(selected.openingFloat)}</strong><span>Cash operations</span><strong>${ops.length}</strong><span>Expected at close</span><strong>${money(selected.closeCount?.expectedTotal||0)}</strong><span>Counted total</span><strong>${money(selected.closeCount?.countedTotal||0)}</strong><span>Variance</span><strong>${varianceLabel(selected.closeCount?.variance||0)}</strong></div><h2 class="section-title">Currency count</h2>${selected.closeCount?.lines.map(l=>`<div class="cash-history-row"><div><strong>${l.currency}</strong><small>${l.currency!=="UZS"?`Stored rate ${l.rate}`:"Operating currency"}</small></div><b>${l.currency==="UZS"?money(l.amount):`${l.amount} ${l.currency} · ${money(l.converted)}`}</b></div>`).join("")||""}</aside>`:""}</div>`);
}

function cashLocked(title,key) {
  return `${header(title,tr("entitlement.lockedDescription"))}<section class="card cash-empty-hero"><div>${icon("configuration")}<h2>${localizeText(title)} ${tr("entitlement.notEnabled")}</h2><p>${tr("entitlement.helpPrefix")} <strong>${localizeText(key.replaceAll("_"," "))}</strong> ${tr("entitlement.helpSuffix")}</p><a class="button secondary" href="checkout.html">${tr("entitlement.returnCheckout")}</a></div></section>`;
}

const views = { dashboard, checkout, drafts, returns, holds, sales, catalog, import:imports, suppliers, inventory, transfer, clients, shift, "cash-operations":cashOperations, "register-history":registerHistory, reports, configuration };
function enhanceTables(){
  $$(".table-wrap").forEach((wrap,index)=>{
    if(wrap.dataset.enhanced||wrap.closest(".modal"))return;
    const table=wrap.querySelector("table"),body=table?.querySelector("tbody");
    if(!table||!body)return;
    const rows=[...body.querySelectorAll("tr")];
    if(rows.length<4&&!wrap.classList.contains("data-table"))return;
    wrap.dataset.enhanced="true";
    const toolbar=document.createElement("div");
    toolbar.className="table-toolbar";
    toolbar.innerHTML=`<label>${icon("search")}<input class="input" type="search" placeholder="${tr("table.search")}" aria-label="${tr("table.search")}"></label><span>${tr("table.results",{count:rows.length})}</span>`;
    wrap.parentElement.insertBefore(toolbar,wrap);
    const input=toolbar.querySelector("input"),count=toolbar.querySelector("span");
    input.addEventListener("input",()=>{
      const query=input.value.trim().toLocaleLowerCase(localeCode());
      let visible=0;
      rows.forEach(row=>{
        const show=!query||row.textContent.toLocaleLowerCase(localeCode()).includes(query);
        row.hidden=!show;
        if(show)visible++;
      });
      count.textContent=tr("table.results",{count:visible});
    });
  });
}
function enhanceSalesChart(){
  const root=$("[data-sales-chart]");
  if(!root)return;
  const svg=$("svg",root),guide=$(".sales-chart-guide",root),active=$(".sales-chart-point",root),tooltip=$(".sales-chart-tooltip",root),label=$("span",tooltip),value=$("strong",tooltip);
  const points=$$(".sales-chart-anchor",root).map(anchor=>({x:number(anchor.getAttribute("cx")),y:number(anchor.getAttribute("cy")),label:decodeURIComponent(anchor.dataset.label),value:number(anchor.dataset.value)}));
  let currentX=points[0].x,currentY=points[0].y,targetX=currentX,targetY=currentY,frame=0;
  const paint=()=>{guide.setAttribute("x1",currentX);guide.setAttribute("x2",currentX);active.setAttribute("cx",currentX);active.setAttribute("cy",currentY);};
  const animate=()=>{
    currentX+=(targetX-currentX)*.28;currentY+=(targetY-currentY)*.28;paint();
    if(Math.abs(targetX-currentX)>.25||Math.abs(targetY-currentY)>.25)frame=requestAnimationFrame(animate);
    else{currentX=targetX;currentY=targetY;paint();frame=0;}
  };
  const hide=()=>root.classList.remove("is-active");
  const show=event=>{
    const bounds=svg.getBoundingClientRect(),chartX=(event.clientX-bounds.left)*(900/bounds.width);
    const point=points.reduce((nearest,current)=>Math.abs(current.x-chartX)<Math.abs(nearest.x-chartX)?current:nearest,points[0]);
    const pixelX=point.x/900*bounds.width,pixelY=point.y/310*bounds.height;
    targetX=point.x;targetY=point.y;
    if(!root.classList.contains("is-active")){currentX=targetX;currentY=targetY;paint();}
    else if(!frame)frame=requestAnimationFrame(animate);
    label.textContent=point.label;value.textContent=money(point.value);
    tooltip.style.left=`${Math.max(96,Math.min(bounds.width-96,pixelX))}px`;
    tooltip.style.top=`${Math.max(70,pixelY)}px`;
    root.classList.add("is-active");
  };
  root.addEventListener("pointerenter",show);
  root.addEventListener("pointermove",show);
  root.addEventListener("pointerleave",hide);
}
function enhanceReports(){
  if(page!=="reports")return;
  const module=$(".reports-module"),header=$(".reports-module>.page-header");
  if(!module||!header)return;
  const period=state.dashboardPeriod||"today",range=dashboardRange(period),selectedStores=dashboardSelectedStoreIds();
  const toolbar=document.createElement("section");
  toolbar.className="report-toolbar";
  toolbar.setAttribute("aria-label",tr("dashboard.analyticsFilters"));
  toolbar.innerHTML=`<div class="dashboard-period-picker report-period-picker" role="group" aria-label="${tr("dashboard.periodLabel")}">${[["yesterday","dashboard.periodYesterday"],["today","dashboard.periodToday"],["week","dashboard.periodWeek"],["month","dashboard.periodMonth"],["year","dashboard.periodYear"]].map(([value,key])=>`<button class="${period===value?"active":""}" data-dashboard-period="${value}" aria-pressed="${period===value}">${tr(key)}</button>`).join("")}</div><span class="report-context">${icon("calendar")}<span><small>${tr("reports.selectedPeriod")}</small><strong>${dashboardDateLabel(range)}</strong></span></span><span class="report-context">${icon("inventory")}<span><small>${tr("dashboard.storeFilter")}</small><strong>${dashboardStoreLabel(selectedStores)}</strong></span></span>`;
  header.after(toolbar);
  const exportButton=$(".page-header .button",module);
  if(exportButton){exportButton.classList.remove("primary");exportButton.classList.add("secondary");exportButton.dataset.action="export-report";exportButton.innerHTML=`${icon("export")}${tr("reports.export")}`;}
  const source=state.sales.slice(0,30).filter(sale=>selectedStores.includes(sale.branchId||"b1")),baseRevenue=source.reduce((sum,sale)=>sum+sale.total,0),options=dashboardGroupingOptions(period,range),group=options.includes(state.dashboardGroup)?state.dashboardGroup:options[0],series=dashboardSalesSeries(period,baseRevenue,group,range),paths=reportChartPaths(series.values);
  [["revenue",paths.revenue],["cost",paths.cost],["profit",paths.profit]].forEach(([name,path])=>$( `.report-line.${name}`,module)?.setAttribute("d",path));
}
function render(){
  document.documentElement.lang=state.locale;
  document.title=`${tr(page)} - Retail OS`;
  $("#app").innerHTML=localizeHtml((views[page] || dashboard)());
  enhanceTables();
  enhanceSalesChart();
  enhanceReports();
}
function modal(title,body,footer=""){ $("#modal-root").innerHTML=localizeHtml(`<div class="backdrop"><section class="modal"><header><h2>${title}</h2><button class="icon-button" data-close title="Close">${icon("x")}</button></header><div class="modal-body">${body}</div>${footer?`<footer>${footer}</footer>`:""}</section></div>`); setTimeout(()=>$(".modal input:not([type=hidden]),.modal select")?.focus(),0); }
const closeModal=()=>$("#modal-root").innerHTML="";
const toast=(msg,type="positive")=>{const el=document.createElement("div");el.className=`toast ${type}`;el.innerHTML=`${icon(type==="danger"?"alert":"check")}<span>${localizeText(msg)}</span>`;document.body.append(el);setTimeout(()=>el.classList.add("show"),10);setTimeout(()=>el.remove(),2800);};
function addProduct(pid){const p=state.products.find(x=>x.id===pid),found=state.cart.find(x=>x.id===pid);if(!p)return;const next=(found?.qty||0)+1;if(p.unit!=="service"&&next>availableStock(p))return toast(`${heldQty(p.id)} held · only ${availableStock(p)} available`,"danger");if(found)found.qty++;else state.cart.push({id:p.id,name:p.name,price:p.price,qty:1,discount:0});saveCurrentDraft();save();render();setTimeout(()=>$("#product-search")?.focus(),0);}
function productForm(p={}){modal(p.id?"Edit product":"Создать товар",`<form id="product-form" class="form-grid"><input type="hidden" name="id" value="${p.id||""}">${field("name","Name",p.name||"")}${field("sku","SKU",p.sku||`ROS-${Date.now().toString().slice(-4)}`)}${field("barcode","Barcode",p.barcode||"")}${select("category","Category",["Drinks","Sneakers","Beauty","Groceries","Services"],p.category)}${select("supplier","Supplier",state.suppliers.map(s=>s.name),p.supplier)}${field("price","Sale price",p.price||"","text",true)}${field("cost","Supply price",p.cost||"","text",true)}${field("stock","Stock in active branch",p.id?stockOf(p):0,"text")}${field("fiscalCode","Tasnif code",p.fiscalCode||"")}<button class="button primary">Save</button></form>`);}
function openRegister(){modal(tr("openRegister"),`<form id="open-form" class="form-grid">${select("cashier","Cashier",state.employees.filter(e=>e.status==="Active").map(e=>[e.id,e.name]),"e1")}${field("amount","Opening cash",state.register.expectedCash||500000,"text",true)}<button class="button primary">Open Register</button></form>`);}
function closeRegister(){modal(tr("closeRegister"),`<form id="close-form" class="form-grid"><label>Expected cash<span class="money-display">${money(state.register.expectedCash)}</span></label>${field("actual","Actual cash",state.register.expectedCash,"text",true)}<label>Variance<span id="variance" class="money-display">${money(0)}</span></label><button class="button destructive" type="submit">Confirm Close</button></form>`);}
function pay(){const t=totals();if(!state.register.open||t.total<=0)return;const client=state.clients.find(c=>c.id===state.customerId);if(state.payment==="Prepayment"&&client.prepayment<t.total)return toast("Not enough prepayment balance","danger");const sale={id:uid("sale"),receipt:`R-${10500+state.sales.length}`,date:new Date().toISOString(),cashier:cashier(),customer:client.name,items:state.cart.map(x=>({...x})),subtotal:t.subtotal,discount:t.discount,tax:t.tax,total:t.total,payment:state.payment,fiscalized:state.config.fiscalization&&state.config.online,fiscalId:state.config.fiscalization&&state.config.online?`FISC-${Date.now().toString().slice(-6)}`:"",profit:state.cart.reduce((s,i)=>s+(i.price-(state.products.find(p=>p.id===i.id)?.cost||0))*i.qty,0),status:"Completed"};state.cart.forEach(i=>{const p=state.products.find(x=>x.id===i.id);if(p&&p.unit!=="service"){p.stockByBranch[state.branchId]=Math.max(0,stockOf(p)-i.qty);state.stockMoves.unshift({product:p.name,branchId:state.branchId,type:"Продажа",qty:-i.qty,date:today(),user:cashier()});}});if(state.payment==="Debt")client.debt+=t.total;if(state.payment==="Prepayment")client.prepayment-=t.total;if(state.payment==="Cash")state.register.expectedCash+=t.total;if(state.config.fiscalization&&!state.config.online)state.config.fiscalPending++;client.total+=t.total;client.history.unshift(sale.receipt);state.sales.unshift(sale);state.cart=[];save();render();modal("Payment Successful!",`<div class="receipt-success">${icon("check")}</div><h2>${sale.receipt}</h2><div class="receipt-grid"><span>Total Paid</span><strong>${money(sale.total)}</strong><span>Payment Method</span><strong>${sale.payment}</strong><span>Customer</span><strong>${sale.customer}</strong><span>Cashier</span><strong>${sale.cashier}</strong><span>Date</span><strong>${today()}</strong></div>`,`<button class="button primary">Print Receipt</button><button class="button secondary">Send Receipt</button>`);}
function mockImport(){state.importRows=[{name:"Orange Juice 1L",sku:"IMP-01",barcode:"478009001",price:45000,cost:28000,stock:20,category:"Drinks",errors:[]},{name:"",sku:"IMP-02",barcode:"478009002",price:30000,cost:18000,stock:10,category:"Groceries",errors:["Missing name"]},{name:"Duplicate Espresso",sku:"ROS-0001",barcode:"",price:-1,cost:15500,stock:4,category:"Drinks",errors:["Duplicate SKU","Missing barcode","Invalid price"]}];validateImport();}
function validateImport(){state.importRows.forEach(r=>{r.errors=[];if(!r.name)r.errors.push("Missing name");if(!r.barcode)r.errors.push("Missing barcode");if(state.products.some(p=>p.sku===r.sku))r.errors.push("Duplicate SKU");if(number(r.price)<=0)r.errors.push("Invalid price");if(number(r.cost)<0)r.errors.push("Invalid cost");});save();render();}
function saleModal(id){const s=state.sales.find(x=>x.id===id);modal(`Receipt ${s.receipt}`,`<div class="receipt-grid"><span>Date</span><strong>${formatDate(s.date)}</strong><span>Cashier</span><strong>${s.cashier}</strong><span>Customer</span><strong>${s.customer}</strong><span>Total</span><strong>${money(s.total)}</strong><span>Payment</span><strong>${s.payment}</strong><span>Fiscal</span><strong>${s.fiscalized?s.fiscalId:"Non-fiscal"}</strong></div>`);}
function supplierModal(id){const s=state.suppliers.find(x=>x.id===id);modal(s.name,`<div class="receipt-grid"><span>Contact</span><strong>${s.contact}</strong><span>Phone</span><strong>${s.phone}</strong><span>Settlement</span><strong class="${s.balance?"money-danger":""}">${money(s.balance)}</strong><span>Products</span><strong>${state.products.filter(p=>p.supplier===s.name).length}</strong></div>`);}
function tasnifModal(){const data=[{name:"Mineral Water 1L",category:"Drinks",unit:"pcs",fiscalCode:"TASNIF-101"},{name:"Children's Sneakers",category:"Sneakers",unit:"pcs",fiscalCode:"TASNIF-255"},{name:"Facial Massage",category:"Services",unit:"service",fiscalCode:"TASNIF-804"}];modal("Quick Add from Tasnif",`<div class="tasnif-list">${data.map((x,i)=>`<button class="tasnif-item" data-tasnif="${i}"><span><strong>${x.name}</strong><small>${x.category} · ${x.fiscalCode}</small></span><b>Select</b></button>`).join("")}</div>`);window.__tasnif=data;}

function setRegisterMode(mode) {
  if (mode==="basic"&&state.register.open) return toast("Close the open shift before switching to Basic","danger");
  const bundle=state.entitlementBundles[mode];
  state.registerMode=mode;
  state.orgEntitlements={...bundle};
  state.registerEntitlements={...bundle};
  save();
  render();
  toast(`${mode==="full"?"Full":"Basic"} register enabled`);
}

function cashPay() {
  const t=totals(),shiftRequired=isEnabled("cash_shift")&&!state.register.open;
  if (!state.cart.length) return;
  if (shiftRequired) return toast("Open a shift before completing payment","danger");
  const client=customerById(state.customerId);
  if (state.payment==="Prepayment"&&customerBalance(client.id)<t.total) return toast("Not enough customer deposit","danger");
  for (const line of state.cart) {
    const p=state.products.find(x=>x.id===line.id);
    if (p?.unit!=="service"&&line.qty>availableStock(p)) return toast(`${p.name}: only ${availableStock(p)} available`,"danger");
  }
  const fiscal=isEnabled("fiscalization")&&state.config.fiscalization;
  const sale={id:uid("sale"),receipt:`R-${10500+state.sales.length}`,date:new Date().toISOString(),branchId:state.branchId,registerId:"REG-01",shiftId:state.register.shiftId||"",cashier:state.register.open?cashier():"Liam Johnson",customer:client?.name||"Walk-in",customerId:client?.id||"",items:state.cart.map(x=>({...x})),subtotal:t.subtotal,discount:t.discount,tax:t.tax,total:t.total,payment:state.payment,fiscalized:fiscal&&state.config.online,fiscalId:fiscal&&state.config.online?`FISC-${Date.now().toString().slice(-6)}`:"",profit:state.cart.reduce((s,i)=>s+(i.price-(state.products.find(p=>p.id===i.id)?.cost||0))*i.qty,0),status:"Completed"};
  state.cart.forEach(i=>{
    const p=state.products.find(x=>x.id===i.id);
    if (p&&p.unit!=="service") {
      p.stockByBranch[state.branchId]=stockOf(p)-i.qty;
      state.stockMoves.unshift({product:p.name,branchId:state.branchId,type:"Продажа",qty:-i.qty,date:today(),user:sale.cashier,reason:"sale",registerId:"REG-01"});
    }
  });
  if (state.payment==="Debt") client.debt+=t.total;
  if (state.payment==="Prepayment") state.customerTransactions.unshift({id:uid("CTX"),customerId:client.id,type:"deposit_out",amount:-t.total,actor:sale.cashier,createdAt:new Date().toISOString()});
  if (["Cash","Card","QR","Transfer"].includes(state.payment)) movement("in","sale",t.total,state.payment,sale.shiftId);
  if (fiscal&&!state.config.online) state.config.fiscalPending++;
  if (client) {
    client.prepayment=customerBalance(client.id);
    client.total+=t.total;
    client.history.unshift(sale.receipt);
  }
  state.sales.unshift(sale);
  if (state.currentDraftId) {
    const draft=state.drafts.find(d=>d.id===state.currentDraftId);
    if (draft) draft.status="Проведён";
  }
  state.cart=[];
  state.currentDraftId="";
  if (state.register.open) state.register.expectedCash=expectedCash();
  save();
  render();
  modal(tr("checkout.paymentSuccess"),`<div class="receipt-success">${icon("check")}</div><h2>${sale.receipt}</h2>${!fiscal?'<div class="non-fiscal-mark">NON-FISCAL SALES SLIP</div>':""}<div class="receipt-grid"><span>${tr("checkout.totalPaid")}</span><strong>${money(sale.total)}</strong><span>${tr("checkout.paymentMethod")}</span><strong>${tr(`payment.${sale.payment.toLowerCase()}`)}</strong><span>${tr("common.customer")}</span><strong>${sale.customer}</strong><span>${tr("common.operator")}</span><strong>${sale.cashier}</strong><span>${tr("common.date")}</span><strong>${today()}</strong><span>${tr("checkout.document")}</span><strong>${fiscal?tr("checkout.fiscalReceipt"):tr("checkout.markedSlip")}</strong></div>`,`<a class="button primary" href="checkout.html">${icon("plus")}${tr("checkout.newSale")}</a><button class="button secondary">${tr("checkout.printReceipt")}</button><button class="button secondary">${tr("checkout.sendReceipt")}</button>`);
}

function holdModal(useCart=false) {
  const productOptions=state.products.filter(p=>p.unit!=="service"&&availableStock(p)>0).map(p=>[p.id,`${p.name} · ${availableStock(p)} available`]);
  modal(useCart?"Place basket on hold":"Create customer hold",`<form id="${useCart?"cash-hold-cart-form":"cash-hold-form"}" class="form-grid">${select("customerId","Customer",state.clients.map(c=>[c.id,`${c.name} · ${c.phone}`]),state.customerId)}${useCart?`<label>Basket<span class="money-display">${state.cart.reduce((s,l)=>s+l.qty,0)} units · ${money(totals().total)}</span></label>`:`${select("productId","Product",productOptions,productOptions[0]?.[0])}${field("qty","Quantity",1,"number")}`}${field("deposit","Prepayment",0,"text",true)}<button class="button primary">${useCart?"Place on hold":"Create hold"}</button></form>`);
}

function createHold(data,useCart=false) {
  const deposit=Math.max(0,number(data.deposit));
  if (deposit>0&&isEnabled("cash_shift")&&!state.register.open) return toast("Open a shift before receiving a prepayment","danger");
  let lines;
  if (useCart) {
    if (!state.cart.length) return toast("Basket is empty","danger");
    lines=state.cart.map(i=>({id:i.id,name:i.name,price:i.price,qty:i.qty}));
  } else {
    const p=state.products.find(x=>x.id===data.productId),qty=Math.max(1,number(data.qty));
    if (!p||qty>availableStock(p)) return toast(`Only ${p?availableStock(p):0} available`,"danger");
    lines=[{id:p.id,name:p.name,price:p.price,qty}];
  }
  const hold={id:`HD-${310+state.holds.length}`,branchId:state.branchId,registerId:"REG-01",customerId:data.customerId,status:"Активна",createdAt:new Date().toISOString(),depositRemaining:deposit,lines};
  state.holds.unshift(hold);
  if (deposit>0) {
    state.customerTransactions.unshift({id:uid("CTX"),customerId:data.customerId,holdId:hold.id,type:"hold_prepayment",amount:deposit,actor:state.register.open?cashier():"Liam Johnson",createdAt:new Date().toISOString()});
    movement("in","hold_prepayment",deposit,"Cash",state.register.shiftId||"");
  }
  if (useCart) {
    state.cart=[];
    if (state.currentDraftId) {
      const d=state.drafts.find(x=>x.id===state.currentDraftId);
      if (d) d.status="Удалён";
    }
    state.currentDraftId="";
  }
  save();
  closeModal();
  render();
  toast("Hold created · physical stock unchanged");
}

function processCashReturn() {
  const sale=state.sales.find(s=>s.id===state.cashUi.returnSaleId);
  if (!sale) return;
  if (isEnabled("cash_shift")&&!state.register.open) return toast("Open a shift before processing a return","danger");
  const linesIn=sale.items.map(i=>({...i,qty:number(state.cashUi.returnQty[i.id])})).filter(i=>i.qty>0);
  if (!linesIn.length) return;
  const linesOut=(state.cashUi.exchangeIds||[]).map(id=>state.products.find(p=>p.id===id)).filter(Boolean).map(p=>({id:p.id,name:p.name,price:p.price,qty:1}));
  for (const line of linesIn) {
    const sold=sale.items.find(i=>i.id===line.id)?.qty||0;
    const prior=state.returns.filter(r=>r.originalSaleId===sale.id).flatMap(r=>r.linesIn).filter(i=>i.id===line.id).reduce((s,i)=>s+i.qty,0);
    if (line.qty>sold-prior) return toast(`Cannot return more ${line.name} than was sold`,"danger");
  }
  for (const line of linesOut) {
    const p=state.products.find(x=>x.id===line.id);
    if (p.unit!=="service"&&line.qty>availableStock(p)) return toast(`${p.name} is unavailable`,"danger");
  }
  const returnTotal=linesIn.reduce((s,l)=>s+l.price*l.qty,0),outTotal=linesOut.reduce((s,l)=>s+l.price*l.qty,0),settlement=outTotal-returnTotal;
  const customer=state.clients.find(c=>c.name===sale.customer)||customerById(sale.customerId);
  if (settlement<0&&state.cashUi.settlementMethod==="Deposit"&&!customer) return toast("Select an identified customer for deposit credit","danger");
  linesIn.forEach(l=>{const p=state.products.find(x=>x.id===l.id);if(p&&p.unit!=="service")p.stockByBranch[state.branchId]=stockOf(p)+l.qty;state.stockMoves.unshift({product:l.name,branchId:state.branchId,type:"Возврат",qty:l.qty,date:today(),user:cashier(),reason:"return",registerId:"REG-01"});});
  linesOut.forEach(l=>{const p=state.products.find(x=>x.id===l.id);if(p&&p.unit!=="service")p.stockByBranch[state.branchId]=stockOf(p)-l.qty;state.stockMoves.unshift({product:l.name,branchId:state.branchId,type:"Обмен",qty:-l.qty,date:today(),user:cashier(),reason:"exchange",registerId:"REG-01"});});
  const entry={id:`RT-${210+state.returns.length}`,type:linesOut.length?"Обмен":"Возврат",originalSaleId:sale.id,branchId:state.branchId,registerId:"REG-01",shiftId:state.register.shiftId||"",customerId:customer?.id||"",linesIn,linesOut,settlement,settlementMethod:settlement<0?state.cashUi.settlementMethod:state.payment,actor:state.register.open?cashier():"Liam Johnson",createdAt:new Date().toISOString(),immutable:true};
  state.returns.unshift(entry);
  if (settlement<0&&state.cashUi.settlementMethod==="Deposit") state.customerTransactions.unshift({id:uid("CTX"),customerId:customer.id,returnId:entry.id,type:"refund_credit",amount:Math.abs(settlement),actor:entry.actor,createdAt:new Date().toISOString()});
  else if (settlement!==0) movement(settlement>0?"in":"out",settlement>0?"exchange_settlement":"refund",Math.abs(settlement),"Cash",entry.shiftId);
  if (isEnabled("fiscalization")&&!state.config.online) state.config.fiscalPending++;
  state.cashUi.returnQty={};
  state.cashUi.exchangeIds=[];
  save();
  render();
  toast(`${cashStatus(entry.type)} completed · ${explicitMoney(settlement)}`);
}

function redeemHoldModal(id) {
  const hold=state.holds.find(h=>h.id===id&&h.status==="Активна");
  if (!hold) return;
  modal(`Redeem ${hold.id}`,`<form id="cash-redeem-hold-form" class="cash-stack"><input type="hidden" name="holdId" value="${hold.id}"><div class="cash-notice info">${icon("check")}<div><strong>Deposit available ${money(hold.depositRemaining)}</strong><span>Prepayment applies to collected items first.</span></div></div><div class="cash-lines">${hold.lines.map(l=>`<label class="cash-line"><div><strong>${l.name}</strong><small>${l.qty} held · ${money(l.price)}</small></div><strong>${money(l.price*l.qty)}</strong><input class="input compact-number" name="qty_${l.id}" type="number" min="0" max="${l.qty}" value="${l.qty}"></label>`).join("")}</div>${select("paymentMethod","Remainder payment",["Cash","Card","QR","Transfer"],"Cash")}${select("excessMethod","If deposit exceeds final collection",[["Deposit","Keep as customer deposit"],["Cash","Pay difference back in cash"]],"Deposit")}<button class="button primary">Complete collection</button></form>`);
}

function redeemHold(data) {
  const hold=state.holds.find(h=>h.id===data.holdId&&h.status==="Активна");
  if (!hold) return;
  if (isEnabled("cash_shift")&&!state.register.open) return toast("Open a shift before redeeming a hold","danger");
  const selected=hold.lines.map(l=>({...l,qty:Math.min(l.qty,Math.max(0,number(data[`qty_${l.id}`])))})).filter(l=>l.qty>0);
  if (!selected.length) return toast("Select at least one held unit","danger");
  const subtotal=selected.reduce((s,l)=>s+l.price*l.qty,0),depositUsed=Math.min(hold.depositRemaining,subtotal),due=subtotal-depositUsed,customer=customerById(hold.customerId);
  selected.forEach(l=>{const p=state.products.find(x=>x.id===l.id);if(p&&p.unit!=="service")p.stockByBranch[state.branchId]=stockOf(p)-l.qty;state.stockMoves.unshift({product:l.name,branchId:state.branchId,type:"Продажа",qty:-l.qty,date:today(),user:cashier(),reason:"hold_redemption",registerId:"REG-01"});});
  if (depositUsed>0) {
    state.customerTransactions.unshift({id:uid("CTX"),customerId:hold.customerId,holdId:hold.id,type:"deposit_out",amount:-depositUsed,actor:cashier(),createdAt:new Date().toISOString()});
    hold.depositRemaining-=depositUsed;
  }
  if (due>0) movement("in","sale_remainder",due,data.paymentMethod,state.register.shiftId);
  hold.lines=hold.lines.map(l=>({...l,qty:l.qty-(selected.find(x=>x.id===l.id)?.qty||0)})).filter(l=>l.qty>0);
  if (!hold.lines.length) {
    const excess=hold.depositRemaining;
    if (excess>0&&data.excessMethod==="Cash") {
      state.customerTransactions.unshift({id:uid("CTX"),customerId:hold.customerId,holdId:hold.id,type:"deposit_out",amount:-excess,actor:cashier(),createdAt:new Date().toISOString()});
      movement("out","hold_refund",excess,"Cash",state.register.shiftId);
    }
    hold.depositRemaining=0;
    hold.status="Выкуплена";
  }
  const sale={id:uid("sale"),receipt:`R-${10500+state.sales.length}`,date:new Date().toISOString(),branchId:state.branchId,registerId:"REG-01",shiftId:state.register.shiftId,customer:customer.name,customerId:customer.id,cashier:cashier(),items:selected,subtotal,total:subtotal,discount:0,tax:0,payment:data.paymentMethod,fiscalized:isEnabled("fiscalization")&&state.config.online,fiscalId:"",profit:0,status:"Completed",holdId:hold.id};
  state.sales.unshift(sale);
  save();
  closeModal();
  render();
  toast(`${hold.status==="Выкуплена"?"Hold redeemed":"Partial collection"} · customer pays ${money(due)}`);
}

function cancelHoldModal(id) {
  const hold=state.holds.find(h=>h.id===id&&h.status==="Активна");
  if (!hold) return;
  modal(`Cancel ${hold.id}`,`<form id="cash-cancel-hold-form" class="form-grid"><input type="hidden" name="holdId" value="${hold.id}"><div class="cash-notice warning"><div><strong>Prepayment ${money(hold.depositRemaining)}</strong><span>Choose what happens to customer money. It is never kept silently.</span></div></div>${select("method","Refund treatment",[["Deposit","Keep as customer deposit"],["Cash","Pay back in cash"]],"Deposit")}<button class="button destructive">Cancel hold and release stock</button></form>`);
}

function cancelHold(data) {
  const hold=state.holds.find(h=>h.id===data.holdId&&h.status==="Активна");
  if (!hold) return;
  if (data.method==="Cash"&&hold.depositRemaining>0&&isEnabled("cash_shift")&&!state.register.open) return toast("Open a shift before paying cash back","danger");
  if (data.method==="Cash"&&hold.depositRemaining>0) {
    state.customerTransactions.unshift({id:uid("CTX"),customerId:hold.customerId,holdId:hold.id,type:"deposit_out",amount:-hold.depositRemaining,actor:cashier(),createdAt:new Date().toISOString()});
    movement("out","hold_refund",hold.depositRemaining,"Cash",state.register.shiftId);
  }
  hold.depositRemaining=0;
  hold.status="Отменена";
  save();
  closeModal();
  render();
  toast("Hold cancelled · available stock released");
}

function closeShiftModal() {
  const expected=expectedCash();
  modal("Count & close shift",`<form id="cash-close-shift-form" class="form-grid"><label>Expected cash<span class="money-display">${money(expected)}</span></label>${field("countedUzs","Counted UZS",expected,"text",true)}${field("countedUsd","Counted USD",0,"number")}${field("usdRate","USD rate at close",12700,"number")}<label>Variance<span id="cash-variance" class="money-display">Balanced · no variance</span></label><button class="button destructive">Close shift permanently</button></form>`);
}

let sidebarTooltipTimer=0;
function hideSidebarTooltip() {
  clearTimeout(sidebarTooltipTimer);
  sidebarTooltipTimer=0;
  const tooltip=$("#sidebar-tooltip");
  if (!tooltip) return;
  tooltip.classList.remove("visible");
  tooltip.setAttribute("aria-hidden","true");
}

document.addEventListener("pointerover",e=>{
  const item=e.target.closest("[data-sidebar-tooltip]");
  if (!item||!document.querySelector(".app.sidebar-collapsed")||window.matchMedia("(max-width:700px)").matches) return;
  clearTimeout(sidebarTooltipTimer);
  sidebarTooltipTimer=setTimeout(()=>{
    if (!item.isConnected||!item.matches(":hover")) return;
    const tooltip=$("#sidebar-tooltip"),box=item.getBoundingClientRect();
    if (!tooltip) return;
    tooltip.textContent=item.dataset.sidebarTooltip;
    tooltip.style.left=`${Math.round(box.right+10)}px`;
    tooltip.style.top=`${Math.round(box.top+box.height/2)}px`;
    tooltip.classList.add("visible");
    tooltip.setAttribute("aria-hidden","false");
  },300);
});
document.addEventListener("pointerout",e=>{
  const item=e.target.closest("[data-sidebar-tooltip]");
  if (!item||item.contains(e.relatedTarget)) return;
  hideSidebarTooltip();
});

document.addEventListener("keydown",e=>{if(e.key==="Escape"&&state.profileMenuOpen){state.profileMenuOpen=false;save();render();return;}if(e.key==="Escape")closeModal();if(e.key==="/"&&!$(".modal")&&page==="checkout"){e.preventDefault();$("#product-search")?.focus();}});
document.addEventListener("click",e=>{
  const filter=e.target.closest("[data-client-filter]");
  if(!filter)return;
  e.preventDefault();e.stopImmediatePropagation();state.clientFilter=filter.dataset.clientFilter;save();render();
},true);
document.addEventListener("click",e=>{
  const button=e.target.closest('[data-action="export-report"]');
  if(!button)return;
  e.preventDefault();e.stopImmediatePropagation();
  const original=button.innerHTML;
  button.disabled=true;button.classList.add("loading");button.setAttribute("aria-busy","true");button.innerHTML=`${icon("loader")}${tr("reports.preparingExport")}`;
  setTimeout(()=>{if(!button.isConnected)return;button.disabled=false;button.classList.remove("loading");button.removeAttribute("aria-busy");button.innerHTML=original;toast(tr("reports.exportReady"));},700);
},true);
document.addEventListener("click",e=>{const b=e.target.closest("button,[data-close]");if(!b)return;if(b.dataset.dashboardPeriod){state.dashboardPeriod=b.dataset.dashboardPeriod;save();return render();}if(b.dataset.close!==undefined)return closeModal();if(b.dataset.add)return addProduct(b.dataset.add);if(b.dataset.category){state.category=b.dataset.category;save();return render();}if(b.dataset.catalogStatus){state.catalogStatus=b.dataset.catalogStatus;save();return render();}if(b.dataset.plus){state.cart.find(x=>x.id===b.dataset.plus).qty++;save();return render();}if(b.dataset.minus){const item=state.cart.find(x=>x.id===b.dataset.minus);item.qty=Math.max(1,item.qty-1);save();return render();}if(b.dataset.remove){state.cart=state.cart.filter(x=>x.id!==b.dataset.remove);save();return render();}if(b.dataset.payment){state.payment=b.dataset.payment;save();return render();}if(b.dataset.product)return productForm(state.products.find(p=>p.id===b.dataset.product));if(b.dataset.sale)return saleModal(b.dataset.sale);if(b.dataset.supplier)return supplierModal(b.dataset.supplier);if(b.dataset.tasnif!==undefined){const x=window.__tasnif[number(b.dataset.tasnif)];closeModal();return productForm({...x,sku:`ROS-${Date.now().toString().slice(-4)}`,barcode:"",supplier:state.suppliers[0].name,price:0,cost:0,stockByBranch:{[state.branchId]:0}});}if(b.dataset.client){const c=state.clients.find(x=>x.id===b.dataset.client);return modal(c.name,`<div class="receipt-grid"><span>Debt</span><strong class="money-danger">${money(c.debt)}</strong><span>Prepayment</span><strong class="money-positive">${money(c.prepayment)}</strong><span>Receipts</span><strong>${c.history.join(", ") || "No purchase history yet"}</strong></div><button class="button primary" data-prepay="${c.id}">Add Prepayment</button>`);}if(b.dataset.prepay)return modal("Add Prepayment",`<form id="prepay-form" class="form-grid"><input type="hidden" name="client" value="${b.dataset.prepay}">${field("amount","Amount",500000,"text",true)}<button class="button primary">Save</button></form>`);const a=b.dataset.action;if(a==="toggle-sidebar"){state.sidebarCollapsed=!state.sidebarCollapsed;state.profileMenuOpen=false;save();return render();}if(a==="profile-menu"){state.profileMenuOpen=!state.profileMenuOpen;save();return render();}if(a==="theme"){state.config.theme=state.config.theme==="dark"?"light":"dark";save();return render();}if(a==="online"){state.config.online=!state.config.online;save();return render();}if(a==="fiscal"){state.config.fiscalization=!state.config.fiscalization;save();return render();}if(a==="open-register")return openRegister();if(a==="close-register")return closeRegister();if(a==="pay")return pay();if(a==="add-product")return productForm();if(a==="tasnif")return tasnifModal();if(a==="print-tags")return toast("Price tag template prepared");if(a==="mock-import")return mockImport();if(a==="validate-import")return validateImport();if(a==="import-valid"){validateImport();const valid=state.importRows.filter(r=>!r.errors.length);valid.forEach(r=>state.products.unshift({id:uid("p"),name:r.name,sku:r.sku,barcode:r.barcode,category:r.category,supplier:"Local Distribution",price:number(r.price),cost:number(r.cost),stockByBranch:{[state.branchId]:number(r.stock),b2:0,b3:0},unit:"pcs",fiscalCode:"TASNIF-NEW",status:"Активный",favorite:false}));state.importHistory.unshift({id:`IMP-${100+state.importHistory.length}`,status:"Успешно",date:"20 мая 2024",rows:valid.length,fixed:valid.length,errors:0,progress:100});state.importRows=state.importRows.filter(r=>r.errors.length);save();render();return toast(`${valid.length} imported`);}if(a==="add-client")return modal("Add Customer",`<form id="client-form" class="form-grid">${field("name","Name")}${field("phone","Phone")}${field("debt","Debt",0,"text",true)}${field("prepayment","Prepayment",0,"text",true)}<button class="button primary">Save</button></form>`);if(a==="supplier-order")return modal("Create Purchase Order",`<form id="supplier-form" class="form-grid">${select("supplier","Supplier",state.suppliers.map(s=>[s.id,s.name]))}${field("ordered","Ordered amount",10000000,"text",true)}${field("received","Received amount",7000000,"text",true)}<label>Remaining<span id="remaining" class="money-display">${money(3000000)}</span></label><button class="button primary">Save</button></form>`);if(a==="start-stocktake")return toast("Started partial stocktake");if(a==="stock-adjust")return toast("Stock adjustment saved");if(a==="create-transfer")return toast("Transfer draft created");});
document.addEventListener("click",e=>{if(!state.profileMenuOpen||e.target.closest(".profile-shell"))return;state.profileMenuOpen=false;save();$(".profile-popover")?.classList.remove("open");$(".profile-popover")?.setAttribute("aria-hidden","true");$(".sidebar-profile")?.setAttribute("aria-expanded","false");});
document.addEventListener("click",e=>{
  const button=e.target.closest("button");
  if (button?.dataset.dashboardPeriod) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const period=button.dataset.dashboardPeriod,range=dashboardPresetRange(period),groups=dashboardGroupingOptions(period,range);
    state.dashboardPeriod=period;
    state.dashboardDateFrom=range.from;
    state.dashboardDateTo=range.to;
    state.dashboardGroup=groups.includes(state.dashboardGroup)?state.dashboardGroup:groups[0];
    state.dashboardStoreMenuOpen=false;
    state.dashboardDateMenuOpen=false;
    state.profileMenuOpen=false;
    save();
    return render();
  }
  if (button?.dataset.calendarNav) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const view=new Date(Number(state.dashboardCalendarYear),Number(state.dashboardCalendarMonth),1),step=Number(button.dataset.step);
    if (button.dataset.calendarNav==="year") view.setFullYear(view.getFullYear()+step);
    else view.setMonth(view.getMonth()+step);
    state.dashboardCalendarYear=view.getFullYear();
    state.dashboardCalendarMonth=view.getMonth();
    state.dashboardCalendarMenuSide="";
    state.dashboardCalendarMenuType="";
    save();
    return render();
  }
  if (button?.dataset.calendarTitle) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const side=button.dataset.calendarSide,type=button.dataset.calendarTitle;
    const isOpen=state.dashboardCalendarMenuSide===side&&state.dashboardCalendarMenuType===type;
    state.dashboardCalendarMenuSide=isOpen?"":side;
    state.dashboardCalendarMenuType=isOpen?"":type;
    save();
    return render();
  }
  if (button?.dataset.calendarMonthChoice!==undefined||button?.dataset.calendarYearChoice!==undefined) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const side=button.dataset.calendarSide,type=button.dataset.calendarMonthChoice!==undefined?"month":"year";
    const value=Number(type==="month"?button.dataset.calendarMonthChoice:button.dataset.calendarYearChoice);
    const base=new Date(Number(state.dashboardCalendarYear),Number(state.dashboardCalendarMonth),1);
    const target=side==="left"?new Date(base):new Date(base.getFullYear(),base.getMonth()+1,1);
    if (type==="month") target.setMonth(value);
    else target.setFullYear(value);
    const nextBase=side==="left"?target:new Date(target.getFullYear(),target.getMonth()-1,1);
    state.dashboardCalendarYear=nextBase.getFullYear();
    state.dashboardCalendarMonth=nextBase.getMonth();
    state.dashboardCalendarMenuSide="";
    state.dashboardCalendarMenuType="";
    save();
    return render();
  }
  if (button?.dataset.calendarDate) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const value=button.dataset.calendarDate;
    if (state.dashboardDatePicking!=="end"||!state.dashboardDateDraftFrom||state.dashboardDateDraftTo) {
      state.dashboardDateDraftFrom=value;
      state.dashboardDateDraftTo="";
      state.dashboardDatePicking="end";
    } else {
      if (value<state.dashboardDateDraftFrom) {
        state.dashboardDateDraftTo=state.dashboardDateDraftFrom;
        state.dashboardDateDraftFrom=value;
      } else state.dashboardDateDraftTo=value;
      state.dashboardDatePicking="start";
      const range={from:state.dashboardDateDraftFrom,to:state.dashboardDateDraftTo},groups=dashboardGroupingOptions("custom",range);
      state.dashboardPeriod="custom";
      state.dashboardDateFrom=range.from;
      state.dashboardDateTo=range.to;
      state.dashboardGroup=groups.includes(state.dashboardGroup)?state.dashboardGroup:groups[0];
      state.dashboardDateMenuOpen=false;
      state.dashboardCalendarMenuSide="";
      state.dashboardCalendarMenuType="";
      state.profileMenuOpen=false;
    }
    save();
    return render();
  }
  const action=button?.dataset.action;
  if (action==="dashboard-stores") {
    e.preventDefault();
    e.stopImmediatePropagation();
    state.dashboardStoreMenuOpen=!state.dashboardStoreMenuOpen;
    state.dashboardDateMenuOpen=false;
    state.profileMenuOpen=false;
    save();
    return render();
  }
  if (action==="dashboard-dates") {
    e.preventDefault();
    e.stopImmediatePropagation();
    const opening=!state.dashboardDateMenuOpen,range=dashboardRange();
    state.dashboardDateMenuOpen=opening;
    state.dashboardStoreMenuOpen=false;
    state.profileMenuOpen=false;
    state.dashboardCalendarMenuSide="";
    state.dashboardCalendarMenuType="";
    if (opening) {
      const view=new Date(`${range.from}T12:00:00`);
      state.dashboardCalendarYear=view.getFullYear();
      state.dashboardCalendarMonth=view.getMonth();
      state.dashboardDateDraftFrom=range.from;
      state.dashboardDateDraftTo=range.to;
      state.dashboardDatePicking="start";
    }
    save();
    return render();
  }
  let changed=false;
  if (state.dashboardStoreMenuOpen&&!e.target.closest(".dashboard-store-control")) {
    state.dashboardStoreMenuOpen=false;
    $(".store-filter-popover")?.classList.remove("open");
    changed=true;
  }
  if (state.dashboardDateMenuOpen&&!e.target.closest(".dashboard-date-control")) {
    state.dashboardDateMenuOpen=false;
    $(".date-filter-popover")?.classList.remove("open");
    changed=true;
  }
  if (changed) save();
},true);
document.addEventListener("change",e=>{
  if (e.target.name==="dashboard-store") {
    e.stopImmediatePropagation();
    const all=state.branches.map(branch=>branch.id),value=e.target.value;
    let selected=dashboardSelectedStoreIds();
    if (value==="all") selected=e.target.checked?all:[all.includes(state.branchId)?state.branchId:all[0]];
    else if (e.target.checked&&!selected.includes(value)) selected=[...selected,value];
    else if (!e.target.checked) selected=selected.filter(id=>id!==value);
    if (!selected.length) selected=[value==="all"?all[0]:value];
    state.dashboardStoreIds=selected;
    state.dashboardStoreMenuOpen=true;
    save();
    return render();
  }
  if (e.target.id==="dashboard-grouping") {
    e.stopImmediatePropagation();
    state.dashboardGroup=e.target.value;
    save();
    return render();
  }
},true);
document.addEventListener("keydown",e=>{
  if (e.key!=="Escape"||(!state.dashboardStoreMenuOpen&&!state.dashboardDateMenuOpen)) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  state.dashboardStoreMenuOpen=false;
  state.dashboardDateMenuOpen=false;
  save();
  render();
},true);
document.addEventListener("input",e=>{if(e.target.id==="product-search"){state.search=e.target.value;save();render();setTimeout(()=>{const x=$("#product-search");x?.focus();x?.setSelectionRange(x.value.length,x.value.length)},0);}if(e.target.name==="discount"){state.receiptDiscount=Math.max(0,Math.min(100,number(e.target.value)));save();render();}if(e.target.name==="actual"){$("#variance").textContent=money(number(e.target.value)-state.register.expectedCash);$("#variance").className=`money-display ${number(e.target.value)-state.register.expectedCash<0?"money-danger":number(e.target.value)-state.register.expectedCash>0?"money-positive":""}`;}if(e.target.name==="ordered"||e.target.name==="received"){$("#remaining").textContent=money(number($("[name=ordered]").value)-number($("[name=received]").value));}});
document.addEventListener("change",e=>{if(e.target.name==="customer"){state.customerId=e.target.value;save();render();}if(e.target.id==="branch"){state.branchId=e.target.value;save();render();}if(e.target.id==="locale"||e.target.id==="locale-config"){state.locale=e.target.value;state.config.locale=e.target.value;save();render();}});
document.addEventListener("keydown",e=>{if(e.target.id==="product-search"&&e.key==="Enter"){e.preventDefault();const q=e.target.value.trim();const p=state.products.find(p=>p.barcode===q||p.sku.toLowerCase()===q.toLowerCase()||p.name.toLowerCase()===q.toLowerCase());if(p){state.search="";addProduct(p.id);}else toast(tr("checkout.productNotFound"),"danger");}if((e.target.id==="import-scanner"||e.target.id==="stocktake-scanner"||e.target.id==="transfer-scanner")&&e.key==="Enter"){e.preventDefault();toast("Scanned locally; will sync when online");}});
document.addEventListener("submit",e=>{e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f));if(f.id==="open-form"){state.register={open:true,cashierId:d.cashier,openingAmount:number(d.amount),expectedCash:number(d.amount),openedAt:today()};save();closeModal();render();return toast("Register opened");}if(f.id==="close-form"){const variance=number(d.actual)-state.register.expectedCash;state.register={open:false,cashierId:"",openingAmount:0,expectedCash:0,openedAt:"",lastVariance:variance};save();closeModal();render();return toast(`Register closed · ${variance<0?"shortage":"variance"} ${money(variance)}`,variance<0?"danger":"positive");}if(f.id==="product-form"){const duplicate=state.products.some(x=>x.barcode===d.barcode&&x.id!==d.id);if(duplicate)return toast("Duplicate barcode is blocked","danger");if(number(d.price)<=0||number(d.cost)<0)return toast("Invalid price is blocked","danger");let p=d.id?state.products.find(x=>x.id===d.id):{id:uid("p"),favorite:false,stockByBranch:{b1:0,b2:0,b3:0}};Object.assign(p,{name:d.name,sku:d.sku,barcode:d.barcode,category:d.category,supplier:d.supplier,price:number(d.price),cost:number(d.cost),unit:d.category==="Services"?"service":"pcs",fiscalCode:d.fiscalCode,status:"Активный"});p.stockByBranch[state.branchId]=number(d.stock);if(!d.id)state.products.unshift(p);state.stockMoves.unshift({product:p.name,branchId:state.branchId,type:d.id?"Корректировка":"Поступление",qty:number(d.stock),date:today(),user:"Liam Johnson"});save();closeModal();render();return toast("Product saved");}if(f.id==="client-form"){state.clients.unshift({id:uid("c"),name:d.name,phone:d.phone,total:0,debt:number(d.debt),prepayment:number(d.prepayment),loyalty:"New",lastVisit:"Never",history:[]});save();closeModal();render();return toast("Customer saved");}if(f.id==="supplier-form"){const s=state.suppliers.find(x=>x.id===d.supplier),remaining=number(d.ordered)-number(d.received);s.balance+=remaining;s.status=remaining>0?"Долг":"Активный";state.purchaseOrders.unshift({id:uid("PO"),supplier:s.name,branchId:state.branchId,status:"Оформлен",ordered:number(d.ordered),received:number(d.received),remaining,progress:30,lines:1,date:"20 мая 2024"});save();closeModal();render();return toast(`Remaining ${money(remaining)}`);}if(f.id==="employee-form"){state.employees.unshift({id:uid("e"),name:d.name,role:d.role,status:"Active"});save();closeModal();render();return toast("Employee saved");}if(f.id==="prepay-form"){state.clients.find(c=>c.id===d.client).prepayment+=number(d.amount);save();closeModal();render();return toast("Prepayment added");}});

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-cash-action]");
  if (!b) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const action=b.dataset.cashAction,id=b.dataset.id;
  if (action==="checkout-view") {state.checkoutMobileView=b.dataset.view;save();return render();}
  if (action==="mode") return setRegisterMode(b.dataset.mode);
  if (action==="cart-plus") {
    const item=state.cart.find(x=>x.id===id),p=state.products.find(x=>x.id===id);
    if (p.unit!=="service"&&item.qty+1>availableStock(p)) return toast(`Only ${availableStock(p)} available`,"danger");
    item.qty++;saveCurrentDraft();save();return render();
  }
  if (action==="cart-minus") {
    const item=state.cart.find(x=>x.id===id);item.qty=Math.max(1,item.qty-1);saveCurrentDraft();save();return render();
  }
  if (action==="cart-remove") {state.cart=state.cart.filter(x=>x.id!==id);saveCurrentDraft();save();return render();}
  if (action==="save-draft") return saveCurrentDraft(true);
  if (action==="hold-cart") return holdModal(true);
  if (action==="pay") return cashPay();
  if (action==="open-draft") {
    const d=state.drafts.find(x=>x.id===id&&x.status==="Черновик");
    if (!d) return;
    state.cart=d.lines.map(x=>({...x}));state.customerId=d.customerId;state.currentDraftId=d.id;save();location.href="checkout.html";return;
  }
  if (action==="delete-draft") {const d=state.drafts.find(x=>x.id===id);if(d)d.status="Удалён";save();render();return toast("Draft deleted · no stock affected");}
  if (action==="add-exchange") {const pid=$("#cash-exchange-product")?.value;if(pid)state.cashUi.exchangeIds.push(pid);save();return render();}
  if (action==="remove-exchange") {const index=state.cashUi.exchangeIds.indexOf(id);if(index>=0)state.cashUi.exchangeIds.splice(index,1);save();return render();}
  if (action==="process-return") return processCashReturn();
  if (action==="new-hold") return holdModal(false);
  if (action==="redeem-hold") return redeemHoldModal(id);
  if (action==="cancel-hold") return cancelHoldModal(id);
  if (action==="close-shift") return closeShiftModal();
  if (action==="operation-type") {state.cashUi.operationType=b.dataset.type;save();return render();}
  if (action==="select-shift") {state.cashUi.selectedShiftId=id;save();return render();}
},true);

document.addEventListener("change",e=>{
  if (e.target.id==="branch"&&state.register.open&&e.target.value!==state.register.branchId) {
    e.preventDefault();e.stopImmediatePropagation();render();return toast("Close the open shift before changing branch","danger");
  }
  if (e.target.id==="cash-return-sale") {state.cashUi.returnSaleId=e.target.value;state.cashUi.returnQty={};state.cashUi.exchangeIds=[];save();render();return;}
  if (e.target.id==="cash-settlement-method") {state.cashUi.settlementMethod=e.target.value;save();render();return;}
  if (e.target.dataset.returnQty!==undefined) {
    const max=number(e.target.max),value=Math.max(0,Math.min(max,number(e.target.value)));
    state.cashUi.returnQty[e.target.dataset.returnQty]=value;save();render();
  }
},true);

document.addEventListener("input",e=>{
  if (["countedUzs","countedUsd","usdRate"].includes(e.target.name)&&$("#cash-variance")) {
    const uzs=number($('[name="countedUzs"]')?.value),usd=number($('[name="countedUsd"]')?.value),rate=number($('[name="usdRate"]')?.value),variance=uzs+usd*rate-expectedCash();
    $("#cash-variance").textContent=varianceLabel(variance);
    $("#cash-variance").className=`money-display ${variance<0?"money-danger":variance>0?"money-positive":""}`;
  }
},true);

document.addEventListener("submit",e=>{
  const f=e.target;
  if (f.id==="prepay-form") {
    e.preventDefault();
    e.stopImmediatePropagation();
    const d=Object.fromEntries(new FormData(f)),amount=Math.max(0,number(d.amount));
    if (isEnabled("cash_shift")&&!state.register.open) return toast("Open a shift before receiving customer money","danger");
    state.customerTransactions.unshift({id:uid("CTX"),customerId:d.client,type:"deposit_in",amount,actor:state.register.open?cashier():"Liam Johnson",createdAt:new Date().toISOString()});
    movement("in","deposit_in",amount,"Cash",state.register.shiftId||"");
    const client=customerById(d.client);client.prepayment=customerBalance(client.id);
    save();closeModal();render();return toast("Customer deposit recorded");
  }
  if (!f.id.startsWith("cash-")) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const d=Object.fromEntries(new FormData(f));
  if (f.id==="cash-open-shift") {
    if (state.register.open) return toast("A shift is already open","danger");
    const id=`SH-${100+state.registerHistory.length+1}`;
    state.register={id:"REG-01",open:true,shiftId:id,cashierId:d.cashier,branchId:state.branchId,openingAmount:number(d.amount),expectedCash:number(d.amount),openedAt:today(),openedIso:new Date().toISOString(),status:"Открыта"};
    save();render();return toast(`Shift ${id} opened locally`);
  }
  if (f.id==="cash-close-shift-form") {
    const expected=expectedCash(),uzs=Math.max(0,number(d.countedUzs)),usd=Math.max(0,number(d.countedUsd)),rate=Math.max(1,number(d.usdRate)),counted=uzs+usd*rate,variance=counted-expected;
    state.registerHistory.unshift({id:state.register.shiftId,registerId:"REG-01",branchId:state.register.branchId,openedBy:cashier(),openedAt:state.register.openedIso,openingFloat:state.register.openingAmount,closedBy:cashier(),closedAt:new Date().toISOString(),status:"Закрыта",closeCount:{expectedTotal:expected,countedTotal:counted,variance,lines:[{currency:"UZS",amount:uzs,rate:1,converted:uzs},...(usd?[{currency:"USD",amount:usd,rate,converted:usd*rate}]:[])]}});
    state.cashUi.selectedShiftId=state.register.shiftId;
    state.register={id:"REG-01",open:false,shiftId:"",cashierId:"",branchId:state.branchId,openingAmount:0,expectedCash:0,openedAt:"",lastVariance:variance};
    save();closeModal();render();return toast(`Shift closed · ${varianceLabel(variance)}`,variance<0?"danger":"positive");
  }
  if (f.id==="cash-operation-form") {
    if (!state.register.open) return toast("Open a shift first","danger");
    const amount=Math.max(0,number(d.amount)),reason=String(d.reason||"").trim(),type=state.cashUi.operationType;
    if (!amount||!reason) return toast("Amount and reason are required","danger");
    state.cashOperations.unshift({id:uid("CO"),shiftId:state.register.shiftId,registerId:"REG-01",branchId:state.branchId,type,amount,reason,actor:cashier(),createdAt:new Date().toISOString()});
    movement(type==="Внесение"?"in":"out","cash_operation",amount,"Cash",state.register.shiftId);
    state.register.expectedCash=expectedCash();save();render();return toast(`${cashStatus(type)} recorded`);
  }
  if (f.id==="cash-hold-form") return createHold(d,false);
  if (f.id==="cash-hold-cart-form") return createHold(d,true);
  if (f.id==="cash-redeem-hold-form") return redeemHold(d);
  if (f.id==="cash-cancel-hold-form") return cancelHold(d);
},true);

render();
