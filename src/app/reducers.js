import { ADD_TO_FAVORITES, REMOVE_FAVORITE_MOVIE } from '../app/action';

const initialState = {
  favoriteMovies: JSON.parse(localStorage.getItem('favoriteMovies')) || [],
};

export default function favoriteReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_FAVORITES:
      const updatedMoviesAdd = [...state.favoriteMovies, action.payload];
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedMoviesAdd));
      return {
        ...state,
        favoriteMovies: updatedMoviesAdd,
      };
    case REMOVE_FAVORITE_MOVIE:
      const updatedMoviesRemove = state.favoriteMovies.filter(
        (movie) => movie.title !== action.payload
      );
      localStorage.setItem('favoriteMovies', JSON.stringify(updatedMoviesRemove));
      return {
        ...state,
        favoriteMovies: updatedMoviesRemove,
      };
    default:
      return state;
  }
}