import { ImageResponse } from "next/og";

export const alt = "Unbox ASMR Roblox Guide — real gameplay, verified data, no made-up codes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", padding: 76, background: "#FFF9F0", color: "#252A34", fontFamily: "sans-serif" }}><div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 58, border: "2px solid #E9E2D7", borderRadius: 36, background: "white" }}><div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 28, fontWeight: 700 }}><span style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, background: "#F2B84B", color: "#3D2E10" }}>U</span><span>Unbox ASMR Guide</span></div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", flexDirection: "column", fontSize: 66, lineHeight: 1.05, fontWeight: 800, letterSpacing: -3 }}><span>Unbox ASMR Roblox</span><span>Guide &amp; Verified Wiki</span></div><div style={{ marginTop: 24, color: "#667085", fontSize: 28 }}>Real gameplay. Verified data. No made-up codes.</div></div><div style={{ display: "flex", gap: 16, color: "#2F6FB2", fontSize: 23, fontWeight: 700 }}>Independent fan guide · Checked July 30, 2026</div></div></div>, size);
}
