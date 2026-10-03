export type MarketingLocale = "ru" | "uz" | "en";

export type LocalizedMarketingContent = {
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  problemTitle: string;
  solutionTitle: string;
  finalCtaTitle: string;
  finalCtaDescription: string;
};

export type MarketingContent = {
  locales: Record<MarketingLocale, LocalizedMarketingContent>;
  starterPrice: string;
  standardPrice: string;
  proPrice: string;
  contactEmail: string;
};

export const defaultMarketingContent: MarketingContent = {
  locales: {
    ru: {
      eyebrow: "Retail OS для магазинов Узбекистана",
      heroTitle: "Продажи продолжаются, даже когда интернет — нет.",
      heroDescription:
        "DinoPOS объединяет кассу, склад, клиентов и операционную аналитику в одной системе. Команда работает быстрее, а владелец видит бизнес целиком.",
      primaryCta: "Обсудить пилот",
      secondaryCta: "Открыть продукт",
      problemTitle: "Магазину нужна система, которая выдерживает реальный рабочий день.",
      solutionTitle: "Одна спокойная система для ежедневной торговли.",
      finalCtaTitle: "Запустим DinoPOS в вашем магазине",
      finalCtaDescription:
        "Оставьте контакты — разберём процессы, подготовим данные и запустим пилот без затяжного внедрения.",
    },
    uz: {
      eyebrow: "O‘zbekiston do‘konlari uchun Retail OS",
      heroTitle: "Internet to‘xtasa ham savdo davom etadi.",
      heroDescription:
        "DinoPOS kassa, ombor, mijozlar va operatsion tahlilni bitta tizimda birlashtiradi. Jamoa tezroq ishlaydi, egasi esa biznesni to‘liq ko‘radi.",
      primaryCta: "Pilotni muhokama qilish",
      secondaryCta: "Mahsulotni ochish",
      problemTitle: "Do‘konga haqiqiy ish kuniga bardosh beradigan tizim kerak.",
      solutionTitle: "Kundalik savdo uchun yagona va ishonchli tizim.",
      finalCtaTitle: "DinoPOS’ni do‘koningizda ishga tushiramiz",
      finalCtaDescription:
        "Kontaktlaringizni qoldiring — jarayonlarni o‘rganamiz, ma’lumotlarni tayyorlaymiz va uzoq joriy etishsiz pilotni boshlaymiz.",
    },
    en: {
      eyebrow: "Retail OS for Uzbekistan’s stores",
      heroTitle: "Sales keep moving, even when the internet does not.",
      heroDescription:
        "DinoPOS brings checkout, inventory, customers, and operational analytics into one system. Teams move faster while owners see the whole business.",
      primaryCta: "Discuss a pilot",
      secondaryCta: "Open the product",
      problemTitle: "A store needs a system built for the reality of every working day.",
      solutionTitle: "One calm system for everyday retail operations.",
      finalCtaTitle: "Let’s launch DinoPOS in your store",
      finalCtaDescription:
        "Leave your details and we will map the workflow, prepare the data, and launch a focused pilot without a drawn-out implementation.",
    },
  },
  starterPrice: "$29",
  standardPrice: "$59",
  proPrice: "$99",
  contactEmail: "hello@dinopos.uz",
};

export const marketingCopy = {
  ru: {
    nav: ["Возможности", "Продукт", "Запуск", "Тарифы"],
    demo: "Демо продукта",
    trust: ["Работа без сети", "RU · UZ · EN", "Единые данные"],
    problemBody:
      "Очередь на кассе, ручные остатки и разрозненные отчёты крадут время каждый день. DinoPOS спроектирован вокруг реальности локального ритейла: нестабильной связи, доступного оборудования и длинных смен.",
    advantages: [
      ["01", "Касса не зависит от сети", "Продажа завершается локально. Данные сохраняются и синхронизируются после восстановления связи."],
      ["02", "Операции связаны", "Продажи, возвраты, смены, товары и остатки используют одну понятную модель данных."],
      ["03", "Владелец видит картину", "Дашборд собирает выручку, маржу, динамику точек и исключения, требующие внимания."],
    ],
    productKicker: "Продукт",
    productTitle: "От первой продажи до полной картины бизнеса",
    modules: ["Касса и оплаты", "Товары и штрихкоды", "Остатки и поставки", "Клиенты и лояльность", "Смены и кассовые операции", "Отчёты и аналитика"],
    metrics: [["≤ 3", "действий на ключевую задачу"], ["< 300 мс", "цель добавления товара"], ["3", "языка интерфейса"]],
    launchKicker: "Пилот",
    launchTitle: "Запуск без многомесячного внедрения",
    steps: [
      ["01", "Разбираем процессы", "Фиксируем кассы, каталог, роли и текущие ограничения."],
      ["02", "Готовим магазин", "Импортируем товары, настраиваем рабочие места и команду."],
      ["03", "Запускаем продажи", "Проводим первые смены и остаёмся рядом с пользователями."],
    ],
    pricingKicker: "Тарифы",
    pricingTitle: "Понятная цена по мере роста",
    monthly: "/ месяц",
    pilotNote: "Финальные условия фиксируются после пилота.",
    plans: [
      ["Starter", "Одна торговая точка", ["Касса и продажи", "Базовый склад", "1 касса · 1 пользователь"]],
      ["Standard", "Растущий магазин", ["Всё из Starter", "CRM и лояльность", "До 5 пользователей", "Расширенные отчёты"]],
      ["Pro", "Сеть магазинов", ["Всё из Standard", "До 10 торговых точек", "Неограниченные пользователи", "Приоритетная поддержка"]],
    ],
    popular: "Для роста",
    form: { name: "Имя", phone: "Телефон", business: "Название магазина", city: "Город", count: "Количество точек", message: "Что важно учесть?", submit: "Обсудить пилот", sending: "Отправляем…", success: "Заявка отправлена. Скоро свяжемся.", error: "API заявок ещё не опубликован. Напишите нам:", consent: "Отправляя форму, вы соглашаетесь на связь по указанным контактам." },
    footer: "Касса и управление магазином для Узбекистана.",
  },
  uz: {
    nav: ["Imkoniyatlar", "Mahsulot", "Ishga tushirish", "Tariflar"],
    demo: "Mahsulot demosini ko‘rish",
    trust: ["Tarmoqsiz ishlash", "RU · UZ · EN", "Yagona ma’lumotlar"],
    problemBody: "Kassadagi navbat, qo‘lda yuritiladigan qoldiq va tarqoq hisobotlar har kuni vaqtni oladi. DinoPOS mahalliy retailning haqiqiy sharoitlari — beqaror aloqa, mavjud uskunalar va uzoq smenalar uchun yaratilgan.",
    advantages: [["01", "Kassa tarmoqqa bog‘liq emas", "Savdo lokal yakunlanadi. Ma’lumotlar saqlanib, aloqa tiklanganda sinxronlanadi."], ["02", "Operatsiyalar bog‘langan", "Savdo, qaytarish, smena, mahsulot va qoldiq bitta tushunarli ma’lumot modelidan foydalanadi."], ["03", "Egasi umumiy holatni ko‘radi", "Dashboard tushum, marja, nuqtalar dinamikasi va e’tibor talab qiladigan holatlarni ko‘rsatadi."]],
    productKicker: "Mahsulot", productTitle: "Birinchi savdodan biznesning to‘liq ko‘rinishigacha",
    modules: ["Kassa va to‘lovlar", "Mahsulot va shtrixkodlar", "Qoldiq va yetkazmalar", "Mijoz va sodiqlik", "Smena va kassa operatsiyalari", "Hisobot va tahlil"],
    metrics: [["≤ 3", "asosiy vazifa uchun amal"], ["< 300 ms", "tovar qo‘shish maqsadi"], ["3", "interfeys tili"]],
    launchKicker: "Pilot", launchTitle: "Ko‘p oylik joriy etishsiz ishga tushirish",
    steps: [["01", "Jarayonlarni o‘rganamiz", "Kassalar, katalog, rollar va mavjud cheklovlarni aniqlaymiz."], ["02", "Do‘konni tayyorlaymiz", "Mahsulotlarni import qilib, ish joylari va jamoani sozlaymiz."], ["03", "Savdoni boshlaymiz", "Birinchi smenalarni o‘tkazib, foydalanuvchilar bilan birga qolamiz."]],
    pricingKicker: "Tariflar", pricingTitle: "O‘sishga mos tushunarli narx", monthly: "/ oy", pilotNote: "Yakuniy shartlar pilotdan so‘ng belgilanadi.",
    plans: [["Starter", "Bitta savdo nuqtasi", ["Kassa va savdo", "Asosiy ombor", "1 kassa · 1 foydalanuvchi"]], ["Standard", "O‘sayotgan do‘kon", ["Starter’dagi hamma narsa", "CRM va sodiqlik", "5 tagacha foydalanuvchi", "Kengaytirilgan hisobotlar"]], ["Pro", "Do‘konlar tarmog‘i", ["Standard’dagi hamma narsa", "10 tagacha savdo nuqtasi", "Cheksiz foydalanuvchi", "Ustuvor yordam"]]],
    popular: "O‘sish uchun",
    form: { name: "Ism", phone: "Telefon", business: "Do‘kon nomi", city: "Shahar", count: "Nuqtalar soni", message: "Nimani hisobga olish muhim?", submit: "Pilotni muhokama qilish", sending: "Yuborilmoqda…", success: "Ariza yuborildi. Tez orada bog‘lanamiz.", error: "Arizalar API’si hali chop etilmagan. Bizga yozing:", consent: "Formani yuborib, ko‘rsatilgan kontakt orqali bog‘lanishga rozilik bildirasiz." },
    footer: "O‘zbekiston uchun kassa va do‘kon boshqaruvi.",
  },
  en: {
    nav: ["Capabilities", "Product", "Launch", "Pricing"], demo: "Product demo", trust: ["Offline operation", "RU · UZ · EN", "One data model"],
    problemBody: "Checkout queues, manual stock counts, and disconnected reports cost time every day. DinoPOS is designed around local retail reality: unstable networks, practical hardware, and long shifts.",
    advantages: [["01", "Checkout is network-independent", "Sales complete locally. Data remains safe and synchronizes when connectivity returns."], ["02", "Operations stay connected", "Sales, returns, shifts, products, and inventory use one clear data model."], ["03", "Owners see the whole picture", "The dashboard brings together revenue, margin, location performance, and exceptions that need attention."]],
    productKicker: "Product", productTitle: "From the first sale to the full business picture", modules: ["Checkout and payments", "Products and barcodes", "Stock and supplies", "Customers and loyalty", "Shifts and cash operations", "Reports and analytics"],
    metrics: [["≤ 3", "actions for a key task"], ["< 300 ms", "add-to-cart target"], ["3", "interface languages"]],
    launchKicker: "Pilot", launchTitle: "Launch without months of implementation", steps: [["01", "Map the workflow", "We capture registers, catalog, roles, and current constraints."], ["02", "Prepare the store", "We import products and configure workstations and the team."], ["03", "Start selling", "We run the first shifts and stay close to users."]],
    pricingKicker: "Pricing", pricingTitle: "Clear pricing as you grow", monthly: "/ month", pilotNote: "Final commercial terms are confirmed after the pilot.", plans: [["Starter", "One retail location", ["Checkout and sales", "Core inventory", "1 register · 1 user"]], ["Standard", "A growing store", ["Everything in Starter", "CRM and loyalty", "Up to 5 users", "Advanced reports"]], ["Pro", "Retail networks", ["Everything in Standard", "Up to 10 locations", "Unlimited users", "Priority support"]]], popular: "For growth",
    form: { name: "Name", phone: "Phone", business: "Store name", city: "City", count: "Number of locations", message: "What should we consider?", submit: "Discuss a pilot", sending: "Sending…", success: "Request sent. We will be in touch soon.", error: "The lead API is not published yet. Email us:", consent: "By submitting, you agree that we may contact you using the details provided." },
    footer: "Checkout and store operations for Uzbekistan.",
  },
} as const;
