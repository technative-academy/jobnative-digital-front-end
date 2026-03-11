import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import { useAuth } from '../../hooks/useAuth';

const initialForm = {
  email: '',
  name: '',
  password: '',
};

function Signup() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password.trim().length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Unable to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      footerLinkLabel="Sign in"
      footerLinkTo="/login"
      footerText="Already have an account?"
      mode="signup"
      subtitle="Enter your details to create an account."
      title="Create account"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error ? (
          <div className="auth-message auth-message--error" role="alert">
            {error}
          </div>
        ) : null}

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="signup-name">
            Full name
          </label>
          <input
            autoComplete="name"
            className="auth-field__input"
            id="signup-name"
            name="name"
            onChange={handleChange}
            placeholder="Alex Johnson"
            required
            type="text"
            value={form.name}
          />
        </div>

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="signup-email">
            Email address
          </label>
          <input
            autoComplete="email"
            className="auth-field__input"
            id="signup-email"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            required
            type="email"
            value={form.email}
          />
        </div>

        <div className="auth-field">
          <label className="auth-field__label" htmlFor="signup-password">
            Password
          </label>
          <input
            autoComplete="new-password"
            className="auth-field__input"
            id="signup-password"
            name="password"
            onChange={handleChange}
            placeholder="At least 8 characters"
            required
            type="password"
            value={form.password}
          />
        </div>

        <button className="auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;
