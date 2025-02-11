export async function fetchMovies() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des films");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Erreur Fetch Movies:", error);
    return [];
  }
}
