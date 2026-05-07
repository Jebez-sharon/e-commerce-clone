import { useState } from "react";
import { FiX, FiArrowLeft } from "react-icons/fi";
import "../styles/AuthModal.css";

const API = import.meta.env.VITE_API_URL;

function AuthModal({ onClose, onLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (!email) return setError("Please enter your email");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      setIsNewUser(data.isNewUser);
      setStep(2);
    } catch (err) {
      setError("Something went wrong. Try again");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!otp) return setError("Please enter OTP");
    if (isNewUser && (!name || !mobileNumber || !gender))
      return setError("Please fill all fields");
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, name, mobileNumber, gender }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdated"));
      onLogin(data.user);
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          <FiX />
        </button>

        {/* Enter email */}
        {step === 1 && (
          <>
            <h2>Welcome to AJIO</h2>
            <p className="auth-modal-subtitle">Enter your email to continue</p>

            <div className="auth-input-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              className="auth-btn"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "CONTINUE"}
            </button>

            <p className="auth-terms">
              By continuing, I agree to the <a href="#">Terms & Conditions</a>{" "}
              and <a href="#">Privacy Policy</a>
            </p>
          </>
        )}

        {/* OTP and Details */}
        {step === 2 && (
          <>
            <button className="auth-modal-back" onClick={() => setStep(1)}>
              <FiArrowLeft size={14} /> Back
            </button>

            <h2>Welcome to AJIO</h2>
            <p className="auth-modal-subtitle">
              {isNewUser ? "Please set up your account " : "Enter OTP to login"}
            </p>

            <div className="auth-email-display">
              {email}
              <button className="auth-email-edit" onClick={() => setStep(1)}>
                Edit
              </button>
            </div>
            <p className="auth-modal-subtitle">
              OTP has been sent to your email
            </p>

            {/* New user Fields */}
            {isNewUser && (
              <>
                <div className="auth-gender-group">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={(e) => setGender(e.target.value)}
                    />{" "}
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={(e) => setGender(e.target.value)}
                    />{" "}
                    Male
                  </label>
                </div>

                <div className="auth-input-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="auth-input-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="auth-input-group">
              <label> OTP *</label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP "
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-btn" onClick={handleRegister} disabled={loading}>
              {loading ? "Verifying..." : isNewUser ? "CREATE ACCOUNT" : "LOGIN"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
