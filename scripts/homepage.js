 function homePage() {
  const headerHeroLeft = document.querySelector(".leftHeroCard");
  const headerHeroRight = document.querySelector(".rightHeroCard");
  const main = document.querySelector(".mainContent");
  const tvSectionTitle = document.createElement("h2");
  const movieSectionTitle = document.createElement("h2");
  tvSectionTitle.className = "sectionTitle";
  tvSectionTitle.textContent = "Popular Tv Series";
  movieSectionTitle.className = "sectionTitle";
  movieSectionTitle.textContent = "Popular Movies";

  const movieSection = document.createElement("section");
  movieSection.className = "movieSection";
  const tvSection = document.createElement("section");
  tvSection.className = "tvSection";

  movieSection.append(movieSectionTitle);
  tvSection.append(tvSectionTitle);
  main.append(movieSection, tvSection);

  const moviesUrl =
    "https://api.themoviedb.org/3/movie/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1";

  const tvSeriesUrl =
    "https://api.themoviedb.org/3/tv/popular?api_key=569ccf1a5cbb5c6658fdd087c1f05771&language=en-US&page=1";

  const imgUrl = "https://image.tmdb.org/t/p/w300/";

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
      let randomMovLen = 0;
      let filteredByRating = [];
      data.map((el) => {
        const { vote_average } = el;
        if (vote_average >= 8) {
          randomMovLen += 1;
          if (randomMovLen <= 2) {
            filteredByRating.push(el);
          }
        }
      });

      // Check if filteredByRating has any items before selecting a random one
      if (filteredByRating.length == 2) {
        let movl = filteredByRating[0];
        let movr = filteredByRating[1];
        const { name, poster_path, vote_average } = movl;

        headerHeroLeft.innerHTML = `
        <img src="${imgUrl + poster_path}" alt="${name}" />
        <span>${vote_average.toFixed(1)}</span>
        <div class="titleBox">
          <p>${name}</p>
        </div>
      `;

        headerHeroRight.innerHTML = `
        <img src="${imgUrl + movr.poster_path}" alt="${movr.name}" />
        <span>${movr.vote_average.toFixed(1)}</span>
        <div class="titleBox">
          <p>${movr.name}</p>
        </div>
      `;
      }
    }

    // create new div for each movie or tv-series then render
    function renderMainContent() {
      data.map((list) => {
        const { name, poster_path, vote_average, title } = list;
        const card = document.createElement("div");
        card.classList.add("card", "mainCard");
        card.innerHTML = ` 
      <img src="${imgUrl + poster_path}" alt="${name || title}" />
      <span class="mainCard-rating">${vote_average.toFixed(1)}</span>
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
  const main = document.querySelector(".mainContent");
  const homelink = document.querySelector(".home");
  homelink.addEventListener("click", renderHomepageContent);

  function renderHomepageContent() {
    // if we are already in homepage
    // then do not render homepage
    if (!homelink.classList.contains("activeLink")) {
      clearMainContent();
      homePage();
    }
  }
  function clearMainContent() {
    main.innerHTML = "";
  }
}
handleHomeClick();

/* fixed navbar */
function handleFixedNavbar() {
  const nav = document.querySelector(".navbar");
  let navTop = nav.offsetTop;

  function fixedNav() {
    if (window.scrollY >= navTop) {
      nav.classList.add("fixedNavbar");
    } else {
      nav.classList.remove("fixedNavbar");
    }
  }

  window.addEventListener("scroll", fixedNav);
}

handleFixedNavbar();
