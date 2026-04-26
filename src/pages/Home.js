import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/homeComponents/NavBar";
import { FiSearch, FiShoppingBag, FiTruck, FiShield } from "react-icons/fi";
import "./Home.css";
import Tshirt from "../assets/img/big_tshirt.jpg";
import SneakersNike from "../assets/img/Sneakers_nike.jpg";
import DressSummer from "../assets/img/summer_dress.jpg";
import SneakersAdidas from "../assets/img/Sneakers_adidas.jpg";
import JeansMen from "../assets/img/Jeans_mens.jpg";
import SkinBag from "../assets/img/skin_bag.jpg";
import CoatWomen from "../assets/img/Palto_girl.jpg";
import CostumeMen from "../assets/img/Costume_men.jpg";
import { FaLocationDot } from "react-icons/fa6";
const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Массив с товарами для анимации
  const products = [
    {
      id: 1,
      image: Tshirt,
      title: "Футболка оверсайз",
      price: "885 ₽",
      url: "https://www.ozon.ru/product/futbolka-esqudo-oversayz-3552911937/?at=r2t4jWYq0sGOGO6LHPm6Xn6TpRm601iV86y3Bc1V2xX4",
    },
    {
      id: 2,
      image: SneakersNike,
      title: "Кроссовки Nike",
      price: "2 236 ₽",
      url: "https://www.ozon.ru/product/krossovki-air-force-dunk-2884397522/?at=ywtAWpw1zc57VYZMIKGEMzMU4yyk32S880krwSq9n6j",
    },
    {
      id: 3,
      image: DressSummer,
      title: "Платье летнее",
      price: "2 690 ₽",
      url: "https://www.ozon.ru/product/plate-bez-rukavov-tsvet-2082783570/?at=w0tgQ2mjzTzOX41Kc9rxy4wT791PyoukKmLWjSAL9plj",
    },
    {
      id: 4,
      image: SneakersAdidas,
      title: "Кроссовки Adidas",
      price: "2 000 ₽",
      url: "https://www.ozon.ru/product/krossovki-originals-forum-2061501684/?at=w0tgQ2mjzTBq9mkWIglG8rqF7gKO3LsABBNNYIvrnp2z",
    },
    {
      id: 5,
      image: JeansMen,
      title: "Джинсы мужские",
      price: "3 287 ₽",
      url: "https://www.ozon.ru/product/dzhinsy-kanytonshop-banan-1617930400/?at=99trKDX0ghpQPqjXu34rwj8sq9KowLHWBJNZBuQPAKRj",
    },
    {
      id: 6,
      image: SkinBag,
      title: "Сумка кожаная",
      price: "1 923 ₽",
      url: "https://www.ozon.ru/product/sumka-zhenskaya-bolshaya-shopper-na-plecho-cherez-plecho-hobo-dlya-noutbuka-2609155459/?at=VvtzKY6JLHQ1WO2HlYyVXQSgrW309iAKBV8ESDgql36",
    },
    {
      id: 7,
      image: CoatWomen,
      title: "Пальто женское",
      price: "5 083 ₽",
      url: "https://www.ozon.ru/product/palto-katty-po-demisezonnoe-vesennee-881177479/?at=28t0GgXYJS8jymMwU1JygK4U5PA472h40rpzBtY2ZpPP",
    },
    {
      id: 8,
      image: CostumeMen,
      title: "Костюм мужской",
      price: "8 810 ₽",
      url: "https://www.ozon.ru/product/kostyum-klassicheskiy-svyatnyh-2900302193/?at=XQtkNWRQyh8nA1K3sxAK1YPtjNLqOjFOA6W5vunNvNgr",
    },
  ];

  // Бесконечная прокрутка слайдов
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <div className="home">
      <NavBar />

      {/* Hero секция с анимацией */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Найдите <span className="gradient-text">лучшие цены</span>
            <br />
            на всех маркетплейсах
          </h1>
          <p className="hero-subtitle">
            MarketScan — это умный поиск, который собирает предложения с
            российских интернет магазинов и других площадок. Экономьте время и
            деньги!
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleSearchClick}>
              <FiSearch className="btn-icon" />
              Начать поиск
            </button>
            {/* <button
              className="secondary-btn"
              onClick={() => navigate("/register")}
            >
              Зарегистрироваться
            </button> */}
          </div>
        </div>

        {/* Анимация товаров */}
        <div className="product-showcase">
          <div
            className="product-track"
            style={{ transform: `translateX(-${currentSlide * 220}px)` }}
          >
            {[...products, ...products].map((product, index) => (
              <a href={product.url} className="Special-link">
                <div key={`${product.id}-${index}`} className="product-card">
                  <img src={product.image} alt={product.title} />
                  <div className="product-card-info">
                    <h4>{product.title}</h4>
                    <p>{product.price}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Секция преимуществ */}
      <section className="features-section">
        <h2 className="section-title">Почему выбирают MarketScan?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FiShoppingBag />
            </div>
            <h3>Все площадки в одном месте</h3>
            <p>
              Wildberries, Ozon, Яндекс Маркет, AliExpress и более 50 других
              магазинов
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiSearch />
            </div>
            <h3>Умный поиск</h3>
            <p>Находим точные совпадения и похожие товары по вашему запросу</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiTruck />
            </div>
            <h3>Сравнение доставки</h3>
            <p>Учитываем стоимость и сроки доставки от разных продавцов</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FiShield />
            </div>
            <h3>Безопасные покупки</h3>
            <p>
              Переходите только на проверенные площадки с защитой покупателя
            </p>
          </div>
        </div>
      </section>

      {/* Секция статистики */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Магазинов</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1M+</span>
            <span className="stat-label">Товаров</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Обновление цен</span>
          </div>
        </div>
      </section>

      {/* Секция с примерами поиска */}
      <section className="examples-section">
        <h2 className="section-title">Популярные запросы</h2>
        <div className="examples-grid">
          {[
            "футболка оверсайз",
            "кроссовки найк",
            "айфон 15",
            "наушники",
            "часы samsung",
            "духи",
          ].map((item) => (
            <button
              key={item}
              className="example-tag"
              onClick={() => navigate(`/search?q=${encodeURIComponent(item)}`)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* CTA секция */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Готовы начать экономить?</h2>
          <p>Присоединяйтесь к пользователей, которые уже нашли лучшие цены</p>
          <button className="cta-button" onClick={handleSearchClick}>
            Попробовать бесплатно
          </button>
        </div>
      </section>

      {/* Футер */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-info">
              <h3 className="footer-title">MarketScan</h3>
              <p className="footer-description">
                Умный поиск товаров на всех маркетплейсах
              </p>
            </div>

            <div className="footer-creators">
              <h4 className="footer-subtitle">Над проектом работали</h4>
              <p className="footer-text">
                Проект сделан учениками школы МОУ СОШ №34 им. А.Г. Монетова
              </p>
              <p className="footer-names">
                Большаков Даниил и Широкий Александр
              </p>
              <p className="footer-location">
                <FaLocationDot /> г. Подольск, Московская область
              </p>
            </div>

            <div className="footer-copyright">
              <p>© {new Date().getFullYear()} MarketScan</p>
              <p className="footer-rights">Все права защищены</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
