import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Добавляем ref для отслеживания текущего запроса
  const currentQueryRef = useRef(null);

  // Проверяем, есть ли уже пользователь при загрузке
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
        // Получаем информацию о пользователе
        const response = await api.get("/me");
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Failed to get user:", error);
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const { access_token, user } = response.data;

      localStorage.setItem("accessToken", access_token);
      setAccessToken(access_token);
      setUser(user);

      toast.success("Успешный вход!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Ошибка входа";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (email, password, phone = "") => {
    try {
      const response = await api.post("/register", { email, password, phone });
      const { access_token, user } = response.data;

      localStorage.setItem("accessToken", access_token);
      setAccessToken(access_token);
      setUser(user);

      toast.success("Регистрация успешна!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Ошибка регистрации";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);
      setSearchResults(null);
      setSearchError(null);
      currentQueryRef.current = null;
      toast.success("Вы вышли из системы");
    }
  };

  // Функция поиска товаров
  const searchProducts = async (query) => {
    // Валидация
    if (!query.trim()) {
      setSearchError("Введите поисковый запрос");
      return { success: false, error: "Введите поисковый запрос" };
    }

    // Проверка на дублирование запроса
    if (searchLoading) {
      console.log("Поиск уже выполняется, пропускаем...");
      return { success: false, error: "Поиск уже выполняется" };
    }

    // Проверка на повторный поиск того же самого
    if (currentQueryRef.current === query && searchResults?.query === query) {
      console.log("Тот же запрос уже выполнен, пропускаем...");
      return { success: true, data: searchResults };
    }

    setSearchLoading(true);
    setSearchError(null);
    currentQueryRef.current = query;

    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`);

      // Проверяем, не изменился ли query за время запроса
      if (currentQueryRef.current === query) {
        setSearchResults({
          query: response.data.query,
          results: response.data.results,
        });

        toast.success(`Найдено ${response.data.results.length} товаров`);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      // Проверяем, актуален ли еще этот запрос
      if (currentQueryRef.current === query) {
        let message = "Ошибка при поиске";

        if (error.response) {
          switch (error.response.status) {
            case 400:
              message = error.response.data?.message || "Некорректный запрос";
              break;
            case 401:
              message = "Необходимо авторизоваться";
              // Можно добавить редирект на логин
              window.location.href = "/login";
              break;
            case 429:
              message = "Слишком много запросов. Попробуйте позже";
              break;
            default:
              message = error.response.data?.message || "Ошибка сервера";
          }
        } else if (error.request) {
          message = "Сервер не отвечает. Проверьте подключение";
        } else {
          message = "Произошла ошибка";
        }

        setSearchError(message);
        toast.error(message);
      }

      return {
        success: false,
        error: error,
      };
    } finally {
      if (currentQueryRef.current === query) {
        setSearchLoading(false);
      }
    }
  };

  // Очистка результатов поиска
  const clearSearch = () => {
    setSearchResults(null);
    setSearchError(null);
    currentQueryRef.current = null;
  };

  const value = {
    // Аутентификация
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,

    // Поиск
    searchProducts,
    searchResults,
    searchLoading,
    searchError,
    clearSearch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
