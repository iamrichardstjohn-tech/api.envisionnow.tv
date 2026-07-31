import React from "react";

const EnvisionNowCommercial = () => (
  <div
    style={{
      background: "linear-gradient(120deg, #1e90ff 0%, #e6b85c 100%)",
      color: "#fff",
      borderRadius: 18,
      boxShadow: "0 4px 32px #1e90ff33",
      padding: "2.5rem 1.5rem",
      maxWidth: 540,
      margin: "3rem auto",
      textAlign: "center",
      fontFamily: "Arial Black, Arial, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}
  >
    <video
      src="/envision-now-tv-flash.mov"
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: "100%",
        maxWidth: 400,
        borderRadius: 12,
        margin: "0 auto 1.5rem auto",
        boxShadow: "0 2px 16px #0008",
        display: "block"
      }}
    />
    <h1 style={{ fontSize: "2.4em", margin: "0.5em 0 0.2em 0", color: "#fff" }}>
      EnvisionNow.TV
    </h1>
    <h2 style={{ color: "#e6b85c", fontWeight: 700, marginBottom: 18 }}>
      Stream. Create. Connect.
    </h2>
    <p style={{ fontSize: "1.18em", margin: "1.2em 0", color: "#fff" }}>
      Discover a world of movies, live events, and exclusive content for creators and fans. Upload your own reels, join casting calls, and connect with a vibrant creative community—all in one place.
    </p>
    <ul style={{ listStyle: "none", padding: 0, margin: "1.5em 0", color: "#fff", fontSize: "1.08em", textAlign: "left", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
      <li>✔️ 1000s of movies & shows</li>
      <li>✔️ Public domain classics & new releases</li>
      <li>✔️ Upload your own film reels</li>
      <li>✔️ Live chat & member events</li>
      <li>✔️ Monetize your creativity</li>
      <li>✔️ Family & kids content</li>
    </ul>
    <a
      href="https://www.envisionnow.tv/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        background: "#e6b85c",
        color: "#232428",
        fontWeight: 700,
        fontSize: "1.18em",
        borderRadius: 8,
        padding: "0.8em 2em",
        marginTop: "1.2em",
        textDecoration: "none",
        boxShadow: "0 2px 8px #e6b85c55"
      }}
    >
      Start Watching Free
    </a>
    <div style={{ marginTop: "2em", fontSize: "1em", color: "#fff", opacity: 0.7 }}>
      EnvisionNow.TV – Streaming for Creators, Dreamers, and Families.
    </div>
  </div>
);

export default EnvisionNowCommercial;