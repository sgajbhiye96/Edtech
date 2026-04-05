import { useState } from "react";
const UPI_OPTIONS = [
{
id: "phonepe",
name: "PhonePe",
color: "#5f259f",
bg: "#f3eeff",
icon: (
<svg width="32" height="32" viewBox="0 0 100 100" fill="none">
<rect width="100" height="100" rx="20" fill="#5f259f"/>
<text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="44" fontWeight="bold" fill="white">Pe</text>
</svg>
),
upiId: "innovationailabs@ybl",
},
{
id: "gpay",
name: "Google Pay",
color: "#1a73e8",
bg: "#e8f0fe",
icon: (
<svg width="32" height="32" viewBox="0 0 100 100" fill="none">
<rect width="100" height="100" rx="20" fill="white"/>
<text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#1a73e8">G</text>
</svg>
),
upiId: "innovationailabs@ybl",
},
{
id: "paytm",
name: "Paytm",
color: "#002970",
bg: "#e8eeff",
icon: (
<svg width="32" height="32" viewBox="0 0 100 100" fill="none">
<rect width="100" height="100" rx="20" fill="#002970"/>
<text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">Pay</text>
</svg>
),
upiId: "innovationailabs@ybl",
},
{
id: "upi",

name: "Other UPI App",
color: "#f97316",
bg: "#fff7ed",
icon: (
<svg width="32" height="32" viewBox="0 0 100 100" fill="none">
<rect width="100" height="100" rx="20" fill="#f97316"/>
<text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">UPI</text>
</svg>
),
upiId: null,
},
];
export default function PaymentModal({ course, onClose, onSuccess }) {
const [step, setStep] = useState("select"); // select | upi-id | processing | success
const [selectedApp, setSelectedApp] = useState(null);
const [upiId, setUpiId] = useState("");
const [upiError, setUpiError] = useState("");
const price = course?.price || 999;
const courseName = course?.title || "Course";
const handleSelectApp = (app) => {
setSelectedApp(app);
if (app.id === "upi") {
setStep("upi-id");
} else {
setStep("upi-id");
setUpiId(app.upiId);
}
};
const validateUPI = (id) => /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(id);
const handlePay = () => {
if (!validateUPI(upiId)) {
setUpiError("Please enter a valid UPI ID (e.g. name@upi)");
return;
}
setUpiError("");
setStep("processing");
// Simulate processing
setTimeout(() => {
setStep("success");
setTimeout(() => {
onSuccess?.();
}, 2000);

}, 2500);
};
return (
// Backdrop
<div
onClick={onClose}
style={{
position: "fixed", inset: 0,
background: "rgba(0,0,0,0.6)",
backdropFilter: "blur(4px)",
zIndex: 1000,
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "1rem",
fontFamily: "'DM Sans', sans-serif",
}}
>
{/* Modal */}
<div
onClick={(e) => e.stopPropagation()}
style={{
background: "#fff",
borderRadius: "20px",
width: "100%",
maxWidth: "440px",
overflow: "hidden",
boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
animation: "slideUp 0.3s ease",
}}
>
<style>{`
@keyframes slideUp {
from { transform: translateY(30px); opacity: 0; }
to { transform: translateY(0); opacity: 1; }
}
@keyframes spin {
to { transform: rotate(360deg); }
}
@keyframes checkPop {
0% { transform: scale(0); opacity: 0; }
60% { transform: scale(1.2); }
100% { transform: scale(1); opacity: 1; }
}
`}</style>

{/* Header */}
<div style={{
background: "linear-gradient(135deg, #0f0c29, #1a1a4e)",
padding: "20px 24px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
}}>
<div>
<div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
Secure Payment
</div>
<div style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>
₹{price.toLocaleString("en-IN")}
</div>
<div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "2px" }}>
{courseName}
</div>
</div>
<button
onClick={onClose}
style={{
background: "rgba(255,255,255,0.1)",
border: "none",
color: "#fff",
width: "32px", height: "32px",
borderRadius: "50%",
cursor: "pointer",
fontSize: "1rem",
display: "flex", alignItems: "center", justifyContent: "center",
}}
>
✕
</button>
</div>
{/* Body */}
<div style={{ padding: "24px" }}>
{/* ── STEP: SELECT APP ── */}
{step === "select" && (
<>
<h3 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 700,
fontSize: "1rem",
color: "#0f0c29",

marginBottom: "6px",
}}>
Pay via UPI
</h3>
<p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "20px" }}>
Choose your preferred UPI app to complete payment.
</p>
<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
{UPI_OPTIONS.map((app) => (
<button
key={app.id}
onClick={() => handleSelectApp(app)}
style={{
display: "flex",
alignItems: "center",
gap: "14px",
padding: "14px 16px",
borderRadius: "12px",
border: "1.5px solid #f0f0f0",
background: "#fff",
cursor: "pointer",
transition: "all 0.15s",
textAlign: "left",
width: "100%",
}}
onMouseOver={(e) => {
e.currentTarget.style.border = `1.5px solid ${app.color}`;
e.currentTarget.style.background = app.bg;
}}
onMouseOut={(e) => {
e.currentTarget.style.border = "1.5px solid #f0f0f0";
e.currentTarget.style.background = "#fff";
}}
>
{app.icon}
<div style={{ flex: 1 }}>
<div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#111" }}>
{app.name}
</div>
{app.upiId && (
<div style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
{app.upiId}
</div>
)}
</div>
<span style={{ color: "#d1d5db", fontSize: "1.1rem" }}>›</span>

</button>
))}
</div>
{/* Security badge */}
<div style={{
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: "6px",
marginTop: "20px",
color: "#9ca3af",
fontSize: "0.78rem",
}}>
256-bit SSL secured · NPCI certified UPI
</div>
</>
)}
{/* ── STEP: ENTER UPI ID ── */}
{step === "upi-id" && (
<>
<button
onClick={() => { setStep("select"); setUpiError(""); }}
style={{
background: "none",
border: "none",
cursor: "pointer",
color: "#6366f1",
fontSize: "0.88rem",
fontWeight: 600,
marginBottom: "16px",
padding: 0,
display: "flex",
alignItems: "center",
gap: "4px",
}}
>
← Back
</button>
<div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
{selectedApp?.icon}
<div>
<div style={{ fontWeight: 700, color: "#111", fontFamily: "'Syne', sans-serif" }}>
{selectedApp?.name}
</div>

<div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>Enter your UPI ID</div>
</div>
</div>
<label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
UPI ID
</label>
<input
type="text"
placeholder="yourname@upi"
value={upiId}
onChange={(e) => { setUpiId(e.target.value); setUpiError(""); }}
style={{
width: "100%",
padding: "12px 14px",
borderRadius: "10px",
border: upiError ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
fontSize: "0.95rem",
outline: "none",
boxSizing: "border-box",
fontFamily: "'DM Sans', sans-serif",
marginBottom: "4px",
}}
/>
{upiError && (
<div style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: "4px" }}>
{upiError}
</div>
)}
<div style={{ color: "#9ca3af", fontSize: "0.78rem", marginBottom: "20px" }}>
e.g. mobilenumber@paytm, name@okaxis, name@ybl
</div>
{/* Order summary */}
<div style={{
background: "#f9fafb",
borderRadius: "10px",
padding: "14px 16px",
marginBottom: "20px",
border: "1px solid #f0f0f0",
}}>
<div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#6b7280", marginBottom: "6px" }}>
<span>{courseName}</span>
<span>₹{price.toLocaleString("en-IN")}</span>
</div>
<div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "#6b7280", marginBottom: "8px" }}>
<span>GST (18%)</span>

<span>₹{Math.round(price * 0.18).toLocaleString("en-IN")}</span>
</div>
<div style={{
display: "flex", justifyContent: "space-between",
fontWeight: 700, fontSize: "1rem", color: "#111",
borderTop: "1px solid #e5e7eb",
paddingTop: "8px",
fontFamily: "'Syne', sans-serif",
}}>
<span>Total</span>
<span>₹{Math.round(price * 1.18).toLocaleString("en-IN")}</span>
</div>
</div>
<button
onClick={handlePay}
style={{
width: "100%",
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff",
border: "none",
padding: "14px",
borderRadius: "10px",
fontSize: "1rem",
fontWeight: 700,
cursor: "pointer",
fontFamily: "'Syne', sans-serif",
boxShadow: "0 6px 24px rgba(99,102,241,0.35)",
transition: "opacity 0.2s",
}}
onMouseOver={(e) => (e.target.style.opacity = "0.9")}
onMouseOut={(e) => (e.target.style.opacity = "1")}
>
Pay ₹{Math.round(price * 1.18).toLocaleString("en-IN")} →
</button>
<div style={{
display: "flex",
alignItems: "center",
justifyContent: "center",
gap: "6px",
marginTop: "14px",
color: "#9ca3af",
fontSize: "0.75rem",
}}>
Your payment is safe & secure
</div>

</>
)}
{/* ── STEP: PROCESSING ── */}
{step === "processing" && (
<div style={{ textAlign: "center", padding: "32px 0" }}>
<div style={{
width: "56px", height: "56px",
border: "4px solid #e5e7eb",
borderTop: "4px solid #6366f1",
borderRadius: "50%",
margin: "0 auto 20px",
animation: "spin 0.8s linear infinite",
}} />
<h3 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 700,
fontSize: "1.1rem",
color: "#0f0c29",
marginBottom: "8px",
}}>
Processing Payment...
</h3>
<p style={{ color: "#9ca3af", fontSize: "0.88rem" }}>
Please wait. Do not close this window.
</p>
<p style={{ color: "#6366f1", fontSize: "0.82rem", marginTop: "8px", fontWeight: 600 }}>
Verifying with {selectedApp?.name}
</p>
</div>
)}
{/* ── STEP: SUCCESS ── */}
{step === "success" && (
<div style={{ textAlign: "center", padding: "32px 0" }}>
<div style={{
width: "72px", height: "72px",
background: "linear-gradient(135deg, #10b981, #059669)",
borderRadius: "50%",
display: "flex",
alignItems: "center",
justifyContent: "center",
margin: "0 auto 20px",
fontSize: "2rem",
animation: "checkPop 0.4s ease",
boxShadow: "0 8px 28px rgba(16,185,129,0.35)",
}}>

✓
</div>
<h3 style={{
fontFamily: "'Syne', sans-serif",
fontWeight: 800,
fontSize: "1.3rem",
color: "#0f0c29",
marginBottom: "8px",
}}>
Payment Successful!
</h3>
<p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "6px" }}>
You are now enrolled in
</p>
<p style={{ color: "#6366f1", fontWeight: 700, fontSize: "0.95rem" }}>
{courseName}
</p>
<p style={{ color: "#9ca3af", fontSize: "0.8rem", marginTop: "12px" }}>
Redirecting to your dashboard...
</p>
</div>
)}
</div>
</div>
</div>
);
}