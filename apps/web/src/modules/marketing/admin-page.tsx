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
import { defaultMarketingContent, type MarketingContent, type MarketingLocale } from "./marketing-content";
import "./marketing.css";

const statuses: LeadStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];
const statusLabels: Record<LeadStatus, string> = { NEW: "Новая", CONTACTED: "Связались", QUALIFIED: "Квалифицирована", WON: "Клиент", LOST: "Закрыта" };

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

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((lead) => lead.status === "NEW").length,
    qualified: leads.filter((lead) => lead.status === "QUALIFIED").length,
    won: leads.filter((lead) => lead.status === "WON").length,
  }), [leads]);

  async function loadDashboard(auth = authorization) {
    setLoading(true);
    setMessage("");
    try {
      const [nextLeads, nextContent] = await Promise.all([loadAdminLeads(auth), loadAdminContent(auth)]);
      setLeads(nextLeads);
      setContent(nextContent);
    } catch {
      setMessage("Не удалось подключиться. Проверьте адрес API и данные администратора.");
      if (!authorization) setAuthorization("");
    } finally {
      setLoading(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const auth = `Basic ${btoa(`${values.get("username")}:${values.get("password")}`)}`;
    setAuthorization(auth);
    await loadDashboard(auth);
  }

  async function changeStatus(id: number, status: LeadStatus) {
    try {
      const changed = await updateLeadStatus(authorization, id, status);
      setLeads((current) => current.map((lead) => lead.id === id ? changed : lead));
    } catch {
      setMessage("Не удалось обновить статус заявки.");
    }
  }

  async function saveContent() {
    setLoading(true);
    try {
      setContent(await saveAdminContent(authorization, content));
      setMessage("Контент опубликован в API.");
    } catch {
      setMessage("Не удалось сохранить контент.");
    } finally {
      setLoading(false);
    }
  }

  function updateLocalized(field: keyof MarketingContent["locales"]["ru"], value: string) {
    setContent((current) => ({ ...current, locales: { ...current.locales, [editorLocale]: { ...current.locales[editorLocale], [field]: value } } }));
  }

  if (!marketingApiUrl) {
    return (
      <main className="marketing-admin-state">
        <span>DINOPOS / ADMIN</span><h1>Java API ещё не опубликован</h1>
        <p>Для работы заявок и редактора задайте <code>VITE_MARKETING_API_URL</code> при сборке GitHub Pages. Исходники API находятся в папке <code>backend</code>.</p>
        <Link className="marketing-link-button" to="/"><ArrowLeft size={16} />Вернуться на лендинг</Link>
      </main>
    );
  }

  if (!authorization) {
    return (
      <main className="marketing-admin-state">
        <span>DINOPOS / ADMIN</span><h1>Вход в админку</h1><p>Используйте логин и пароль Java API.</p>
        <form className="admin-login" onSubmit={login}><label>Логин<input autoComplete="username" name="username" required /></label><label>Пароль<input autoComplete="current-password" name="password" required type="password" /></label><button className="marketing-primary-button" disabled={loading} type="submit">{loading ? "Подключаем…" : "Войти"}</button>{message ? <p role="alert">{message}</p> : null}</form>
        <Link className="admin-back-link" to="/"><ArrowLeft size={14} />На лендинг</Link>
      </main>
    );
  }

  const currentLocale = content.locales[editorLocale];
  return (
    <main className="marketing-admin">
      <aside className="admin-sidebar">
        <Link className="marketing-brand" to="/"><span className="marketing-brand-mark"><i /><i /></span><strong>DinoPOS</strong></Link>
        <nav><button className={tab === "leads" ? "active" : ""} onClick={() => setTab("leads")} type="button"><span>01</span>Заявки</button><button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")} type="button"><span>02</span>Контент</button></nav>
        <footer><Link to="/" target="_blank">Открыть лендинг <ExternalLink size={13} /></Link><button onClick={() => setAuthorization("")} type="button">Выйти</button></footer>
      </aside>
      <section className="admin-main">
        <header><span>DinoPOS · Landing admin</span><b><i />API подключён</b></header>
        <div className="admin-content">
          {message ? <p className="admin-message" role="status">{message}</p> : null}
          {tab === "leads" ? <>
            <div className="admin-page-title"><div><h1>Заявки клиентов</h1><p>Лиды с формы пилотного запуска.</p></div><button className="marketing-link-button" onClick={() => void loadDashboard()} type="button"><RefreshCw size={15} />Обновить</button></div>
            <div className="admin-kpis"><article><span>Всего</span><strong>{stats.total}</strong></article><article><span>Новые</span><strong>{stats.new}</strong></article><article><span>Квалифицированы</span><strong>{stats.qualified}</strong></article><article><span>Клиенты</span><strong>{stats.won}</strong></article></div>
            <section className="admin-card"><div className="admin-card-title"><h2>Последние заявки</h2><span>{leads.length} записей</span></div>
              {leads.length === 0 ? <div className="admin-empty"><strong>Заявок пока нет</strong><span>Новая заявка появится здесь после отправки формы.</span></div> : <div className="admin-table-wrap"><table><thead><tr><th>Клиент</th><th>Магазин</th><th>Контакты</th><th>Комментарий</th><th>Дата</th><th>Статус</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td><strong>{lead.name}</strong><small>{lead.locale.toUpperCase()}</small></td><td><strong>{lead.businessName}</strong><small>{lead.city || "Город не указан"} · {lead.storeCount || 1} точ.</small></td><td><a href={`tel:${lead.phone}`}>{lead.phone}</a></td><td>{lead.message || "—"}</td><td>{formatDate(lead.createdAt)}</td><td><select value={lead.status} onChange={(event) => void changeStatus(lead.id, event.target.value as LeadStatus)}>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td></tr>)}</tbody></table></div>}
            </section>
          </> : <>
            <div className="admin-page-title"><div><h1>Контент лендинга</h1><p>Главные тексты и тарифы без правки кода.</p></div><button className="marketing-primary-button" disabled={loading} onClick={() => void saveContent()} type="button"><Save size={15} />{loading ? "Сохраняем…" : "Сохранить"}</button></div>
            <div className="admin-editor"><section className="admin-card"><div className="editor-tabs">{(["ru", "uz", "en"] as MarketingLocale[]).map((item) => <button className={editorLocale === item ? "active" : ""} key={item} onClick={() => setEditorLocale(item)} type="button">{item.toUpperCase()}</button>)}</div><div className="editor-fields">
              <label>Надзаголовок<input value={currentLocale.eyebrow} onChange={(e) => updateLocalized("eyebrow", e.target.value)} /></label><label className="wide">Главный заголовок<textarea value={currentLocale.heroTitle} onChange={(e) => updateLocalized("heroTitle", e.target.value)} /></label><label className="wide">Описание первого экрана<textarea value={currentLocale.heroDescription} onChange={(e) => updateLocalized("heroDescription", e.target.value)} /></label><label>Главная кнопка<input value={currentLocale.primaryCta} onChange={(e) => updateLocalized("primaryCta", e.target.value)} /></label><label>Вторая кнопка<input value={currentLocale.secondaryCta} onChange={(e) => updateLocalized("secondaryCta", e.target.value)} /></label><label className="wide">Заголовок проблемы<textarea value={currentLocale.problemTitle} onChange={(e) => updateLocalized("problemTitle", e.target.value)} /></label><label className="wide">Заголовок решения<textarea value={currentLocale.solutionTitle} onChange={(e) => updateLocalized("solutionTitle", e.target.value)} /></label><label className="wide">Финальный призыв<textarea value={currentLocale.finalCtaTitle} onChange={(e) => updateLocalized("finalCtaTitle", e.target.value)} /></label><label className="wide">Описание призыва<textarea value={currentLocale.finalCtaDescription} onChange={(e) => updateLocalized("finalCtaDescription", e.target.value)} /></label>
            </div></section><aside className="admin-card admin-settings"><h2>Общие настройки</h2><label>Starter<input value={content.starterPrice} onChange={(e) => setContent({ ...content, starterPrice: e.target.value })} /></label><label>Standard<input value={content.standardPrice} onChange={(e) => setContent({ ...content, standardPrice: e.target.value })} /></label><label>Pro<input value={content.proPrice} onChange={(e) => setContent({ ...content, proPrice: e.target.value })} /></label><label>Email<input type="email" value={content.contactEmail} onChange={(e) => setContent({ ...content, contactEmail: e.target.value })} /></label></aside></div>
          </>}
        </div>
      </section>
    </main>
  );
}
