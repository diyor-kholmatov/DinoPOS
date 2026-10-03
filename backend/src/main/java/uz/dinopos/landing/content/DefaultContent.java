package uz.dinopos.landing.content;

import java.util.LinkedHashMap;
import java.util.Map;

final class DefaultContent {
    private DefaultContent() {}

    static SiteContentDto value() {
        Map<String, LocalizedContentDto> locales = new LinkedHashMap<>();
        locales.put("ru", new LocalizedContentDto(
            "Retail OS для магазинов Узбекистана",
            "Продажи продолжаются, даже когда интернет — нет.",
            "DinoPOS объединяет кассу, склад, клиентов и операционную аналитику в одной системе. Команда работает быстрее, а владелец видит бизнес целиком.",
            "Обсудить пилот", "Открыть продукт",
            "Магазину нужна система, которая выдерживает реальный рабочий день.",
            "Одна спокойная система для всей ежедневной торговли.",
            "Запустим DinoPOS в вашем магазине",
            "Оставьте контакты — обсудим процессы магазина и подготовим пилот без лишней бюрократии."
        ));
        locales.put("uz", new LocalizedContentDto(
            "O‘zbekiston do‘konlari uchun Retail OS",
            "Internet to‘xtasa ham savdo davom etadi.",
            "DinoPOS kassa, ombor, mijozlar va operatsion tahlilni bitta tizimda birlashtiradi. Jamoa tezroq ishlaydi, egasi esa biznesni to‘liq ko‘radi.",
            "Pilotni muhokama qilish", "Mahsulotni ochish",
            "Do‘konga haqiqiy ish kuniga bardosh beradigan tizim kerak.",
            "Kundalik savdo uchun yagona va ishonchli tizim.",
            "DinoPOS’ni do‘koningizda ishga tushiramiz",
            "Kontaktlaringizni qoldiring — jarayonlaringizni muhokama qilib, ortiqcha byurokratiyasiz pilot tayyorlaymiz."
        ));
        locales.put("en", new LocalizedContentDto(
            "Retail OS for Uzbekistan’s stores",
            "Sales keep moving, even when the internet does not.",
            "DinoPOS brings checkout, inventory, customers, and operational analytics into one system. Teams move faster while owners see the whole business.",
            "Discuss a pilot", "Open the product",
            "A store needs a system built for the reality of every working day.",
            "One calm system for everyday retail operations.",
            "Let’s launch DinoPOS in your store",
            "Leave your details and we’ll map your workflow and prepare a low-friction pilot."
        ));
        return new SiteContentDto(locales, "$29", "$59", "$99", "hello@dinopos.uz");
    }
}
