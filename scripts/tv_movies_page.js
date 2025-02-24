function homePage() {
  const headerHeroLeft = document.querySelector('.leftHeroCard');
  const headerHeroRight = document.querySelector('.rightHeroCard');
  const main = document.querySelector('.mainContent');
  const tvSectionTitle = document.createElement('h2');
  const movieSectionTitle = document.createElement('h2');
  tvSectionTitle.className = 'sectionTitle';
  tvSectionTitle.textContent = 'Popular Tv Series';
  movieSectionTitle.className = 'sectionTitle';
  movieSectionTitle.textContent = 'Popular Movies';

  const movieSection = document.createElement('section');
  movieSection.className = 'movieSection';
  const tvSection = document.createElement('section');
  tvSection.className = 'tvSection';

  movieSection.append(movieSectionTitle);
  tvSection.append(tvSectionTitle);
  main.append(movieSection, tvSection);

  const moviesUrl =
    'https://api.themoviedb.org/3/movie/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1';

  const tvSeriesUrl =
    'https://api.themoviedb.org/3/tv/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1';

  const imgUrl = 'https://image.tmdb.org/t/p/w300/';

  // Pass the URL variables to the fetch functions
  fetchMovies(moviesUrl);
  fetchTvSeries(tvSeriesUrl);

  // Fetch movies data and pass it to the useFetchedData function
  async function fetchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    useFetchedData(data.results);
  }
  
  // Fetch TV series data and pass it to the useFetchedData function
  async function fetchTvSeries(url) {
    const res = await fetch(url);
    const data = await res.json();
    useFetchedData(data.results);
  }

  function useFetchedData(data) {
    // This function filters fetched movie and tv series depend on rating > 8, then...
    // Renders the single movie and tv-series randomly on header section
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

      // Check if filteredByRating has any items before selecting a random one
      if (filteredByRating.length > 0) {
        let randomItem = filteredByRating[Math.floor(Math.random() * filteredByRating.length)];

        if (randomItem) {
          const { title, name, poster_path, vote_average } = randomItem;
          
          // Round vote_average to one decimal place using Math.round()
          const roundedVoteAverage = Math.round(vote_average * 10) / 10;

          if (title) {
            headerHeroLeft.innerHTML = `
              <img src="${imgUrl + poster_path}" alt="${title}" />
              <span>${roundedVoteAverage} / 10</span>
              <div class="titleBox">
                <p>${title}</p>
              </div>
            `;
          } else if (name) {
            headerHeroRight.innerHTML = `
              <img src="${imgUrl + poster_path}" alt="${name}" />
              <span>${roundedVoteAverage} / 10</span>
              <div class="titleBox">
                <p>${name}</p>
              </div>
            `;
          }
        }
      } else {
        console.warn("filteredByRating is empty.");
      }
    }

    // Create new div for each movie or TV series then render
    function renderMainContent() {
      data.map((list) => {
        const { name, poster_path, vote_average, title } = list;
        
        // Round vote_average to one decimal place using Math.round()
        const roundedVoteAverage = Math.round(vote_average * 10) / 10;

        const card = document.createElement('div');
        card.classList.add('card', 'mainCard');
        card.innerHTML = ` 
          <img src="${imgUrl + poster_path}" alt="${name || title}" />
          <span class="mainCard-rating">${roundedVoteAverage} / 10</span>
          <div class="titleBox mainCard-title">
            <p>${name || title}</p>
          </div>
        `;
        list.title ? movieSection.append(card) : tvSection.append(card);
      });
    }
    renderHeroContent();
    renderMainContent();
  }
}

homePage();

function handleHomeClick() {
  const main = document.querySelector('.mainContent');
  const homelink = document.querySelector('.home');
  homelink.addEventListener('click', renderHomepageContent);

  function renderHomepageContent() {
    // If we are already in homepage then do not render homepage
    if (!homelink.classList.contains('activeLink')) {
      clearMainContent();
      homePage();
    }
  }
  function clearMainContent() {
    main.innerHTML = '';
  }
}
handleHomeClick();

/* Fixed navbar */
function handleFixedNavbar() {
  const nav = document.querySelector('.navbar');
  let navTop = nav.offsetTop;

  function fixedNav() {
    if (window.scrollY >= navTop) {
      nav.classList.add('fixedNavbar');
    } else {
      nav.classList.remove('fixedNavbar');
    }
  }

  window.addEventListener('scroll', fixedNav);
}

handleFixedNavbar();
