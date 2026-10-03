package uz.dinopos.landing.content;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

final class DefaultContent {
    private DefaultContent() {}

    static SiteContentDto value() {
        Map<String, LocalizedContentDto> locales = new LinkedHashMap<>();
        locales.put("ru", new LocalizedContentDto(
            "Один рабочий день · один спокойный ритм",
            "Магазин работает в своём ритме.",
            "DinoPOS держит продажи, товары, смены и остатки в одном понятном рабочем пространстве — для кассира, управляющего и владельца.",
            "Посмотреть одну смену", "Обсудить пилот",
            "Одна смена с DinoPOS",
            "От открытия кассы до итогов дня — без разрывов между операциями.",
            "Пять обычных моментов магазина. Интерфейс меняется вместе со сменой и показывает каждому только то, что важно сейчас.",
            List.of(
                event("08:57", "Открытие", "Смена начинается без утренней суеты", "Кассир проверяет остаток денег, открывает смену и сразу видит готовность рабочего места.", "opening"),
                event("11:42", "Поток", "Товар попадает в чек за одно движение", "Сканер, быстрый поиск и крупные действия помогают не собирать очередь даже в час пик.", "rush"),
                event("14:18", "Нет сети", "Интернет пропал. Продажа — нет.", "Операция сохраняется локально. Кассир продолжает работу, а синхронизация возвращается вместе со связью.", "offline"),
                event("18:35", "Остатки", "Заканчивающийся товар замечен до пустой полки", "Управляющий видит исключение, проверяет движение и готовит пополнение без ручного обхода.", "inventory"),
                event("22:04", "Итог", "День закрывается одной понятной картиной", "Выручка, смена, расхождения и динамика точки готовы для владельца без отдельной таблицы.", "closing")
            ),
            "Одна система. Три разных взгляда.",
            "DinoPOS не заставляет всех работать в одном перегруженном интерфейсе.",
            List.of(
                role("Кассир", "Быстро провести продажу", "Только текущий чек, товары, оплата и состояние смены."),
                role("Управляющий", "Увидеть, что требует внимания", "Остатки, возвраты, кассовые операции и задачи точки."),
                role("Владелец", "Понять бизнес без сборки отчёта", "Продажи, маржа и сравнение магазинов в одной картине.")
            ),
            "Почему мы это строим",
            "Хорошая касса не должна напоминать о себе. Она просто помогает магазину спокойно прожить день — даже когда вокруг что-то идёт не по плану.",
            "Команда DinoPOS",
            "Давайте проживём первую смену вместе",
            "Разберём процессы магазина, подготовим каталог и настроим рабочее место. Без презентации на сто слайдов и многомесячного внедрения.",
            List.of("Разбор текущего процесса", "Подготовка товаров и ролей", "Сопровождение первых смен")
        ));

        locales.put("uz", new LocalizedContentDto(
            "Bitta ish kuni · bitta xotirjam ritm",
            "Do‘kon o‘z ritmida ishlaydi.",
            "DinoPOS savdo, mahsulot, smena va qoldiqlarni kassir, boshqaruvchi va egasi uchun bitta tushunarli ish maydonida birlashtiradi.",
            "Bitta smenani ko‘rish", "Pilotni muhokama qilish",
            "DinoPOS bilan bir smena",
            "Kassani ochishdan kun yakunigacha — operatsiyalar orasida uzilish yo‘q.",
            "Do‘konning beshta oddiy lahzasi. Interfeys smena bilan birga o‘zgaradi va har kimga ayni paytda muhim bo‘lganini ko‘rsatadi.",
            List.of(
                event("08:57", "Ochilish", "Smena ertalabki shoshilinchsiz boshlanadi", "Kassir pul qoldig‘ini tekshiradi, smenani ochadi va ish joyi tayyorligini darhol ko‘radi.", "opening"),
                event("11:42", "Oqim", "Mahsulot chekga bir harakatda qo‘shiladi", "Skaner, tezkor qidiruv va yirik amallar tig‘iz paytda ham navbatni ushlab turadi.", "rush"),
                event("14:18", "Tarmoq yo‘q", "Internet yo‘qoldi. Savdo esa yo‘qolmadi.", "Operatsiya lokal saqlanadi. Kassir ishlashda davom etadi, aloqa qaytganda sinxronlash tiklanadi.", "offline"),
                event("18:35", "Qoldiq", "Mahsulot tugashi bo‘sh javondan oldin seziladi", "Boshqaruvchi istisnoni ko‘radi, harakatni tekshiradi va qo‘lda aylanmasdan to‘ldirishni tayyorlaydi.", "inventory"),
                event("22:04", "Yakun", "Kun bitta tushunarli manzara bilan yopiladi", "Tushum, smena, farqlar va nuqta dinamikasi alohida jadvalsiz egaga tayyor.", "closing")
            ),
            "Bitta tizim. Uch xil qarash.",
            "DinoPOS hammani bitta ortiqcha yuklangan interfeysda ishlashga majburlamaydi.",
            List.of(
                role("Kassir", "Savdoni tez o‘tkazish", "Faqat joriy chek, mahsulotlar, to‘lov va smena holati."),
                role("Boshqaruvchi", "Nimaga e’tibor kerakligini ko‘rish", "Qoldiq, qaytarish, kassa amallari va nuqta vazifalari."),
                role("Egasi", "Hisobot yig‘masdan biznesni tushunish", "Savdo, marja va do‘konlarni bitta manzarada solishtirish.")
            ),
            "Nega biz buni quryapmiz",
            "Yaxshi kassa o‘zini eslatmasligi kerak. U atrofda nimadir reja bo‘yicha ketmasa ham, do‘konga kunni xotirjam o‘tkazishga yordam beradi.",
            "DinoPOS jamoasi",
            "Birinchi smenani birga o‘tkazamiz",
            "Do‘kon jarayonlarini o‘rganamiz, katalogni tayyorlaymiz va ish joyini sozlaymiz. Yuz slaydli taqdimot va ko‘p oylik joriy etishsiz.",
            List.of("Joriy jarayonni o‘rganish", "Mahsulot va rollarni tayyorlash", "Birinchi smenalarni qo‘llab-quvvatlash")
        ));

        locales.put("en", new LocalizedContentDto(
            "One working day · one calm rhythm",
            "The store moves at its own rhythm.",
            "DinoPOS keeps sales, products, shifts, and inventory in one clear workspace for the cashier, manager, and owner.",
            "See one shift", "Discuss a pilot",
            "One shift with DinoPOS",
            "From opening the register to the day’s result — without gaps between operations.",
            "Five ordinary moments in a store. The interface moves with the shift and shows each person what matters right now.",
            List.of(
                event("08:57", "Opening", "The shift starts without the morning scramble", "The cashier checks the float, opens the shift, and immediately sees that the workspace is ready.", "opening"),
                event("11:42", "Rush", "A product reaches the receipt in one move", "Scanning, fast search, and clear actions keep the queue moving through the busiest hour.", "rush"),
                event("14:18", "Offline", "The internet stopped. The sale did not.", "The operation stays safe locally. The cashier keeps working and synchronization returns with the connection.", "offline"),
                event("18:35", "Inventory", "Low stock appears before the shelf is empty", "The manager sees the exception, checks movement, and prepares replenishment without a manual walk-through.", "inventory"),
                event("22:04", "Closing", "The day closes as one clear picture", "Revenue, shift totals, discrepancies, and store movement are ready for the owner without another spreadsheet.", "closing")
            ),
            "One system. Three different views.",
            "DinoPOS does not make everyone work inside the same overloaded interface.",
            List.of(
                role("Cashier", "Complete a sale quickly", "Only the current receipt, products, payment, and shift status."),
                role("Manager", "See what needs attention", "Inventory, returns, cash operations, and store tasks."),
                role("Owner", "Understand the business without assembling a report", "Sales, margin, and store comparison in one picture.")
            ),
            "Why we are building this",
            "A good register should not keep reminding you it exists. It simply helps the store move calmly through the day — even when something around it goes off plan.",
            "The DinoPOS team",
            "Let’s run the first shift together",
            "We map the store workflow, prepare the catalog, and configure the workspace. No hundred-slide presentation and no months-long implementation.",
            List.of("Map the current workflow", "Prepare products and roles", "Support the first shifts")
        ));

        return new SiteContentDto(locales, "hello@dinopos.uz", "+998 90 000 00 00", "@dinopos");
    }

    private static ShiftEventDto event(String time, String label, String title, String description, String tone) {
        return new ShiftEventDto(time, label, title, description, tone);
    }

    private static RoleCardDto role(String role, String title, String description) {
        return new RoleCardDto(role, title, description);
    }
}
