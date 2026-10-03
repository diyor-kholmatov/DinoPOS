import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleCheck,
  CloudOff,
  Package,
  ReceiptText,
  ScanLine,
  Sparkles,
  Store,
  UserRound,
  Wifi,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { createLead, loadPublicContent, marketingApiUrl } from "./marketing-api";
import {
  defaultMarketingContent,
  marketingUi,
  type MarketingContent,
  type MarketingLocale,
  type ShiftEvent,
} from "./marketing-content";
import "./marketing.css";

const locales: MarketingLocale[] = ["ru", "uz", "en"];

function DinoMark() {
  return <span className="marketing-brand-mark" aria-hidden="true"><i /><i /></span>;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ReceiptScene({ locale }: { locale: MarketingLocale }) {
  const ui = marketingUi[locale];
  const products = locale === "uz"
    ? [["Donli qahva", "58 000"], ["Sut 1 l", "14 500"], ["Kruassan", "18 000"]]
    : locale === "en"
      ? [["Coffee beans", "58 000"], ["Milk 1 L", "14 500"], ["Croissant", "18 000"]]
      : [["Кофе в зёрнах", "58 000"], ["Молоко 1 л", "14 500"], ["Круассан", "18 000"]];

  return (
    <div className="hero-scene" aria-label="DinoPOS checkout in progress">
      <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      <div className="counter-card">
        <header><span><i />{ui.live}</span><b>11:42</b></header>
        <div className="counter-search"><ScanLine size={17} /><span>Barcode / SKU / product</span><kbd>F2</kbd></div>
        <div className="counter-items">
          {products.map(([name, price], index) => <div key={name}><span>{index + 1}</span><strong>{name}</strong><small>1 × {price}</small><b>{price}</b></div>)}
        </div>
        <div className="counter-total"><span>{ui.total}</span><strong>90 500 <small>UZS</small></strong></div>
        <button type="button"><span>{ui.paid}</span><ArrowRight size={17} /></button>
      </div>
      <div className="receipt-paper">
        <span className="receipt-pin"><ReceiptText size={16} /></span>
        <small>DINOPOS · #00482</small><h3>{ui.paid}</h3>
        <div>{products.map(([name, price]) => <p key={name}><span>{name}</span><b>{price}</b></p>)}</div>
        <p className="receipt-sum"><span>{ui.total}</span><b>90 500 UZS</b></p>
        <span className="receipt-sync"><CircleCheck size={13} />{ui.synced}</span>
      </div>
      <div className="hero-note note-online"><Wifi size={14} /><span>{ui.status}</span></div>
      <div className="hero-note note-speed"><Sparkles size={14} /><span>3 actions</span></div>
    </div>
  );
}

function ShiftScreen({ event, locale }: { event: ShiftEvent; locale: MarketingLocale }) {
  const ui = marketingUi[locale];
  const commonHeader = <header className="shift-ui-header"><span><DinoMark /><b>DinoPOS</b></span><div><i />{ui.live}<strong>{event.time}</strong></div></header>;

  if (event.tone === "opening") return <div className="shift-ui opening-ui">{commonHeader}<div className="shift-ui-center"><span className="shift-icon"><Store size={28} /></span><small>{event.label}</small><h3>{event.title}</h3><dl><div><dt>Cash float</dt><dd>250 000 UZS</dd></div><div><dt>Register</dt><dd>POS · 01</dd></div><div><dt>Status</dt><dd className="positive">Ready</dd></div></dl><button type="button">{locale === "ru" ? "Открыть смену" : locale === "uz" ? "Smenani ochish" : "Open shift"}</button></div></div>;

  if (event.tone === "rush") return <div className="shift-ui rush-ui">{commonHeader}<div className="rush-body"><section><div className="shift-search"><ScanLine size={17} /> Barcode / SKU / product</div><div className="product-tiles">{[["CF","Coffee","58 000"],["ML","Milk","14 500"],["CR","Croissant","18 000"],["WT","Water","6 000"]].map((item) => <div key={item[0]}><span>{item[0]}</span><b>{item[1]}</b><small>{item[2]} UZS</small></div>)}</div></section><aside><small>{ui.currentSale}</small><h3>3 items</h3><div className="rush-lines"><p>Coffee <b>58 000</b></p><p>Milk <b>14 500</b></p><p>Croissant <b>18 000</b></p></div><div className="rush-total"><span>{ui.total}</span><strong>90 500</strong></div><button type="button">{ui.paid}<ArrowRight size={15} /></button></aside></div></div>;

  if (event.tone === "offline") return <div className="shift-ui offline-ui">{commonHeader}<div className="offline-signal"><CloudOff size={19} /><span>{ui.offline}</span><b>14:18</b></div><div className="offline-sale"><small>SALE · #00617</small><span className="offline-check"><Check size={26} /></span><h3>{ui.paid}</h3><strong>126 000 UZS</strong><p>{locale === "ru" ? "Операция сохранена на этом устройстве" : locale === "uz" ? "Amal ushbu qurilmada saqlandi" : "Operation saved on this device"}</p></div><div className="sync-queue"><span><i />1</span><p><b>{locale === "ru" ? "В очереди синхронизации" : locale === "uz" ? "Sinxronlash navbatida" : "Waiting to synchronize"}</b><small>{locale === "ru" ? "Отправим автоматически после восстановления связи" : locale === "uz" ? "Aloqa tiklanganda avtomatik yuboriladi" : "Will send automatically when the connection returns"}</small></p></div></div>;

  if (event.tone === "inventory") return <div className="shift-ui inventory-ui">{commonHeader}<div className="inventory-title"><span><Package size={19} /></span><div><small>{ui.lowStock}</small><h3>3 products</h3></div></div><div className="inventory-list">{[["Face Cream","Beauty World","0"],["Matcha Syrup","Tea Imports","1"],["Sneaker Cleaner Kit","Urban Kicks","1"]].map(([name,supplier,count], index) => <div key={name}><span className={`stock-dot stock-${index}`} /><p><b>{name}</b><small>{supplier}</small></p><strong>{count}</strong><button type="button">{locale === "ru" ? "Пополнить" : locale === "uz" ? "To‘ldirish" : "Replenish"}</button></div>)}</div></div>;

  return <div className="shift-ui closing-ui">{commonHeader}<div className="closing-heading"><small>{ui.dayResult}</small><h3>22:04 · Downtown Store</h3></div><div className="closing-kpis"><div><span>{ui.revenue}</span><strong>12 480 500</strong><small>UZS</small></div><div><span>{ui.orders}</span><strong>47</strong><small>+8 today</small></div><div><span>Variance</span><strong>0</strong><small className="positive">Perfect</small></div></div><div className="closing-chart"><span style={{ height: "42%" }} /><span style={{ height: "68%" }} /><span style={{ height: "54%" }} /><span style={{ height: "82%" }} /><span style={{ height: "73%" }} /><span style={{ height: "100%" }} /><span style={{ height: "88%" }} /></div><div className="closing-foot"><CircleCheck size={15} />{ui.synced}</div></div>;
}

export function MarketingPage() {
  const [locale, setLocale] = useState<MarketingLocale>("ru");
  const [content, setContent] = useState<MarketingContent>(defaultMarketingContent);
  const [activeShift, setActiveShift] = useState(0);
  const [activeRole, setActiveRole] = useState(0);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const storyRef = useRef<HTMLElement>(null);
  const current = content.locales[locale];
  const ui = marketingUi[locale];

  useEffect(() => {
    document.documentElement.dataset.theme = "light";
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    if (!marketingApiUrl) return;
    const controller = new AbortController();
    void loadPublicContent(controller.signal).then(setContent).catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const nodes = storyRef.current?.querySelectorAll<HTMLElement>("[data-shift-index]");
    if (!nodes?.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveShift(Number((visible.target as HTMLElement).dataset.shiftIndex));
    }, { rootMargin: "-30% 0px -42%", threshold: [0, .25, .5, .75] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [current.shiftEvents]);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await createLead({ ...values, storeCount: Number(values.storeCount || 1), contactMethod: "TELEGRAM", locale });
      form.reset();
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <div className="marketing-site">
      <header className="marketing-header">
        <a className="marketing-brand" href="#top" aria-label="DinoPOS"><DinoMark /><strong>DinoPOS</strong></a>
        <nav aria-label="Primary navigation"><a href="#shift">{ui.nav[0]}</a><a href="#roles">{ui.nav[1]}</a><a href="#pilot">{ui.nav[2]}</a></nav>
        <div className="marketing-header-actions"><div className="marketing-locale" aria-label="Language">{locales.map((item) => <button className={locale === item ? "active" : ""} key={item} onClick={() => setLocale(item)} type="button">{item.toUpperCase()}</button>)}</div><button className="marketing-quiet-cta" onClick={() => scrollTo("pilot")} type="button">{current.secondaryCta}<ArrowRight size={14} /></button></div>
      </header>

      <main>
        <section className="marketing-hero" id="top">
          <div className="hero-copy"><span className="marketing-eyebrow"><i />{current.eyebrow}</span><h1>{current.heroTitle}</h1><p>{current.heroDescription}</p><div className="hero-actions"><button className="marketing-primary-button large" onClick={() => scrollTo("shift")} type="button">{current.primaryCta}<ArrowDown size={17} /></button><button className="marketing-text-button" onClick={() => scrollTo("pilot")} type="button">{current.secondaryCta}<ArrowRight size={16} /></button></div><div className="hero-signature"><span>08:57</span><i /><span>22:04</span><p>{locale === "ru" ? "Одна смена. Все операции на своих местах." : locale === "uz" ? "Bitta smena. Barcha amallar o‘z joyida." : "One shift. Every operation in its place."}</p></div></div>
          <ReceiptScene locale={locale} />
        </section>

        <section className="shift-story" id="shift" ref={storyRef}>
          <div className="story-intro"><span>{current.storyKicker}</span><h2>{current.storyTitle}</h2><p>{current.storyDescription}</p></div>
          <div className="story-grid">
            <div className="shift-stage"><div className="shift-stage-time"><span>{current.shiftEvents[activeShift]?.time}</span><i /></div><ShiftScreen event={current.shiftEvents[activeShift] ?? current.shiftEvents[0]!} locale={locale} /><p className="shift-caption"><span>0{activeShift + 1}</span>{current.shiftEvents[activeShift]?.label}</p></div>
            <div className="shift-timeline">{current.shiftEvents.map((event, index) => <article className={activeShift === index ? "active" : ""} data-shift-index={index} key={`${event.time}-${event.tone}`} onMouseEnter={() => setActiveShift(index)}><button type="button" onClick={() => setActiveShift(index)} aria-label={`${event.time}: ${event.title}`}><span className="event-time">{event.time}</span><div><small>{event.label}</small><h3>{event.title}</h3><p>{event.description}</p></div><i /></button></article>)}</div>
          </div>
        </section>

        <section className="role-story" id="roles">
          <div className="role-heading"><span>DINOPOS / TEAM</span><h2>{current.rolesTitle}</h2><p>{current.rolesIntro}</p></div>
          <div className="role-layout"><div className="role-tabs">{current.roleCards.map((role, index) => <button className={activeRole === index ? "active" : ""} key={role.role} onClick={() => setActiveRole(index)} type="button"><span>0{index + 1}</span><strong>{role.role}</strong><ArrowRight size={16} /></button>)}</div><div className="role-focus"><div className="role-person"><span><UserRound size={22} /></span><small>{current.roleCards[activeRole]?.role}</small></div><h3>{current.roleCards[activeRole]?.title}</h3><p>{current.roleCards[activeRole]?.description}</p><div className={`role-product role-${activeRole}`}><span /><span /><span /><span /></div></div></div>
        </section>

        <section className="founder-note"><div className="founder-mark"><DinoMark /><span>DinoPOS</span></div><div><span>{current.founderKicker}</span><blockquote>“{current.founderQuote}”</blockquote><p>— {current.founderName}</p></div></section>

        <section className="marketing-contact" id="pilot">
          <div className="contact-copy"><span>FIRST SHIFT / PILOT</span><h2>{current.pilotTitle}</h2><p>{current.pilotDescription}</p><ul>{current.pilotFeatures.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul><div className="contact-direct"><a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a><a href={`tel:${content.contactPhone.replace(/\s/g, "")}`}>{content.contactPhone}</a><span>{content.contactTelegram}</span></div></div>
          <form onSubmit={submitLead}><div className="form-intro"><span>01</span><p>{locale === "ru" ? "Расскажите немного о магазине" : locale === "uz" ? "Do‘kon haqida qisqacha ayting" : "Tell us a little about the store"}</p></div><label>{ui.form.name}<input name="name" required /></label><label>{ui.form.phone}<input name="phone" required type="text" placeholder="+998 / @telegram" /></label><label>{ui.form.business}<input name="businessName" required /></label><label>{ui.form.city}<input name="city" /></label><label>{ui.form.count}<input defaultValue="1" min="1" name="storeCount" type="number" /></label><label className="wide">{ui.form.message}<textarea name="message" rows={3} /></label><div className="form-action"><button className="marketing-primary-button large" disabled={submitState === "sending"} type="submit">{submitState === "sending" ? ui.form.sending : ui.form.submit}<ArrowRight size={17} /></button><small>{ui.form.consent}</small></div>{submitState === "success" ? <p className="form-message success" role="status">{ui.form.success}</p> : null}{submitState === "error" ? <p className="form-message error" role="alert">{ui.form.error} <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></p> : null}</form>
        </section>
      </main>

      <footer className="marketing-footer"><a className="marketing-brand" href="#top"><DinoMark /><strong>DinoPOS</strong></a><p>{ui.footer}</p><span>© 2026</span></footer>
    </div>
  );
}
