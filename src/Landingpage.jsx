import React, { useEffect, useRef, useState } from "react";

const START_SPOTS = 9352;

export default function App() {
  const [spotsLeft, setSpotsLeft] = useState(() => {
    const saved = localStorage.getItem("envision_spots_left");
    return saved ? parseInt(saved, 10) : START_SPOTS;
  });
  const [success, setSuccess] = useState(false);
  const leftRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft(prev => {
        const change = Math.floor(Math.random() * 3);
        if (change > 0 && prev > 8700) {
          const updated = prev - change;
          localStorage.setItem("envision_spots_left", updated);
          return updated;
        }
        return prev;
      });
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (leftRef.current) {
      leftRef.current.textContent = spotsLeft.toLocaleString();
    }
  }, [spotsLeft]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setSpotsLeft(prev => {
      const updated = Math.max(0, prev - 1);
      localStorage.setItem("envision_spots_left", updated);
      return updated;
    });
    e.target.reset();
  };

  const handleShare = async (e) => {
    e.preventDefault();
    const shareData = {
      title: "EnvisionNow.TV Early Access",
      text: "Join the first wave of EnvisionNow.TV — Watch. Create. Earn. Get Discovered.",
      url: "https://www.envisionnow.tv"
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      e.target.textContent = "Link Copied";
      setTimeout(() => (e.target.textContent = "Share Page"), 1800);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg: #030305;
          --surface: rgba(14,14,18,.78);
          --red: #e50914;
          --red2: #97000a;
          --gold: #f7c55d;
          --text: #ffffff;
          --muted: #b8b8c7;
          --line: rgba(255,255,255,.14);
        }
        * { box-sizing: border-box; }
        body, #root {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, Arial, Helvetica, sans-serif;
          min-height: 100vh;
        }
        body::before, #root::before {
          content: "";
          position: fixed;
          inset: 0;
          background:
            url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2400&q=80");
          background-size: cover;
          background-position: center;
          z-index: -2;
        }
        body::after, #root::after {
          content: "";
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 5px);
          z-index: -1;
          pointer-events: none;
        }
        .wrap {
          width: min(1220px, 100%);
          margin: 0 auto;
          padding: 34px 20px 28px;
        }
        .top {
          text-align: center;
          margin-bottom: 22px;
        }
        .logo {
          width: min(360px, 78vw);
          height: auto;
          display: block;
          margin: 0 auto 12px;
          filter: drop-shadow(0 0 40px rgba(229,9,20,.32));
          border-radius: 18px;
        }
        .brand {
          font-size: clamp(30px, 5vw, 64px);
          line-height: .92;
          letter-spacing: .08em;
          font-weight: 950;
          margin: 0;
          text-transform: uppercase;
        }
        .tag {
          color: var(--muted);
          font-size: clamp(14px, 2vw, 20px);
          margin: 12px auto 0;
          max-width: 850px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          background: rgba(247,197,93,.10);
          border: 1px solid rgba(247,197,93,.35);
          border-radius: 999px;
          padding: 10px 16px;
          margin: 22px 0 12px;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .headline {
          font-size: clamp(42px, 8vw, 100px);
          line-height: .9;
          letter-spacing: -.07em;
          text-transform: uppercase;
          text-align: center;
          margin: 10px auto 18px;
          max-width: 1050px;
        }
        .red { color: var(--red); text-shadow: 0 0 34px rgba(229,9,20,.42); }
        .intro {
          max-width: 980px;
          margin: 0 auto 32px;
          text-align: center;
          color: #ddd;
          font-size: clamp(16px, 2vw, 22px);
          line-height: 1.45;
        }
        .grid {
          display: grid;
          grid-template-columns: .95fr 1.05fr;
          gap: 26px;
          align-items: stretch;
        }
        .panel {
          background: linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.04));
          border: 1px solid var(--line);
          border-radius: 30px;
          box-shadow: 0 30px 90px rgba(0,0,0,.58);
          backdrop-filter: blur(18px);
          padding: clamp(22px, 3vw, 38px);
          overflow: hidden;
        }
        .features {
          display: grid;
          gap: 15px;
          margin-bottom: 28px;
        }
        .feature {
          display: flex;
          gap: 13px;
          align-items: flex-start;
          padding: 15px;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 18px;
          background: rgba(0,0,0,.25);
        }
        .icon {
          color: var(--red);
          font-size: 24px;
          width: 30px;
          text-align: center;
        }
        .feature strong {
          display: block;
          font-size: 17px;
          margin-bottom: 4px;
        }
        .feature span {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.35;
        }
        .signup h2 {
          font-size: clamp(30px, 4vw, 48px);
          line-height: .95;
          margin: 0 0 10px;
          text-transform: uppercase;
          letter-spacing: -.04em;
        }
        .signup p {
          color: var(--muted);
          line-height: 1.5;
          margin: 0 0 18px;
        }
        .counter {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 18px 0 22px;
        }
        .counter-card {
          border: 1px solid rgba(229,9,20,.30);
          background: rgba(229,9,20,.10);
          border-radius: 18px;
          padding: 16px;
          text-align: center;
        }
        .counter-card b {
          display: block;
          font-size: clamp(32px, 4vw, 54px);
          line-height: .95;
          color: var(--gold);
        }
        .counter-card span {
          display: block;
          margin-top: 6px;
          color: #eee;
          text-transform: uppercase;
          letter-spacing: .08em;
          font-size: 12px;
          font-weight: 900;
        }
        form {
          display: grid;
          gap: 13px;
        }
        label {
          display: block;
          font-size: 12px;
          color: rgba(255,255,255,.72);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: 7px;
        }
        input, select {
          width: 100%;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(0,0,0,.38);
          color: white;
          border-radius: 15px;
          padding: 15px;
          font-size: 16px;
          outline: none;
        }
        input:focus, select:focus {
          border-color: rgba(247,197,93,.85);
          box-shadow: 0 0 0 4px rgba(247,197,93,.12);
        }
        select option { background: #111; }
        button {
          border: 0;
          border-radius: 17px;
          padding: 17px 20px;
          background: linear-gradient(135deg, var(--red), var(--red2));
          color: white;
          font-size: 16px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .08em;
          cursor: pointer;
          box-shadow: 0 18px 45px rgba(229,9,20,.32);
        }
        .mini {
          font-size: 12px;
          color: rgba(255,255,255,.55) !important;
          margin-top: 10px !important;
        }
        .poster-box {
          position: relative;
          min-height: 100%;
          display: grid;
          align-items: center;
        }
        .flag {
          color: var(--gold);
          font-size: 13px;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
          margin-bottom: 14px;
          text-align: center;
        }
        .poster {
          width: 100%;
          display: block;
          border-radius: 18px;
          border: 1px solid rgba(229,9,20,.55);
          box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 0 55px rgba(229,9,20,.35);
        }
        .poster-caption {
          margin-top: 16px;
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 18px;
          text-align: center;
          background: rgba(0,0,0,.34);
        }
        .poster-caption strong {
          display: block;
          font-size: clamp(24px, 3vw, 40px);
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .poster-caption span {
          display: block;
          margin-top: 6px;
          color: var(--muted);
          letter-spacing: .1em;
          text-transform: uppercase;
          font-size: 13px;
          font-weight: 900;
        }
        .bottom-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-top: 26px;
        }
        .bottom-card {
          text-align: center;
          padding: 18px 10px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 18px;
          background: rgba(0,0,0,.22);
        }
        .bottom-card b {
          display: block;
          margin: 8px 0 6px;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: .08em;
        }
        .bottom-card span {
          color: var(--muted);
          font-size: 12px;
          line-height: 1.3;
        }
        footer {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-top: 26px;
          color: rgba(255,255,255,.56);
          font-size: 13px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255,255,255,.10);
          padding-top: 18px;
        }
        footer a { color: rgba(255,255,255,.8); text-decoration: none; }
        .success {
          display: none;
          background: rgba(34,197,94,.13);
          border: 1px solid rgba(34,197,94,.4);
          color: #d7ffe5;
          padding: 14px;
          border-radius: 15px;
          font-weight: 800;
          margin-top: 12px;
        }
        .success.show { display: block; }
        @media (max-width: 980px) {
          .grid { grid-template-columns: 1fr; }
          .bottom-grid { grid-template-columns: repeat(2, 1fr); }
          .counter { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .wrap { padding: 20px 14px; }
          .logo { width: min(320px, 94vw); }
          .panel { border-radius: 22px; }
          .bottom-grid { grid-template-columns: 1fr; }
        }
        .share-box {
          margin-top: 18px;
          border: 1px solid rgba(247,197,93,.24);
          background: rgba(247,197,93,.07);
          border-radius: 18px;
          padding: 16px;
        }
        .share-box strong {
          display: block;
          font-size: 15px;
          margin-bottom: 6px;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .share-box p {
          margin: 0 0 12px !important;
          font-size: 13px;
          color: rgba(255,255,255,.76) !important;
          line-height: 1.4;
        }
        .share-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .share-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          border-radius: 13px;
          border: 1px solid rgba(255,255,255,.14);
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .06em;
          background: rgba(0,0,0,.30);
          cursor: pointer;
        }
        .share-btn.primary {
          background: linear-gradient(135deg, var(--red), var(--red2));
          border: 0;
        }
        .social-row {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          margin-top: 22px;
          flex-wrap: wrap;
        }
        .social-row a {
          color: white;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(255,255,255,.07);
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .06em;
        }
      `}</style>
      <main className="wrap">
        <section className="top">
          <img className="logo" src="/logo.png" alt="EnvisionNow.TV Logo" />
          <h1 className="brand">EnvisionNow.TV</h1>
          <div className="tag">Streaming. Creators. Gaming. Casting. Merch. Podcasts. Audiobooks. In-scene purchases. <br /> <span className="red">Coming Soon.</span></div>
          <div className="badge">Early Access</div>
          <div className="headline">Watch. Create. Earn. <span className="red">Get Discovered.</span></div>
          <div className="intro">Join the first wave. Unlock exclusive content, early access, and opportunities for fans, creators, actors, brands, and investors. Built for the culture. Powered by Redemption.</div>
        </section>
        <section className="grid">
          <div className="panel poster-box">
            <div>
              <div className="poster-caption">
                <strong>32 Degreez Teaser</strong>
                <span>Unlocked after signup</span>
              </div>
            </div>
          </div>
          <div className="panel signup">
            <h2>Request Early Access</h2>
            <p>Be the first to know. Get exclusive updates and unlock the 32 Degreez teaser.</p>
            <div className="counter">
              <div className="counter-card">
                <b ref={leftRef}>{spotsLeft.toLocaleString()}</b>
                <span>Spots Left</span>
              </div>
              <div className="counter-card">
                <b>2026</b>
                <span>Launch Year</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@email.com" required />
              </div>
              <div>
                <label htmlFor="phone">Phone for Early Alerts</label>
                <input id="phone" name="phone" type="tel" placeholder="501-000-0000" />
              </div>
              <div>
                <label htmlFor="city">City / State</label>
                <input id="city" name="city" placeholder="Little Rock, AR" />
              </div>
              <div>
                <label htmlFor="social_link">Instagram / TikTok / YouTube</label>
                <input id="social_link" name="social_link" type="url" placeholder="https://instagram.com/yourname" />
              </div>
              <div>
                <label htmlFor="role">I’m joining as a</label>
                <select id="role" name="role" required>
                  <option value="">Select one</option>
                  <option>Fan / Viewer</option>
                  <option>Creator / Influencer</option>
                  <option>Actor / Actress</option>
                  <option>Filmmaker / Producer</option>
                  <option>Gamer / Streamer</option>
                  <option>Brand / Advertiser</option>
                  <option>Investor / Partner</option>
                </select>
              </div>
              <input type="hidden" name="source" value="coming_soon_page" />
              <input type="hidden" name="campaign" value="early_access" />
              <input type="hidden" name="referral_source" id="referral_source" value="direct" />
              <button type="submit">Request Early Access</button>
              <div className={"success" + (success ? " show" : "") } id="successMessage">
                <strong>You’re In.</strong><br />
                You just joined the first wave of EnvisionNow.TV.<br />
                Built for the culture. Powered by Redemption.<br />
                Your 32 Degreez teaser access is now unlocked below.
              </div>
            </form>
            <div className="share-box">
              <strong>Share with friends</strong>
              <p>Invite your friends to join the first wave and unlock more exclusive content.</p>
              <div className="share-actions">
                <button className="share-btn primary" onClick={handleShare}>Share Page</button>
                <a className="share-btn" href="mailto:?subject=EnvisionNow.TV Early Access&body=Join the first wave of EnvisionNow.TV — Watch. Create. Earn. Get Discovered. https://www.envisionnow.tv">Email Invite</a>
              </div>
            </div>
          </div>
        </section>
        <section className="bottom-grid">
          <div className="bottom-card"><div>🎞️</div><b>Movies & Series</b><span>Originals, classics, indie cinema.</span></div>
          <div className="bottom-card"><div>📡</div><b>Live</b><span>Creators, events, real-time energy.</span></div>
          <div className="bottom-card"><div>🎮</div><b>Gaming</b><span>Play, compete, level up.</span></div>
          <div className="bottom-card"><div>🛒</div><b>Shop</b><span>Products from your favorite scenes.</span></div>
          <div className="bottom-card"><div>⭐</div><b>Opportunity</b><span>Actors, creators, brands, investors.</span></div>
        </section>
        <div className="social-row">
          <a href="https://www.instagram.com/theofficialrichardstjohn" target="_blank" rel="noopener">Instagram</a>
          <a href="https://www.envisionnow.tv" target="_blank" rel="noopener">Website</a>
          <a href="mailto:info@envisionnow.tv">Email</a>
        </div>
        <footer>
          <span>© 2026 EnvisionNow.TV</span>
          <span>Built for the culture. Powered by Redemption.</span>
          <a href="mailto:info@envisionnow.tv">info@envisionnow.tv</a>
        </footer>
      </main>
    </>
  );
}