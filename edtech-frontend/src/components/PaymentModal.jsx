import { useEffect, useState } from "react";
import API from "../services/api";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

export default function PaymentModal({ batch, onClose, onSuccess }) {
  const [step, setStep] = useState("creating");
  const [error, setError] = useState("");

  useEffect(() => {
    startPayment();
  }, []);

  const startPayment = async () => {
    setStep("creating");
    setError("");

    try {
      const orderResponse = await API.post("/payments/create-order/", {
        batch_id: batch.id,
      });

      await loadRazorpay();

      const { key_id, order_id, amount, currency } = orderResponse.data;

      const options = {
        key: key_id,
        amount,
        currency,
        name: "Innovation AI Labs",
        description: batch.course_title || batch.name,
        order_id,
        handler: async (response) => {
          setStep("verifying");
          try {
            const verifyResponse = await API.post("/payments/verify/", response.data);
            if (verifyResponse.data.status === "SUCCESS") {
              setStep("success");
              onSuccess?.(verifyResponse.data);
            } else {
              throw new Error("Payment could not be verified.");
            }
          } catch (err) {
            setError(
              err?.response?.data?.error ||
                "Payment verification failed. If money was deducted, please contact support."
            );
            setStep("failed");
          }
        },
        modal: {
          ondismiss: () => {
            if (step !== "verifying") setStep("cancelled");
          },
        },
        theme: { color: "#12172B" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setError(response?.error?.description || "Payment failed. Please try again.");
        setStep("failed");
      });
      setStep("paying");
      razorpay.open();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Unable to start payment.");
      setStep("failed");
    }
  };

  const amount = Number(batch.price || 0).toLocaleString("en-IN");

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
      onClick={step === "failed" || step === "cancelled" ? onClose : undefined}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#12172B] p-6 text-white">
          <div className="text-xs uppercase tracking-wider text-white/50">
            Secure payment via Razorpay
          </div>
          <div className="mt-1 text-2xl font-bold">₹{amount}</div>
          <div className="mt-1 text-sm text-white/60">
            {batch.course_title || batch.name}
          </div>
        </div>

        <div className="p-7 text-center">
          {(step === "creating" || step === "verifying") && (
            <>
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#F2A93B]" />
              <h3 className="text-lg font-bold text-[#12172B]">
                {step === "creating" ? "Preparing payment" : "Verifying payment"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {step === "creating"
                  ? "Creating your secure Razorpay order..."
                  : "Confirming your payment with our server. Please wait."}
              </p>
            </>
          )}

          {step === "paying" && (
            <>
              <h3 className="text-lg font-bold text-[#12172B]">Complete your payment</h3>
              <p className="mt-2 text-sm text-gray-500">
                Razorpay checkout is open. Complete the payment and keep this page open.
              </p>
            </>
          )}

          {step === "success" && (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F1E3] text-3xl text-[#3D7A38]">
                ✓
              </div>
              <h3 className="text-xl font-bold text-[#12172B]">Payment confirmed</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your enrollment is now active.
              </p>
              <button
                onClick={() => onSuccess?.()}
                className="mt-6 w-full rounded-md bg-[#F2A93B] px-5 py-3 font-bold text-[#12172B]"
              >
                Go to dashboard →
              </button>
            </>
          )}

          {(step === "failed" || step === "cancelled") && (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
                ✕
              </div>
              <h3 className="text-xl font-bold text-[#12172B]">
                {step === "cancelled" ? "Payment cancelled" : "Payment failed"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {error || "No payment was completed."}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={startPayment}
                  className="flex-1 rounded-md bg-[#12172B] px-4 py-3 font-bold text-white"
                >
                  Try again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-md border border-gray-200 px-4 py-3 font-bold text-gray-700"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
