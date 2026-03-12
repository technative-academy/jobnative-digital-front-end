import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import { useAuth } from "../../hooks/useAuth";

const initialForm = {
  email: "",
  password: "",
};

function Login() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      footerLinkLabel="Create one now"
      footerLinkTo="/signup"
      footerText="Need an account?"
      mode="login"
      subtitle="Enter your email and password to continue."
      title="Sign in"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? (
          <div className="auth-message auth-message--error" role="alert">
            {error}
          </div>
        ) : null}

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="login-email">
            Email address
          </label>
          <input
            autoComplete="email"
            className="auth-field__input"
            id="login-email"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            required
            type="email"
            value={form.email}
          />
        </div>

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="login-password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className="auth-field__input"
            id="login-password"
            name="password"
            onChange={handleChange}
            placeholder="Enter your password"
            required
            type="password"
            value={form.password}
          />
        </div>

        <button className="auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
