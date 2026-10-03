export type MarketingLocale = "ru" | "uz" | "en";
export type ShiftTone = "opening" | "rush" | "offline" | "inventory" | "closing";

export type ShiftEvent = {
  time: string;
  label: string;
  title: string;
  description: string;
  tone: ShiftTone;
};

export type RoleCard = {
  role: string;
  title: string;
  description: string;
};

export type LocalizedMarketingContent = {
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  storyKicker: string;
  storyTitle: string;
  storyDescription: string;
  shiftEvents: ShiftEvent[];
  rolesTitle: string;
  rolesIntro: string;
  roleCards: RoleCard[];
  founderKicker: string;
  founderQuote: string;
  founderName: string;
  pilotTitle: string;
  pilotDescription: string;
  pilotFeatures: string[];
};

export type MarketingContent = {
  locales: Record<MarketingLocale, LocalizedMarketingContent>;
  contactEmail: string;
  contactPhone: string;
  contactTelegram: string;
};

export const defaultMarketingContent: MarketingContent = {
  locales: {
    ru: {
      eyebrow: "Один рабочий день · один спокойный ритм",
      heroTitle: "Магазин работает в своём ритме.",
      heroDescription: "DinoPOS держит продажи, товары, смены и остатки в одном понятном рабочем пространстве — для кассира, управляющего и владельца.",
      primaryCta: "Посмотреть одну смену",
      secondaryCta: "Обсудить пилот",
      storyKicker: "Одна смена с DinoPOS",
      storyTitle: "От открытия кассы до итогов дня — без разрывов между операциями.",
      storyDescription: "Пять обычных моментов магазина. Интерфейс меняется вместе со сменой и показывает каждому только то, что важно сейчас.",
      shiftEvents: [
        { time: "08:57", label: "Открытие", title: "Смена начинается без утренней суеты", description: "Кассир проверяет остаток денег, открывает смену и сразу видит готовность рабочего места.", tone: "opening" },
        { time: "11:42", label: "Поток", title: "Товар попадает в чек за одно движение", description: "Сканер, быстрый поиск и крупные действия помогают не собирать очередь даже в час пик.", tone: "rush" },
        { time: "14:18", label: "Нет сети", title: "Интернет пропал. Продажа — нет.", description: "Операция сохраняется локально. Кассир продолжает работу, а синхронизация возвращается вместе со связью.", tone: "offline" },
        { time: "18:35", label: "Остатки", title: "Заканчивающийся товар замечен до пустой полки", description: "Управляющий видит исключение, проверяет движение и готовит пополнение без ручного обхода.", tone: "inventory" },
        { time: "22:04", label: "Итог", title: "День закрывается одной понятной картиной", description: "Выручка, смена, расхождения и динамика точки готовы для владельца без отдельной таблицы.", tone: "closing" },
      ],
      rolesTitle: "Одна система. Три разных взгляда.",
      rolesIntro: "DinoPOS не заставляет всех работать в одном перегруженном интерфейсе.",
      roleCards: [
        { role: "Кассир", title: "Быстро провести продажу", description: "Только текущий чек, товары, оплата и состояние смены." },
        { role: "Управляющий", title: "Увидеть, что требует внимания", description: "Остатки, возвраты, кассовые операции и задачи точки." },
        { role: "Владелец", title: "Понять бизнес без сборки отчёта", description: "Продажи, маржа и сравнение магазинов в одной картине." },
      ],
      founderKicker: "Почему мы это строим",
      founderQuote: "Хорошая касса не должна напоминать о себе. Она просто помогает магазину спокойно прожить день — даже когда вокруг что-то идёт не по плану.",
      founderName: "Команда DinoPOS",
      pilotTitle: "Давайте проживём первую смену вместе",
      pilotDescription: "Разберём процессы магазина, подготовим каталог и настроим рабочее место. Без презентации на сто слайдов и многомесячного внедрения.",
      pilotFeatures: ["Разбор текущего процесса", "Подготовка товаров и ролей", "Сопровождение первых смен"],
    },
    uz: {
      eyebrow: "Bitta ish kuni · bitta xotirjam ritm",
      heroTitle: "Do‘kon o‘z ritmida ishlaydi.",
      heroDescription: "DinoPOS savdo, mahsulot, smena va qoldiqlarni kassir, boshqaruvchi va egasi uchun bitta tushunarli ish maydonida birlashtiradi.",
      primaryCta: "Bitta smenani ko‘rish",
      secondaryCta: "Pilotni muhokama qilish",
      storyKicker: "DinoPOS bilan bir smena",
      storyTitle: "Kassani ochishdan kun yakunigacha — operatsiyalar orasida uzilish yo‘q.",
      storyDescription: "Do‘konning beshta oddiy lahzasi. Interfeys smena bilan birga o‘zgaradi va har kimga ayni paytda muhim bo‘lganini ko‘rsatadi.",
      shiftEvents: [
        { time: "08:57", label: "Ochilish", title: "Smena ertalabki shoshilinchsiz boshlanadi", description: "Kassir pul qoldig‘ini tekshiradi, smenani ochadi va ish joyi tayyorligini darhol ko‘radi.", tone: "opening" },
        { time: "11:42", label: "Oqim", title: "Mahsulot chekga bir harakatda qo‘shiladi", description: "Skaner, tezkor qidiruv va yirik amallar tig‘iz paytda ham navbatni ushlab turadi.", tone: "rush" },
        { time: "14:18", label: "Tarmoq yo‘q", title: "Internet yo‘qoldi. Savdo esa yo‘qolmadi.", description: "Operatsiya lokal saqlanadi. Kassir ishlashda davom etadi, aloqa qaytganda sinxronlash tiklanadi.", tone: "offline" },
        { time: "18:35", label: "Qoldiq", title: "Mahsulot tugashi bo‘sh javondan oldin seziladi", description: "Boshqaruvchi istisnoni ko‘radi, harakatni tekshiradi va qo‘lda aylanmasdan to‘ldirishni tayyorlaydi.", tone: "inventory" },
        { time: "22:04", label: "Yakun", title: "Kun bitta tushunarli manzara bilan yopiladi", description: "Tushum, smena, farqlar va nuqta dinamikasi alohida jadvalsiz egaga tayyor.", tone: "closing" },
      ],
      rolesTitle: "Bitta tizim. Uch xil qarash.",
      rolesIntro: "DinoPOS hammani bitta ortiqcha yuklangan interfeysda ishlashga majburlamaydi.",
      roleCards: [
        { role: "Kassir", title: "Savdoni tez o‘tkazish", description: "Faqat joriy chek, mahsulotlar, to‘lov va smena holati." },
        { role: "Boshqaruvchi", title: "Nimaga e’tibor kerakligini ko‘rish", description: "Qoldiq, qaytarish, kassa amallari va nuqta vazifalari." },
        { role: "Egasi", title: "Hisobot yig‘masdan biznesni tushunish", description: "Savdo, marja va do‘konlarni bitta manzarada solishtirish." },
      ],
      founderKicker: "Nega biz buni quryapmiz",
      founderQuote: "Yaxshi kassa o‘zini eslatmasligi kerak. U atrofda nimadir reja bo‘yicha ketmasa ham, do‘konga kunni xotirjam o‘tkazishga yordam beradi.",
      founderName: "DinoPOS jamoasi",
      pilotTitle: "Birinchi smenani birga o‘tkazamiz",
      pilotDescription: "Do‘kon jarayonlarini o‘rganamiz, katalogni tayyorlaymiz va ish joyini sozlaymiz. Yuz slaydli taqdimot va ko‘p oylik joriy etishsiz.",
      pilotFeatures: ["Joriy jarayonni o‘rganish", "Mahsulot va rollarni tayyorlash", "Birinchi smenalarni qo‘llab-quvvatlash"],
    },
    en: {
      eyebrow: "One working day · one calm rhythm",
      heroTitle: "The store moves at its own rhythm.",
      heroDescription: "DinoPOS keeps sales, products, shifts, and inventory in one clear workspace for the cashier, manager, and owner.",
      primaryCta: "See one shift",
      secondaryCta: "Discuss a pilot",
      storyKicker: "One shift with DinoPOS",
      storyTitle: "From opening the register to the day’s result — without gaps between operations.",
      storyDescription: "Five ordinary moments in a store. The interface moves with the shift and shows each person what matters right now.",
      shiftEvents: [
        { time: "08:57", label: "Opening", title: "The shift starts without the morning scramble", description: "The cashier checks the float, opens the shift, and immediately sees that the workspace is ready.", tone: "opening" },
        { time: "11:42", label: "Rush", title: "A product reaches the receipt in one move", description: "Scanning, fast search, and clear actions keep the queue moving through the busiest hour.", tone: "rush" },
        { time: "14:18", label: "Offline", title: "The internet stopped. The sale did not.", description: "The operation stays safe locally. The cashier keeps working and synchronization returns with the connection.", tone: "offline" },
        { time: "18:35", label: "Inventory", title: "Low stock appears before the shelf is empty", description: "The manager sees the exception, checks movement, and prepares replenishment without a manual walk-through.", tone: "inventory" },
        { time: "22:04", label: "Closing", title: "The day closes as one clear picture", description: "Revenue, shift totals, discrepancies, and store movement are ready for the owner without another spreadsheet.", tone: "closing" },
      ],
      rolesTitle: "One system. Three different views.",
      rolesIntro: "DinoPOS does not make everyone work inside the same overloaded interface.",
      roleCards: [
        { role: "Cashier", title: "Complete a sale quickly", description: "Only the current receipt, products, payment, and shift status." },
        { role: "Manager", title: "See what needs attention", description: "Inventory, returns, cash operations, and store tasks." },
        { role: "Owner", title: "Understand the business without assembling a report", description: "Sales, margin, and store comparison in one picture." },
      ],
      founderKicker: "Why we are building this",
      founderQuote: "A good register should not keep reminding you it exists. It simply helps the store move calmly through the day — even when something around it goes off plan.",
      founderName: "The DinoPOS team",
      pilotTitle: "Let’s run the first shift together",
      pilotDescription: "We map the store workflow, prepare the catalog, and configure the workspace. No hundred-slide presentation and no months-long implementation.",
      pilotFeatures: ["Map the current workflow", "Prepare products and roles", "Support the first shifts"],
    },
  },
  contactEmail: "hello@dinopos.uz",
  contactPhone: "+998 90 000 00 00",
  contactTelegram: "@dinopos",
};

export const marketingUi = {
  ru: {
    nav: ["О смене", "Для команды", "Пилот"],
    live: "Смена в работе",
    status: "Система готова",
    currentSale: "Текущая продажа",
    total: "Итого",
    paid: "Оплата принята",
    synced: "Все операции синхронизированы",
    offline: "Работа без сети",
    lowStock: "Требует пополнения",
    dayResult: "Итог дня",
    orders: "Продаж",
    revenue: "Выручка",
    form: { name: "Как к вам обращаться?", phone: "Телефон или Telegram", business: "Название магазина", city: "Город", count: "Сколько торговых точек?", message: "Что сейчас больше всего мешает работе?", submit: "Обсудить пилот", sending: "Отправляем…", success: "Спасибо. Свяжемся лично и без рассылки.", error: "API заявок ещё не подключён. Можно написать напрямую:", consent: "Ответим лично. Никакой автоматической рассылки." },
    footer: "Создано для реального ритма магазинов Узбекистана.",
  },
  uz: {
    nav: ["Smena haqida", "Jamoa uchun", "Pilot"], live: "Smena ishlamoqda", status: "Tizim tayyor", currentSale: "Joriy savdo", total: "Jami", paid: "To‘lov qabul qilindi", synced: "Barcha amallar sinxronlandi", offline: "Tarmoqsiz ishlash", lowStock: "To‘ldirish kerak", dayResult: "Kun yakuni", orders: "Savdo", revenue: "Tushum",
    form: { name: "Sizga qanday murojaat qilamiz?", phone: "Telefon yoki Telegram", business: "Do‘kon nomi", city: "Shahar", count: "Nechta savdo nuqtasi bor?", message: "Hozir ishga eng ko‘p nima xalaqit beradi?", submit: "Pilotni muhokama qilish", sending: "Yuborilmoqda…", success: "Rahmat. Shaxsan bog‘lanamiz, tarqatmasiz.", error: "Arizalar API’si hali ulanmagan. To‘g‘ridan-to‘g‘ri yozing:", consent: "Shaxsan javob beramiz. Avtomatik tarqatma yo‘q." }, footer: "O‘zbekiston do‘konlarining haqiqiy ritmi uchun yaratilgan.",
  },
  en: {
    nav: ["The shift", "For the team", "Pilot"], live: "Shift in progress", status: "System ready", currentSale: "Current sale", total: "Total", paid: "Payment accepted", synced: "All operations synchronized", offline: "Working offline", lowStock: "Replenishment needed", dayResult: "Day result", orders: "Sales", revenue: "Revenue",
    form: { name: "What should we call you?", phone: "Phone or Telegram", business: "Store name", city: "City", count: "How many locations?", message: "What gets in the way of work today?", submit: "Discuss a pilot", sending: "Sending…", success: "Thank you. We will reply personally, with no mailing list.", error: "The lead API is not connected yet. Contact us directly:", consent: "A personal reply. No automated mailing list." }, footer: "Made for the real rhythm of Uzbekistan’s stores.",
  },
} as const;
