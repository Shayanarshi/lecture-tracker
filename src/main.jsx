import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Flame,
  Search,
  RotateCcw,
  Target,
  Circle,
  GraduationCap,
  CalendarDays,
  ArrowUpRight,
  Play,
} from "lucide-react";
import "./styles.css";

const lessons = [
  { number: 71, date: "16-Oct-26", duration: "55:53", day: 1 },
  { number: 72, date: "16-Oct-26", duration: "74:37", day: 1 },
  { number: 73, date: "16-Oct-26", duration: "71:49", day: 1 },

  { number: 74, date: "17-Oct-26", duration: "69:18", day: 2 },
  { number: 75, date: "17-Oct-26", duration: "76:54", day: 2 },
  { number: 76, date: "17-Oct-26", duration: "70:09", day: 2 },
  { number: 78, date: "17-Oct-26", duration: "72:20", day: 2 },
  { number: 79, date: "17-Oct-26", duration: "74:26", day: 2 },
  { number: 80, date: "17-Oct-26", duration: "52:52", day: 2 },

  { number: 81, date: "18-Oct-26", duration: "61:14", day: 3 },
  { number: 82, date: "18-Oct-26", duration: "76:40", day: 3 },
  { number: 83, date: "18-Oct-26", duration: "82:17", day: 3 },
  { number: 84, date: "18-Oct-26", duration: "70:52", day: 3 },
  { number: 85, date: "18-Oct-26", duration: "72:58", day: 3 },

  { number: 86, date: "19-Oct-26", duration: "60:33", day: 4 },
  { number: 87, date: "19-Oct-26", duration: "69:23", day: 4 },
  { number: 88, date: "19-Oct-26", duration: "70:44", day: 4 },
  { number: 89, date: "19-Oct-26", duration: "54:39", day: 4 },
  { number: 90, date: "19-Oct-26", duration: "59:29", day: 4 },
  { number: 91, date: "19-Oct-26", duration: "66:31", day: 4 },

  { number: 92, date: "20-Oct-26", duration: "61:29", day: 5 },
  { number: 93, date: "20-Oct-26", duration: "70:56", day: 5 },
  { number: 94, date: "20-Oct-26", duration: "70:43", day: 5 },
  { number: 95, date: "20-Oct-26", duration: "66:21", day: 5 },
  { number: 96, date: "20-Oct-26", duration: "61:23", day: 5 },

  { number: 97, date: "21-Oct-26", duration: "61:30", day: 6 },
  { number: 98, date: "21-Oct-26", duration: "73:50", day: 6 },
  { number: 99, date: "21-Oct-26", duration: "61:22", day: 6 },
  { number: 100, date: "21-Oct-26", duration: "58:10", day: 6 },
  { number: 101, date: "21-Oct-26", duration: "73:24", day: 6 },
];

const STORAGE_KEY = "sbwms-lecture-progress-v1";
const dayDescriptions = {
  1: "Start strong — 3 lectures",
  2: "Build your momentum",
  3: "Keep the consistency",
  4: "Stay on track",
  5: "Almost at the finish line",
  6: "Finish strong",
};

function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(value) ? value : []);
  } catch {
    return new Set();
  }
}

function durationToMinutes(duration) {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes + seconds / 60;
}

function formatDuration(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  return hours ? `${hours}h ${mins}m` : `${mins} min`;
}

function App() {
  const [completed, setCompleted] = useState(readProgress);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeDay, setActiveDay] = useState("all");
  const [showReset, setShowReset] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed]);

  const completedCount = completed.size;
  const remainingCount = lessons.length - completedCount;
  const progress = Math.round((completedCount / lessons.length) * 100);
  const nextLesson = lessons.find((lesson) => !completed.has(lesson.number));
  const totalMinutes = lessons.reduce(
    (total, lesson) => total + durationToMinutes(lesson.duration),
    0
  );
  const remainingMinutes = lessons
    .filter((lesson) => !completed.has(lesson.number))
    .reduce((total, lesson) => total + durationToMinutes(lesson.duration), 0);

  const visibleLessons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const isComplete = completed.has(lesson.number);
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && isComplete) ||
        (filter === "pending" && !isComplete);
      const matchesDay =
        activeDay === "all" || lesson.day === Number(activeDay);
      const searchable =
        `lecture ${lesson.number} ${lesson.date} ${lesson.duration}`.toLowerCase();
      return (
        matchesFilter &&
        matchesDay &&
        searchable.includes(normalizedQuery)
      );
    });
  }, [query, filter, activeDay, completed]);

  const groupedLessons = useMemo(() => {
    return [1, 2, 3, 4, 5, 6]
      .map((day) => ({
        day,
        lessons: visibleLessons.filter((lesson) => lesson.day === day),
      }))
      .filter((group) => group.lessons.length > 0);
  }, [visibleLessons]);

  function toggleLesson(number) {
    setCompleted((current) => {
      const updated = new Set(current);
      if (updated.has(number)) updated.delete(number);
      else updated.add(number);
      return updated;
    });
  }

  function exportProgress() {
    const data = {
      course: "91-SBWMS-11AM-20-May-26-Shekher",
      exportedAt: new Date().toISOString(),
      completedLectures: [...completed].sort((a, b) => a - b),
      remainingLectures: lessons
        .map((lesson) => lesson.number)
        .filter((number) => !completed.has(number)),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lecture-progress.json";
    link.click();
    URL.revokeObjectURL(url);
    setToast("Progress exported successfully");
    window.setTimeout(() => setToast(""), 2500);
  }

  function resetProgress() {
    setCompleted(new Set());
    setShowReset(false);
    setToast("Progress reset");
    window.setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><GraduationCap size={22} /></div>
          <div>
            <div className="brand-name">LearnTrack</div>
            <div className="brand-caption">PERSONAL LEARNING</div>
          </div>
        </div>
        <div className="sidebar-label">WORKSPACE</div>
        <div className="nav-item nav-item-active">
          <BookOpen size={18} />
          <span>My learning</span>
        </div>
        <div className="sidebar-course">
          <div className="course-icon"><BookOpen size={18} /></div>
          <div className="min-w-0">
            <div className="course-small">CURRENT COURSE</div>
            <div className="course-title">SBWMS · Shekher</div>
            <div className="course-subtitle">{remainingCount} lectures remaining</div>
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-tip-icon"><Target size={18} /></div>
          <p className="sidebar-tip-title">Small steps add up.</p>
          <p className="sidebar-tip-text">Stay consistent and celebrate every lecture you finish.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">My learning <span>/</span> <strong>Lecture tracker</strong></div>
          <div className="topbar-right">
            <span className="saved-indicator"><span /> Progress saved</span>
            <div className="avatar">SA</div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><Flame size={15} /> YOUR LEARNING JOURNEY</div>
              <h1>Keep your momentum going.</h1>
              <p className="welcome-copy">
                One lecture at a time. Complete your SBWMS course from 16–21 October 2026.
              </p>
            </div>
            <div className="target-pill"><CalendarDays size={16} /> 6-day completion plan</div>
          </section>

          <section className="hero-card">
            <div className="hero-content">
              <div className="hero-label"><span className="hero-dot" /> COURSE OVERVIEW</div>
              <h2>SBWMS · Shekher</h2>
              <p>91-SBWMS-11AM-20-May-26-Shekher</p>
              <div className="hero-progress-heading">
                <span>Overall completion</span>
                <strong>{progress}%</strong>
              </div>
              <div className="hero-progress-track">
                <div className="hero-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="hero-progress-foot">
                <span>{completedCount} of {lessons.length} lectures completed</span>
                <span>{remainingCount} to go</span>
              </div>
            </div>
            <div className="hero-illustration" aria-hidden="true">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="book-stack">
                <div className="book book-back" />
                <div className="book book-middle" />
                <div className="book book-front"><BookOpen size={38} strokeWidth={1.5} /></div>
              </div>
              <div className="floating-check"><Check size={19} /></div>
              <div className="floating-star">✦</div>
            </div>
          </section>

          <section className="stats-grid">
            <StatCard icon={<CheckCircle2 size={19} />} label="Completed" value={completedCount} note="Great progress" tone="green" />
            <StatCard icon={<BookOpen size={19} />} label="Remaining" value={remainingCount} note="Keep it moving" tone="blue" />
            <StatCard icon={<Clock3 size={19} />} label="Video time left" value={formatDuration(remainingMinutes)} note={`${formatDuration(totalMinutes)} total course time`} tone="violet" />
            <StatCard icon={<Target size={19} />} label="Your target" value="6 days" note="16–21 Oct 2026" tone="amber" />
          </section>

          <section className="content-grid">
            <div className="lessons-panel">
              <div className="section-heading">
                <div>
                  <h2>Your study plan</h2>
                  <p>Check off each lecture as you complete it.</p>
                </div>
                <button className="text-button" onClick={exportProgress}>
                  <Download size={16} /> Export
                </button>
              </div>

              <div className="filters">
                <div className="search-box">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search lectures..."
                    aria-label="Search lectures"
                  />
                  {query && <button className="clear-search" onClick={() => setQuery("")}>×</button>}
                </div>
                <label className="select-wrap">
                  <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter lectures">
                    <option value="all">All status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ChevronDown size={15} />
                </label>
              </div>

              <div className="day-tabs" aria-label="Filter by study day">
                <button className={activeDay === "all" ? "day-tab active" : "day-tab"} onClick={() => setActiveDay("all")}>All days</button>
                {[1, 2, 3, 4, 5, 6].map((day) => (
                  <button key={day} className={activeDay === String(day) ? "day-tab active" : "day-tab"} onClick={() => setActiveDay(String(day))}>Day {day}</button>
                ))}
              </div>

              <div className="lesson-groups">
                {groupedLessons.map(({ day, lessons: dayLessons }) => {
                  const finished = dayLessons.filter((lesson) => completed.has(lesson.number)).length;
                  const actualDayTotal = lessons.filter((lesson) => lesson.day === day).length;
                  const actualDayDone = lessons.filter((lesson) => lesson.day === day && completed.has(lesson.number)).length;
                  return (
                    <section className="day-group" key={day}>
                      <div className="day-heading">
                        <div className="day-number">{String(day).padStart(2, "0")}</div>
                        <div className="day-title-block">
                          <h3>Day {day} <span>{dayDescriptions[day]}</span></h3>
                          <p>{actualDayDone} of {actualDayTotal} lectures completed</p>
                        </div>
                        <div className="day-progress">
                          <div className="mini-progress"><span style={{ width: `${(actualDayDone / actualDayTotal) * 100}%` }} /></div>
                          <span>{Math.round((actualDayDone / actualDayTotal) * 100)}%</span>
                        </div>
                      </div>

                      <div className="lesson-list">
                        {dayLessons.map((lesson) => {
                          const isDone = completed.has(lesson.number);
                          return (
                            <button
                              key={lesson.number}
                              className={`lesson-row ${isDone ? "lesson-row-done" : ""}`}
                              onClick={() => toggleLesson(lesson.number)}
                              aria-pressed={isDone}
                            >
                              <span className={`lesson-check ${isDone ? "checked" : ""}`}>
                                {isDone && <Check size={15} strokeWidth={2.5} />}
                              </span>
                              <span className="lesson-number">{String(lesson.number).padStart(2, "0")}</span>
                              <span className="lesson-info">
                                <span className="lesson-name">Lecture {lesson.number}</span>
                                <span className="lesson-date"><CalendarDays size={13} /> {lesson.date}</span>
                              </span>
                              <span className="lesson-duration"><Clock3 size={14} /> {lesson.duration}</span>
                              <span className={`lesson-status ${isDone ? "status-done" : ""}`}>
                                {isDone ? "Completed" : "To do"}
                              </span>
                              {!isDone && <ArrowUpRight className="lesson-arrow" size={16} />}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
                {groupedLessons.length === 0 && (
                  <div className="empty-state">
                    <Search size={25} />
                    <strong>No lectures found</strong>
                    <span>Try another search or filter.</span>
                    <button onClick={() => { setQuery(""); setFilter("all"); setActiveDay("all"); }}>Clear filters</button>
                  </div>
                )}
              </div>

              <div className="panel-footer">
                <span>Showing {visibleLessons.length} of {lessons.length} lectures</span>
                <button className="reset-button" onClick={() => setShowReset(true)}><RotateCcw size={14} /> Reset progress</button>
              </div>
            </div>

            <aside className="right-column">
              <section className="next-card">
                <div className="next-card-top"><span className="next-icon"><Play size={17} fill="currentColor" /></span><span className="up-next">UP NEXT</span></div>
                {nextLesson ? (
                  <>
                    <h3>Lecture {nextLesson.number}</h3>
                    <p className="next-date">{nextLesson.date}</p>
                    <div className="next-duration"><Clock3 size={15} /> {nextLesson.duration}</div>
                    <button className="primary-button" onClick={() => toggleLesson(nextLesson.number)}>
                      <CheckCircle2 size={16} /> Mark as completed
                    </button>
                  </>
                ) : (
                  <>
                    <div className="finished-icon"><CheckCircle2 size={34} /></div>
                    <h3>Course complete!</h3>
                    <p className="next-date">You've completed all listed lectures.</p>
                  </>
                )}
              </section>

              <section className="routine-card">
                <div className="routine-heading"><Target size={18} /><h3>Daily target</h3></div>
                <div className="routine-big">3–6 <span>lectures / day</span></div>
                <p>Follow your six-day plan from 16–21 October. Day 1 has 3 lectures; the remaining days have 5–6 each.</p>
                <div className="routine-days">
                  {[1, 2, 3, 4, 5, 6].map((day) => {
                    const dayLessons = lessons.filter((lesson) => lesson.day === day);
                    const count = dayLessons.filter((lesson) => completed.has(lesson.number)).length;
                    const done = count === dayLessons.length;
                    return <div className="routine-day" key={day}><span className={`routine-day-check ${done ? "complete" : ""}`}>{done ? <Check size={12} /> : day}</span><span>Day {day}</span><span className="routine-count">{count}/{dayLessons.length}</span></div>;
                  })}
                </div>
              </section>

              <section className="tip-card">
                <div className="tip-icon"><Flame size={18} /></div>
                <h3>Keep the streak alive</h3>
                <p>Progress beats perfection. Even one completed lecture is a step forward.</p>
              </section>
            </aside>
          </section>

          <footer className="app-footer">
            <span><span className="footer-dot" /> Progress saves in this browser only (not synced across devices).</span>
            <span>Built for your learning journey <span className="footer-heart">♥</span></span>
          </footer>
        </div>
      </main>

      {showReset && (
        <div className="modal-backdrop" role="presentation" onClick={() => setShowReset(false)}>
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-icon"><RotateCcw size={22} /></div>
            <h2 id="reset-title">Reset your progress?</h2>
            <p>This will mark all lectures as pending. This action cannot be undone unless you have exported a backup.</p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowReset(false)}>Keep progress</button>
              <button className="danger-button" onClick={resetProgress}>Reset all</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  );
}

function StatCard({ icon, label, value, note, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
