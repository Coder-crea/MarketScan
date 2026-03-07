import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiExternalLink, FiSearch } from "react-icons/fi";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchProducts, searchResults, searchLoading, searchError } =
    useAuth();
  const [results, setResults] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const hasFetched = useRef(false);

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query) {
      setInputValue(query);
    }
  }, [query]);

  useEffect(() => {
    if (!query || hasFetched.current) return;

    hasFetched.current = true;
    handleSearch(query);

    return () => {
      hasFetched.current = false;
    };
  }, [query]);

  const handleSearch = async (searchQuery) => {
    if (results?.query === searchQuery) return;

    const result = await searchProducts(searchQuery);
    if (result.success) {
      setResults(result.data);
    }
  };

  const handleSearchInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      hasFetched.current = false;
      navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
      setInputValue("");
    }
  };

  const handleNewSearch = (newQuery) => {
    if (newQuery.trim()) {
      hasFetched.current = false;
      navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  // Показываем загрузку
  if (searchLoading) {
    return (
      <div className="search-loading">
        <div className="search-header">
          <div className="search-center">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск товаров..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleSearchInput}
              autoFocus
            />
          </div>
        </div>
        <div className="loading-spinner"></div>
        <p>Ищем товары по запросу "{query}"...</p>
      </div>
    );
  }

  // Показываем ошибку
  if (searchError) {
    return (
      <div className="search-error">
        <div className="search-header">
          <div className="search-center">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск товаров..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleSearchInput}
              autoFocus
            />
          </div>
        </div>
        <p>{searchError}</p>
        <button onClick={() => navigate("/")}>Вернуться на главную</button>
      </div>
    );
  }

  // Показываем результаты
  if (results) {
    return (
      <div className="search-container">
        <div className="search-header">
          <div className="search-center">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск товаров..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleSearchInput}
              autoFocus
            />
          </div>
        </div>

        <div className="search-header">
          <h1>Результаты поиска: "{query}"</h1>
          <p className="results-count">
            Найдено товаров: {results.results.length}
          </p>
        </div>

        <div className="results-grid">
          {results.results.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
                <span className="product-source">{product.source}</span>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">
                  {product.price} {product.currency}
                </p>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-link"
                >
                  Перейти в магазин
                  <FiExternalLink className="link-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Если нет query (просто зашли на /search)
  return (
    <div className="search-empty">
      <div className="search-header">
        <div className="search-center">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск товаров..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleSearchInput}
            autoFocus
          />
        </div>
      </div>
      <FiSearch className="empty-icon" />
      <h2>Поиск товаров</h2>
      <p>Введите запрос в поисковую строку, чтобы найти товары</p>
    </div>
  );
};

export default Search;
