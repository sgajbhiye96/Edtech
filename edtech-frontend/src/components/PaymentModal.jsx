import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import upiQr from "../assets/siddharth-upi-qr.svg";

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
  const [step, setStep] = useState("choose");
  const [error, setError] = useState("");
  const [displayAmount, setDisplayAmount] = useState(Number(batch.price || 0));
  const [utr, setUtr] = useState("");
  const stepRef = useRef("choose");

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const updateStep = (nextStep) => {
    stepRef.current = nextStep;
    setStep(nextStep);
  };

  const startPayment = async () => {
    updateStep("creating");
    setError("");
    try {
      const orderResponse = await API.post("/payments/create-order/", { batch_id: batch.id });
      await loadRazorpay();
      const { key_id, order_id, amount, currency } = orderResponse.data;
      setDisplayAmount(Number(amount || 0) / 100);

      const options = {
        key: key_id,
        amount,
        currency,
        name: "Innovation AI Labs",
        description: batch.course_title || batch.name,
        order_id,
        handler: async (response) => {
          updateStep("verifying");
          try {
            const verifyResponse = await API.post("/payments/verify/", response);
            if (verifyResponse.data.status === "SUCCESS") {
              updateStep("success");
              onSuccess?.(verifyResponse.data);
            } else {
              throw new Error("Payment could not be verified.");
            }
          } catch (err) {
            setError(
              err?.response?.data?.error ||
                "Payment verification failed. If money was deducted, please contact support."
            );
            updateStep("failed");
          }
        },
        modal: {
          ondismiss: () => {
            if (stepRef.current !== "verifying") updateStep("cancelled");
          },
        },
        theme: { color: "#12172B" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", (response) => {
        setError(response?.error?.description || "Payment failed. Please try again.");
        updateStep("failed");
      });
      updateStep("paying");
      razorpay.open();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Unable to start payment.");
      updateStep("failed");
    }
  };

  const submitUPI = async (event) => {
    event.preventDefault();
    setError("");
    const cleanedUtr = utr.trim().replace(/\s+/g, "");

    if (
      cleanedUtr.length < 6 ||
      cleanedUtr.length > 40 ||
      !/^[a-zA-Z0-9]+$/.test(cleanedUtr)
    ) {
      setError("Please enter a valid UPI UTR / transaction ID.");
      return;
    }

    updateStep("upi-submitting");
    try {
      const response = await API.post("/payments/upi-submit/", {
        batch_id: batch.id,
        utr: cleanedUtr,
      });
      setDisplayAmount(Number(response.data.amount || displayAmount));
      updateStep("upi-submitted");
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to submit your UPI payment.");
      updateStep("upi");
    }
  };

  const amount = Number(displayAmount || 0).toLocaleString("en-IN");
  const closeOnBackdrop =
    step === "failed" || step === "cancelled" || step === "upi-submitted";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[3px] animate-modal-backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#12172B] p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/50">Secure payment</div>
              <div className="mt-1 text-2xl font-bold">₹{amount}</div>
              <div className="mt-1 text-sm text-white/60">
                {batch.course_title || batch.name}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl leading-none text-white/60 hover:text-white"
              aria-label="Close payment"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-7 text-center">
          {step === "choose" && (
            <div className="animate-content-in">
              <h3 className="text-lg font-bold text-[#12172B]">Choose payment method</h3>
              <p className="mt-2 text-sm text-gray-500">
                Pay securely with Razorpay or scan the UPI QR code.
              </p>
              <button
                type="button"
                onClick={startPayment}
                className="mt-6 w-full rounded-md bg-[#F2A93B] px-5 py-3 font-bold text-[#12172B] hover:bg-[#F5BC63] transition-all"
              >
                Pay ₹{amount} with Razorpay
              </button>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  updateStep("upi");
                }}
                className="mt-3 w-full rounded-md border-2 border-[#12172B] px-5 py-3 font-bold text-[#12172B] hover:bg-gray-50 transition-all"
              >
                Pay ₹{amount} via UPI QR
              </button>
              <p className="mt-4 text-xs text-gray-400">
                UPI QR payments are manually verified before enrollment is activated.
              </p>
            </div>
          )}

          {(step === "creating" || step === "verifying") && (
            <div className="animate-content-in">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#F2A93B]" />
              <h3 className="text-lg font-bold text-[#12172B]">
                {step === "creating" ? "Preparing payment" : "Verifying payment"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {step === "creating"
                  ? "Creating your secure Razorpay order..."
                  : "Confirming your payment with our server. Please wait."}
              </p>
            </div>
          )}

          {step === "paying" && (
            <div className="animate-content-in">
              <h3 className="text-lg font-bold text-[#12172B]">Complete your payment</h3>
              <p className="mt-2 text-sm text-gray-500">
                Razorpay checkout is open. Complete the payment and keep this page open.
              </p>
            </div>
          )}

          {step === "upi" && (
            <div className="animate-content-in">
              <h3 className="text-lg font-bold text-[#12172B]">Pay with UPI</h3>
              <p className="mt-2 text-sm text-gray-500">
                Scan the QR code and pay exactly ₹{amount}.
              </p>
              <div className="mx-auto mt-5 w-fit rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <img
                  src={upiQr}
                  alt="UPI payment QR code for Innovation AI Labs"
                  className="h-64 w-64"
                />
              </div>
              <div className="mt-3 text-sm font-semibold text-[#12172B]">
                UPI ID: 7507730786@ptaxis
              </div>
              <form onSubmit={submitUPI} className="mt-5 text-left">
                <label className="text-sm font-semibold text-gray-700">
                  UPI UTR / Transaction ID
                </label>
                <input
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="Enter transaction ID after payment"
                  className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#12172B]"
                  autoComplete="off"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-[#12172B] px-5 py-3 font-bold text-white hover:opacity-90 transition-all"
                >
                  I have paid — Submit UTR
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  updateStep("choose");
                }}
                className="mt-3 text-sm font-semibold text-gray-500 hover:text-[#12172B]"
              >
                ← Back to payment methods
              </button>
            </div>
          )}

          {step === "upi-submitting" && (
            <div className="animate-content-in">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#F2A93B]" />
              <h3 className="text-lg font-bold text-[#12172B]">Submitting payment</h3>
              <p className="mt-2 text-sm text-gray-500">
                Recording your UPI transaction for verification.
              </p>
            </div>
          )}

          {step === "upi-submitted" && (
            <div className="animate-content-in">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl text-amber-600">
                ✓
              </div>
              <h3 className="text-xl font-bold text-[#12172B]">Payment submitted</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your UPI payment has been recorded. We will verify the transaction and
                activate your enrollment.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-md bg-[#F2A93B] px-5 py-3 font-bold text-[#12172B]"
              >
                Close
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="animate-content-in">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E4F1E3] text-3xl text-[#3D7A38] animate-success-pop">
                ✓
              </div>
              <h3 className="text-xl font-bold text-[#12172B]">Payment confirmed</h3>
              <p className="mt-2 text-sm text-gray-500">Your enrollment is now active.</p>
              <button
                onClick={() => onSuccess?.()}
                className="mt-6 w-full rounded-md bg-[#F2A93B] px-5 py-3 font-bold text-[#12172B]"
              >
                Go to dashboard →
              </button>
            </div>
          )}

          {(step === "failed" || step === "cancelled") && (
            <div className="animate-content-in">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600 animate-success-pop">
                ✕
              </div>
              <h3 className="text-xl font-bold text-[#12172B]">
                {step === "cancelled" ? "Payment cancelled" : "Payment failed"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{error || "No payment was completed."}</p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setError("");
                    updateStep("choose");
                  }}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
