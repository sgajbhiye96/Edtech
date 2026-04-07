import { useState, useEffect } from "react";
import API from "../services/api";
// Load Cashfree JS SDK dynamically
const loadCashfreeSDK = () =>
new Promise((resolve, reject) => {
if (window.Cashfree) return resolve(window.Cashfree);
const script = document.createElement("script");
script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
script.onload = () => resolve(window.Cashfree);
script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
document.head.appendChild(script);
});
const STEPS = {
INIT: "init", // Creating order
PAYING: "paying", // Cashfree checkout open
VERIFYING: "verifying", // Polling for status
SUCCESS: "success",
FAILED: "failed",
};
export default function PaymentModal({ course, onClose, onSuccess }) {
const [step, setStep] = useState(STEPS.INIT);
const [error, setError] = useState("");
const [orderId, setOrderId] = useState("");
const [paymentId, setPaymentId] = useState("");
const price = course?.price || 999;
const gst = Math.round(price * 0.18);
const total = price + gst;
// Auto-start on mount
useEffect(() => {
startPayment();
}, []);
const startPayment = async () => {
setStep(STEPS.INIT);
setError("");
try {
// 1. Create order on backend
const res = await API.post("/payments/create-order/", {

course_id: course?.id,
amount: total,
});
const { order_id, payment_session_id } = res.data;
setOrderId(order_id);
// 2. Load Cashfree SDK
const CashfreeConstructor = await loadCashfreeSDK();
const cashfree = new CashfreeConstructor({
mode: import.meta.env.VITE_CASHFREE_ENV === "production"
? "production"
: "sandbox",
});
setStep(STEPS.PAYING);
// 3. Open Cashfree checkout (opens in a popup/redirect)
const result = await cashfree.checkout({
paymentSessionId: payment_session_id,
redirectTarget: "_modal", // opens as modal overlay
});
// 4. Cashfree returns result
if (result.error) {
setError(result.error.message || "Payment was cancelled or failed.");
setStep(STEPS.FAILED);
return;
}
// 5. Verify on backend (poll until confirmed)
setStep(STEPS.VERIFYING);
await pollVerification(order_id);
} catch (err) {
const msg = err?.response?.data?.error || err?.message || "Something went wrong.";
setError(msg);
setStep(STEPS.FAILED);
}
};
// Poll backend every 2s for up to 30s
const pollVerification = async (order_id) => {
const maxAttempts = 15;
for (let i = 0; i < maxAttempts; i++) {
await new Promise((r) => setTimeout(r, 2000));
try {

const res = await API.get(`/payments/verify/${order_id}/`);
const { status, payment_id } = res.data;
if (status === "SUCCESS") {
setPaymentId(payment_id || "");
setStep(STEPS.SUCCESS);
return;
}
if (status === "FAILED" || status === "CANCELLED") {
setError("Payment failed or was cancelled. Please try again.");
setStep(STEPS.FAILED);
return;
}
// PENDING → keep polling
} catch {
// Network hiccup — keep polling
}
}
// Timeout
setError("Payment verification timed out. If money was deducted, contact support.");
setStep(STEPS.FAILED);
};
// ── Styles ──────────────────────────────────────────────────
const overlay = {
position: "fixed", inset: 0,
background: "rgba(0,0,0,0.65)",
backdropFilter: "blur(6px)",
zIndex: 1000,
display: "flex", alignItems: "center", justifyContent: "center",
padding: "1rem",
fontFamily: "'DM Sans', sans-serif",
};
const modal = {
background: "#fff",
borderRadius: "20px",
width: "100%", maxWidth: "420px",
boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
overflow: "hidden",
animation: "paySlideUp 0.28s cubic-bezier(.22,.68,0,1.2)",
};
return (
<div style={overlay} onClick={step === STEPS.FAILED ? onClose : undefined}>
<style>{`
@keyframes paySlideUp {

from { transform: translateY(40px) scale(0.97); opacity: 0; }
to { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes checkPop {
0% { transform: scale(0) rotate(-20deg); opacity: 0; }
60% { transform: scale(1.15) rotate(5deg); }
100%{ transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes dot {
0%,80%,100% { transform: scale(0.6); opacity: 0.3; }
40% { transform: scale(1); opacity: 1; }
}
`}</style>
<div style={modal} onClick={(e) => e.stopPropagation()}>
{/* Header */}
<div style={{
background: "linear-gradient(135deg, #0f0c29, #1a1a4e)",
padding: "20px 22px 18px",
display: "flex", justifyContent: "space-between", alignItems: "flex-start",
}}>
<div>
<div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "5px" }}>
Secured by Cashfree · PCI DSS Compliant
</div>
<div style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
₹{total.toLocaleString("en-IN")}
</div>
<div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "2px" }}>
{course?.title} · incl. 18% GST
</div>
</div>
{(step === STEPS.FAILED || step === STEPS.SUCCESS) && (
<button
onClick={onClose}
style={{
background: "rgba(255,255,255,0.1)", border: "none",
color: "#fff", width: "30px", height: "30px",
borderRadius: "50%", cursor: "pointer",
display: "flex", alignItems: "center", justifyContent: "center",
}}
>✕</button>
)}
</div>

{/* Body */}
<div style={{ padding: "32px 24px" }}>
{/* ── INIT: Creating order ── */}
{step === STEPS.INIT && (
<div style={{ textAlign: "center" }}>
<div style={{
width: "52px", height: "52px",
border: "4px solid #e5e7eb",
borderTop: "4px solid #6366f1",
borderRadius: "50%",
margin: "0 auto 20px",
animation: "spin 0.75s linear infinite",
}} />
<h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#0f0c29", marginBottom: "8px" }}>
Preparing Payment
</h3>
<p style={{ color: "#9ca3af", fontSize: "0.88rem" }}>
Setting up your secure checkout...
</p>
</div>
)}
{/* ── PAYING: Cashfree modal is open ── */}
{step === STEPS.PAYING && (
<div style={{ textAlign: "center" }}>
<div style={{ fontSize: "3rem", marginBottom: "16px" }}> </div>
<h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#0f0c29", marginBottom: "8px" }}>
Complete Your Payment
</h3>
<p style={{ color: "#6b7280", fontSize: "0.88rem", marginBottom: "20px" }}>
The Cashfree payment window is open. Choose UPI, card, or net banking to pay.
</p>
{/* Order summary */}
<div style={{
background: "#f9fafb", borderRadius: "12px",
padding: "14px 16px", textAlign: "left",
border: "1px solid #f0f0f0",
}}>
{[
{ label: course?.title || "Course", val: `₹${price.toLocaleString("en-IN")}` },
{ label: "GST (18%)", val: `₹${gst.toLocaleString("en-IN")}` },
].map((r) => (
<div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#6b7280", marginBottom: "6px" }}>
<span>{r.label}</span><span>{r.val}</span>
</div>

))}
<div style={{
display: "flex", justifyContent: "space-between",
fontWeight: 800, fontSize: "1rem", color: "#111",
borderTop: "1px solid #e5e7eb", paddingTop: "8px",
fontFamily: "'Syne', sans-serif",
}}>
<span>Total</span>
<span>₹{total.toLocaleString("en-IN")}</span>
</div>
</div>
<p style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "16px" }}>
Do not close this window until payment is complete
</p>
</div>
)}
{/* ── VERIFYING ── */}
{step === STEPS.VERIFYING && (
<div style={{ textAlign: "center" }}>
<div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
{[0, 1, 2].map((i) => (
<div key={i} style={{
width: "12px", height: "12px",
borderRadius: "50%",
background: "#6366f1",
animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite`,
}} />
))}
</div>
<h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#0f0c29", marginBottom: "8px" }}>
Verifying Payment
</h3>
<p style={{ color: "#6b7280", fontSize: "0.88rem", marginBottom: "6px" }}>
Confirming your payment with Cashfree...
</p>
<p style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
This usually takes 5–10 seconds. Please wait.
</p>
<div style={{
marginTop: "20px",
background: "#fefce8",
border: "1px solid #fde68a",
borderRadius: "10px",
padding: "10px 14px",
fontSize: "0.78rem",

color: "#92400e",
}}>
⚠ Do not refresh or close this page
</div>
</div>
)}
{/* ── SUCCESS ── */}
{step === STEPS.SUCCESS && (
<div style={{ textAlign: "center" }}>
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
<h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#0f0c29", marginBottom: "6px" }}>
Payment Confirmed!
</h3>
<p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "4px" }}>
₹{total.toLocaleString("en-IN")} paid successfully
</p>
<p style={{ color: "#6366f1", fontWeight: 700, fontSize: "0.9rem", marginBottom: "20px" }}>
{course?.title}
</p>
{/* Transaction details */}
<div style={{
background: "#f9fafb", borderRadius: "12px",
padding: "14px 16px", marginBottom: "20px",
border: "1px solid #f0f0f0", textAlign: "left",
}}>
<div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "8px" }}>
<span style={{ color: "#9ca3af" }}>Order ID</span>
<span style={{ fontFamily: "monospace", fontWeight: 600, color: "#374151", fontSize: "0.78rem" }}>{orderId}</span>
</div>
{paymentId && (
<div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "8px" }}>
<span style={{ color: "#9ca3af" }}>Payment ID</span>
<span style={{ fontFamily: "monospace", fontWeight: 600, color: "#374151", fontSize: "0.78rem" }}>{paymentId}</span>

</div>
)}
<div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
<span style={{ color: "#9ca3af" }}>Amount Paid</span>
<span style={{ fontWeight: 700, color: "#10b981" }}>₹{total.toLocaleString("en-IN")}</span>
</div>
</div>
<button
onClick={() => onSuccess?.()}
style={{
width: "100%",
background: "linear-gradient(135deg, #10b981, #059669)",
color: "#fff", border: "none",
padding: "14px", borderRadius: "12px",
fontSize: "1rem", fontWeight: 700,
cursor: "pointer",
fontFamily: "'Syne', sans-serif",
boxShadow: "0 6px 24px rgba(16,185,129,0.35)",
}}
>
Go to My Dashboard →
</button>
<p style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: "10px" }}>
A confirmation email has been sent to you
</p>
</div>
)}
{/* ── FAILED ── */}
{step === STEPS.FAILED && (
<div style={{ textAlign: "center" }}>
<div style={{
width: "72px", height: "72px",
background: "linear-gradient(135deg, #ef4444, #dc2626)",
borderRadius: "50%",
display: "flex", alignItems: "center", justifyContent: "center",
margin: "0 auto 20px",
fontSize: "2rem", color: "white",
boxShadow: "0 8px 28px rgba(239,68,68,0.35)",
}}>
✕
</div>
<h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#0f0c29", marginBottom: "8px" }}>
Payment Failed
</h3>

<p style={{ color: "#6b7280", fontSize: "0.88rem", marginBottom: "20px" }}>
{error || "Something went wrong. Please try again."}
</p>
<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
<button
onClick={startPayment}
style={{
width: "100%",
background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
color: "#fff", border: "none",
padding: "13px", borderRadius: "12px",
fontSize: "0.95rem", fontWeight: 700,
cursor: "pointer",
fontFamily: "'Syne', sans-serif",
}}
>
Try Again →
</button>
<button
onClick={onClose}
style={{
width: "100%",
background: "none",
border: "1.5px solid #e5e7eb",
color: "#6b7280",
padding: "12px", borderRadius: "12px",
fontSize: "0.9rem",
cursor: "pointer",
}}
>
Cancel
</button>
</div>
{error.includes("deducted") && (
<div style={{
marginTop: "16px",
background: "#fefce8", border: "1px solid #fde68a",
borderRadius: "10px", padding: "12px 14px",
fontSize: "0.78rem", color: "#92400e",
}}>
If money was deducted, contact us at{" "}
<strong>support@innovationailabs.in</strong> with your Order ID: <strong>{orderId}</strong>
</div>
)}
</div>

)}
</div>
</div>
</div>
);
}