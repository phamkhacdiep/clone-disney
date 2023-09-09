export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const REMOVE_FAVORITE_MOVIE = 'REMOVE_FAVORITE_MOVIE';
export function addToFavorites(movie) {
  return {
    type: ADD_TO_FAVORITES,
    payload: movie,
  };
}

export const removeFavoriteMovie = (movieTitle) => {
  return {
    type: REMOVE_FAVORITE_MOVIE,
    payload: movieTitle,
  };
};