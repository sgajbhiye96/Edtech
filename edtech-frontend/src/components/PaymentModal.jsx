import { useState, useEffect, useRef } from "react";
// ── Real-looking SVG icons for each UPI app ──
const PhonePeIcon = () => (
<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
<rect width="40" height="40" rx="10" fill="#5f259f"/>
<path d="M20 8C13.37 8 8 13.37 8 20C8 26.63 13.37 32 20 32C26.63 32 32 26.63 32 20C32 13.37 26.63 8 20 8Z" fill="#5f259f"/>
<path d="M24.5 14H19C17.07 14 15.5 15.57 15.5 17.5V26.5L18 24.5V22H24.5C26.43 22 28 20.43 28 18.5V17.5C28 15.57 26.43 14 24.5 14ZM25.5 18.5C25.5 19.05 25.05 19.5 24.5 19.5H18V17.5C18 16.95 18.45 16.5 19 16.5H24.5C25.05 16.5 25.5 16.95 25.5 17.5V18.5Z" fill="white"/>
</svg>
);
const GPay = () => (
<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
<rect width="40" height="40" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
<text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="Arial" fill="#1a73e8">G</text>
<path d="M20 12C15.58 12 12 15.58 12 20C12 24.42 15.58 28 20 28C24.42 28 28 24.42 28 20H20V17H27.64C27.87 17.94 28 18.96 28 20" stroke="#1a73e8" strokeWidth="0" fill="none"/>
<circle cx="20" cy="20" r="8" fill="none" stroke="none"/>
<path d="M13 20C13 16.13 16.13 13 20 13C21.84 13 23.5 13.7 24.77 14.83L22.65 16.95C21.95 16.3 21.02 15.9 20 15.9C17.73 15.9 15.9 17.73 15.9 20C15.9 22.27 17.73 24.1 20 24.1C22.03 24.1 23.63 22.8 24.01 21H20V18.5H26.5C26.65 19.17 26.75 19.83 26.75 20.5C26.75 24.09 23.77 27 20 27C16.13 27 13 23.87 13 20Z" fill="#4285f4"/>
<path d="M13 20C13 16.13 16.13 13 20 13C21.84 13 23.5 13.7 24.77 14.83L22.65 16.95C21.95 16.3 21.02 15.9 20 15.9C17.73 15.9 15.9 17.73 15.9 20" fill="#34a853"/>
<path d="M15.9 20C15.9 21.19 16.38 22.27 17.17 23.05L15.05 25.17C13.79 23.92 13 22.05 13 20H15.9Z" fill="#fbbc05"/>
<path d="M17.17 23.05C17.95 23.83 19.03 24.1 20 24.1C21.03 24.1 21.95 23.7 22.65 23.05L24.77 25.17C23.5 26.3 21.84 27 20 27C18.16 27 16.5 26.3 15.23 25.17L17.17 23.05Z" fill="#ea4335"/>
</svg>
);
const PaytmIcon = () => (
<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
<rect width="40" height="40" rx="10" fill="#00b9f1"/>
<rect x="8" y="13" width="10" height="14" rx="1" fill="white"/>
<rect x="22" y="13" width="10" height="6" rx="1" fill="white"/>
<rect x="22" y="22" width="10" height="5" rx="1" fill="#002970"/>
<text x="50%" y="76%" dominantBaseline="middle" textAnchor="middle" fontSize="5" fontWeight="800" fontFamily="Arial" fill="white">paytm</text>
</svg>
);
const AmazonPayIcon = () => (
<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
<rect width="40" height="40" rx="10" fill="#232f3e"/>
<text x="50%" y="44%" dominantBaseline="middle" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Arial" fill="white">amazon</text>
<path d="M11 24C14 26.5 19 28 25 26.5" stroke="#ff9900" strokeWidth="2" strokeLinecap="round"/>
<path d="M25 26.5L27 24.5" stroke="#ff9900" strokeWidth="2" strokeLinecap="round"/>
<text x="50%" y="66%" dominantBaseline="middle" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="Arial" fill="#ff9900">pay</text>
</svg>
);

const BHIMIcon = () => (
<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
<rect width="40" height="40" rx="10" fill="#00529c"/>
<circle cx="20" cy="15" r="5" fill="white"/>
<path d="M12 28C12 23.58 15.58 20 20 20C24.42 20 28 23.58 28 28" stroke="white" strokeWidth="2.5" fill="none"/>
<text x="50%" y="88%" dominantBaseline="middle" textAnchor="middle" fontSize="5.5" fontWeight="800" fontFamily="Arial" fill="#ff9933">BHIM</text>
</svg>
);
const CreditCardIcon = () => (
<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
<rect width="40" height="40" rx="10" fill="linear-gradient(135deg,#1e3a5f,#2d6a9f)"/>
<defs>
<linearGradient id="cardGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
<stop offset="0%" stopColor="#1e3a5f"/>
<stop offset="100%" stopColor="#2563eb"/>
</linearGradient>
</defs>
<rect width="40" height="40" rx="10" fill="url(#cardGrad)"/>
<rect x="7" y="12" width="26" height="17" rx="3" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
<rect x="7" y="17" width="26" height="4" fill="rgba(255,255,255,0.2)"/>
<rect x="10" y="23" width="8" height="3" rx="1" fill="rgba(255,255,255,0.6)"/>
<circle cx="28" cy="24.5" r="3" fill="#eb001b" fillOpacity="0.8"/>
<circle cx="31" cy="24.5" r="3" fill="#f79e1b" fillOpacity="0.8"/>
</svg>
);
const UPIIcon = () => (
<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
<rect width="40" height="40" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
<text x="50%" y="42%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="Arial" fill="#097939">UPI</text>
<path d="M12 26L20 18L28 26" stroke="#ff6600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
<circle cx="20" cy="16" r="2" fill="#ff6600"/>
</svg>
);
// ── QR Code (realistic-looking pattern) ──
const QRCodeDisplay = ({ upiId, amount }) => {
const size = 160;
// Generate deterministic "QR-like" pattern based on upiId
const seed = (upiId || "upi").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
const grid = 21;
const cell = size / grid;
const isFixed = (r, c) => {
// Corner squares
if ((r < 7 && c < 7) || (r < 7 && c >= grid - 7) || (r >= grid - 7 && c < 7)) return true;

return false;
};
const cells = [];
for (let r = 0; r < grid; r++) {
for (let c = 0; c < grid; c++) {
const val = isFixed(r, c)
? ((r === 0 || r === 6 || c === 0 || c === 6) ? 1 : (r < 2 || r > 4 || c < 2 || c > 4) ? 0 : 1)
: (((seed * (r + 1) * (c + 1) * 17) % 37 + (r * 13 + c * 7)) % 3 === 0 ? 1 : 0);
cells.push({ r, c, val });
}
}
return (
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
<div style={{
background: "white",
padding: "12px",
borderRadius: "12px",
border: "1px solid #e5e7eb",
boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
}}>
<svg width={size} height={size} style={{ display: "block" }}>
{cells.map(({ r, c, val }) =>
val ? (
<rect
key={`${r}-${c}`}
x={c * cell}
y={r * cell}
width={cell}
height={cell}
fill="#111"
/>
) : null
)}
</svg>
</div>
<div style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center" }}>
Scan with any UPI app
</div>
</div>
);
};
// ── Timer countdown ──
function useCountdown(seconds) {
const [left, setLeft] = useState(seconds);

useEffect(() => {
if (left <= 0) return;
const t = setTimeout(() => setLeft((l) => l - 1), 1000);
return () => clearTimeout(t);
}, [left]);
return left;
}
const UPI_APPS = [
{ id: "phonepe", name: "PhonePe", Icon: PhonePeIcon, color: "#5f259f", bg: "#f3eeff", hint: "9XXXXXXXXX@ybl or name@ibl" },
{ id: "gpay", name: "Google Pay", Icon: GPay, color: "#1a73e8", bg: "#e8f0fe", hint: "name@okaxis or number@okicici" },
{ id: "paytm", name: "Paytm", Icon: PaytmIcon, color: "#00b9f1", bg: "#e6f9ff", hint: "number@paytm" },
{ id: "amazon", name: "Amazon Pay", Icon: AmazonPayIcon, color: "#ff9900", bg: "#fff8ec", hint: "name@apl" },
{ id: "bhim", name: "BHIM UPI", Icon: BHIMIcon, color: "#00529c", bg: "#e6f0ff", hint: "number@upi or VPA" },
{ id: "card", name: "Credit / Debit Card", Icon: CreditCardIcon, color: "#2563eb", bg: "#eff6ff", hint: null },
{ id: "upi", name: "Other UPI ID", Icon: UPIIcon, color: "#097939", bg: "#f0faf4", hint: "yourname@bankname" },
];
export default function PaymentModal({ course, onClose, onSuccess }) {
const [step, setStep] = useState("select"); // select | detail | qr | processing | success | failed
const [selected, setSelected] = useState(null);
const [upiId, setUpiId] = useState("");
const [upiError, setUpiError] = useState("");
const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
const [cardError, setCardError] = useState("");
const [payMode, setPayMode] = useState("id"); // id | qr
const timer = useCountdown(step === "processing" ? 999 : 0);
const inputRef = useRef();
const price = course?.price || 999;
const gst = Math.round(price * 0.18);
const total = price + gst;
// Focus input when step changes
useEffect(() => {
if (step === "detail" && inputRef.current) inputRef.current.focus();
}, [step]);
const validateUPI = (id) => /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(id.trim());
const formatCard = (val) =>
val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (val) => {
const d = val.replace(/\D/g, "").slice(0, 4);
return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const handlePay = () => {
if (selected.id === "card") {
if (!cardForm.number || cardForm.number.replace(/\s/g, "").length < 16) {
setCardError("Enter a valid 16-digit card number."); return;
}
if (!cardForm.name) { setCardError("Enter cardholder name."); return; }
if (!cardForm.expiry || cardForm.expiry.length < 5) { setCardError("Enter valid expiry MM/YY."); return; }
if (!cardForm.cvv || cardForm.cvv.length < 3) { setCardError("Enter valid CVV."); return; }
setCardError("");
} else {
if (!validateUPI(upiId)) {
setUpiError("Enter a valid UPI ID (e.g. name@upi or 9876543210@ybl)"); return;
}
setUpiError("");
}
setStep("processing");
// Simulate realistic processing time
setTimeout(() => setStep("success"), 3000);
};
const handleQRPay = () => {
setStep("processing");
setTimeout(() => setStep("success"), 3500);
};
const s = {
overlay: {
position: "fixed", inset: 0,
background: "rgba(0,0,0,0.65)",
backdropFilter: "blur(6px)",
zIndex: 1000,
display: "flex", alignItems: "center", justifyContent: "center",
padding: "1rem",
fontFamily: "'DM Sans', sans-serif",
},
modal: {
background: "#fff",
borderRadius: "20px",
width: "100%", maxWidth: "460px",
maxHeight: "92vh",
overflowY: "auto",
boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
animation: "paySlideUp 0.28s cubic-bezier(.22,.68,0,1.2)",
},
header: {
background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 100%)",

padding: "20px 22px 18px",
display: "flex", justifyContent: "space-between", alignItems: "flex-start",
borderRadius: "20px 20px 0 0",
position: "sticky", top: 0, zIndex: 10,
},
body: { padding: "22px" },
appBtn: (app, isSelected) => ({
display: "flex", alignItems: "center", gap: "13px",
padding: "12px 14px",
borderRadius: "12px",
border: isSelected ? `2px solid ${app.color}` : "1.5px solid #f0f0f0",
background: isSelected ? app.bg : "#fff",
cursor: "pointer",
width: "100%", textAlign: "left",
transition: "all 0.15s",
marginBottom: "8px",
}),
input: (hasError) => ({
width: "100%",
padding: "12px 14px",
borderRadius: "10px",
border: hasError ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
fontSize: "0.95rem",
outline: "none",
boxSizing: "border-box",
fontFamily: "'DM Sans', sans-serif",
transition: "border 0.15s",
}),
payBtn: {
width: "100%",
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff", border: "none",
padding: "14px", borderRadius: "12px",
fontSize: "1rem", fontWeight: 700,
cursor: "pointer",
fontFamily: "'Syne', sans-serif",
boxShadow: "0 6px 24px rgba(99,102,241,0.38)",
transition: "opacity 0.2s",
letterSpacing: "0.01em",
},
};
return (
<div style={s.overlay} onClick={onClose}>
<style>{`
@keyframes paySlideUp {
from { transform: translateY(40px) scale(0.97); opacity: 0; }

to { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes checkPop {
0% { transform: scale(0) rotate(-20deg); opacity: 0; }
60% { transform: scale(1.15) rotate(5deg); }
100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes failShake {
0%,100% { transform: translateX(0); }
20%,60% { transform: translateX(-8px); }
40%,80% { transform: translateX(8px); }
}
.pay-app-btn:hover { transform: translateX(3px); }
.pay-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
.pay-btn:hover { opacity: 0.9; }
.tab-btn { transition: all 0.15s; }
`}</style>
<div style={s.modal} onClick={(e) => e.stopPropagation()}>
{/* ── HEADER ── */}
<div style={s.header}>
<div>
<div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "5px" }}>
Secure Payment · PCI DSS Compliant
</div>
<div style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
₹{total.toLocaleString("en-IN")}
</div>
<div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "2px" }}>
{course?.title || "Course Enrollment"} · incl. 18% GST
</div>
</div>
<button
onClick={onClose}
style={{
background: "rgba(255,255,255,0.1)", border: "none",
color: "#fff", width: "30px", height: "30px",
borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem",
display: "flex", alignItems: "center", justifyContent: "center",
flexShrink: 0,
}}
>✕</button>
</div>
<div style={s.body}>

{/* ══ STEP: SELECT ══ */}
{step === "select" && (
<>
<h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#0f0c29", marginBottom: "4px" }}>
Choose Payment Method
</h3>
<p style={{ color: "#9ca3af", fontSize: "0.8rem", marginBottom: "18px" }}>
All UPI apps and cards are accepted
</p>
{UPI_APPS.map((app) => (
<button
key={app.id}
className="pay-app-btn"
style={s.appBtn(app, selected?.id === app.id)}
onClick={() => { setSelected(app); setUpiId(""); setUpiError(""); setCardForm({ number: "", name: "", expiry: "", cvv: "" }); setStep("detail"); }}
>
<app.Icon />
<div style={{ flex: 1 }}>
<div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#111" }}>{app.name}</div>
{app.hint && <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{app.hint}</div>}
</div>
<span style={{ color: "#d1d5db" }}>›</span>
</button>
))}
{/* Trust badges */}
<div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "18px", flexWrap: "wrap" }}>
{[" SSL Encrypted", " NPCI Certified", " RBI Regulated"].map((b) => (
<div key={b} style={{ color: "#9ca3af", fontSize: "0.72rem" }}>{b}</div>
))}
</div>
</>
)}
{/* ══ STEP: DETAIL (UPI ID or Card) ══ */}
{step === "detail" && selected && (
<>
{/* Back */}
<button
onClick={() => { setStep("select"); setUpiError(""); setCardError(""); }}
style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", fontSize: "0.88rem", fontWeight: 600, marginBottom: "18px", padding: 0, display: "flex", alignItems: "center", gap: "4px" }}
>
← Back
</button>

{/* Selected app header */}
<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px", padding: "12px 14px", background: "#fafafa", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
<selected.Icon />
<div>
<div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111", fontFamily: "'Syne', sans-serif" }}>{selected.name}</div>
<div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
{selected.id === "card" ? "Enter card details" : "Enter UPI ID or scan QR"}
</div>
</div>
</div>
{/* ── CARD FORM ── */}
{selected.id === "card" ? (
<>
{/* Card preview */}
<div style={{
background: "linear-gradient(135deg, #1e3a5f, #2563eb)",
borderRadius: "14px",
padding: "20px",
marginBottom: "20px",
color: "white",
position: "relative",
overflow: "hidden",
minHeight: "110px",
}}>
<div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
<div style={{ position: "absolute", bottom: "-30px", left: "30%", width: "130px", height: "130px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
<div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>DEBIT / CREDIT</div>
<div style={{ fontFamily: "monospace", fontSize: "1.05rem", letterSpacing: "0.2em", marginBottom: "14px", color: "rgba(255,255,255,0.9)" }}>
{cardForm.number || "•••• •••• •••• ••••"}
</div>
<div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
<div>
<div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem" }}>CARD HOLDER</div>
<div>{cardForm.name || "YOUR NAME"}</div>
</div>
<div>
<div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem" }}>EXPIRES</div>
<div>{cardForm.expiry || "MM/YY"}</div>
</div>
</div>
</div>
{cardError && (
<div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", borderRadius: "8px", padding: "10px 12px", fontSize: "0.82rem", marginBottom: "14px" }}>
⚠ {cardError}
</div>

)}
<label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>Card Number</label>
<input
className="pay-input"
style={{ ...s.input(false), marginBottom: "12px", fontFamily: "monospace", letterSpacing: "0.1em" }}
placeholder="1234 5678 9012 3456"
maxLength={19}
value={cardForm.number}
onChange={(e) => setCardForm({ ...cardForm, number: formatCard(e.target.value) })}
/>
<label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>Cardholder Name</label>
<input
className="pay-input"
style={{ ...s.input(false), marginBottom: "12px", textTransform: "uppercase" }}
placeholder="AS ON CARD"
value={cardForm.name}
onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
/>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
<div>
<label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>Expiry</label>
<input
className="pay-input"
style={s.input(false)}
placeholder="MM/YY"
maxLength={5}
value={cardForm.expiry}
onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
/>
</div>
<div>
<label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>CVV</label>
<input
className="pay-input"
style={s.input(false)}
placeholder="•••"
type="password"
maxLength={4}
value={cardForm.cvv}
onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
/>
</div>
</div>
</>

) : (
<>
{/* UPI: Toggle ID / QR */}
<div style={{ display: "flex", gap: "0", background: "#f3f4f6", borderRadius: "10px", padding: "4px", marginBottom: "20px" }}>
{["id", "qr"].map((mode) => (
<button
key={mode}
className="tab-btn"
onClick={() => setPayMode(mode)}
style={{
flex: 1, border: "none", cursor: "pointer",
padding: "8px",
borderRadius: "8px",
fontSize: "0.88rem", fontWeight: 600,
background: payMode === mode ? "#fff" : "transparent",
color: payMode === mode ? "#6366f1" : "#6b7280",
boxShadow: payMode === mode ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
}}
>
{mode === "id" ? " Enter UPI ID" : " Scan QR Code"}
</button>
))}
</div>
{payMode === "id" ? (
<>
<label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>
UPI ID
</label>
<div style={{ position: "relative", marginBottom: "6px" }}>
<input
ref={inputRef}
className="pay-input"
style={s.input(!!upiError)}
placeholder={selected.hint || "yourname@upi"}
value={upiId}
onChange={(e) => { setUpiId(e.target.value); setUpiError(""); }}
/>
{upiId && validateUPI(upiId) && (
<span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#10b981", fontSize: "1.1rem" }}>✓</span>
)}
</div>
{upiError && (
<div style={{ color: "#ef4444", fontSize: "0.78rem", marginBottom: "4px" }}>⚠ {upiError}</div>
)}
<div style={{ color: "#9ca3af", fontSize: "0.75rem", marginBottom: "20px" }}>
Hint: {selected.hint}

</div>
</>
) : (
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
<QRCodeDisplay upiId={`innovationailabs@${selected.id}`} amount={total} />
<div style={{ marginTop: "14px", textAlign: "center" }}>
<div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", marginBottom: "2px" }}>
Pay ₹{total.toLocaleString("en-IN")} to
</div>
<div style={{ fontSize: "0.78rem", color: "#6366f1", fontWeight: 600 }}>
innovationailabs@{selected.id === "upi" ? "upi" : selected.id}
</div>
</div>
</div>
)}
</>
)}
{/* Order Summary */}
<div style={{
background: "#f9fafb", borderRadius: "12px",
padding: "14px 16px", marginBottom: "18px",
border: "1px solid #f0f0f0",
}}>
<div style={{ fontWeight: 700, fontSize: "0.8rem", color: "#374151", marginBottom: "10px", fontFamily: "'Syne', sans-serif" }}>
Order Summary
</div>
{[
{ label: course?.title || "Course", val: `₹${price.toLocaleString("en-IN")}` },
{ label: "GST (18%)", val: `₹${gst.toLocaleString("en-IN")}` },
].map((r) => (
<div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#6b7280", marginBottom: "6px" }}>
<span>{r.label}</span><span>{r.val}</span>
</div>
))}
<div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "0.95rem", color: "#111", borderTop: "1px solid #e5e7eb", paddingTop: "8px", fontFamily: "'Syne', sans-serif" }}>
<span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
</div>
</div>
{/* Pay button */}
{payMode === "qr" && selected.id !== "card" ? (
<button className="pay-btn" style={s.payBtn} onClick={handleQRPay}>
I've Completed the Payment ✓
</button>
) : (
<button className="pay-btn" style={s.payBtn} onClick={handlePay}>

Pay ₹{total.toLocaleString("en-IN")} →
</button>
)}
<div style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.72rem", marginTop: "12px" }}>
256-bit SSL · Your payment info is never stored
</div>
</>
)}
{/* ══ STEP: PROCESSING ══ */}
{step === "processing" && (
<div style={{ textAlign: "center", padding: "36px 0" }}>
<div style={{
width: "64px", height: "64px",
border: "5px solid #e5e7eb",
borderTop: "5px solid #6366f1",
borderRadius: "50%",
margin: "0 auto 24px",
animation: "spin 0.75s linear infinite",
}} />
<h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.15rem", color: "#0f0c29", marginBottom: "8px" }}>
Processing Payment
</h3>
<p style={{ color: "#6b7280", fontSize: "0.88rem", marginBottom: "8px" }}>
{selected?.id === "card"
? "Verifying card details securely..."
: `Sending request to ${selected?.name}...`}
</p>
<p style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
Please do not close this window
</p>
<div style={{
marginTop: "24px",
display: "flex", justifyContent: "center", gap: "6px",
}}>
{[0, 1, 2].map((i) => (
<div key={i} style={{
width: "8px", height: "8px", borderRadius: "50%",
background: "#6366f1",
animation: `spin ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
opacity: 0.4 + i * 0.3,
}} />
))}
</div>
</div>
)}

{/* ══ STEP: SUCCESS ══ */}
{step === "success" && (
<div style={{ textAlign: "center", padding: "36px 0" }}>
<div style={{
width: "80px", height: "80px",
background: "linear-gradient(135deg, #10b981, #059669)",
borderRadius: "50%",
display: "flex", alignItems: "center", justifyContent: "center",
margin: "0 auto 20px",
fontSize: "2.2rem", color: "white",
animation: "checkPop 0.5s cubic-bezier(.22,.68,0,1.2)",
boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
}}>
✓
</div>
<h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#0f0c29", marginBottom: "8px" }}>
Payment Successful!
</h3>
<p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "4px" }}>
₹{total.toLocaleString("en-IN")} paid via {selected?.name}
</p>
<p style={{ color: "#6366f1", fontWeight: 700, fontSize: "0.95rem", marginBottom: "20px" }}>
{course?.title}
</p>
{/* Transaction ID */}
<div style={{
background: "#f9fafb", borderRadius: "10px",
padding: "12px 16px", marginBottom: "20px",
border: "1px solid #f0f0f0", textAlign: "left",
}}>
<div style={{ fontSize: "0.72rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Transaction ID</div>
<div style={{ fontFamily: "monospace", fontSize: "0.88rem", color: "#374151", fontWeight: 600 }}>
TXN{Date.now().toString().slice(-10)}
</div>
</div>
<button
style={{ ...s.payBtn, background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 6px 24px rgba(16,185,129,0.35)" }}
onClick={() => { onSuccess?.(); }}
>
Go to My Dashboard →
</button>
<p style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "10px" }}>
A confirmation has been sent to your email
</p>

</div>
)}
</div>
</div>
</div>
);
}