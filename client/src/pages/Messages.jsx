// pages/Messages.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import "./Messages.css";

const MOCK_CONVERSATIONS = [
  {
    id: "c1",
    name: "Nikola J.",
    username: "nikolaphoto",
    avatar: null,
    lastMessage: "Dogovaramo termin za subotu?",
    lastTime: "10:24",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", from: "them", text: "Ej, video sam Showcase — brutalan!", time: "09:58" },
      { id: "m2", from: "you", text: "Hvala! Aj da odradimo city walk?", time: "10:02" },
      { id: "m3", from: "them", text: "Dogovaramo termin za subotu?", time: "10:24" },
    ],
  },
  {
    id: "c2",
    name: "Marko L.",
    username: "markolens",
    avatar: null,
    lastMessage: "Šaljem ti RAW fajlove večeras.",
    lastTime: "09:13",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", from: "them", text: "Treba mi pomoć oko exporta za print.", time: "08:37" },
      { id: "m2", from: "you", text: "Pošalji RAW, pa ću ti poslati parametre.", time: "08:55" },
      { id: "m3", from: "them", text: "Šaljem ti RAW fajlove večeras.", time: "09:13" },
    ],
  },
  {
    id: "c3",
    name: "Ana K.",
    username: "anak",
    avatar: null,
    lastMessage: "Može li nedelja oko 17h?",
    lastTime: "Yesterday",
    unread: 0,
    online: true,
    messages: [
      { id: "m1", from: "them", text: "Zanima me portrait sesh u centru.", time: "Yesterday 14:02" },
      { id: "m2", from: "you", text: "Može! Subota ili nedelja posle 16h.", time: "Yesterday 14:10" },
      { id: "m3", from: "them", text: "Može li nedelja oko 17h?", time: "Yesterday 14:11" },
    ],
  },
];

const TABS = ["All", "Unread"];

const Messages = () => {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0]?.id || null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // za mobilni

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  // Filter + search
  const filtered = useMemo(() => {
    let list = [...conversations];
    if (tab === "Unread") list = list.filter((c) => c.unread > 0);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.username.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, tab, query]);

  // Označi kao pročitano kad otvoriš razgovor
  useEffect(() => {
    if (!active) return;
    if (active.unread > 0) {
      setConversations((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, unread: 0 } : c))
      );
    }
  }, [activeId]); // eslint-disable-line

  // scroll na dno kad se promeni active ili stigne nova poruka
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, conversations]);

  // slanje poruke
  const [draft, setDraft] = useState("");
  const onSend = () => {
    const text = draft.trim();
    if (!text || !active) return;
    const time = new Date();
    const hh = String(time.getHours()).padStart(2, "0");
    const mm = String(time.getMinutes()).padStart(2, "0");

    const newMsg = { id: "m" + Date.now(), from: "you", text, time: `${hh}:${mm}` };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              lastMessage: text,
              lastTime: `${hh}:${mm}`,
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );
    setDraft("");
    setIsTyping(false);

    // simulacija odgovora za demo
    setTimeout(() => setIsTyping(true), 500);
    setTimeout(() => {
      const reply = {
        id: "m" + (Date.now() + 1),
        from: "them",
        text: "👍",
        time: `${hh}:${mm}`,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === active.id
            ? {
                ...c,
                lastMessage: reply.text,
                lastTime: `${hh}:${mm}`,
                messages: [...c.messages, reply],
              }
            : c
        )
      );
      setIsTyping(false);
    }, 1200);
  };

  // Enter za slanje, Shift+Enter novi red
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <main className="messages-page">
      {/* HERO */}
      <section className="messages-hero" role="banner" aria-label="Messages hero">
        <div className="hero-inner">
          <h1 className="hero-title">Messages</h1>
          <p className="hero-subtitle">Direct chat sa fotografima i klijentima.</p>
          <div className="hero-cta">
            <button className="btn-outline" onClick={() => setSidebarOpen((s) => !s)}>
              {sidebarOpen ? "Close conversations" : "Open conversations"}
            </button>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* LAYOUT */}
      <section className="messages-layout" aria-label="Messages layout">
        {/* SIDEBAR */}
        <aside className={`msg-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-head">
            <div className="tabs">
              {TABS.map((t) => (
                <button
                  key={t}
                  className={`tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                  aria-pressed={tab === t}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="search">
              <input
                type="search"
                placeholder="Search chats…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search conversations"
              />
            </div>
          </div>

          <div className="conv-list">
            {filtered.map((c) => (
              <button
                key={c.id}
                className={`conv-item ${activeId === c.id ? "active" : ""}`}
                onClick={() => {
                  setActiveId(c.id);
                  setSidebarOpen(false);
                }}
              >
                <div className="avatar" data-online={c.online}>
                  {c.avatar ? (
                    <img src={c.avatar} alt={c.name} />
                  ) : (
                    <span>{(c.name || c.username).slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <div className="meta">
                  <div className="top">
                    <strong className="name">{c.name}</strong>
                    <span className="time">{c.lastTime}</span>
                  </div>
                  <div className="bottom">
                    <span className="snippet">{c.lastMessage}</span>
                    {c.unread > 0 && <span className="unread">{c.unread}</span>}
                  </div>
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="empty-state">
                <p>No conversations found.</p>
              </div>
            )}
          </div>
        </aside>

        {/* CHAT */}
        <section className="chat-panel">
          {!active ? (
            <div className="chat-empty">
              <p>Select a conversation to start chatting.</p>
            </div>
          ) : (
            <>
              <header className="chat-head">
                <div className="left">
                  <button
                    className="only-mobile back"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Back to conversations"
                  >
                    ←
                  </button>
                  <div className="avatar" data-online={active.online}>
                    <span>{active.name.slice(0, 1).toUpperCase()}</span>
                  </div>
                  <div className="who">
                    <strong>{active.name}</strong>
                    <small className="status">{active.online ? "Online" : "Offline"}</small>
                  </div>
                </div>
                <div className="right">
                  <button className="icon-btn" title="Search in chat">🔎</button>
                  <button className="icon-btn" title="More">⋯</button>
                </div>
              </header>

              <div className="chat-body">
                {active.messages.map((m) => (
                  <div key={m.id} className={`msg ${m.from === "you" ? "you" : "them"}`}>
                    <div className="bubble">
                      <p>{m.text}</p>
                      <span className="time">{m.time}</span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="msg them">
                    <div className="bubble typing">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <footer className="chat-input">
                <button className="icon-btn" title="Attach">📎</button>
                <textarea
                  placeholder="Write a message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                />
                <button className="send-btn" onClick={onSend} title="Send">➤</button>
              </footer>
            </>
          )}
        </section>
      </section>
    </main>
  );
};

export default Messages;
