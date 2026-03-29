import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiExternalLink,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
  FiChevronDown,
} from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import toast from "react-hot-toast";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const hasFetched = useRef(false);
  const currentQueryRef = useRef(null);
  const sortMenuRef = useRef(null);

  const query = searchParams.get("q") || "";
  const API_URL = "https://foxshop-production.up.railway.app/api";

  // Закрытие меню сортировки при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Функция сортировки товаров
  const sortProducts = useCallback((products, sortType, order) => {
    if (!products || products.length === 0) return products;

    const sorted = [...products];

    switch (sortType) {
      case "price":
        sorted.sort((a, b) => {
          const priceA =
            parseFloat(a.price?.replace(/[^0-9.-]/g, "")) || Infinity;
          const priceB =
            parseFloat(b.price?.replace(/[^0-9.-]/g, "")) || Infinity;
          return order === "asc" ? priceA - priceB : priceB - priceA;
        });
        break;

      case "rating":
        sorted.sort((a, b) => {
          const ratingA = parseFloat(a.rating) || -1;
          const ratingB = parseFloat(b.rating) || -1;
          // Товары без рейтинга отправляем в конец
          if (ratingA === -1 && ratingB === -1) return 0;
          if (ratingA === -1) return 1;
          if (ratingB === -1) return -1;
          return order === "asc" ? ratingA - ratingB : ratingB - ratingA;
        });
        break;

      default:
        // По умолчанию - порядок от сервера
        return products;
    }

    return sorted;
  }, []);

  // Поиск товаров - обернуто в useCallback
  const performSearch = useCallback(
    async (searchQuery) => {
      if (!searchQuery?.trim()) {
        setError("Введите поисковый запрос");
        toast.error("Введите поисковый запрос");
        return;
      }

      if (
        currentQueryRef.current === searchQuery &&
        results?.query === searchQuery
      ) {
        return;
      }

      setLoading(true);
      setError(null);
      currentQueryRef.current = searchQuery;

      try {
        const response = await fetch(
          `${API_URL}/search?q=${encodeURIComponent(searchQuery)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}`);
        }

        const data = await response.json();

        if (currentQueryRef.current === searchQuery) {
          setResults({
            query: data.query || searchQuery,
            results: data.results || [],
            originalResults: data.results || [],
          });

          const count = data.results?.length || 0;
          if (count > 0) {
            toast.success(`Найдено ${count} товаров`);
          } else {
            toast.error("Товары не найдены");
          }
        }
      } catch (err) {
        if (currentQueryRef.current === searchQuery) {
          let message = "Ошибка при поиске";
          if (err.message.includes("Failed to fetch")) {
            message = "Сервер не отвечает. Проверьте подключение";
          }
          setError(message);
          toast.error(message);
        }
      } finally {
        if (currentQueryRef.current === searchQuery) {
          setLoading(false);
        }
      }
    },
    [API_URL, results?.query],
  );

  // Выполнение поиска при клике на кнопку - обернуто в useCallback
  const handleSearchClick = useCallback(() => {
    const searchQuery = inputValue.trim();
    if (searchQuery) {
      if (searchQuery !== query) {
        hasFetched.current = false;
        setResults(null);
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    } else {
      toast.error("Введите поисковый запрос");
    }
  }, [inputValue, query, navigate]);

  // Запускаем поиск при изменении query - исправлено
  useEffect(() => {
    if (query && !hasFetched.current) {
      hasFetched.current = true;
      performSearch(query);
    }
    return () => {
      hasFetched.current = false;
    };
  }, [query, performSearch]);

  // Обновляем инпут
  useEffect(() => {
    if (query) {
      setInputValue(query);
    }
  }, [query]);

  // Обработка ввода - обернуто в useCallback
  const handleSearchInput = useCallback(
    (e) => {
      if (e.key === "Enter" && e.target.value.trim()) {
        const newQuery = e.target.value.trim();
        if (newQuery !== query) {
          hasFetched.current = false;
          setResults(null);
          navigate(`/search?q=${encodeURIComponent(newQuery)}`);
        }
      }
    },
    [query, navigate],
  );

  // Получаем отсортированные результаты
  const sortedResults = useMemo(() => {
    if (!results?.originalResults) return [];
    return sortProducts(results.originalResults, sortBy, sortOrder);
  }, [results, sortBy, sortOrder, sortProducts]);

  // Поисковая строка с кнопкой
  const SearchInput = () => (
    <div className="search-header">
      <div className="search-center">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск товаров..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleSearchInput}
            autoFocus
            disabled={loading}
          />
          <button
            className="search-button"
            onClick={handleSearchClick}
            disabled={loading}
          >
            <CiSearch size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // Компонент сортировки
  const SortControls = () => (
    <div className="sort-controls" ref={sortMenuRef}>
      <button
        className="sort-button"
        onClick={() => setShowSortMenu(!showSortMenu)}
      >
        <span>Сортировка</span>
        <FiChevronDown
          className={`sort-icon ${showSortMenu ? "rotated" : ""}`}
        />
      </button>

      {showSortMenu && (
        <div className="sort-menu">
          <div
            className={`sort-option ${sortBy === "default" ? "active" : ""}`}
            onClick={() => {
              setSortBy("default");
              setShowSortMenu(false);
            }}
          >
            По умолчанию
          </div>
          <div className="sort-option price-sort">
            <span>По цене</span>
            <div className="sort-order-buttons">
              <button
                className={`order-btn ${sortBy === "price" && sortOrder === "asc" ? "active" : ""}`}
                onClick={() => {
                  setSortBy("price");
                  setSortOrder("asc");
                  setShowSortMenu(false);
                }}
              >
                <FiArrowUp size={14} /> дешевле
              </button>
              <button
                className={`order-btn ${sortBy === "price" && sortOrder === "desc" ? "active" : ""}`}
                onClick={() => {
                  setSortBy("price");
                  setSortOrder("desc");
                  setShowSortMenu(false);
                }}
              >
                <FiArrowDown size={14} /> дороже
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Загрузка
  if (loading) {
    return (
      <div className="search-loading">
        <SearchInput />
        <div className="loading-spinner"></div>
        <p>Ищем товары по запросу "{query}"...</p>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="search-error">
        <SearchInput />
        <p>{error}</p>
        <div className="error-buttons">
          <button onClick={() => navigate("/")}>На главную</button>
          <button className="retry" onClick={() => performSearch(query)}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  // Результаты
  if (results && sortedResults) {
    const products = sortedResults;

    return (
      <div className="search-container">
        <SearchInput />

        <div className="search-info">
          <div className="search-info-left">
            <h1>Результаты поиска: "{query}"</h1>
            <p className="results-count">Найдено товаров: {products.length}</p>
          </div>
          {products.length > 0 && <SortControls />}
        </div>

        {products.length === 0 ? (
          <div className="no-results">
            <p>По запросу "{query}" ничего не найдено</p>
          </div>
        ) : (
          <div className="results-grid">
            {products.map((product, idx) => (
              <div key={product.id || idx} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image || "https://via.placeholder.com/200"}
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/200";
                    }}
                  />
                  <span className="product-source">
                    {product.source || "Unknown"}
                  </span>
                </div>
                <div className="product-info">
                  <h3 className="product-title">
                    {product.title || "Без названия"}
                  </h3>
                  <p className="product-price">
                    {product.price || "Цена не указана"}
                  </p>
                  {product.rating && (
                    <div className="product-rating">
                      <span className="stars">⭐ {product.rating}</span>
                      {product.reviews && (
                        <span className="reviews">
                          ({product.reviews} отзывов)
                        </span>
                      )}
                    </div>
                  )}
                  {product.url && product.url !== "#" && (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="product-link"
                    >
                      Перейти в магазин <FiExternalLink />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Пустая страница
  return (
    <div className="search-empty">
      <SearchInput />
      <FiSearch className="empty-icon" />
      <h2>Поиск товаров</h2>
      <p>Введите запрос, чтобы найти товары</p>
    </div>
  );
};

export default Search;
