import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlay, FaShareAlt, FaHeart, FaStar } from 'react-icons/fa';
import './ItemDetailPage.css';

const ItemDetailPage = () => {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);

        const headers = {
          accept: 'application/json',
Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,

        };

        // Fetch main item details
        const itemUrl = `https://api.themoviedb.org/3/${type}/${id}?language=en-US`;
        const itemRes = await fetch(itemUrl, { headers });
        if (!itemRes.ok) throw new Error("Failed to fetch item details");
        const itemData = await itemRes.json();
        setItem(itemData);

        // Fetch videos (trailers)
        const videoUrl = `https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`;
        const videoRes = await fetch(videoUrl, { headers });
        if (!videoRes.ok) throw new Error("Failed to fetch videos");
        const videoData = await videoRes.json();
        setVideos(videoData.results || []);

      } catch (err) {
        console.error('Failed to fetch details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [type, id]);

  const handleTrailerClick = () => {
    const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    if (trailer) {
      setIsModalOpen(true);
    } else {
      alert('Trailer not found for this item.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="movie-detail-page-skeleton">
        <div className="detail-header-skeleton"></div>
        <div className="detail-content-skeleton">
          <div className="detail-poster-skeleton"></div>
          <div className="detail-info-skeleton">
            <h1 className="skeleton-line-title"></h1>
            <p className="skeleton-line-text"></p>
            <p className="skeleton-line-text"></p>
            <p className="skeleton-line-text"></p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return <div className="movie-detail-page">Item not found.</div>;
  }

  // ✅ Fallbacks for missing data
  const backdropUrl = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : 'https://via.placeholder.com/1280x720';

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750';

  const title = item.title || item.name;
  const overview = item.overview || "No overview available.";
  const releaseInfo = item.release_date || item.first_air_date || "N/A";
  const runtime = item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null);
  const genres = item.genres ? item.genres.map(g => g.name).join(', ') : 'N/A';

  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  return (
    <div className="movie-detail-page">
      <div className="poster">
        <div className="detail-poster-container">
          <img src={posterUrl} alt={title} className="detail-poster" />
        </div>

        <div className="detail-header" style={{ backgroundImage: `url(${backdropUrl})` }}>
          <div className="overlay"></div>
          <div className="detail-header-content">
            <h1 className="detail-title">{title}</h1>

            <div className="rating-info">
              <FaStar className="star-icon" />
              <span className="rating-score">
                {item.vote_average ? item.vote_average.toFixed(1) : "N/A"} / 10
              </span>
            </div>

            <div className="action-icons">
              <button className="play-button" onClick={handleTrailerClick}>
                <FaPlay className="play-icon" /> Trailer
              </button>
              <div className="action-icons-row">
                <button className="icon-button"><FaHeart /></button>
                <button className="icon-button"><FaShareAlt /></button>
              </div>
            </div>

            <div className="detail-content">
              <div className="detail-info">
                <p className="detail-tagline">{item.tagline || ''}</p>
                <p className="detail-overview">{overview}</p>
                <div className="detail-meta">
                  <p><strong>Release Date:</strong> {releaseInfo}</p>
                  <p><strong>Runtime:</strong> {runtime ? `${runtime} minutes` : 'N/A'}</p>
                  <p><strong>Genres:</strong> {genres}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Trailer Modal */}
      {isModalOpen && trailer && (
        <div className="video-modal-overlay" onClick={handleCloseModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&modestbranding=1&rel=0&controls=1&disablekb=1&playsinline=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
