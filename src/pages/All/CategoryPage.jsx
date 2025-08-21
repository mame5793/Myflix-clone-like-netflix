import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category, genre, language } = useParams();
  const [items, setItems] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let endpoint = '';
    let title = '';

    if (category) {
      const categoryEndpoints = {
        popular: 'movie/popular',
        upcoming: 'movie/upcoming',
        now_playing: 'movie/now_playing',
        tv: 'tv/on_the_air',
        children: 'discover/movie?with_genres=10751',
        action: 'discover/movie?with_genres=28',
        comedy: 'discover/movie?with_genres=35',
        drama: 'discover/movie?with_genres=18',
        horror: 'discover/movie?with_genres=27',
        romance: 'discover/movie?with_genres=10749',
        scifi: 'discover/movie?with_genres=878',
      };
      endpoint = categoryEndpoints[category] || 'movie/popular';
      title = category;
    } else if (genre) {
      const genreMap = {
        action: 28,
        comedy: 35,
        drama: 18,
        horror: 27,
        romance: 10749,
      };
      endpoint = `discover/movie?with_genres=${genreMap[genre] || 28}`;
      title = genre;
    } else if (language) {
      const langMap = {
        english: 'en',
        spanish: 'es',
        french: 'fr',
        german: 'de',
        italian: 'it',
        korean: 'ko',
        japanese: 'ja',
        hindi: 'hi',
        arabic: 'ar',
        portuguese: 'pt',
        chinese: 'zh',
        russian: 'ru',
        turkish: 'tr',
      };
      const langCode = langMap[language.toLowerCase()] || 'en';
      endpoint = `discover/movie?with_original_language=${langCode}`;
      title = language;
    }

    const fetchItems = async () => {
      try {
        setLoading(true);
        const url = `https://api.themoviedb.org/3/${endpoint}${
          endpoint.includes('?') ? '&' : '?'
        }language=en-US&page=1`;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        });

        const data = await res.json();
        setItems(data.results || []);
        setPageTitle(title);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category, genre, language]);

  return (
    <div className="category-page">
      <h1>{pageTitle.toUpperCase()} Movies</h1>
      <div className="movie-grid">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="movie-card skeleton"></div>
            ))
          : items.map((item) => {
              const isMovie = item.title ? true : false;
              const type = isMovie ? 'movie' : 'tv';
              const itemTitle = isMovie ? item.title : item.name;

              return (
                <Link to={`/${type}/${item.id}`} key={item.id} className="movie-card-link">
                  <div className="movie-card">
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        alt={itemTitle}
                      />
                    ) : (
                      <div>No Image</div>
                    )}
                    <p>{itemTitle}</p>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default CategoryPage;