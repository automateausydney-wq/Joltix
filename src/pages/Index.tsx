import { useState, useEffect, useRef } from "react";import { useState, useEffect, useRef } from "react";

function useAnimatedNumber(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const rateMap: Record<string, number> = {
  "Under $75/hr": 50,
  "$75-$150/hr": 112,
  "$150-$300/hr": 225,
  "$300+/hr": 400,
};

const jobValueMap: Record<string, number> = {
  "Under $5K": 3000,
  "$5K-$20K": 12500,
  "$20K-$60K": 40000,
  "$60K+": 90000,
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #1a2744" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", textAlign: "left" }}>
        <span style={{ color: "#ccd6f6", fontSize: 17, fontWeight: 600, lineHeight: 1.4, fontFamily: "DM Sans, sans-serif" }}>{q}</span>
        <span style={{ color: "#00E5FF", fontSize: 24, marginLeft: 16, flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <p style={{ color: "#778899", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px", paddingRight: 32, fontFamily: "DM Sans, sans-serif" }}>{a}</p>
      )}
    </div>
  );
}

export default function Index() {
  const [enquiries, setEnquiries] = useState(10);
  const [adminHours, setAdminHours] = useState(6);
  const [rate, setRate] = useState("$75-$150/hr");
  const [missedLeads, setMissedLeads] = useState(3);
  const [tradeType, setTradeType] = useState<"tradie" | "builder">("tradie");
  const [jobValue, setJobValue] = useState("$5K-$20K");
  const [navOpen, setNavOpen] = useState(false);

  const rateVal = rateMap[rate] ?? 112;
  const jobVal = jobValueMap[jobValue] ?? 12500;
  const adminLoss = Math.round(adminHours * 52 * rateVal);
  const leadLoss = tradeType === "builder"
    ? Math.round(missedLeads * 12 * jobVal)
    : Math.round(missedLeads * 12 * 650);
  const totalLoss = adminLoss + leadLoss;
  const recover = Math.round(totalLoss * 0.75);

  const animAdmin = useAnimatedNumber(adminLoss);
  const animLead = useAnimatedNumber(leadLoss);
  const animRecover = useAnimatedNumber(recover);

  const painReveal = useReveal();
  const howReveal = useReveal();
  const usecaseReveal = useReveal();
  const builderReveal = useReveal();
  const pricingReveal = useReveal();
  const calcReveal = useReveal();
  const socialReveal = useReveal();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080E1A", color: "white", fontFamily: "DM Sans, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .fd { font-family: 'Barlow Condensed', sans-serif; }
        .cyan { color: #00E5FF; }
        .card { background: #0D1526; border: 1px solid #1a2744; border-radius: 16px; }
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.show { opacity: 1; transform: translateY(0); }
        .btn-p { background: #00E5FF; color: #080E1A; font-weight: 700; border-radius: 10px; padding: 14px 28px; font-size: 16px; border: none; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-p:hover { background: #33ecff; transform: translateY(-2px); }
        .btn-o { background: transparent; color: #00E5FF; font-weight: 700; border-radius: 10px; padding: 14px 28px; font-size: 16px; border: 2px solid #00E5FF; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .grid-bg { background-image: linear-gradient(#1a274420 1px, transparent 1px), linear-gradient(90deg, #1a274420 1px, transparent 1px); background-size: 40px 40px; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 3px; background: #1a2744; outline: none; width: 100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #00E5FF; cursor: pointer; }
        select { background: #0D1526; color: white; border: 1px solid #1a2744; border-radius: 8px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; width: 100%; }
        .pop-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #00E5FF; color: #080E1A; font-weight: 800; font-size: 12px; padding: 4px 16px; border-radius: 999px; white-space: nowrap; }
        .tag { display: inline-block; background: #00E5FF18; color: #00E5FF; border: 1px solid #00E5FF44; border-radius: 999px; padding: 4px 14px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
        .whatsapp-btn { position: fixed; bottom: 24px; right: 24px; z-index: 999; background: #25D366; border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px #25D36666; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, #1a2744, transparent); margin: 0 auto; max-width: 1000px; }
        @media(max-width:640px) { .hide-mob { display: none !important; } }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#080E1Acc", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a2744" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div className="fd" style={{ fontSize: 28 }}><span className="cyan">JOLT</span>IX</div>
          <div className="hide-mob" style={{ display: "flex", gap: 24 }}>
            {["How It Works", "Pricing", "Builders"].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(/ /g, "-"))}
                style={{ background: "none", border: "none", color: "#8899aa", cursor: "pointer", fontSize: 15, fontFamily: "DM Sans, sans-serif" }}>
                {item}
              </button>
            ))}
          </div>
          <button className="btn-p" onClick={() => scrollTo("audit")} style={{ padding: "10px 22px", fontSize: 14 }}>Book Free Audit</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div className="tag" style={{ marginBottom: 24 }}>Sydney-Based - Results in 48 Hours</div>
          <h1 className="fd" style={{ fontSize: "clamp(48px,8vw,96px)", lineHeight: 0.95, margin: "0 0 28px" }}>
            STOP LOSING JOBS<br /><span className="cyan">TO MISSED CALLS</span><br />AND SLOW FOLLOW-UPS
          </h1>
          <p style={{ fontSize: "clamp(17px,2.5vw,22px)", color: "#8899bb", maxWidth: 680, margin: "0 auto 16px", lineHeight: 1.6 }}>
            Joltix sets up AI automations for <strong style={{ color: "#ccd6f6" }}>builders, sparkies, plumbers, concreters and landscapers</strong> — quotes, follow-ups and reminders running automatically while you are on the tools.
          </p>
          <p style={{ fontSize: 15, color: "#556070", marginBottom: 40 }}>Done in 48 hours. Flat fee. No lock-in.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <button className="btn-p" id="audit" onClick={() => scrollTo("book")} style={{ fontSize: 18, padding: "16px 36px" }}>Book Free Audit</button>
            <button className="btn-o" onClick={() => scrollTo("how-it-works")}>See How It Works</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px", justifyContent: "center" }}>
            {["Done in 48 hours", "No lock-in contracts", "Australian-owned", "Works on any phone", "100% money-back guarantee"].map(t => (
              <span key={t} style={{ color: "#667788", fontSize: 14 }}>checkmark {t}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* PAIN POINTS */}
      <section style={{ padding: "80px 20px" }}>
        <div ref={painReveal.ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="tag" style={{ marginBottom: 16 }}>Sound Familiar?</div>
            <h2 className={`fd reveal ${painReveal.visible ? "show" : ""}`} style={{ fontSize: "clamp(36px,5vw,60px)", margin: 0 }}>
              STILL DOING THIS <span className="cyan">MANUALLY?</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              { icon: "📞", title: "Missing calls on the tools", body: "You are on the roof, under a sink, or driving between jobs — and a lead just called and hung up." },
              { icon: "📋", title: "Quotes going cold", body: "You sent the quote, they went quiet, and you feel awkward chasing — so you do not. Job goes to someone else." },
              { icon: "🕐", title: "Manual appointment reminders", body: "You are texting clients the night before every job, one by one, from your personal phone." },
              { icon: "💸", title: "Leads disappearing", body: "You are too busy on-site to reply to new enquiries fast. By the time you do, they have moved on." },
              { icon: "📱", title: "Apps that do not talk to each other", body: "Your bookings are in one place, quotes in another, and invoices somewhere else. Chaos." },
              { icon: "😤", title: "Sunday night admin sessions", body: "Your weekend ends sitting at the kitchen table catching up on follow-ups that should have been done Wednesday." },
            ].map((p, i) => (
              <div key={i} className={`card reveal ${painReveal.visible ? "show" : ""}`} style={{ padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
                <h3 className="fd" style={{ fontSize: 22, margin: "0 0 8px" }}>{p.title}</h3>
                <p style={{ color: "#778899", fontSize: 15, margin: 0, lineHeight: 1.6 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "80px 20px" }}>
        <div ref={howReveal.ref} style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="tag" style={{ marginBottom: 16 }}>Simple Process</div>
            <h2 className={`fd reveal ${howReveal.visible ? "show" : ""}`} style={{ fontSize: "clamp(36px,5vw,60px)", margin: 0 }}>
              HOW <span className="cyan">JOLTIX</span> WORKS
            </h2>
            <p style={{ color: "#778899", marginTop: 16, fontSize: 17 }}>Three steps. Zero tech skills needed.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { num: "01", icon: "🔍", title: "Free 15-Min Audit", body: "You tell us your biggest admin headache. We map out exactly what to automate first." },
              { num: "02", icon: "⚡", title: "We Build It in 48 Hours", body: "We set up your automation using tools you already have. You do not touch a thing." },
              { num: "03", icon: "🤖", title: "It Runs Itself", body: "Your leads get replied to, quotes get followed up, reminders go out — automatically, 24/7." },
            ].map((s, i) => (
              <div key={i} className={`card reveal ${howReveal.visible ? "show" : ""}`} style={{ padding: 32, position: "relative" }}>
                <div className="fd" style={{ fontSize: 64, color: "#1a2744", position: "absolute", top: 16, right: 20, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                <h3 className="fd" style={{ fontSize: 26, margin: "0 0 12px" }}>{s.title}</h3>
                <p style={{ color: "#778899", fontSize: 15, margin: 0, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* PRICING */}
      <section id="pricing" style={{ padding: "80px 20px" }}>
        <div ref={pricingReveal.ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="tag" style={{ marginBottom: 16 }}>Simple Pricing</div>
            <h2 className={`fd reveal ${pricingReveal.visible ? "show" : ""}`} style={{ fontSize: "clamp(36px,5vw,60px)", margin: "0 0 12px" }}>
              FLAT FEES. <span className="cyan">NO SURPRISES.</span>
            </h2>
            <p style={{ color: "#778899", fontSize: 17 }}>All packages include free audit, full setup, and support window.</p>
          </div>

          <div style={{ display: "flex", gap: 0, justifyContent: "center", marginBottom: 48, background: "#0D1526", borderRadius: 12, padding: 4, width: "fit-content", margin: "0 auto 48px" }}>
            {(["tradie", "builder"] as const).map(t => (
              <button key={t} onClick={() => setTradeType(t)}
                style={{ padding: "10px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, fontFamily: "DM Sans, sans-serif", transition: "all 0.2s", background: tradeType === t ? (t === "builder" ? "#ff9800" : "#00E5FF") : "transparent", color: tradeType === t ? "#080E1A" : "#778899" }}>
                {t === "tradie" ? "Solo Tradie" : "Builder / Renovator"}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {(tradeType === "tradie" ? [
              { name: "Starter", price: 199, tag: "", tagline: "Perfect for solo tradies just getting started.", features: ["1 automation (you choose)", "Free 15-min audit", "We handle 100% of setup", "Works with tools you already have", "7-day email support", "Done within 48 hours"] },
              { name: "Growth", price: 449, tag: "Most Popular", tagline: "Stop losing leads and run on autopilot.", features: ["3 automations (you choose)", "Free 30-min strategy audit", "Priority 24-hr delivery", "CRM/calendar integration", "14-day email + WhatsApp support", "Handover walkthrough video"] },
              { name: "Pro", price: 799, tag: "", tagline: "Full automation for serious operators.", features: ["Up to 5 automations", "Full workflow mapping (45 min)", "Custom-built for your tools", "Same-day priority delivery", "30-day support + 1 free tweak", "Optional: $149/mo retainer"] },
            ] : [
              { name: "Builder Starter", price: 799, tag: "", tagline: "Solo builder ready to stop losing quotes.", features: ["Quote follow-up sequence (3-step)", "Missed call text-back", "Free 30-min strategy audit", "We handle 100% of setup", "14-day support", "Done within 48 hours"] },
              { name: "Builder Growth", price: 1499, tag: "Best Value", tagline: "Serious builder, serious automations.", features: ["5 automations custom-built", "Quote + invoice + review sequence", "Subcontractor reminders", "Client update sequence", "Priority 24-hr delivery", "30-day support + 2 free tweaks"] },
              { name: "Builder Pro", price: 2999, tag: "", tagline: "Full operation automation for growing teams.", features: ["Up to 8 automations", "Full workflow mapping session", "CRM + job management integration", "Team coordination workflows", "Same-day delivery", "$299/mo retainer option"] },
            ]).map((pkg, i) => (
              <div key={i} className={`card reveal ${pricingReveal.visible ? "show" : ""}`}
                style={{ padding: 32, position: "relative", border: pkg.tag ? "2px solid #00E5FF" : "1px solid #1a2744" }}>
                {pkg.tag && <div className="pop-badge">{pkg.tag}</div>}
                <h3 className="fd" style={{ fontSize: 28, margin: "0 0 4px" }}>{pkg.name}</h3>
                <p style={{ color: "#778899", fontSize: 14, margin: "0 0 20px" }}>{pkg.tagline}</p>
                <div style={{ marginBottom: 24 }}>
                  <span className="fd" style={{ fontSize: 52 }}>$<span className="cyan">{pkg.price.toLocaleString()}</span></span>
                  <span style={{ color: "#556070", fontSize: 15 }}> AUD one-off</span>
                </div>
                <div style={{ marginBottom: 28 }}>
                  {pkg.features.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <span style={{ color: "#00E5FF" }}>checkmark</span>
                      <span style={{ fontSize: 15, color: "#ccd6f6", lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-p" onClick={() => scrollTo("book")}
                  style={{ width: "100%", background: pkg.tag ? "#00E5FF" : "transparent", color: pkg.tag ? "#080E1A" : "#00E5FF", border: pkg.tag ? "none" : "2px solid #00E5FF" }}>
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40, padding: 20, background: "#0D1526", borderRadius: 12, border: "1px solid #1a2744" }}>
            <p style={{ margin: 0, fontSize: 16, color: "#ccd6f6" }}>
              100% Money-Back Guarantee — If your automation is not live in 48 hours, you get a full refund. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section id="calculator" style={{ padding: "80px 20px", background: "#0a1020" }}>
        <div ref={calcReveal.ref} style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ marginBottom: 16 }}>Free Calculator</div>
            <h2 className={`fd reveal ${calcReveal.visible ? "show" : ""}`} style={{ fontSize: "clamp(36px,5vw,60px)", margin: "0 0 12px" }}>
              HOW MUCH IS MANUAL ADMIN<br /><span className="cyan">COSTING YOUR BUSINESS?</span>
            </h2>
          </div>
          <div className="card" style={{ padding: "40px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <label style={{ fontSize: 15, color: "#ccd6f6", fontWeight: 600 }}>New enquiries per week</label>
                    <span style={{ color: "#00E5FF", fontWeight: 700 }}>{enquiries}</span>
                  </div>
                  <input type="range" min={1} max={50} value={enquiries} onChange={e => setEnquiries(+e.target.value)} />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <label style={{ fontSize: 15, color: "#ccd6f6", fontWeight: 600 }}>Admin hours wasted per week</label>
                    <span style={{ color: "#00E5FF", fontWeight: 700 }}>{adminHours} hrs</span>
                  </div>
                  <input type="range" min={1} max={20} value={adminHours} onChange={e => setAdminHours(+e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 15, color: "#ccd6f6", fontWeight: 600, display: "block", marginBottom: 10 }}>
                    {tradeType === "builder" ? "Average job/project value" : "Your hourly rate"}
                  </label>
                  {tradeType === "builder" ? (
                    <select value={jobValue} onChange={e => setJobValue(e.target.value)}>
                      {Object.keys(jobValueMap).map(k => <option key={k}>{k}</option>)}
                    </select>
                  ) : (
                    <select value={rate} onChange={e => setRate(e.target.value)}>
                      {Object.keys(rateMap).map(k => <option key={k}>{k}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <label style={{ fontSize: 15, color: "#ccd6f6", fontWeight: 600 }}>Leads lost per month</label>
                    <span style={{ color: "#00E5FF", fontWeight: 700 }}>{missedLeads}</span>
                  </div>
                  <input type="range" min={0} max={20} value={missedLeads} onChange={e => setMissedLeads(+e.target.value)} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Lost in unbilled admin time/year", value: animAdmin },
                  { label: "Missed leads cost you/year", value: animLead },
                ].map((r, i) => (
                  <div key={i} style={{ background: "#080E1A", borderRadius: 12, padding: "20px 24px", border: "1px solid #1a2744" }}>
                    <p style={{ color: "#778899", fontSize: 14, margin: "0 0 8px" }}>{r.label}</p>
                    <p className="fd" style={{ fontSize: 40, margin: 0, color: "#ff4455" }}>${r.value.toLocaleString()}</p>
                  </div>
                ))}
                <div style={{ background: "linear-gradient(135deg, #001a22, #002233)", borderRadius: 12, padding: 24, border: "1px solid #00E5FF44" }}>
                  <p style={{ color: "#00E5FF", fontSize: 14, margin: "0 0 8px", fontWeight: 600 }}>Joltix could recover up to</p>
                  <p className="fd" style={{ fontSize: 52, margin: "0 0 4px", color: "#00E5FF" }}>${animRecover.toLocaleString()}</p>
                  <p style={{ color: "#778899", fontSize: 13, margin: "0 0 16px" }}>per year — starting from just ${tradeType === "builder" ? "799" : "199"}</p>
                  <button className="btn-p" onClick={() => scrollTo("book")} style={{ width: "100%", fontSize: 15 }}>Fix This Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: "80px 20px" }}>
        <div ref={socialReveal.ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="tag" style={{ marginBottom: 16 }}>What Tradies Say</div>
            <h2 className={`fd reveal ${socialReveal.visible ? "show" : ""}`} style={{ fontSize: "clamp(36px,5vw,60px)", margin: 0 }}>
              RESULTS THAT <span className="cyan">SPEAK FOR THEMSELVES</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { name: "Jake M.", trade: "Plumber - Western Sydney", quote: "I was missing 4-5 calls a week on the tools. Joltix set up a missed-call text-back in a day. Got 2 new jobs from it the first week. Paid for itself immediately." },
              { name: "Marcus T.", trade: "Electrician - Penrith", quote: "Sceptical at first — I am not a tech person at all. They just set it up and it works. The appointment reminders alone save me hours a week." },
              { name: "Dave R.", trade: "Builder - Parramatta", quote: "Sent a $48K renovation quote, client went quiet. Joltix follow-up brought them back on day 5. That job alone was 60x the cost of the package." },
            ].map((t, i) => (
              <div key={i} className={`card reveal ${socialReveal.visible ? "show" : ""}`} style={{ padding: 32, borderLeft: "4px solid #00E5FF" }}>
                <div style={{ marginBottom: 16 }}>{"star".repeat(5)}</div>
                <p style={{ color: "#ccd6f6", fontSize: 16, lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>{t.quote}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#00E5FF22", display: "flex", alignItems: "center", justifyContent: "center", color: "#00E5FF", fontWeight: 700 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{t.name}</p>
                    <p style={{ margin: 0, color: "#778899", fontSize: 13 }}>{t.trade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK */}
      <section id="book" style={{ padding: "80px 20px", background: "linear-gradient(135deg, #001a2e 0%, #080E1A 100%)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="tag" style={{ marginBottom: 24 }}>Book Your Free Audit</div>
          <h2 className="fd" style={{ fontSize: "clamp(36px,6vw,72px)", margin: "0 0 20px", lineHeight: 0.95 }}>
            READY TO STOP<br /><span className="cyan">LOSING JOBS?</span>
          </h2>
          <p style={{ color: "#778899", fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>
            Book a free 15-minute audit. We will map out exactly what to automate first — no tech skills, no commitment, no pressure.
          </p>
          <div className="card" style={{ padding: "40px 32px", boxShadow: "0 0 24px #00E5FF55" }}>
            <div style={{ display: "grid", gap: 16 }}>
              {[
                { label: "Your name", type: "text", placeholder: "e.g. Jake Morrison" },
                { label: "Your trade", type: "text", placeholder: "e.g. Builder, Plumber, Electrician..." },
                { label: "Phone number", type: "tel", placeholder: "04XX XXX XXX" },
                { label: "Biggest admin headache?", type: "text", placeholder: "e.g. Quoting, missed calls, follow-ups..." },
              ].map((f, i) => (
                <div key={i} style={{ textAlign: "left" }}>
                  <label style={{ display: "block", color: "#778899", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    style={{ width: "100%", background: "#080E1A", border: "1px solid #1a2744", borderRadius: 10, padding: "12px 16px", color: "white", fontSize: 16, fontFamily: "DM Sans, sans-serif", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <button className="btn-p" style={{ width: "100%", fontSize: 18, padding: 16, marginTop: 8 }}
                onClick={() => alert("Booked! We will send a WhatsApp confirmation within 2 hours.")}>
                Book My Free Audit
              </button>
              <p style={{ color: "#445566", fontSize: 13, margin: 0, textAlign: "center" }}>No spam. We will confirm via WhatsApp within 2 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="fd" style={{ fontSize: "clamp(32px,5vw,56px)", margin: 0 }}>QUICK <span className="cyan">ANSWERS</span></h2>
          </div>
          {[
            { q: "Do I need any technical skills?", a: "None. We handle 100% of the setup. You just answer a few questions about how your business works and approve the finished automation before it goes live." },
            { q: "What tools do I need to already have?", a: "Most automations use free tools — Gmail, Google Sheets, Calendly, and a phone number. If you use ServiceM8, Tradify or something specific, we will build around it." },
            { q: "How does the 48-hour guarantee work?", a: "Once we have everything we need from you after the audit, your automation is live within 48 hours — or you get a full refund. Simple as that." },
            { q: "I am a builder with bigger jobs. Is this worth it?", a: "100%. One recovered quote at your average project value pays for the Builder package 20-80 times over." },
            { q: "Can I add more automations later?", a: "Yes. Purchase any package again, or jump on the monthly retainer to get ongoing tweaks and new automations as your business grows." },
          ].map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#050a12", padding: "48px 20px 32px", borderTop: "1px solid #1a2744" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <div className="fd" style={{ fontSize: 32, marginBottom: 8 }}><span className="cyan">JOLT</span>IX</div>
              <p style={{ color: "#445566", fontSize: 14, margin: 0 }}>Built for Australian tradies and builders. Sydney-based. Results in 48 hours.</p>
            </div>
            <div>
              <p style={{ color: "#ccd6f6", fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Contact</p>
              <p style={{ color: "#445566", fontSize: 14, margin: "0 0 8px" }}>hello@joltix.com.au</p>
              <p style={{ color: "#445566", fontSize: 14, margin: "0 0 8px" }}>Sydney, NSW</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1a2744", paddingTop: 24 }}>
            <p style={{ color: "#334455", fontSize: 13, margin: 0 }}>2026 Joltix. Australian-owned. Sydney, NSW.</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP */}
      <a href="https://wa.me/61400000000" target="_blank" rel="noreferrer" className="whatsapp-btn">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
