"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import styles from "./events.module.css";

/* ────────────────────────────────────────────────
   MOCK DATA — 12 events (attended + conducted)
──────────────────────────────────────────────── */
type EventStatus = "Approved" | "Pending Review" | "Rejected";
type EventTab    = "attended" | "conducted";

interface FacultyEvent {
  id: number;
  date: string;
  name: string;
  category: string;
  role: string;
  status: EventStatus;
  tab: EventTab;
}

const ALL_EVENTS: FacultyEvent[] = [
  // Attended
  { id:1,  date:"Oct 12, 2023", name:"Advanced Machine Learning Methodologies",      category:"FDP",       role:"Participant", status:"Approved",       tab:"attended" },
  { id:2,  date:"Sep 28, 2023", name:"Cybersecurity in Higher Education",             category:"Seminar",   role:"Speaker",     status:"Pending Review", tab:"attended" },
  { id:3,  date:"Aug 15, 2023", name:"Pedagogy Innovation Workshop",                 category:"Workshop",  role:"Participant", status:"Approved",       tab:"attended" },
  { id:4,  date:"Jul 04, 2023", name:"Data Privacy and GDPR Compliance Summit",      category:"Conference",role:"Panelist",    status:"Approved",       tab:"attended" },
  { id:5,  date:"Jun 20, 2023", name:"Cloud Security Fundamentals Bootcamp",         category:"FDP",       role:"Participant", status:"Approved",       tab:"attended" },
  { id:6,  date:"May 10, 2023", name:"Ethical Hacking & Penetration Testing Seminar",category:"Seminar",   role:"Speaker",     status:"Pending Review", tab:"attended" },
  { id:7,  date:"Apr 05, 2023", name:"Research Methodology for Computer Science",    category:"Workshop",  role:"Participant", status:"Approved",       tab:"attended" },
  { id:8,  date:"Mar 18, 2023", name:"Blockchain Technology in Academia",            category:"Webinar",   role:"Participant", status:"Rejected",       tab:"attended" },
  // Conducted
  { id:9,  date:"Oct 02, 2023", name:"Intro to Cybersecurity for Engineering Students",category:"Seminar", role:"Coordinator", status:"Approved",       tab:"conducted" },
  { id:10, date:"Aug 22, 2023", name:"Capture The Flag (CTF) Competition 2023",       category:"Workshop", role:"Organizer",   status:"Approved",       tab:"conducted" },
  { id:11, date:"Jul 14, 2023", name:"Guest Lecture: Zero Trust Architecture",        category:"Seminar",  role:"Coordinator", status:"Pending Review", tab:"conducted" },
  { id:12, date:"May 30, 2023", name:"Annual Department Tech Symposium",              category:"Conference",role:"Organizer",  status:"Approved",       tab:"conducted" },
];

const CATEGORIES = ["All", "FDP", "Seminar", "Workshop", "Conference", "Webinar"];
const DATE_FILTERS = ["Last 6 Months", "Last 3 Months", "This Year", "All Time"];
const PER_PAGE = 3;

/* ── SVG Icon helpers ── */
const IcoSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoFilter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const IcoDownload = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcoChevronLeft  = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IcoChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IcoPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcoX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcoChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

/* ── Status Badge ── */
function StatusBadge({ status }: { status: EventStatus }) {
  const cls =
    status === "Approved"       ? styles.badgeApproved :
    status === "Pending Review" ? styles.badgePending  :
                                  styles.badgeRejected;
  return <span className={`${styles.badge} ${cls}`}>{status}</span>;
}

/* ── Log New Event Modal ── */
function LogEventModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", date: "", category: "FDP", role: "Participant", venue: "", description: ""
  });

  const update = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle} id="modal-title">Log New Event</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close"><IcoX /></button>
        </div>
        <div className={styles.modalBody}>
          <div className={`${styles.formGroup} ${styles.formControlFull}`}>
            <label className={styles.formLabel}>Event Name *</label>
            <input className={styles.formControl} placeholder="e.g. National Cybersecurity Summit" value={form.name} onChange={(e) => update("name", e.target.value)}/>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date *</label>
              <input type="date" className={styles.formControl} value={form.date} onChange={(e) => update("date", e.target.value)}/>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category *</label>
              <select className={styles.formControl} value={form.category} onChange={(e) => update("category", e.target.value)}>
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Your Role *</label>
              <select className={styles.formControl} value={form.role} onChange={(e) => update("role", e.target.value)}>
                {["Participant","Speaker","Panelist","Coordinator","Organizer"].map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Venue / Platform</label>
              <input className={styles.formControl} placeholder="e.g. IIT Chennai / Online" value={form.venue} onChange={(e) => update("venue", e.target.value)}/>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea className={styles.formControl} rows={3} placeholder="Brief description of the event…" value={form.description} onChange={(e) => update("description", e.target.value)} style={{resize:"vertical"}}/>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} onClick={onClose}>Submit for Review</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function EventsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]     = useState<EventTab>("attended");
  const [search, setSearch]           = useState("");
  const [dateFilter, setDateFilter]   = useState("Last 6 Months");
  const [catFilter, setCatFilter]     = useState("All");
  const [page, setPage]               = useState(1);
  const [showDateDrop, setShowDateDrop] = useState(false);
  const [showCatDrop, setShowCatDrop]   = useState(false);

  /* Filtered + paginated events */
  const filtered = useMemo(() => {
    return ALL_EVENTS.filter((ev) => {
      if (ev.tab !== activeTab) return false;
      if (search && !ev.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== "All" && ev.category !== catFilter) return false;
      return true;
    });
  }, [activeTab, search, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleTabChange = (tab: EventTab) => { setActiveTab(tab); setPage(1); };
  const handleSearch    = (val: string)   => { setSearch(val);    setPage(1); };
  const handleCat       = (cat: string)   => { setCatFilter(cat); setPage(1); setShowCatDrop(false); };
  const handleDate      = (d: string)     => { setDateFilter(d);  setPage(1); setShowDateDrop(false); };

  return (
    <MainLayout
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "My Events" }]}
      userName="Sunil P"
    >
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Event Management</h1>
          <p className={styles.pageSubtitle}>Track, manage, and review your academic participation and contributions.</p>
        </div>
        <button id="log-new-event-btn" className={styles.logBtn} onClick={() => router.push("/add-event")}>
          <IcoPlus /> Log New Event
        </button>
      </div>

      {/* Main card */}
      <div className={styles.card}>
        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          <button
            id="tab-attended"
            role="tab"
            aria-selected={activeTab === "attended"}
            className={`${styles.tab} ${activeTab === "attended" ? styles.activeTab : ""}`}
            onClick={() => handleTabChange("attended")}
          >
            Attended Events
          </button>
          <button
            id="tab-conducted"
            role="tab"
            aria-selected={activeTab === "conducted"}
            className={`${styles.tab} ${activeTab === "conducted" ? styles.activeTab : ""}`}
            onClick={() => handleTabChange("conducted")}
          >
            Conducted Events
          </button>
        </div>

        {/* Filters */}
        <div className={styles.filtersBar}>
          {/* Search */}
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}><IcoSearch /></span>
            <input
              id="events-search"
              type="text"
              className={styles.searchInput}
              placeholder="Search events by name…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            {/* Date filter */}
            <div style={{ position: "relative" }}>
              <button id="date-filter-btn" className={styles.filterBtn} onClick={() => { setShowDateDrop(!showDateDrop); setShowCatDrop(false); }}>
                <IcoCalendar /> {dateFilter} <IcoChevronDown />
              </button>
              {showDateDrop && (
                <div style={{ position:"absolute", top:"100%", left:0, marginTop:4, background:"#fff", border:"1.5px solid var(--border)", borderRadius:10, boxShadow:"var(--shadow-md)", zIndex:100, minWidth:150, overflow:"hidden" }}>
                  {DATE_FILTERS.map((d) => (
                    <button key={d} onClick={() => handleDate(d)}
                      style={{ display:"block", width:"100%", textAlign:"left", padding:"0.55rem 0.9rem", background: d === dateFilter ? "#eef2ff":"transparent", color: d === dateFilter ? "var(--accent)":"var(--text-primary)", border:"none", fontSize:"0.82rem", fontWeight: d===dateFilter ? 600:400, cursor:"pointer", fontFamily:"inherit" }}>
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category filter */}
            <div style={{ position: "relative" }}>
              <button id="category-filter-btn" className={styles.filterBtn} onClick={() => { setShowCatDrop(!showCatDrop); setShowDateDrop(false); }}>
                <IcoFilter /> Category: {catFilter} <IcoChevronDown />
              </button>
              {showCatDrop && (
                <div style={{ position:"absolute", top:"100%", right:0, marginTop:4, background:"#fff", border:"1.5px solid var(--border)", borderRadius:10, boxShadow:"var(--shadow-md)", zIndex:100, minWidth:130, overflow:"hidden" }}>
                  {CATEGORIES.map((c) => (
                    <button key={c} onClick={() => handleCat(c)}
                      style={{ display:"block", width:"100%", textAlign:"left", padding:"0.55rem 0.9rem", background: c === catFilter ? "#eef2ff":"transparent", color: c === catFilter ? "var(--accent)":"var(--text-primary)", border:"none", fontSize:"0.82rem", fontWeight: c===catFilter ? 600:400, cursor:"pointer", fontFamily:"inherit" }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          {paginated.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
              <div className={styles.emptyTitle}>No events found</div>
              <div className={styles.emptyDesc}>Try adjusting your search or filters.</div>
            </div>
          ) : (
            <table className={styles.eventsTable} aria-label="Events table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((ev) => (
                  <tr key={ev.id}>
                    <td className={styles.dateCell}>{ev.date}</td>
                    <td><div className={styles.eventName}>{ev.name}</div></td>
                    <td><span className={styles.categoryBadge}>{ev.category}</span></td>
                    <td><span className={styles.roleBadge}>{ev.role}</span></td>
                    <td><StatusBadge status={ev.status} /></td>
                    <td style={{ textAlign: "right" }}>
                      {ev.status === "Approved" ? (
                        <button className={styles.actionBtn} title="Download Certificate">
                          <IcoDownload /> Certificate
                        </button>
                      ) : (
                        <span className={`${styles.actionBtn} ${styles.disabled}`}>
                          <IcoDownload /> Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className={styles.pagination}>
            <span className={styles.paginInfo}>
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} events
            </span>
            <div className={styles.paginBtns}>
              <button id="prev-page-btn" className={styles.pageBtn} onClick={() => setPage((p) => p - 1)} disabled={page === 1} aria-label="Previous page">
                <IcoChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  id={`page-btn-${p}`}
                  className={`${styles.pageBtn} ${p === page ? styles.activePage : ""}`}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              ))}
              <button id="next-page-btn" className={styles.pageBtn} onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} aria-label="Next page">
                <IcoChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Close dropdowns on outside click */}
      {(showDateDrop || showCatDrop) && (
        <div style={{ position:"fixed", inset:0, zIndex:99 }} onClick={() => { setShowDateDrop(false); setShowCatDrop(false); }} />
      )}
    </MainLayout>
  );
}
