import React, { useEffect, useState } from 'react';
import './Home.css';
import Navbar from '../../component/Navbar/Navbar';
import hero_banner from '../../assets/hero_banner.jpg';
import hero_tittle from '../../assets/hero_title.png';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import Titlecard from '../../component/Titlecard/Titlecard';
import Fotter from '../../component/Footer/Fotter';

const Home = () => {
  const [allMovies, setAllMovies] = useState({});
  const [loading, setLoading] = useState(true);

  const categoryEndpoints = {
    popular: 'movie/popular',
    tv: 'tv/on_the_air',
    action: 'discover/movie?with_genres=28',
    romance: 'discover/movie?with_genres=10749',
    upcoming: 'movie/upcoming',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = Object.entries(categoryEndpoints);

        const results = await Promise.all(
          endpoints.map(([key, endpoint]) =>
            fetch(
              `https://api.themoviedb.org/3/${endpoint}?language=en-US&page=1`,
              {
                headers: {
                  accept: 'application/json',
                  Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjI5ODYxMGI3Y2I3NTU2NzVkYTljMWE0OWQ1YzEzZSIsIm5iZiI6MTc1NDMxMTgxNy4xNjUsInN1YiI6IjY4OTBhYzg5NTE2ZmMyMmIwZWE0NmFiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2ALR3l0irso4iR7x4y4TjlVXgpSwwCiPl6dshvl5pnY',
                },
              }
            ).then((res) => res.json())
          )
        );

        const movieData = {};
        endpoints.forEach(([key], index) => {
          movieData[key] = results[index].results || [];
        });

        setAllMovies(movieData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
     <Navbar />
      <div className="home">
       
        <div className="hero">
          <img src={hero_banner} alt="hero img" className="banner_img" />

          <div className="hero_caption">
         {   <img src={hero_tittle} alt="" className="caption_img" /> }
            <p>
              Discovering his ties to a secret ancient order, a young man living
              in modern Istanbul embarks on a quest to save the city from an
              immortal enemy.
            </p>
            <div className="hero_btn">
              <div className="btn">
                <button className="btn play">
                  <img src={play_icon} alt="play" /> Play
                </button>
                <button className="btn info">
                  <img src={info_icon} alt="info" /> More info
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="morecard">
          <Titlecard title="Popular" category="popular" movies={allMovies.popular} loading={loading} />
          <Titlecard title="TV Shows" category="tv" movies={allMovies.tv} loading={loading} />
          <Titlecard title="Action" category="action" movies={allMovies.action} loading={loading} />
          <Titlecard title="Romance" category="romance" movies={allMovies.romance} loading={loading} />
          <Titlecard title="Upcoming" category="upcoming" movies={allMovies.upcoming} loading={loading} />
        </div>

        <Fotter />
      </div>
    </>
  );
};

export default Home;
          