"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import s from "./add-event.module.css";

/* ══════════════════════════════════════════════════
   TYPES & CONSTANTS
══════════════════════════════════════════════════ */
type EventMode = "attended" | "conducted";

const SDG_LIST = [
  { n: 1,  name: "No Poverty"             },
  { n: 2,  name: "Zero Hunger"            },
  { n: 3,  name: "Good Health"            },
  { n: 4,  name: "Quality Education"      },
  { n: 5,  name: "Gender Equality"        },
  { n: 6,  name: "Clean Water"            },
  { n: 7,  name: "Affordable Energy"      },
  { n: 8,  name: "Decent Work"            },
  { n: 9,  name: "Industry & Innovation"  },
  { n: 10, name: "Reduced Inequalities"   },
  { n: 11, name: "Sustainable Cities"     },
  { n: 12, name: "Responsible Consumption"},
  { n: 13, name: "Climate Action"         },
  { n: 14, name: "Life Below Water"       },
  { n: 15, name: "Life on Land"           },
  { n: 16, name: "Peace & Justice"        },
  { n: 17, name: "Partnerships"           },
];

const FOCUS_AREAS = [
  "Cybersecurity", "Artificial Intelligence", "Research", "Innovation",
  "Entrepreneurship", "Skill Development", "Social Responsibility", "Sustainability",
  "Public Policy", "Data Science", "IoT & Embedded Systems", "Cloud Computing",
];

const EVENT_TYPES = ["Conference", "Workshop", "Seminar", "FDP", "Webinar", "Symposium", "Guest Lecture", "Hackathon", "Competition", "Exhibition", "Training Program", "Other"];

const DOC_TYPES = [
  { key: "certificate",    label: "Certificate",     icon: "🏅" },
  { key: "approval",       label: "Approval Letter", icon: "📋" },
  { key: "poster",         label: "Event Poster",    icon: "🖼️" },
  { key: "brochure",       label: "Brochure",        icon: "📄" },
  { key: "report",         label: "Event Report",    icon: "📊" },
  { key: "attendance",     label: "Attendance Sheet",icon: "📝" },
  { key: "photos",         label: "Event Photos",    icon: "📸" },
];

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  docType: string;
  progress: number;
  done: boolean;
}

interface FormData {
  // Step 1
  eventName: string; eventType: string; organizer: string; department: string;
  eventDate: string; startTime: string; endTime: string; venue: string;
  format: string;
  // Step 2
  description: string; objectives: string; keyTopics: string; eventOutcome: string;
  chiefGuest: string; numParticipants: string; targetAudience: string; coordinators: string;
  // Step 3
  facultyRole: string; participationType: string; certAvailable: boolean;
  organizingResponsibility: string;
  // Step 4
  sdgs: number[]; focusAreas: string[];
  // Step 5
  files: UploadedFile[];
}

const INITIAL: FormData = {
  eventName:"", eventType:"", organizer:"", department:"", eventDate:"", startTime:"", endTime:"", venue:"", format:"offline",
  description:"", objectives:"", keyTopics:"", eventOutcome:"", chiefGuest:"", numParticipants:"", targetAudience:"", coordinators:"",
  facultyRole:"", participationType:"", certAvailable:false, organizingResponsibility:"",
  sdgs:[], focusAreas:[],
  files:[],
};

const STEPS = [
  { num:1, label:"Basic Information", sub:"Event name, type & venue" },
  { num:2, label:"Event Details",     sub:"Description & outcomes"   },
  { num:3, label:"Participation",     sub:"Role & responsibilities"  },
  { num:4, label:"SDG & Focus",       sub:"Align to goals"           },
  { num:5, label:"Documents",         sub:"Upload proof & files"     },
  { num:6, label:"Review & Submit",   sub:"Final check"              },
];

/* ══════════════════════════════════════════════════
   SMALL ICON COMPONENTS
══════════════════════════════════════════════════ */
const Ico = {
  Check:  () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Back:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Save:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Upload: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  File:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  X:      () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Submit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Pin:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Tag:    () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  User:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

/* ══════════════════════════════════════════════════
   STEP COMPONENTS
══════════════════════════════════════════════════ */

/* ── Step 1: Basic Information ── */
function Step1({ data, set, mode }: { data:FormData; set:(k:keyof FormData,v:unknown)=>void; mode:EventMode }) {
  const formats = [
    { val:"offline", label:"Offline" },
    { val:"online",  label:"Online"  },
    { val:"hybrid",  label:"Hybrid"  },
  ];
  return (
    <div className={s.stepCardBody}>
      <div className={s.formRow}>
        <div className={`${s.formGroup} ${s.formGroupFull}`}>
          <label className={s.fieldLabel}>Event Name <span className={s.required}>*</span></label>
          <input className={s.fieldInput} placeholder="e.g. National Cybersecurity Summit 2024"
            value={data.eventName} onChange={e=>set("eventName",e.target.value)}/>
        </div>
      </div>
      <div className={s.formRow}>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>Event Type <span className={s.required}>*</span></label>
          <select className={s.fieldSelect} value={data.eventType} onChange={e=>set("eventType",e.target.value)}>
            <option value="">Select event type…</option>
            {EVENT_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>Organizer / Institution <span className={s.required}>*</span></label>
          <input className={s.fieldInput} placeholder="e.g. IIT Madras / IEEE"
            value={data.organizer} onChange={e=>set("organizer",e.target.value)}/>
        </div>
      </div>
      <div className={s.formRow}>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>Department</label>
          <input className={s.fieldInput} placeholder="e.g. Computer Science & Engineering"
            value={data.department} onChange={e=>set("department",e.target.value)}/>
        </div>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>Event Date <span className={s.required}>*</span></label>
          <input type="date" className={s.fieldInput} value={data.eventDate} onChange={e=>set("eventDate",e.target.value)}/>
        </div>
      </div>
      <div className={s.formRow3}>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>Start Time</label>
          <input type="time" className={s.fieldInput} value={data.startTime} onChange={e=>set("startTime",e.target.value)}/>
        </div>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>End Time</label>
          <input type="time" className={s.fieldInput} value={data.endTime} onChange={e=>set("endTime",e.target.value)}/>
        </div>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>Duration</label>
          <input className={s.fieldInput} placeholder="e.g. 2 Days" disabled
            value={data.startTime && data.endTime ? "Calculated" : ""}/>
        </div>
      </div>
      <div className={s.formGroup}>
        <label className={s.fieldLabel}><Ico.Pin /> Venue / Host Institution</label>
        <div className={s.venueWrapper}>
          <span className={s.venueIcon}><Ico.Pin /></span>
          <input className={`${s.fieldInput} ${s.venueInput}`}
            placeholder="e.g. Main Auditorium, Building A / Zoom / Google Meet"
            value={data.venue} onChange={e=>set("venue",e.target.value)}/>
        </div>
      </div>
      <div className={s.formGroup}>
        <label className={s.fieldLabel}>Event Format <span className={s.required}>*</span></label>
        <div className={s.formatToggle}>
          {formats.map(f=>(
            <button key={f.val} type="button"
              className={`${s.formatBtn} ${data.format===f.val ? s.formatBtnActive:""}`}
              onClick={()=>set("format",f.val)}>
              {f.val==="offline"?"🏢":f.val==="online"?"💻":"🌐"} {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Event Details ── */
function Step2({ data, set, mode }: { data:FormData; set:(k:keyof FormData,v:unknown)=>void; mode:EventMode }) {
  return (
    <div className={s.stepCardBody}>
      <div className={s.formGroup}>
        <label className={s.fieldLabel}>Description <span className={s.required}>*</span></label>
        <textarea className={s.fieldTextarea} rows={4}
          placeholder="Provide a comprehensive description of the event, its context and significance…"
          value={data.description} onChange={e=>set("description",e.target.value)}/>
      </div>
      <div className={s.formGroup}>
        <label className={s.fieldLabel}>Objectives</label>
        <textarea className={s.fieldTextarea} rows={3}
          placeholder="List the key objectives of this event (one per line)…"
          value={data.objectives} onChange={e=>set("objectives",e.target.value)}/>
      </div>
      <div className={s.formRow}>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>Key Topics Covered</label>
          <textarea className={s.fieldTextarea} rows={3}
            placeholder="e.g. Zero Trust Security, Network Forensics, AI in Threat Detection…"
            value={data.keyTopics} onChange={e=>set("keyTopics",e.target.value)}/>
        </div>
        <div className={s.formGroup}>
          <label className={s.fieldLabel}>Event Outcome / Learning</label>
          <textarea className={s.fieldTextarea} rows={3}
            placeholder="What was achieved or learned from this event?"
            value={data.eventOutcome} onChange={e=>set("eventOutcome",e.target.value)}/>
        </div>
      </div>

      {mode==="conducted" && (
        <div className={s.conductedSection}>
          <div className={s.conductedTag}><Ico.Tag/> Conducted Event — Additional Details</div>
          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label className={s.fieldLabel}>Chief Guest / Speaker</label>
              <input className={s.fieldInput} placeholder="e.g. Dr. A.P.J Abdul Kalam"
                value={data.chiefGuest} onChange={e=>set("chiefGuest",e.target.value)}/>
            </div>
            <div className={s.formGroup}>
              <label className={s.fieldLabel}>Number of Participants</label>
              <input type="number" className={s.fieldInput} min="1" placeholder="e.g. 120"
                value={data.numParticipants} onChange={e=>set("numParticipants",e.target.value)}/>
            </div>
          </div>
          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label className={s.fieldLabel}>Target Audience</label>
              <input className={s.fieldInput} placeholder="e.g. UG Students, Industry Professionals"
                value={data.targetAudience} onChange={e=>set("targetAudience",e.target.value)}/>
            </div>
            <div className={s.formGroup}>
              <label className={s.fieldLabel}>Coordinators</label>
              <input className={s.fieldInput} placeholder="Names of co-organizers…"
                value={data.coordinators} onChange={e=>set("coordinators",e.target.value)}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Step 3: Participation ── */
function Step3({ data, set, mode }: { data:FormData; set:(k:keyof FormData,v:unknown)=>void; mode:EventMode }) {
  const attendedRoles      = ["Participant","Speaker","Panelist","Session Chair","Invited Expert","Observer"];
  const participationTypes = ["In-person","Virtual / Online","Hybrid"];
  const conductedRoles     = ["Coordinator","Co-Coordinator","Organizer","Resource Person","Mentor","Judge","Evaluator"];
  const orgResponsibilities= ["Event Planning","Technical Coordination","Logistics","Registration","Media & Promotion","Budget Management","All of the above"];

  return (
    <div className={s.stepCardBody}>
      {mode === "attended" ? (
        <>
          <div className={s.formGroup}>
            <label className={s.fieldLabel}>Your Role at the Event <span className={s.required}>*</span></label>
            <div className={s.radioCards}>
              {attendedRoles.map(r=>(
                <button key={r} type="button"
                  className={`${s.radioCard} ${data.facultyRole===r?s.radioCardActive:""}`}
                  onClick={()=>set("facultyRole",r)}>
                  <div className={`${s.radioCardDot} ${data.facultyRole===r?s.radioCardDotActive:""}`}>
                    {data.facultyRole===r && <div className={s.radioInner}/>}
                  </div>
                  <div><div className={s.radioCardLabel}>{r}</div></div>
                </button>
              ))}
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.fieldLabel}>Participation Type <span className={s.required}>*</span></label>
            <div className={s.formatToggle}>
              {participationTypes.map(p=>(
                <button key={p} type="button"
                  className={`${s.formatBtn} ${data.participationType===p?s.formatBtnActive:""}`}
                  onClick={()=>set("participationType",p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className={s.toggleRow}>
            <div>
              <div className={s.toggleLabel}>Certificate Available</div>
              <div className={s.toggleSub}>I received a certificate of participation / achievement</div>
            </div>
            <label className={s.toggle}>
              <input type="checkbox" checked={data.certAvailable} onChange={e=>set("certAvailable",e.target.checked)}/>
              <span className={s.toggleSlider}/>
            </label>
          </div>
        </>
      ) : (
        <>
          <div className={s.formGroup}>
            <label className={s.fieldLabel}>Your Role in Conducting the Event <span className={s.required}>*</span></label>
            <div className={s.radioCards}>
              {conductedRoles.map(r=>(
                <button key={r} type="button"
                  className={`${s.radioCard} ${data.facultyRole===r?s.radioCardActive:""}`}
                  onClick={()=>set("facultyRole",r)}>
                  <div className={`${s.radioCardDot} ${data.facultyRole===r?s.radioCardDotActive:""}`}>
                    {data.facultyRole===r && <div className={s.radioInner}/>}
                  </div>
                  <div><div className={s.radioCardLabel}>{r}</div></div>
                </button>
              ))}
            </div>
          </div>
          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label className={s.fieldLabel}>Number of Participants <span className={s.required}>*</span></label>
              <input type="number" className={s.fieldInput} min="1" placeholder="Total attendees"
                value={data.numParticipants} onChange={e=>set("numParticipants",e.target.value)}/>
            </div>
          </div>
          <div className={s.formGroup}>
            <label className={s.fieldLabel}>Organizing Responsibilities</label>
            <div className={s.radioCards}>
              {orgResponsibilities.map(r=>(
                <button key={r} type="button"
                  className={`${s.radioCard} ${data.organizingResponsibility===r?s.radioCardActive:""}`}
                  onClick={()=>set("organizingResponsibility",r)}>
                  <div className={`${s.radioCardDot} ${data.organizingResponsibility===r?s.radioCardDotActive:""}`}>
                    {data.organizingResponsibility===r && <div className={s.radioInner}/>}
                  </div>
                  <div><div className={s.radioCardLabel}>{r}</div></div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Step 4: SDG & Focus ── */
function Step4({ data, set }: { data:FormData; set:(k:keyof FormData,v:unknown)=>void }) {
  const toggleSDG = (n:number) => {
    const arr = data.sdgs.includes(n) ? data.sdgs.filter(x=>x!==n) : [...data.sdgs, n];
    set("sdgs", arr);
  };
  const toggleFocus = (f:string) => {
    const arr = data.focusAreas.includes(f) ? data.focusAreas.filter(x=>x!==f) : [...data.focusAreas, f];
    set("focusAreas", arr);
  };
  return (
    <div className={s.stepCardBody}>
      <div>
        <div className={s.sectionDivider}>Sustainable Development Goals (SDGs)</div>
        <p style={{fontSize:"0.78rem",color:"var(--text-muted)",marginBottom:"0.8rem",marginTop:"0.3rem"}}>Select all SDGs this event addresses. Multiple selection allowed.</p>
        <div className={s.sdgGrid}>
          {SDG_LIST.map(sdg=>{
            const active = data.sdgs.includes(sdg.n);
            return (
              <button key={sdg.n} type="button"
                className={`${s.sdgCard} ${active?s.sdgCardActive:""}`}
                onClick={()=>toggleSDG(sdg.n)}>
                {active && <div className={s.sdgCheck}><Ico.Check/></div>}
                <div className={s.sdgNum}>{sdg.n}</div>
                <div className={s.sdgName}>{sdg.name}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <div className={s.sectionDivider}>Institutional Focus Areas</div>
        <p style={{fontSize:"0.78rem",color:"var(--text-muted)",marginBottom:"0.8rem",marginTop:"0.3rem"}}>Select specific academic or research domains relevant to this event.</p>
        <div className={s.focusGrid}>
          {FOCUS_AREAS.map(f=>{
            const active = data.focusAreas.includes(f);
            return (
              <button key={f} type="button"
                className={`${s.focusChip} ${active?s.focusChipActive:""}`}
                onClick={()=>toggleFocus(f)}>
                {active && <Ico.Check/>} {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Step 5: Documents ── */
function Step5({ data, set }: { data:FormData; set:(k:keyof FormData,v:unknown)=>void }) {
  const [dragging, setDragging] = useState<string|null>(null);
  const inputRefs = useRef<Record<string,HTMLInputElement|null>>({});

  const handleDrop = useCallback((e:React.DragEvent, docType:string)=>{
    e.preventDefault(); setDragging(null);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files, docType);
  },[data.files]);

  const addFiles = (files:File[], docType:string) => {
    const newFiles: UploadedFile[] = files.map(f=>({
      id: `${Date.now()}-${Math.random()}`,
      name: f.name,
      type: f.type || "application/octet-stream",
      size: f.size > 1024*1024 ? `${(f.size/1024/1024).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`,
      docType,
      progress: 100,
      done: true,
    }));
    set("files", [...data.files, ...newFiles]);
  };

  const removeFile = (id:string) => set("files", data.files.filter((f:UploadedFile)=>f.id!==id));

  const extIcon = (name:string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if(["jpg","jpeg","png","gif","webp"].includes(ext||"")) return "🖼️";
    if(ext==="pdf") return "📄";
    if(["doc","docx"].includes(ext||"")) return "📝";
    return "📎";
  };

  return (
    <div className={s.stepCardBody}>
      <div className={s.docSection}>
        <div className={s.docTypeGrid}>
          {DOC_TYPES.map(dt=>(
            <div key={dt.key}>
              <p style={{fontSize:"0.76rem",fontWeight:700,color:"var(--text-secondary)",marginBottom:"0.4rem"}}>{dt.icon} {dt.label}</p>
              <div className={`${s.dropZone} ${dragging===dt.key?s.dropZoneActive:""}`}
                onDragOver={e=>{e.preventDefault();setDragging(dt.key)}}
                onDragLeave={()=>setDragging(null)}
                onDrop={e=>handleDrop(e,dt.key)}
                onClick={()=>inputRefs.current[dt.key]?.click()}>
                <div className={s.dropIcon}><Ico.Upload/></div>
                <div className={s.dropTitle}>Drag & drop here</div>
                <div className={s.dropSubtitle}>PDF, PNG, JPG up to 10 MB</div>
                <button type="button" className={s.dropBrowse}
                  onClick={e=>{e.stopPropagation();inputRefs.current[dt.key]?.click()}}>
                  Browse Files
                </button>
                <input ref={el=>{inputRefs.current[dt.key]=el}} type="file" multiple hidden
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={e=>{if(e.target.files) addFiles(Array.from(e.target.files),dt.key); e.target.value="";}}/>
              </div>
            </div>
          ))}
        </div>

        {data.files.length > 0 && (
          <div className={s.fileList}>
            <div className={s.fileListHeader}>Attached Files ({data.files.length})</div>
            {data.files.map((f:UploadedFile)=>(
              <div key={f.id} className={s.fileItem}>
                <div className={s.fileIconWrap}><span style={{fontSize:"1rem"}}>{extIcon(f.name)}</span></div>
                <div className={s.fileInfo}>
                  <div className={s.fileName}>{f.name}</div>
                  <div className={s.fileMeta}>{DOC_TYPES.find(d=>d.key===f.docType)?.label || f.docType} · {f.size}</div>
                  {!f.done && (
                    <div className={s.fileProgress}>
                      <div className={s.fileProgressBar} style={{width:`${f.progress}%`}}/>
                    </div>
                  )}
                </div>
                <button type="button" className={s.fileRemoveBtn} onClick={()=>removeFile(f.id)} aria-label="Remove file">
                  <Ico.X/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Step 6: Review ── */
function Step6({ data, mode, goTo }: { data:FormData; mode:EventMode; goTo:(s:number)=>void }) {
  const field = (label:string, val:string|boolean|undefined) => val ? (
    <div className={s.reviewRow}>
      <span className={s.reviewLabel}>{label}</span>
      <span className={s.reviewValue}>{String(val)}</span>
    </div>
  ) : null;

  return (
    <div className={s.stepCardBody}>
      <p style={{fontSize:"0.82rem",color:"var(--text-secondary)"}}>
        Please review all information carefully before submitting for approval.
      </p>
      <div className={s.reviewGrid}>

        <div className={s.reviewSection}>
          <div className={s.reviewSectionHeader}>
            📋 Basic Information
            <button className={s.reviewEditBtn} onClick={()=>goTo(1)}>Edit</button>
          </div>
          <div className={s.reviewBody}>
            {field("Event Name", data.eventName || "—")}
            {field("Event Type", data.eventType || "—")}
            {field("Organizer",  data.organizer  || "—")}
            {field("Department", data.department || "—")}
            {field("Date",       data.eventDate  || "—")}
            {field("Time",       data.startTime ? `${data.startTime} – ${data.endTime}` : "—")}
            {field("Venue",      data.venue      || "—")}
            {field("Format",     data.format     || "—")}
          </div>
        </div>

        <div className={s.reviewSection}>
          <div className={s.reviewSectionHeader}>
            📝 Event Details
            <button className={s.reviewEditBtn} onClick={()=>goTo(2)}>Edit</button>
          </div>
          <div className={s.reviewBody}>
            {field("Description", data.description ? data.description.slice(0,100)+"…" : "—")}
            {field("Objectives",  data.objectives ? data.objectives.slice(0,80)+"…" : "—")}
            {field("Key Topics",  data.keyTopics  || "—")}
            {field("Outcome",     data.eventOutcome || "—")}
            {mode==="conducted" && field("Chief Guest",   data.chiefGuest    || "—")}
            {mode==="conducted" && field("Participants",  data.numParticipants || "—")}
            {mode==="conducted" && field("Audience",      data.targetAudience  || "—")}
          </div>
        </div>

        <div className={s.reviewSection}>
          <div className={s.reviewSectionHeader}>
            👤 Participation
            <button className={s.reviewEditBtn} onClick={()=>goTo(3)}>Edit</button>
          </div>
          <div className={s.reviewBody}>
            {field("Faculty Role",        data.facultyRole        || "—")}
            {mode==="attended" && field("Participation Type", data.participationType || "—")}
            {mode==="attended" && field("Certificate",        data.certAvailable ? "Available" : "Not Available")}
            {mode==="conducted" && field("Responsibility",    data.organizingResponsibility || "—")}
          </div>
        </div>

        <div className={s.reviewSection}>
          <div className={s.reviewSectionHeader}>
            🎯 SDG & Focus Areas
            <button className={s.reviewEditBtn} onClick={()=>goTo(4)}>Edit</button>
          </div>
          <div className={s.reviewBody}>
            <div className={s.reviewRow}>
              <span className={s.reviewLabel}>SDGs</span>
              <div>
                {data.sdgs.length > 0 ? (
                  <div className={s.reviewChips}>
                    {data.sdgs.map(n=><span key={n} className={s.reviewChip}>SDG {n}</span>)}
                  </div>
                ) : <span className={s.reviewValue}>None selected</span>}
              </div>
            </div>
            <div className={s.reviewRow}>
              <span className={s.reviewLabel}>Focus Areas</span>
              <div>
                {data.focusAreas.length > 0 ? (
                  <div className={s.reviewChips}>
                    {data.focusAreas.map(f=><span key={f} className={s.reviewChip}>{f}</span>)}
                  </div>
                ) : <span className={s.reviewValue}>None selected</span>}
              </div>
            </div>
          </div>
        </div>

        <div className={`${s.reviewSection} ${s.reviewFull}`}>
          <div className={s.reviewSectionHeader}>
            📎 Documents Attached
            <button className={s.reviewEditBtn} onClick={()=>goTo(5)}>Edit</button>
          </div>
          <div className={s.reviewBody}>
            {data.files.length > 0 ? (
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
                {data.files.map((f:UploadedFile)=>(
                  <span key={f.id} className={s.reviewChip}>📎 {f.name}</span>
                ))}
              </div>
            ) : (
              <span style={{fontSize:"0.82rem",color:"var(--text-muted)"}}>No documents attached</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════ */
export default function AddEventPage() {
  const router = useRouter();
  const [mode, setMode]       = useState<EventMode>("attended");
  const [step, setStep]       = useState(1);
  const [data, setData]       = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const setField = (k:keyof FormData, v:unknown) => setData(p=>({...p,[k]:v}));
  const goTo     = (n:number) => setStep(n);
  const progress = ((step-1)/5)*100;

  const stepTitles: Record<number,{title:string;sub:string}> = {
    1:{ title:"Basic Information",  sub:"Provide foundational details about the event." },
    2:{ title:"Event Details",      sub:"Describe the event content, objectives and outcomes." },
    3:{ title:"Participation",      sub:"Specify your role and level of involvement." },
    4:{ title:"SDG & Focus Areas",  sub:"Align this event with institutional goals." },
    5:{ title:"Supporting Documents", sub:"Upload certificates, approvals and evidence files." },
    6:{ title:"Review & Submit",    sub:"Confirm all details before sending for approval." },
  };

  return (
    <MainLayout
      breadcrumbs={[{label:"Dashboard",href:"/dashboard"},{label:"My Events",href:"/events"},{label:"Add Event"}]}
      userName="Sunil P"
    >
      {/* Header */}
      <div className={s.pageHeader}>
        <div className={s.pageTitleGroup}>
          <h1 className={s.pageTitle}>Add Event</h1>
          <p className={s.pageSubtitle}>Create a complete record of your academic or professional activity.</p>
        </div>
        <div className={s.headerActions}>
          <button className={s.discardBtn} onClick={()=>router.push("/events")}>Discard</button>
          <button className={s.draftBtn}><Ico.Save/> Save as Draft</button>
        </div>
      </div>

      {/* Mode Segmented Control */}
      <div className={s.segmentWrapper}>
        <div className={s.segment}>
          <button id="seg-attended" type="button"
            className={`${s.segBtn} ${mode==="attended"?s.segBtnActive:""}`}
            onClick={()=>{setMode("attended");setData(INITIAL);}}>
            🎓 Attended Event
          </button>
          <button id="seg-conducted" type="button"
            className={`${s.segBtn} ${mode==="conducted"?s.segBtnActive:""}`}
            onClick={()=>{setMode("conducted");setData({...INITIAL,facultyRole:"Coordinator"});}}>
            🎤 Conducted Event
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className={s.progressBar}>
        <div className={s.progressFill} style={{width:`${progress}%`}}/>
      </div>

      {/* Two-column layout */}
      <div className={s.formLayout}>
        {/* Step Navigator */}
        <nav className={s.stepNav} aria-label="Form steps">
          <div className={s.stepNavHeader}>Form Sections</div>
          <div className={s.stepNavList}>
            {STEPS.map((st,i)=>(
              <div key={st.num}>
                <button type="button"
                  className={`${s.stepNavItem} ${step===st.num?s.stepNavItemActive:""}`}
                  onClick={()=>goTo(st.num)}
                  aria-current={step===st.num?"step":undefined}>
                  <div className={`${s.stepCircle} ${step===st.num?s.stepCircleActive:""} ${step>st.num?s.stepCircleDone:""}`}>
                    {step>st.num ? <Ico.Check/> : st.num}
                  </div>
                  <div className={s.stepNavLabels}>
                    <div className={s.stepNavName}>{st.label}</div>
                    <div className={s.stepNavSub}>{st.sub}</div>
                  </div>
                </button>
                {i < STEPS.length-1 && <div className={s.stepConnector}/>}
              </div>
            ))}
          </div>
        </nav>

        {/* Step Content */}
        <div className={s.stepCard}>
          <div className={s.stepCardHeader}>
            <h2 className={s.stepCardTitle}>{stepTitles[step].title}</h2>
            <p className={s.stepCardSubtitle}>{stepTitles[step].sub}</p>
          </div>

          {step===1 && <Step1 data={data} set={setField} mode={mode}/>}
          {step===2 && <Step2 data={data} set={setField} mode={mode}/>}
          {step===3 && <Step3 data={data} set={setField} mode={mode}/>}
          {step===4 && <Step4 data={data} set={setField}/>}
          {step===5 && <Step5 data={data} set={setField}/>}
          {step===6 && <Step6 data={data} mode={mode} goTo={goTo}/>}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={s.bottomNav}>
        <div className={s.bottomLeft}>
          <button type="button" className={s.navDraftBtn}><Ico.Save/> Save as Draft</button>
        </div>
        <div className={s.bottomRight}>
          <button type="button" className={s.navBackBtn}
            disabled={step===1} onClick={()=>setStep(p=>Math.max(1,p-1))}>
            <Ico.Back/> Back
          </button>
          {step < 6 ? (
            <button id="continue-btn" type="button" className={s.navContinueBtn}
              onClick={()=>setStep(p=>Math.min(6,p+1))}>
              Continue <Ico.Arrow/>
            </button>
          ) : (
            <button id="submit-btn" type="button" className={s.navSubmitBtn}
              onClick={()=>setSubmitted(true)}>
              <Ico.Submit/> Submit for Approval
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {submitted && (
        <div className={s.successOverlay}>
          <div className={s.successCard}>
            <div className={s.successIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className={s.successTitle}>Event Submitted Successfully!</div>
            <p className={s.successSub}>
              Your event <strong>"{data.eventName || "record"}"</strong> has been submitted for HOD approval.
              You'll be notified once it's reviewed.
            </p>
            <div className={s.successBtns}>
              <button className={s.draftBtn} onClick={()=>{setSubmitted(false);setData(INITIAL);setStep(1);}}>
                Add Another
              </button>
              <button className={s.navContinueBtn} onClick={()=>router.push("/events")}>
                View My Events <Ico.Arrow/>
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
