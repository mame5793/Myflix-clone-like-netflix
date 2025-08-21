import React, { useRef, useEffect, useState } from 'react';
import './Tittlecard.css';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Titlecard = ({ title, category }) => {
  const scrollRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const endpoint = categoryEndpoints[category] || 'movie/popular';
    const url = `https://api.themoviedb.org/3/${endpoint}${endpoint.includes('?') ? '&' : '?'}language=en-US&page=1`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',

        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,

      },
    };

    setIsLoading(true);
    setError(null); // Reset error on each new fetch

    fetch(url, options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setItems(data.results || []);
      })
      .catch(err => {
        console.error("Failed to fetch movies:", err);
        setError(err); // Set the error state if something goes wrong
      })
      .finally(() => {
        setIsLoading(false); // This runs after .then() or .catch()
      });
  }, [category]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="titlecard">
      <h2>{title}</h2>
      <div className="scroll-wrapper">
        <button className="scroll-button left" onClick={() => scroll('left')}>
          <FaChevronLeft />
        </button>

        <div className="card-list" ref={scrollRef}>
          {isLoading ? (
            // Case 1: Still loading
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : error ? (
            // Case 2: An error occurred
            <div className="error-message">Failed to load movies.</div>
          ) : items.length > 0 ? (
            // Case 3: Success and there are movies
            <>
              {items.map((item, index) => {
                const isMovie = !!item.title;
                const type = isMovie ? 'movie' : 'tv';
                const itemTitle = isMovie ? item.title : item.name;

                return (
                  <Link to={`/${type}/${item.id}`} key={item.id || index} className="card-link">
                    <div className="card">
                      {item.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={itemTitle || 'Item'}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      <p>{itemTitle || 'Untitled'}</p>
                    </div>
                  </Link>
                );
              })}

              <Link to={`/category/${category}`} className="card view-all-card">
                <div className="view-all-content">
                  <span>
                    View All <FaArrowRight />
                  </span>
                </div>
              </Link>
            </>
          ) : (
            // Case 4: Success but NO movies were found
            <div className="empty-message">No movies found in this category.</div>
          )}
        </div>

        <button className="scroll-button right" onClick={() => scroll('right')}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Titlecard;