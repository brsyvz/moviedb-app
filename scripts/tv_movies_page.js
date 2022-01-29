function renderTvMoviesPage() {
  const main = document.querySelector('main');
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  let sectionHeader = document.createElement('h3');
  const tvLink = document.getElementById('tvLink');
  const moviesLink = document.getElementById('moviesLink');
  tvLink.addEventListener('click', renderPopularTvSeries);
  moviesLink.addEventListener('click', renderPopularMovies);
  const moviesUrl =
    'https://api.themoviedb.org/3/movie/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1';

  const tvSeriesUrl =
    'https://api.themoviedb.org/3/tv/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1';

  const imgUrl = 'https://image.tmdb.org/t/p/w300/';

  let currentUrl = '';
  let type = '';

  function renderPopularTvSeries(e) {
    e.preventDefault();
    currentUrl = tvSeriesUrl;
    type = 'tv';
    clearMainContent();
    renderFetchedContent();
  }

  function renderPopularMovies(e) {
    e.preventDefault();
    currentUrl = moviesUrl;
    type = 'movie';
    clearMainContent();
    renderFetchedContent();
  }

  function clearMainContent() {
    main.innerHTML = '';
    wrapper.innerHTML = '';
    main.append(sectionHeader);
    main.append(wrapper);
  }

  function renderFetchedContent() {
    async function fetchMovieOrTvData(url) {
      const res = await fetch(url);
      const data = await res.json();
      renderPopular(data.results);
    }

    // render popular movies or tv series depend on link click.
    function renderPopular(data) {
      data.map((items) => {
        let {
          id,
          poster_path,
          vote_average,
          title,
          overview,
          release_date,
          first_air_date,
          name,
        } = items;
        let genres = '';
        let castMembers = '';
        let companies = '';

        // request for extracting extra movie details by using each movie id
        // extracts genres, cast and  production companies
        fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&append_to_response=credits`
        )
          .then((response) => response.json())
          .then((data) => {
            type === 'movie'
              ? (sectionHeader.textContent = 'Popular Movies')
              : (sectionHeader.textContent = 'Popular TV Series');

            for (let i = 0; i < data.genres.length; i++) {
              genres += data.genres[i].name + ', ';
            }
            for (let i = 0; i < 4; i++) {
              if (data.credits.cast[i] === undefined) {
                continue;
              }
              castMembers += data.credits.cast[i].name + ', ';
            }
            for (let i = 0; i < data.production_companies.length; i++) {
              companies += data.production_companies[i].name + ', ';
            }

            const movieContainer = document.createElement('div');
            movieContainer.className = 'container';
            movieContainer.innerHTML = `
            <img src="${imgUrl + poster_path}" alt="${title || name}"/>
             <ul class="infoDivRight">
              <li class="movieTitle">${title || name}</li>
              <li class="rating">${vote_average}</li>
              <li class="releaseYear">${
                release_date
                  ? release_date.slice(0, 4)
                  : release_date || first_air_date.slice(0, 4)
              }
              </li>
              <li class="genre"><span class="contentTitle">Genre</span>${genres}</li>
              <li class="summary">
              <span class="contentTitle">Summary</span>${
                overview || 'summary information is not found.'
              }</li>
              <li class="cast"><span class="contentTitle">Cast</span>${castMembers}</li>
              <li class="companies"><span class="contentTitle">Producer</span>${companies}</li>
            </ul>`;

            wrapper.append(movieContainer);
            window.scrollTo(0, 750);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
    }

    currentUrl === moviesUrl
      ? fetchMovieOrTvData(moviesUrl)
      : fetchMovieOrTvData(tvSeriesUrl);
  }
}
renderTvMoviesPage();
