function renderHomepage() {
  const headerHeroLeft = document.querySelector('.leftHeroCard');
  const headerHeroRight = document.querySelector('.rightHeroCard');
  const movieSection = document.querySelector('.movieSection');
  const tvSection = document.querySelector('.tvSection');

  const moviesUrl =
    'https://api.themoviedb.org/3/movie/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1';

  const tvSeriesUrl =
    'https://api.themoviedb.org/3/tv/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1';

  const imgUrl = 'https://image.tmdb.org/t/p/w300/';

  // pass the url variables to the fetch functions
  fetchMovies(moviesUrl);
  fetchTvSeries(tvSeriesUrl);

  // gets movie data and passes it to the useFetchedData function.
  async function fetchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    useFetchedData(data.results);
  }
  // gets tv series data and passes it to the useFetchedData function.
  async function fetchTvSeries(url) {
    const res = await fetch(url);
    const data = await res.json();
    useFetchedData(data.results);
  }

  function useFetchedData(data) {
    // this function filters fetched movie and tv series depend on rating > 8, then...
    // renders the single movie and tv-serie randomly on header section
    function renderHeroContent() {
      let filteredByRating = [];
      data.map((el) => {
        const { name, vote_average, title } = el;
        if (vote_average >= 8 && title) {
          filteredByRating.push(el);
        } else if (vote_average >= 8 && name) {
          filteredByRating.push(el);
        }
      });

      let randomItem =
        filteredByRating[Math.floor(Math.random() * filteredByRating.length)];

      [randomItem].map((cards) => {
        const { title, name, poster_path, vote_average } = cards;
        if (cards.title) {
          headerHeroLeft.innerHTML = `
        <img src="${imgUrl + poster_path}" alt="${title}" />
        <span>${vote_average} / 10</span>
        <div class="titleBox">
          <p>${title}</p>
        </div>
      `;
        } else if (cards.name) {
          headerHeroRight.innerHTML = `
        <img src="${imgUrl + poster_path}" alt="${name}" />
        <span>${vote_average} / 10</span>
        <div class="titleBox">
          <p>${name}</p>
        </div>
      `;
        }
      });
    }

    // this function creates new div for each movie or tv-series then,
    // renders them on their sections.
    function renderMainContent() {
      data.map((list) => {
        const { name, poster_path, vote_average, title } = list;
        const card = document.createElement('div');
        card.classList.add('card', 'mainCard');
        card.innerHTML = ` 
      <img src="${imgUrl + poster_path}" alt="${name || title}" />
      <span class="mainCard-rating">${vote_average} / 10</span>
      <div class="titleBox mainCard-title">
        <p>${name || title}</p>
      </div>
    `;
        // if fetched json has "title" key, then it is a movie data
        list.title ? movieSection.append(card) : tvSection.append(card);
      });
    }

    renderHeroContent();
    renderMainContent();
  }
}

renderHomepage();
