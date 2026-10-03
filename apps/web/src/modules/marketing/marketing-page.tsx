import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { createLead, loadPublicContent, marketingApiUrl } from "./marketing-api";
import {
  defaultMarketingContent,
  marketingUi,
  type MarketingContent,
  type MarketingLocale,
  type ShiftTone,
} from "./marketing-content";
import "./marketing-landing.css";

const locales: MarketingLocale[] = ["ru", "uz", "en"];

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const sceneAssets: Record<ShiftTone, string> = {
  opening: publicAsset("product/checkout.png"),
  rush: publicAsset("product/checkout.png"),
  offline: publicAsset("product/checkout.png"),
  inventory: publicAsset("product/dashboard.png"),
  closing: publicAsset("product/dashboard.png"),
};

function DinoMark() {
  return (
    <span className="site-brand-mark" aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ProductFrame({
  alt,
  scene,
  reducedMotion,
}: {
  alt: string;
  scene: ShiftTone;
  reducedMotion: boolean | null;
}) {
  return (
    <div className={`product-frame product-frame--${scene}`}>
      <div className="product-frame-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <b>DinoPOS</b>
      </div>
      <div className="product-frame-viewport">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            alt={alt}
            animate={{ opacity: 1, scale: 1 }}
            className="product-frame-image"
            decoding="async"
            exit={reducedMotion ? undefined : { opacity: 0, scale: 1.012 }}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.99 }}
            key={`${scene}-${sceneAssets[scene]}`}
            loading="eager"
            src={sceneAssets[scene]}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      </div>
      <div className="product-frame-shine" aria-hidden="true" />
    </div>
  );
}

export function MarketingPage() {
  const [locale, setLocale] = useState<MarketingLocale>("ru");
  const [content, setContent] = useState<MarketingContent>(defaultMarketingContent);
  const [activeShift, setActiveShift] = useState(0);
  const [activeRole, setActiveRole] = useState(0);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const current = content.locales[locale];
  const ui = marketingUi[locale];
  const activeEvent = current.shiftEvents[activeShift] ?? current.shiftEvents[0]!;

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroCopyOpacity = useTransform(heroProgress, [0, 0.58], [1, reducedMotion ? 1 : 0]);
  const heroCopyY = useTransform(heroProgress, [0, 0.65], [0, reducedMotion ? 0 : -64]);
  const heroFrameScale = useTransform(heroProgress, [0, 0.76], [1, reducedMotion ? 1 : 0.92]);
  const heroFrameY = useTransform(heroProgress, [0, 0.76], [0, reducedMotion ? 0 : 72]);

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(storyProgress, "change", (value) => {
    const next = Math.min(current.shiftEvents.length - 1, Math.floor(value * current.shiftEvents.length));
    setActiveShift((previous) => (previous === next ? previous : next));
  });

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

  function jumpToShift(index: number) {
    const story = storyRef.current;
    if (!story) return;
    const start = story.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(0, story.offsetHeight - window.innerHeight);
    const progress = current.shiftEvents.length <= 1 ? 0 : (index + 0.12) / current.shiftEvents.length;
    window.scrollTo({ top: start + distance * progress, behavior: reducedMotion ? "auto" : "smooth" });
  }

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
    <div className="landing-site">
      <header className="site-header">
        <a className="site-brand" href="#top" aria-label="DinoPOS">
          <DinoMark />
          <strong>DinoPOS</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#shift">{ui.nav[0]}</a>
          <a href="#roles">{ui.nav[1]}</a>
          <a href="#pilot">{ui.nav[2]}</a>
        </nav>
        <div className="site-header-actions">
          <div className="site-locale" aria-label="Language">
            {locales.map((item) => (
              <button
                aria-pressed={locale === item}
                className={locale === item ? "active" : ""}
                key={item}
                onClick={() => setLocale(item)}
                type="button"
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="site-header-cta" onClick={() => scrollTo("pilot")} type="button">
            {current.secondaryCta}
          </button>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="top" ref={heroRef}>
          <motion.div className="landing-hero-copy" style={{ opacity: heroCopyOpacity, y: heroCopyY }}>
            <span className="site-kicker">{current.eyebrow}</span>
            <h1>{current.heroTitle}</h1>
            <p>{current.heroDescription}</p>
            <div className="landing-hero-actions">
              <button className="site-primary-button" onClick={() => scrollTo("shift")} type="button">
                {current.primaryCta}
                <ArrowDown size={17} />
              </button>
              <button className="site-text-button" onClick={() => scrollTo("pilot")} type="button">
                {current.secondaryCta}
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
          <motion.div className="landing-hero-product" style={{ scale: heroFrameScale, y: heroFrameY }}>
            <ProductFrame alt={current.shiftEvents[4]?.title ?? current.heroTitle} reducedMotion={reducedMotion} scene="closing" />
          </motion.div>
        </section>

        <section className="shift-intro">
          <span className="site-kicker site-kicker--dark">{current.storyKicker}</span>
          <h2>{current.storyTitle}</h2>
          <p>{current.storyDescription}</p>
        </section>

        <section className="shift-story" id="shift" ref={storyRef}>
          <ol className="story-transcript">
            {current.shiftEvents.map((event) => (
              <li key={`transcript-${event.time}-${event.tone}`}>
                <time>{event.time}</time>
                <strong>{event.label}</strong>
                <span>{event.title}</span>
                <p>{event.description}</p>
              </li>
            ))}
          </ol>
          <div className="shift-sticky">
            <div className="shift-copy">
              <div className="shift-meta">
                <span>{String(activeShift + 1).padStart(2, "0")}</span>
                <div aria-hidden="true">
                  <i style={{ transform: `scaleX(${(activeShift + 1) / current.shiftEvents.length})` }} />
                </div>
                <span>{String(current.shiftEvents.length).padStart(2, "0")}</span>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="shift-copy-body"
                  exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
                  initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                  key={`${locale}-${activeEvent.time}`}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="shift-time">{activeEvent.time}</span>
                  <small>{activeEvent.label}</small>
                  <h3>{activeEvent.title}</h3>
                  <p>{activeEvent.description}</p>
                </motion.div>
              </AnimatePresence>
              <div className="shift-steps" aria-label={current.storyKicker}>
                {current.shiftEvents.map((event, index) => (
                  <button
                    aria-label={`${event.time}: ${event.title}`}
                    aria-pressed={activeShift === index}
                    className={activeShift === index ? "active" : ""}
                    key={`${event.time}-${event.tone}`}
                    onClick={() => jumpToShift(index)}
                    type="button"
                  >
                    <span />
                    <b>{event.time}</b>
                  </button>
                ))}
              </div>
            </div>
            <div className="shift-product">
              <ProductFrame alt={activeEvent.title} reducedMotion={reducedMotion} scene={activeEvent.tone} />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="shift-product-label"
                  exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  key={`${locale}-${activeEvent.tone}`}
                >
                  {activeEvent.label} · {activeEvent.time}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="landing-role-story" id="roles">
          <div className="landing-role-heading">
            <span className="site-kicker">DINOPOS / TEAM</span>
            <h2>{current.rolesTitle}</h2>
            <p>{current.rolesIntro}</p>
          </div>
          <div className="role-stage">
            <div className="landing-role-tabs" role="tablist" aria-label={current.rolesTitle}>
              {current.roleCards.map((role, index) => (
                <button
                  aria-controls={`role-panel-${index}`}
                  aria-selected={activeRole === index}
                  className={activeRole === index ? "active" : ""}
                  id={`role-tab-${index}`}
                  key={role.role}
                  onClick={() => setActiveRole(index)}
                  role="tab"
                  type="button"
                >
                  <span>0{index + 1}</span>
                  {role.role}
                </button>
              ))}
            </div>
            <div
              aria-labelledby={`role-tab-${activeRole}`}
              className="role-panel"
              id={`role-panel-${activeRole}`}
              role="tabpanel"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="role-panel-copy"
                  exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  key={`${locale}-${activeRole}`}
                >
                  <h3>{current.roleCards[activeRole]?.title}</h3>
                  <p>{current.roleCards[activeRole]?.description}</p>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`role-panel-product role-panel-product--${activeRole}`}
                  exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97, y: 18 }}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 18 }}
                  key={`role-product-${activeRole}`}
                >
                  <img
                    alt={current.roleCards[activeRole]?.title}
                    decoding="async"
                    loading="lazy"
                    src={activeRole === 0 ? sceneAssets.rush : sceneAssets.closing}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="landing-founder-note">
          <span className="site-kicker site-kicker--dark">{current.founderKicker}</span>
          <blockquote>“{current.founderQuote}”</blockquote>
          <p>— {current.founderName}</p>
        </section>

        <section className="landing-contact" id="pilot">
          <div className="landing-contact-copy">
            <span className="site-kicker">FIRST SHIFT / PILOT</span>
            <h2>{current.pilotTitle}</h2>
            <p>{current.pilotDescription}</p>
            <ul>
              {current.pilotFeatures.map((feature) => (
                <li key={feature}>
                  <Check size={15} />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="landing-contact-direct">
              <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
              <a href={`tel:${content.contactPhone.replace(/\s/g, "")}`}>{content.contactPhone}</a>
              <span>{content.contactTelegram}</span>
            </div>
          </div>
          <form onSubmit={submitLead}>
            <div className="landing-form-intro">
              <span>01</span>
              <p>{locale === "ru" ? "Расскажите немного о магазине" : locale === "uz" ? "Do‘kon haqida qisqacha ayting" : "Tell us a little about the store"}</p>
            </div>
            <label>{ui.form.name}<input autoComplete="name" name="name" required /></label>
            <label>{ui.form.phone}<input autoComplete="tel" name="phone" placeholder="+998 / @telegram" required type="text" /></label>
            <label>{ui.form.business}<input autoComplete="organization" name="businessName" required /></label>
            <label>{ui.form.city}<input autoComplete="address-level2" name="city" /></label>
            <label>{ui.form.count}<input defaultValue="1" min="1" name="storeCount" type="number" /></label>
            <label className="wide">{ui.form.message}<textarea name="message" rows={3} /></label>
            <div className="landing-form-action">
              <button className="site-primary-button" disabled={submitState === "sending"} type="submit">
                {submitState === "sending" ? ui.form.sending : ui.form.submit}
                <ArrowRight size={17} />
              </button>
              <small>{ui.form.consent}</small>
            </div>
            {submitState === "success" ? <p className="landing-form-message success" role="status">{ui.form.success}</p> : null}
            {submitState === "error" ? <p className="landing-form-message error" role="alert">{ui.form.error} <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></p> : null}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="site-brand" href="#top">
          <DinoMark />
          <strong>DinoPOS</strong>
        </a>
        <p>{ui.footer}</p>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
