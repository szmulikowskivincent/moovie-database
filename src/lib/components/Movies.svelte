<script>
  // @ts-nocheck

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

  onMount(async () => {
    try {
      movies = await fetchMovies();
      filteredMovies = movies;
      genres = [
        { id: "28", name: "🎬Action" },
        { id: "12", name: "📽️Aventure" },
        { id: "35", name: "🎥Comédie" },
        { id: "10749", name: "🎞️Romantique" },
      ];
    } catch (err) {
      error = "Erreur lors du chargement des films.";
    } finally {
      isLoading = false;
    }
  });

  function filterMovies() {
    filteredMovies = movies.filter((movie) => {
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
</script>

<main>
  <div class="dashboard">
    <h2>
      <i class="bi bi-film"></i> My Moovies Data Base
    </h2>
    <div class="input-group mb-3">
      <input
        style=" width: 520px; height: 35px; font-size: 24px; margin-left: 5px; margin-: -150px"
        type="text"
        class="form-control"
        bind:value={searchQuery}
        on:input={filterMovies}
        placeholder="🔎 Rechercher par titre..."
      />
    </div>

    <div class="genre-selection">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button
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
        <h2 style="Margin-left: 125px">
          <strong>Note :</strong> ⭐ {selectedMovie.vote_average}
        </h2>
        <p>
          <i class="bi bi-info-circle-fill"></i> <strong>Description :</strong>
          <br /><br />
          {selectedMovie.overview}
        </p>
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
        </div>
      {/each}
    </div>
  {/if}
  <div style="margin-left: 5px" class="dashboard"></div>
</main>
