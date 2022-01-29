function renderTvMoviesPage() {
  const main = document.querySelector('.mainContent');
  let sectionHeader = document.createElement('h3');
  sectionHeader.className = 'sectionHeader';
  const imgUrl = 'https://image.tmdb.org/t/p/w300/';

  // "movie" or "tv"
  let urlExtension = '';

  const navLinks = document.querySelector('.navLinks');
  navLinks.addEventListener('click', (e) => {
    e.preventDefault();

    let target = e.target.id;

    if (target === 'tvLink') {
      urlExtension = 'tv';
    }
    if (target === 'moviesLink') {
      urlExtension = 'movie';
    }

    if (target === 'tvLink' || target === 'moviesLink') {
      clearMainContent();
      renderFetchedContent();
    }
  });

  function clearMainContent() {
    main.innerHTML = '';
    main.append(sectionHeader);
  }

  function renderFetchedContent() {
    let currentUrl = `https://api.themoviedb.org/3/${urlExtension}/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1`;

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
          `https://api.themoviedb.org/3/${urlExtension}/${id}?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&append_to_response=credits`
        )
          .then((response) => response.json())
          .then((data) => {
            urlExtension === 'movie'
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

            const cardContainer = document.createElement('div');
            cardContainer.className = 'container';
            cardContainer.innerHTML = `
            <img src="${imgUrl + poster_path}" alt="${title || name}"/>
             <ul class="infoDiv">
              <li class="cardTitle">${title || name}</li>
              <li class="rating">${vote_average}</li>
              <li class="releaseYear">${
                release_date
                  ? release_date.slice(0, 4)
                  : release_date || first_air_date.slice(0, 4)
              }
              </li>
              <li class="genre"><span class="contentTitles">Genre</span>${genres}</li>
              <li class="summary">
              <span class="contentTitles">Summary</span>${
                overview || 'information not found.'
              }</li>
              <li class="cast"><span class="contentTitles">Cast</span>${castMembers}</li>
              <li class="companies"><span class="contentTitles">Producer</span>${
                companies || 'information not found'
              }</li>
            </ul>`;

            main.append(cardContainer);
            window.scrollTo(0, 750);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      });
    }
    fetchMovieOrTvData(currentUrl);
  }
}
renderTvMoviesPage();
