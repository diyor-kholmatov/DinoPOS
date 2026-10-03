import {
  ArrowRight,
  BarChart3,
  Check,
  CircleCheck,
  CloudOff,
  PackageSearch,
  ScanLine,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createLead, loadPublicContent, marketingApiUrl } from "./marketing-api";
import {
  defaultMarketingContent,
  marketingCopy,
  type MarketingContent,
  type MarketingLocale,
} from "./marketing-content";
import "./marketing.css";

const localeOptions: MarketingLocale[] = ["ru", "uz", "en"];
const moduleIcons = [ScanLine, PackageSearch, Store, Users, ShieldCheck, BarChart3];

function DinoMark() {
  return (
    <span className="marketing-brand-mark" aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function scrollToLeadForm() {
  document.getElementById("pilot")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ProductPreview({ locale }: { locale: MarketingLocale }) {
  const labels = {
    ru: { stores: "Все магазины", sales: "Продажи", summary: "За период", orders: "Заказы", avg: "Средний чек", margin: "Маржа", attention: "Требует внимания", performance: "Результаты точек", newSale: "Новая продажа" },
    uz: { stores: "Barcha do‘konlar", sales: "Savdo", summary: "Davr bo‘yicha", orders: "Buyurtmalar", avg: "O‘rtacha chek", margin: "Marja", attention: "E’tibor talab qiladi", performance: "Nuqtalar natijasi", newSale: "Yangi savdo" },
    en: { stores: "All stores", sales: "Sales", summary: "Period summary", orders: "Orders", avg: "Average order", margin: "Profit margin", attention: "Needs attention", performance: "Store performance", newSale: "New sale" },
  }[locale];

  return (
    <div className="marketing-product-frame" aria-label="DinoPOS dashboard preview">
      <div className="preview-sidebar">
        <div className="preview-logo"><DinoMark /><b>DinoPOS</b></div>
        {['Dashboard', 'Checkout', 'Catalog', 'Inventory', 'Customers', 'Reports'].map((item, index) => (
          <div className={index === 0 ? "preview-nav active" : "preview-nav"} key={item}>
            <span>{index === 0 ? "◔" : "○"}</span>{item}
          </div>
        ))}
        <div className="preview-user">LJ&nbsp;&nbsp; Liam Johnson</div>
      </div>
      <div className="preview-main">
        <header><strong>{labels.stores}</strong><button type="button">＋ {labels.newSale}</button></header>
        <div className="preview-filters"><span>Yesterday</span><span>Today</span><span>Week</span><b>Year</b><span>Aug 2025 — Aug 2026</span></div>
        <section className="preview-analytics">
          <div className="preview-chart">
            <span className="preview-label">{labels.sales}</span>
            <strong>1,638,275,775 <small>UZS</small></strong>
            <em>+7.6%</em>
            <div className="chart-area" aria-hidden="true">
              <svg viewBox="0 0 700 170" preserveAspectRatio="none">
                <path className="grid-line" d="M0 30H700 M0 85H700 M0 140H700" />
                <path className="line one" d="M0 72 C80 42 120 68 190 45 S290 92 370 64 S500 48 700 59" />
                <path className="line two" d="M0 110 C80 84 130 105 205 86 S310 127 390 106 S520 89 700 101" />
                <path className="line three" d="M0 137 C90 117 150 135 230 122 S350 147 440 128 S570 122 700 130" />
              </svg>
            </div>
          </div>
          <aside>
            <b>{labels.summary}</b>
            <dl><div><dt>{labels.orders}</dt><dd>4,574</dd></div><div><dt>{labels.avg}</dt><dd>358,171 UZS</dd></div><div><dt>{labels.margin}</dt><dd>42.9%</dd></div></dl>
          </aside>
        </section>
        <section className="preview-operations">
          <div><b>{labels.attention}</b><p><span>△</span> Face Cream <strong>0</strong></p><p><span>△</span> Matcha Syrup <strong>1</strong></p></div>
          <div><b>{labels.performance}</b><p>Downtown Store <strong>756,850,443</strong></p><p>Airport Kiosk <strong>545,965,361</strong></p></div>
        </section>
      </div>
    </div>
  );
}

export function MarketingPage() {
  const [locale, setLocale] = useState<MarketingLocale>("ru");
  const [content, setContent] = useState<MarketingContent>(defaultMarketingContent);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const t = marketingCopy[locale];
  const current = content.locales[locale];

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

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("sending");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await createLead({ ...values, storeCount: Number(values.storeCount || 1), locale });
      form.reset();
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <div className="marketing-site">
      <header className="marketing-header">
        <a className="marketing-brand" href="#top" aria-label="DinoPOS home"><DinoMark /><strong>DinoPOS</strong></a>
        <nav aria-label="Primary navigation">
          <a href="#capabilities">{t.nav[0]}</a><a href="#product">{t.nav[1]}</a><a href="#launch">{t.nav[2]}</a><a href="#pricing">{t.nav[3]}</a>
        </nav>
        <div className="marketing-header-actions">
          <div className="marketing-locale" aria-label="Language">
            {localeOptions.map((item) => <button className={locale === item ? "active" : ""} key={item} onClick={() => setLocale(item)} type="button">{item.toUpperCase()}</button>)}
          </div>
          <Link className="marketing-link-button header-demo" to="/dashboard">{t.demo}</Link>
          <button className="marketing-primary-button" onClick={scrollToLeadForm} type="button">{current.primaryCta}</button>
        </div>
      </header>

      <main>
        <section className="marketing-hero" id="top">
          <div className="hero-copy">
            <span className="marketing-eyebrow"><i />{current.eyebrow}</span>
            <h1>{current.heroTitle}</h1>
            <p>{current.heroDescription}</p>
            <div className="hero-actions">
              <button className="marketing-primary-button large" onClick={scrollToLeadForm} type="button">{current.primaryCta}<ArrowRight size={17} /></button>
              <Link className="marketing-link-button large" to="/dashboard">{current.secondaryCta}</Link>
            </div>
            <div className="marketing-trust">
              {t.trust.map((item, index) => <span key={item}>{index === 0 ? <CloudOff size={16} /> : <Check size={16} />}{item}</span>)}
            </div>
          </div>
          <ProductPreview locale={locale} />
        </section>

        <section className="marketing-problem" id="capabilities">
          <div><span className="section-index">01 / WHY DINOPOS</span><h2>{current.problemTitle}</h2></div>
          <p>{t.problemBody}</p>
        </section>
        <section className="marketing-advantages">
          {t.advantages.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
        </section>

        <section className="marketing-product" id="product">
          <div className="section-heading"><span className="section-index">02 / {t.productKicker}</span><h2>{current.solutionTitle}</h2><p>{t.productTitle}</p></div>
          <div className="module-board">
            <div className="module-list">
              {t.modules.map((module, index) => {
                const Icon = moduleIcons[index] ?? Store;
                return <div key={module}><Icon size={19} /><strong>{module}</strong><span>0{index + 1}</span></div>;
              })}
            </div>
            <div className="module-message">
              <span>DINOPOS / RETAIL OS</span>
              <blockquote>“{t.productTitle}”</blockquote>
              <Link to="/dashboard">{t.demo}<ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="marketing-metrics">{t.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </section>

        <section className="marketing-launch" id="launch">
          <div className="section-heading"><span className="section-index">03 / {t.launchKicker}</span><h2>{t.launchTitle}</h2></div>
          <div className="launch-steps">{t.steps.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>

        <section className="marketing-pricing" id="pricing">
          <div className="section-heading"><span className="section-index">04 / {t.pricingKicker}</span><h2>{t.pricingTitle}</h2><p>{t.pilotNote}</p></div>
          <div className="pricing-grid">
            {t.plans.map(([name, description, features], index) => (
              <article className={index === 1 ? "featured" : ""} key={name}>
                {index === 1 ? <span className="plan-badge">{t.popular}</span> : null}
                <h3>{name}</h3><p>{description}</p><div className="plan-price"><strong>{[content.starterPrice, content.standardPrice, content.proPrice][index]}</strong><span>{t.monthly}</span></div>
                <ul>{features.map((feature) => <li key={feature}><CircleCheck size={17} />{feature}</li>)}</ul>
                <button className={index === 1 ? "marketing-primary-button" : "marketing-link-button"} onClick={scrollToLeadForm} type="button">{current.primaryCta}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="marketing-contact" id="pilot">
          <div className="contact-copy"><span className="section-index">05 / PILOT</span><h2>{current.finalCtaTitle}</h2><p>{current.finalCtaDescription}</p><a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></div>
          <form onSubmit={submitLead}>
            <label>{t.form.name}<input name="name" required /></label><label>{t.form.phone}<input name="phone" required type="tel" placeholder="+998 90 000 00 00" /></label>
            <label>{t.form.business}<input name="businessName" required /></label><label>{t.form.city}<input name="city" /></label>
            <label>{t.form.count}<input defaultValue="1" min="1" name="storeCount" type="number" /></label><label className="wide">{t.form.message}<textarea name="message" rows={3} /></label>
            <button className="marketing-primary-button large" disabled={submitState === "sending"} type="submit">{submitState === "sending" ? t.form.sending : t.form.submit}<ArrowRight size={17} /></button>
            <small>{t.form.consent}</small>
            {submitState === "success" ? <p className="form-message success" role="status">{t.form.success}</p> : null}
            {submitState === "error" ? <p className="form-message error" role="alert">{t.form.error} <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></p> : null}
          </form>
        </section>
      </main>

      <footer className="marketing-footer"><a className="marketing-brand" href="#top"><DinoMark /><strong>DinoPOS</strong></a><p>{t.footer}</p><div><Link to="/dashboard">{t.demo}</Link><Link to="/admin">Admin</Link></div></footer>
    </div>
  );
}
