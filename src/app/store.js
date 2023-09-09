import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "../feature/user/userSlice";
import movieReducer from "../feature/movie/movieSlice";

const rootReducer = combineReducers({
  user: userReducer,
  movie: movieReducer,
});

const persistedState = JSON.parse(localStorage.getItem("reduxState")) || {};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

store.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

export default store;