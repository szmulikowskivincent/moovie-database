<script>
  import { onMount } from "svelte";
  import "../css/GenreList.css";

  export let genres = [
    { id: 28, name: "Action", icon: "bi bi-lightning-fill" },
    { id: 12, name: "Aventure", icon: "bi bi-globe-americas" },
    { id: 35, name: "Comédie", icon: "bi bi-emoji-laughing" },
    { id: 36, name: "Histoire", icon: "bi bi-book-fill" },
    { id: 27, name: "Horreur", icon: "bi bi-emoji-dizzy" },
    { id: 53, name: "Thriller", icon: "bi bi-eye-fill" },
  ];

  let movies = {};
  let showModal = false;

  const API_URL = "https://api.themoviedb.org/3/discover/movie";
  const API_KEY = "90b2f8332e06b4bb019016f76b0398c9";
  const AUTH_HEADER = {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MGIyZjgzMzJlMDZiNGJiMDE5MDE2Zjc2YjAzOThjOSIsIm5iZiI6MTczMDk2OTM0Ni42MjQsInN1YiI6IjY3MmM3ZjAyOWI3ZTA5Y2ZkY2M0Mjc0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.973U-77nd1KcDL9Gt8Qh2uXXH4F64_jDgR9L7Tgy8Q4",
    },
  };

  async function fetchMovies() {
    for (let genre of genres) {
      const response = await fetch(
        `${API_URL}?api_key=${API_KEY}&with_genres=${genre.id}`,
        AUTH_HEADER
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const movieId = data.results[0].id;
        const movieDetails = await fetchMovieDetails(movieId);
        movies[genre.id] = movieDetails;
      }
    }
  }

  async function fetchMovieDetails(movieId) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,images&api_key=${API_KEY}`,
      AUTH_HEADER
    );
    return response.json();
  }

  onMount(fetchMovies);
</script>

<div class="container mt-5 text-center">
  <button
    class="btn btn-primary btn-lg d-flex align-items-center gap-2"
    on:click={() => (showModal = true)}
  >
    <i class="bi bi-film"></i> Apperçu des vidéos
  </button>
</div>

{#if showModal}
  <div class="modal">
    <div class="modal-content">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span  style="font-size:45px" class="close-btn text-danger" on:click={() => (showModal = false)}
        >&times;</span
      >

      <h2 class="text-center mb-4">
        <i class="bi bi-camera-video me-2"></i> Apperçu des vidéos
      </h2>

      <div class="genres-container">
        {#each genres as { id, name, icon }}
          <div class="genre-item">
            <i class="{icon} text-primary"></i>
            <strong>{name}</strong>
          </div>
        {/each}
      </div>

      {#each genres as { id, name }}
        {#if movies[id]}
          <h3 class="mt-4">
            <i class="bi bi-film me-2"></i>
            {name}
          </h3>

          <div class="carousel">
            <div class="carousel-item">
              <img
                src={"https://image.tmdb.org/t/p/w300" + movies[id].poster_path}
                alt={movies[id].title}
              />
              <strong>{movies[id].title}</strong>
              <p>⭐ {movies[id].vote_average}/10</p>
            </div>

            {#if movies[id].videos && movies[id].videos.results.length > 0}
              {#each movies[id].videos.results.slice(0, 2) as video}
                <div class="carousel-item">
                  <!-- svelte-ignore a11y_missing_attribute -->
                  <iframe
                    src={"https://www.youtube.com/embed/" + video.key}
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}
