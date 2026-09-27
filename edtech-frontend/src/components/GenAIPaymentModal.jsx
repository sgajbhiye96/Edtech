import { useEffect, useState } from "react";
import API from "../services/api";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load payment checkout."));
    document.body.appendChild(script);
  });
}

export default function GenAIPaymentModal({ course, onClose, onSuccess }) {
  const [state, setState] = useState("creating");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(499900);
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    startPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPayment = async () => {
    setState("creating");
    setError("");
    try {
      const orderRes = await API.post("/payments/create-order/", { course_id: course.id });
      const { key_id, order_id, amount: serverAmount, currency } = orderRes.data;
      setOrderId(order_id);
      setAmount(Number(serverAmount || 499900));
      await loadRazorpay();

      const options = {
        key: key_id,
        amount: Number(serverAmount),
        currency: currency || "INR",
        name: "Innovation AI Labs",
        description: course.title,
        order_id,
        handler: async (response) => {
          setState("verifying");
          try {
            const verifyResponse = await API.post("/payments/verify/", response);
            if (verifyResponse.data.status === "SUCCESS") {
              setPaymentId(verifyResponse.data.payment_id || "");
              setState("success");
            } else throw new Error("Payment could not be verified.");
          } catch (err) {
            setError(err?.response?.data?.error || "Payment verification failed. If money was deducted, please contact support.");
            setState("failed");
          }
        },
        modal: {
          ondismiss: () => {
            setState((current) => current === "verifying" ? current : "failed");
            setError("Payment window was closed.");
          },
        },
        theme: { color: "#12172B" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setError(response?.error?.description || "Payment failed. Please try again.");
        setState("failed");
      });
      setState("paying");
      razorpay.open();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Unable to start payment.");
      setState("failed");
    }
  };

  const displayAmount = (amount / 100).toLocaleString("en-IN");

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl">
        <div className="bg-[#12172B] text-white p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Secure checkout via Razorpay</p>
          <div className="text-4xl font-black mt-1">₹{displayAmount}</div>
          <p className="text-sm text-white/60 mt-1">{course.title}</p>
        </div>
        <div className="p-7 text-center">
          {state === "creating" && <><div className="mx-auto w-12 h-12 border-4 border-[#E4E0D2] border-t-[#F2A93B] rounded-full animate-spin" /><h3 className="text-xl font-black mt-5">Preparing secure payment</h3><p className="text-sm text-[#6C728A] mt-2">Connecting to Razorpay...</p></>}
          {state === "paying" && <><div className="text-4xl">💳</div><h3 className="text-xl font-black mt-4">Complete your payment</h3><p className="text-sm text-[#6C728A] mt-2">Choose UPI, card or net banking in the secure Razorpay checkout.</p></>}
          {state === "verifying" && <><div className="mx-auto w-12 h-12 border-4 border-[#E4E0D2] border-t-[#F2A93B] rounded-full animate-spin" /><h3 className="text-xl font-black mt-5">Verifying payment</h3><p className="text-sm text-[#6C728A] mt-2">Please wait while we confirm your payment and activate enrollment.</p></>}
          {state === "success" && <><div className="mx-auto w-20 h-20 rounded-full bg-[#168A55] text-white flex items-center justify-center text-4xl font-black">✓</div><h3 className="text-2xl font-black mt-5">Enrollment confirmed!</h3><p className="text-sm text-[#6C728A] mt-2">₹{displayAmount} paid successfully.</p><p className="text-xs text-[#9AA3CC] mt-4 break-all">Order: {orderId}{paymentId ? \` · Payment: \${paymentId}\` : ""}</p><button onClick={() => onSuccess?.()} className="mt-6 w-full bg-[#12172B] text-white py-3.5 rounded-lg font-bold">Go to My Dashboard →</button></>}
          {state === "failed" && <><div className="mx-auto w-16 h-16 rounded-full bg-[#C73E3E] text-white flex items-center justify-center text-3xl font-black">×</div><h3 className="text-xl font-black mt-5">Payment failed</h3><p className="text-sm text-[#6C728A] mt-2">{error}</p><button onClick={startPayment} className="mt-6 w-full bg-[#F2A93B] text-[#12172B] py-3 rounded-lg font-bold">Try again</button><button onClick={onClose} className="mt-2 w-full border border-[#E4E0D2] text-[#2B3252] py-3 rounded-lg font-semibold">Cancel</button></>}
        </div>
      </div>
    </div>
  );
}
