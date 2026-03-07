import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Используем login из контекста

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    const { email, phone, password } = formData;

    if (!email.trim() || !phone.trim() || !password.trim()) {
      setError("Все поля должны быть заполнены");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Введите корректный email адрес");
      return false;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Введите корректный номер телефона (минимум 10 цифр)");
      return false;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Используем login из контекста (принимает только email и password)
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Вход в аккаунт</h1>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email поле */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className={error && !formData.email ? "error" : ""}
              disabled={loading}
            />
          </div>

          {/* Телефон поле */}
          <div className="form-group">
            <label htmlFor="phone">Номер телефона</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              className={error && !formData.phone ? "error" : ""}
              disabled={loading}
            />
          </div>

          {/* Пароль поле с глазом */}
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={error && !formData.password ? "error" : ""}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          {/* Сообщение об ошибке */}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        {/* Ссылка на регистрацию */}
        <div className="register-link">
          <span
            onClick={() => !loading && navigate("/register")}
            className="register-text"
          >
            Еще нет аккаунта? Зарегистрируйтесь
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
