<script>
  import { onMount } from "svelte";
  import { fetchMovies } from "../controllers/moviesController";
  import "../css/Moovies.css";

  let movies = [];
  let filteredMovies = [];
  let selectedMovie = null;
  let searchQuery = "";
  let selectedGenre = "";
  let genres = [];
  let isLoading = true;
  let error = null;

  let isMenuOpen = false;

  let currentPage = 1;
  let itemsPerPage = 6;
  let totalPages = 2;
  let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  let watchedMovies = JSON.parse(localStorage.getItem("watchedMovies")) || [];

  let videoUrl = "";

  onMount(async () => {
    try {
      movies = await fetchMovies();
      filteredMovies = movies;

      const response = await fetch("/movies.json");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du fichier movies.json");
      }
      const moviesFromJson = await response.json();
      movies = [...movies, ...moviesFromJson];

      genres = [
        { id: "28", name: "🎬Action" },
        { id: "12", name: "📽️Aventure" },
        { id: "35", name: "🎥Comédie" },
        { id: "10749", name: "🎞️Romantique" },
      ];

      filterMovies();
    } catch (err) {
      error = "Erreur lors du chargement des films.";
    } finally {
      isLoading = false;
    }
  });

  function filterMovies() {
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    filteredMovies = movies.slice(startIndex, endIndex).filter((movie) => {
      return (
        (selectedGenre
          ? movie.genre_ids.includes(Number(selectedGenre))
          : true) &&
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  function showDetails(movie) {
    selectedMovie = movie;
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage += 1;
      filterMovies();
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage -= 1;
      filterMovies();
    }
  }

  function playMovie(movie) {
    selectedMovie = movie.youtubeURL;
  }

  function toggleFavorite(movie) {
    if (favoriteMovies.includes(movie.id)) {
      favoriteMovies = favoriteMovies.filter((id) => id !== movie.id);
    } else {
      favoriteMovies.push(movie.id);
    }
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  }

  function toggleWatched(movie) {
    if (watchedMovies.includes(movie.id)) {
      watchedMovies = watchedMovies.filter((id) => id !== movie.id);
    } else {
      watchedMovies.push(movie.id);
    }
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMovies));
  }
</script>

<main>
  <div class="pagination" style="margin-top: -20px; margin-left: 350px">
    <input
      style="width: 570px; height: 35px; font-size: 24px; margin-left:-1220px;"
      type="text"
      class="form-control"
      bind:value={searchQuery}
      on:input={() => {
        currentPage = 1;
        filterMovies();
      }}
      placeholder="🔎 Rechercher par titre..."
    />
    <button on:click={prevPage} disabled={currentPage === 1}>
      Précédent
    </button>
    <span>
      Page {currentPage} sur {totalPages}
    </span>
    <button on:click={nextPage} disabled={currentPage === totalPages}>
      Suivant
    </button>
  </div>

  <div class="dashboard">
    <h2>
      <i class="bi bi-film"></i> My Moovies Data Base
    </h2>

    <div class="genre-selection">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button
        style="margin-top:-80px"
        class="btn btn-outline-secondary"
        type="button"
        on:click={() => (isMenuOpen = !isMenuOpen)}
        aria-expanded={isMenuOpen ? "true" : "false"}
      >
        <i class="bi bi-list"></i>
      </button>

      {#if isMenuOpen}
        <div class="dropdown-menu show">
          {#each genres as genre}
            <a
              class="dropdown-item"
              href="#"
              on:click={() => {
                selectedGenre = genre.id;
                currentPage = 1;
                filterMovies();
              }}
            >
              {genre.name}
            </a>
          {/each}
        </div>
      {/if}
    </div>

    {#if selectedMovie}
      <div style="margin-top: 90px" class="movie-details">
        <h3>
          <i class="bi bi-film"></i>
          {selectedMovie.title}
        </h3>

        <img
          src={`https://image.tmdb.org/t/p/w400${selectedMovie.poster_path}`}
          alt={selectedMovie.title}
        />
        <br /> <br />
        <h2 style="margin-left: 135px">
          <strong>Note :</strong> ⭐ {selectedMovie.vote_average}
        </h2>
        <div>
          <button
            style="background-color: transparent; border: none; font-size: 24px"
            class="btn btn-primary"
            on:click={() =>
              (videoUrl = `https://www.youtube.com/embed/${selectedMovie.id}`)}
          >
            <i class="bi bi-play-circle"></i> ▶ Voir le film
          </button>

          {#if videoUrl}
            <!-- svelte-ignore a11y_missing_attribute -->
            <iframe
              style="position: relative; z-index: 999; margin-left: 0px; margin-top: -150px; margin-left: 2235px;"
              width="420"
              height="315"
              src={videoUrl}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          {/if}
        </div>

        <h1>ⓘ</h1>
        <strong></strong>
        <br /><br />
        {selectedMovie.overview}
      </div>
    {/if}
  </div>

  {#if isLoading}
    <p>Chargement des films...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <div class="movies-grid">
      {#each filteredMovies as movie (movie.id)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="movie-card" on:click={() => showDetails(movie)}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
          <h3>{movie.title}</h3>
          <p>⭐ {movie.vote_average}</p>
          <div class="movie-actions">
            <button
              on:click={(event) => {
                event.stopPropagation();
                toggleFavorite(movie);
              }}
              aria-label="Ajouter aux favoris"
            >
              <i class="bi bi-heart" style="color: red;"></i>
            </button>
            <button
              on:click={(event) => {
                event.stopPropagation();
                toggleWatched(movie);
              }}
              aria-label="Marquer comme déjà vu"
            >
              <i class="bi bi-check2-circle" style="color: green;"></i>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div style="margin-left: 5px" class="dashboard">
    <h2 style="margin-left: 85px">
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <i
        class="bi bi-camera-video"
        style="font-size: 40px; margin-right: 10px;"
      />
      My Moovies
    </h2>

    <div class="favorites">
      <h3>❤️ Favoris</h3>
      <div class="movies-grid">
        {#each movies.filter( (movie) => favoriteMovies.includes(movie.id) ) as movie (movie.id)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="movie-card" on:click={() => showDetails(movie)}>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
        {/each}
      </div>
    </div>

    <div class="watched">
      <h3>✔️ Films déjà regardés</h3>
      <div class="movies-grid">
        {#each movies.filter( (movie) => watchedMovies.includes(movie.id) ) as movie (movie.id)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="movie-card" on:click={() => showDetails(movie)}>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>
