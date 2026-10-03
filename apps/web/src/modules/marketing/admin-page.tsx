import { ArrowLeft, ExternalLink, RefreshCw, Save } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  loadAdminContent,
  loadAdminLeads,
  marketingApiUrl,
  saveAdminContent,
  updateLeadStatus,
  type Lead,
  type LeadStatus,
} from "./marketing-api";
import {
  defaultMarketingContent,
  type LocalizedMarketingContent,
  type MarketingContent,
  type MarketingLocale,
  type RoleCard,
  type ShiftEvent,
  type ShiftTone,
} from "./marketing-content";
import "./marketing.css";

const statuses: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];
const statusLabels: Record<LeadStatus, string> = { NEW: "Новая", CONTACTED: "Связались", QUALIFIED: "Квалифицирована", WON: "Клиент", LOST: "Закрыта" };
const tones: ShiftTone[] = ["opening", "rush", "offline", "inventory", "closing"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function MarketingAdminPage() {
  const [authorization, setAuthorization] = useState("");
  const [tab, setTab] = useState<"leads" | "content">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [content, setContent] = useState<MarketingContent>(defaultMarketingContent);
  const [editorLocale, setEditorLocale] = useState<MarketingLocale>("ru");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => ({ total: leads.length, new: leads.filter((lead) => lead.status === "NEW").length, qualified: leads.filter((lead) => lead.status === "QUALIFIED").length, won: leads.filter((lead) => lead.status === "WON").length }), [leads]);

  async function loadDashboard(auth = authorization) {
    setLoading(true); setMessage("");
    try {
      const [nextLeads, nextContent] = await Promise.all([loadAdminLeads(auth), loadAdminContent(auth)]);
      setLeads(nextLeads); setContent(nextContent);
    } catch {
      setMessage("Не удалось подключиться. Проверьте адрес API и данные администратора.");
      if (!authorization) setAuthorization("");
    } finally { setLoading(false); }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const auth = `Basic ${btoa(`${values.get("username")}:${values.get("password")}`)}`;
    setAuthorization(auth); await loadDashboard(auth);
  }

  async function changeStatus(id: number, status: LeadStatus) {
    try {
      const changed = await updateLeadStatus(authorization, id, status);
      setLeads((current) => current.map((lead) => lead.id === id ? changed : lead));
    } catch { setMessage("Не удалось обновить статус заявки."); }
  }

  async function saveContent() {
    setLoading(true); setMessage("");
    try { setContent(await saveAdminContent(authorization, content)); setMessage("Контент опубликован."); }
    catch { setMessage("Не удалось сохранить контент."); }
    finally { setLoading(false); }
  }

  function updateLocalized(field: keyof LocalizedMarketingContent, value: string) {
    setContent((current) => ({ ...current, locales: { ...current.locales, [editorLocale]: { ...current.locales[editorLocale], [field]: value } } }));
  }

  function updateShift(index: number, field: keyof ShiftEvent, value: string) {
    setContent((current) => {
      const shiftEvents = current.locales[editorLocale].shiftEvents.map((event, itemIndex) => itemIndex === index ? { ...event, [field]: value } : event);
      return { ...current, locales: { ...current.locales, [editorLocale]: { ...current.locales[editorLocale], shiftEvents } } };
    });
  }

  function updateRole(index: number, field: keyof RoleCard, value: string) {
    setContent((current) => {
      const roleCards = current.locales[editorLocale].roleCards.map((role, itemIndex) => itemIndex === index ? { ...role, [field]: value } : role);
      return { ...current, locales: { ...current.locales, [editorLocale]: { ...current.locales[editorLocale], roleCards } } };
    });
  }

  function updatePilotFeature(index: number, value: string) {
    setContent((current) => {
      const pilotFeatures = current.locales[editorLocale].pilotFeatures.map((feature, itemIndex) => itemIndex === index ? value : feature);
      return { ...current, locales: { ...current.locales, [editorLocale]: { ...current.locales[editorLocale], pilotFeatures } } };
    });
  }

  if (!marketingApiUrl) return <main className="marketing-admin-state"><span>DINOPOS / ADMIN</span><h1>Java API ещё не опубликован</h1><p>После размещения API задайте <code>VITE_MARKETING_API_URL</code> при сборке GitHub Pages. Все поля истории смены уже подготовлены для редактирования.</p><Link className="marketing-quiet-cta" to="/"><ArrowLeft size={16} />Вернуться на лендинг</Link></main>;

  if (!authorization) return <main className="marketing-admin-state"><span>DINOPOS / ADMIN</span><h1>Вход в админку</h1><p>Используйте логин и пароль Java API.</p><form className="admin-login" onSubmit={login}><label>Логин<input autoComplete="username" name="username" required /></label><label>Пароль<input autoComplete="current-password" name="password" required type="password" /></label><button className="marketing-primary-button" disabled={loading} type="submit">{loading ? "Подключаем…" : "Войти"}</button>{message ? <p role="alert">{message}</p> : null}</form><Link className="admin-back-link" to="/"><ArrowLeft size={14} />На лендинг</Link></main>;

  const current = content.locales[editorLocale];
  return (
    <main className="marketing-admin">
      <aside className="admin-sidebar"><Link className="marketing-brand" to="/"><span className="marketing-brand-mark"><i /><i /></span><strong>DinoPOS</strong></Link><nav><button className={tab === "leads" ? "active" : ""} onClick={() => setTab("leads")} type="button"><span>01</span>Заявки</button><button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")} type="button"><span>02</span>Контент</button></nav><footer><Link to="/" target="_blank">Открыть лендинг <ExternalLink size={13} /></Link><button onClick={() => setAuthorization("")} type="button">Выйти</button></footer></aside>
      <section className="admin-main"><header><span>DinoPOS · Landing admin</span><b><i />API подключён</b></header><div className="admin-content">{message ? <p className="admin-message" role="status">{message}</p> : null}
        {tab === "leads" ? <><div className="admin-page-title"><div><h1>Заявки клиентов</h1><p>Лиды с формы пилотного запуска.</p></div><button className="marketing-quiet-cta" onClick={() => void loadDashboard()} type="button"><RefreshCw size={15} />Обновить</button></div><div className="admin-kpis"><article><span>Всего</span><strong>{stats.total}</strong></article><article><span>Новые</span><strong>{stats.new}</strong></article><article><span>Квалифицированы</span><strong>{stats.qualified}</strong></article><article><span>Клиенты</span><strong>{stats.won}</strong></article></div><section className="admin-card"><div className="admin-card-title"><h2>Последние заявки</h2><span>{leads.length} записей</span></div>{leads.length === 0 ? <div className="admin-empty"><strong>Заявок пока нет</strong><span>Новая заявка появится здесь после отправки формы.</span></div> : <div className="admin-table-wrap"><table><thead><tr><th>Клиент</th><th>Магазин</th><th>Контакты</th><th>Комментарий</th><th>Дата</th><th>Статус</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong><small>{lead.locale.toUpperCase()}</small></td><td><strong>{lead.businessName}</strong><small>{lead.city || "Город не указан"} · {lead.storeCount || 1} точ.</small></td><td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td><td>{lead.message || "—"}</td><td>{formatDate(lead.createdAt)}</td><td><select value={lead.status} onChange={(event) => void changeStatus(lead.id, event.target.value as LeadStatus)}>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td></tr>)}</tbody></table></div>}</section></> : <><div className="admin-page-title"><div><h1>Контент лендинга</h1><p>История смены, роли, пилот и контакты — без правки кода.</p></div><button className="marketing-primary-button" disabled={loading} onClick={() => void saveContent()} type="button"><Save size={15} />{loading ? "Сохраняем…" : "Опубликовать"}</button></div><div className="admin-editor"><section className="admin-card"><div className="editor-tabs">{(["ru", "uz", "en"] as MarketingLocale[]).map((item) => <button className={editorLocale === item ? "active" : ""} key={item} onClick={() => setEditorLocale(item)} type="button">{item.toUpperCase()}</button>)}</div>
          <div className="editor-section"><header><h3>Первый экран</h3><p>Главное обещание и две кнопки.</p></header><div className="editor-fields"><label className="wide">Надзаголовок<input value={current.eyebrow} onChange={(e) => updateLocalized("eyebrow", e.target.value)} /></label><label className="wide">Главный заголовок<textarea value={current.heroTitle} onChange={(e) => updateLocalized("heroTitle", e.target.value)} /></label><label className="wide">Описание<textarea value={current.heroDescription} onChange={(e) => updateLocalized("heroDescription", e.target.value)} /></label><label>Кнопка истории<input value={current.primaryCta} onChange={(e) => updateLocalized("primaryCta", e.target.value)} /></label><label>Кнопка пилота<input value={current.secondaryCta} onChange={(e) => updateLocalized("secondaryCta", e.target.value)} /></label></div></div>
          <div className="editor-section"><header><h3>История одной смены</h3><p>Заголовок секции и пять управляемых моментов дня.</p></header><div className="editor-fields"><label>Маркер секции<input value={current.storyKicker} onChange={(e) => updateLocalized("storyKicker", e.target.value)} /></label><label className="wide">Заголовок<textarea value={current.storyTitle} onChange={(e) => updateLocalized("storyTitle", e.target.value)} /></label><label className="wide">Описание<textarea value={current.storyDescription} onChange={(e) => updateLocalized("storyDescription", e.target.value)} /></label></div><div className="array-editor">{current.shiftEvents.map((event, index) => <article key={`${event.tone}-${index}`}><label>Время<input value={event.time} onChange={(e) => updateShift(index, "time", e.target.value)} /></label><label>Момент<input value={event.label} onChange={(e) => updateShift(index, "label", e.target.value)} /></label><label>Тип<select value={event.tone} onChange={(e) => updateShift(index, "tone", e.target.value as ShiftTone)}>{tones.map((tone) => <option key={tone}>{tone}</option>)}</select></label><label>Заголовок<input value={event.title} onChange={(e) => updateShift(index, "title", e.target.value)} /></label><label>Описание<textarea value={event.description} onChange={(e) => updateShift(index, "description", e.target.value)} /></label></article>)}</div></div>
          <div className="editor-section"><header><h3>Роли в магазине</h3><p>Три взгляда на одну систему.</p></header><div className="editor-fields"><label className="wide">Заголовок<textarea value={current.rolesTitle} onChange={(e) => updateLocalized("rolesTitle", e.target.value)} /></label><label className="wide">Вводный текст<textarea value={current.rolesIntro} onChange={(e) => updateLocalized("rolesIntro", e.target.value)} /></label></div><div className="array-editor">{current.roleCards.map((role, index) => <article className="role-row" key={`${role.role}-${index}`}><label>Роль<input value={role.role} onChange={(e) => updateRole(index, "role", e.target.value)} /></label><label>Заголовок<input value={role.title} onChange={(e) => updateRole(index, "title", e.target.value)} /></label><label>Описание<textarea value={role.description} onChange={(e) => updateRole(index, "description", e.target.value)} /></label></article>)}</div></div>
          <div className="editor-section"><header><h3>Голос команды</h3><p>Авторская цитата вместо шаблонного блока преимуществ.</p></header><div className="editor-fields"><label>Маркер<input value={current.founderKicker} onChange={(e) => updateLocalized("founderKicker", e.target.value)} /></label><label>Подпись<input value={current.founderName} onChange={(e) => updateLocalized("founderName", e.target.value)} /></label><label className="wide">Цитата<textarea value={current.founderQuote} onChange={(e) => updateLocalized("founderQuote", e.target.value)} /></label></div></div>
          <div className="editor-section"><header><h3>Пилот</h3><p>Финальный призыв и состав запуска.</p></header><div className="editor-fields"><label className="wide">Заголовок<textarea value={current.pilotTitle} onChange={(e) => updateLocalized("pilotTitle", e.target.value)} /></label><label className="wide">Описание<textarea value={current.pilotDescription} onChange={(e) => updateLocalized("pilotDescription", e.target.value)} /></label></div><div className="array-editor">{current.pilotFeatures.map((feature, index) => <label key={index}>Пункт {index + 1}<input value={feature} onChange={(e) => updatePilotFeature(index, e.target.value)} /></label>)}</div></div>
        </section><aside className="admin-card admin-settings"><h2>Контакты</h2><label>Email<input type="email" value={content.contactEmail} onChange={(e) => setContent({ ...content, contactEmail: e.target.value })} /></label><label>Телефон<input value={content.contactPhone} onChange={(e) => setContent({ ...content, contactPhone: e.target.value })} /></label><label>Telegram<input value={content.contactTelegram} onChange={(e) => setContent({ ...content, contactTelegram: e.target.value })} /></label></aside></div></>}
      </div></section>
    </main>
  );
}
