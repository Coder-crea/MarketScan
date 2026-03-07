import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import api from "../api/axios";
import "./History.css";
import { FiCalendar, FiExternalLink } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/search/history");
      setHistory(response.data.history);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Не удалось загрузить историю запросов");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} минут назад`;
    } else if (diffHours < 24) {
      return `${diffHours} часов назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дней назад`;
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="history-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка истории...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="history-error">
          <FaRegClock className="error-icon" />
          <h3>Ошибка загрузки</h3>
          <p>{error}</p>
          <button onClick={fetchHistory} className="retry-btn">
            Попробовать снова
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  if (history.length === 0) {
    return (
      <ProtectedRoute>
        <div className="history-empty">
          <FaRegClock className="empty-icon" />
          <h3>История запросов пуста</h3>
          <p>
            Здесь будут появляться ваши поисковые запросы и найденные товары
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="history-container">
        <div className="history-header">
          <h1>История поиска</h1>
          <span className="history-count">
            Всего запросов: {history.length}
          </span>
        </div>

        <div className="history-timeline">
          {history.map((item, index) => (
            <div key={item.id} className="history-item">
              {/* Запрос пользователя */}
              <div className="query-bubble">
                <div className="query-content">
                  <div className="query-header">
                    <span className="query-label">Вы искали:</span>
                    {/* <span className="query-time">
                      <FiClock className="time-icon" />
                      {formatDate(item.created_at)}
                    </span> */}
                  </div>
                  <div className="query-text">{item.query}</div>
                </div>
              </div>

              {/* Ответ от сервиса (товары) */}
              <div className="offers-bubble">
                <div className="offers-header">
                  <span className="offers-count">
                    Найдено товаров: {item.offers?.length || 0}
                  </span>
                  <span className="offers-full-date">
                    <FiCalendar className="calendar-icon" />
                    {formatFullDate(item.created_at)}
                  </span>
                </div>

                <div className="offers-grid">
                  {item.offers?.map((offer) => (
                    <div key={offer.id} className="offer-card">
                      <div className="offer-image">
                        <img src={offer.image} alt={offer.title} />
                        <span className="offer-source">{offer.source}</span>
                      </div>
                      <div className="offer-info">
                        <h4 className="offer-title">{offer.title}</h4>
                        <div className="offer-price">
                          {offer.price} {offer.currency}
                        </div>
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="offer-link"
                        >
                          Перейти в магазин
                          <FiExternalLink className="link-icon" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Разделитель между запросами (кроме последнего) */}
              {index < history.length - 1 && (
                <div className="timeline-separator" />
              )}
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default History;
