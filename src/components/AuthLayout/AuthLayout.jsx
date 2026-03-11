import { Link } from "react-router-dom";
import "./AuthLayout.css";

const panelContent = {
  login: {
    actionLabel: "Create an account",
    actionTo: "/signup",
    description: "Sign in with your email and password.",
    kicker: "JobNative",
    switchText: "Need an account?",
    title: "Welcome back",
  },
  signup: {
    actionLabel: "Sign in",
    actionTo: "/login",
    description: "Create an account with your name, email, and password.",
    kicker: "JobNative",
    switchText: "Already have an account?",
    title: "Create account",
  },
};

function AuthLayout({
  children,
  footerLinkLabel,
  footerLinkTo,
  footerText,
  mode,
  subtitle,
  title,
}) {
  const content = panelContent[mode];

  return (
    <section className="auth-page">
      <div className="auth-card">
        <aside className="auth-card__aside">
          <p className="auth-card__kicker">{content.kicker}</p>
          <h1 className="auth-card__welcome">{content.title}</h1>
          <p className="auth-card__description">{content.description}</p>
          <p className="auth-card__switch-copy">
            {content.switchText}{" "}
            <Link className="auth-card__switch" to={content.actionTo}>
              {content.actionLabel}
            </Link>
          </p>
        </aside>

        <div className="auth-card__main">
          <div className="auth-card__header">
            <h2 className="auth-card__main-title">{title}</h2>
            <p className="auth-card__main-subtitle">{subtitle}</p>
          </div>

          {children}

          <p className="auth-card__footer">
            {footerText} <Link to={footerLinkTo}>{footerLinkLabel}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default AuthLayout;
