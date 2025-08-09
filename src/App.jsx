import { useEffect, useState } from "react";
import Search from "./Components/Search";
import Spinner from "./Components/Spinner";
import MovieCard from "./Components/MovieCard";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [movieLit, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async () => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const reponse = await fetch(endpoint, API_OPTIONS);

      if (!reponse.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await reponse.json();

      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to Fetch Movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || [])

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage(`Error Fetching Movies. Please Try Again Later`);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>

      <div className="pattern" />

      <div className="wrapper">

        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> you'll Enjoy Without Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {
                movieLit.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              }
            </ul>
          )}

        </section>

      </div>
    </main>
  )
}

export default App;