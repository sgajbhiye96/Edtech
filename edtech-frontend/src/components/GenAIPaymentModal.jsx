import { useEffect, useState } from "react";
import API from "../services/api";

const loadCashfree = () =>
  new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => reject(new Error("Unable to load payment checkout."));
    document.head.appendChild(script);
  });

export default function GenAIPaymentModal({ course, onClose, onSuccess }) {
  const [state, setState] = useState("creating");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(4999);
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    startPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPayment = async () => {
    setState("creating");
    setError("");

    try {
      const orderRes = await API.post("/payments/create-order/", {
        course_id: course.id,
      });

      const {
        order_id: newOrderId,
        payment_session_id: paymentSessionId,
        amount: serverAmount,
      } = orderRes.data;

      setOrderId(newOrderId);
      setAmount(Number(serverAmount || 4999));

      const Cashfree = await loadCashfree();
      const cashfree = new Cashfree({
        mode: import.meta.env.VITE_CASHFREE_ENV === "production"
          ? "production"
          : "sandbox",
      });

      setState("paying");

      const result = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      if (result?.error) {
        setError(result.error.message || "Payment was cancelled or failed.");
        setState("failed");
        return;
      }

      setState("verifying");
      await verify(newOrderId);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.message ||
        "Unable to start payment."
      );
      setState("failed");
    }
  };

  const verify = async (id) => {
    for (let attempt = 0; attempt < 15; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const response = await API.get(`/payments/verify/${id}/`);
        const result = response.data;

        if (result.status === "SUCCESS") {
          setPaymentId(result.payment_id || "");
          setState("success");
          return;
        }

        if (["FAILED", "CANCELLED"].includes(result.status)) {
          setError("Payment failed or was cancelled. Please try again.");
          setState("failed");
          return;
        }
      } catch {
        // Keep polling through transient network failures.
      }
    }

    setError(
      "Payment verification timed out. If money was deducted, contact support@innovationailabs.in with your Order ID."
    );
    setState("failed");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-2xl">
        <div className="bg-[#12172B] text-white p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Secure checkout</p>
          <div className="text-4xl font-black mt-1">₹{amount.toLocaleString("en-IN")}</div>
          <p className="text-sm text-white/60 mt-1">{course.title}</p>
        </div>

        <div className="p-7 text-center">
          {state === "creating" && (
            <>
              <div className="mx-auto w-12 h-12 border-4 border-[#E4E0D2] border-t-[#F2A93B] rounded-full animate-spin" />
              <h3 className="text-xl font-black mt-5">Preparing secure payment</h3>
              <p className="text-sm text-[#6C728A] mt-2">Connecting to Cashfree...</p>
            </>
          )}

          {state === "paying" && (
            <>
              <div className="text-4xl">💳</div>
              <h3 className="text-xl font-black mt-4">Complete your payment</h3>
              <p className="text-sm text-[#6C728A] mt-2">
                Choose UPI, card or net banking in the secure Cashfree checkout.
              </p>
            </>
          )}

          {state === "verifying" && (
            <>
              <div className="mx-auto w-12 h-12 border-4 border-[#E4E0D2] border-t-[#F2A93B] rounded-full animate-spin" />
              <h3 className="text-xl font-black mt-5">Verifying payment</h3>
              <p className="text-sm text-[#6C728A] mt-2">
                Please wait while we confirm your payment and activate enrollment.
              </p>
            </>
          )}

          {state === "success" && (
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-[#168A55] text-white flex items-center justify-center text-4xl font-black">
                ✓
              </div>
              <h3 className="text-2xl font-black mt-5">Enrollment confirmed!</h3>
              <p className="text-sm text-[#6C728A] mt-2">
                ₹{amount.toLocaleString("en-IN")} paid successfully.
              </p>
              <p className="text-xs text-[#9AA3CC] mt-4 break-all">
                Order: {orderId}
                {paymentId ? ` · Payment: ${paymentId}` : ""}
              </p>
              <button
                onClick={onSuccess}
                className="mt-6 w-full bg-[#12172B] text-white py-3.5 rounded-lg font-bold"
              >
                Go to My Dashboard →
              </button>
            </>
          )}

          {state === "failed" && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-[#C73E3E] text-white flex items-center justify-center text-3xl font-black">
                ×
              </div>
              <h3 className="text-xl font-black mt-5">Payment failed</h3>
              <p className="text-sm text-[#6C728A] mt-2">{error}</p>
              <button
                onClick={startPayment}
                className="mt-6 w-full bg-[#F2A93B] text-[#12172B] py-3 rounded-lg font-bold"
              >
                Try again
              </button>
              <button
                onClick={onClose}
                className="mt-2 w-full border border-[#E4E0D2] text-[#2B3252] py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
