function renderTvMoviesPage() {
  const main = document.querySelector('.mainContent');
  let sectionHeader = document.createElement('h3');
  sectionHeader.className = 'sectionHeader';
  const imgUrl = 'https://image.tmdb.org/t/p/w300/';

  let urlExtension = '';

  // when click on nav links,
  // set urlExtension to "tv", "movie" or "home" and,
  // render page content by using urlExtention (tv or movie data),
  // + render page content only once (prevent spam)
  // + display currently active link
  function handleTvAndMovieLinks() {
    const navLinks = document.querySelector('.navLinks');
    navLinks.addEventListener('click', (e) => {
      e.preventDefault();
      const [firstClassName] = e.target.className.split(' ');
      urlExtension = firstClassName;
      if (
        !e.target.classList.contains('activeLink') &&
        !e.target.classList.contains('home')
      ) {
        clearMainContent();
        renderFetchedContent();
      }
      let links = navLinks.getElementsByClassName('links');
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove('activeLink');
      }
      e.target.classList.add('activeLink');
    });
  }

  handleTvAndMovieLinks();

  function clearMainContent() {
    window.scrollTo(0, 700);
    main.innerHTML = '';
    main.append(sectionHeader);
  }

  function renderFetchedContent() {
    let currentUrl = `https://api.themoviedb.org/3/${urlExtension}/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1`;

    // fetch data and pass to the renderPopular function
    async function fetchMovieOrTvData(url) {
      const res = await fetch(url);
      const data = await res.json();
      renderPopular(data.results);
    }
    // use passed  data
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
            // create new div for each movie/tv item
            //
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
