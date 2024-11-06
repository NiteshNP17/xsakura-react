// MovieContext.ts (note: .ts not .tsx since we're not using JSX here)
import { createContext } from "react";
import { MovieData } from "../../../utils/customTypes";

interface MovieContextType {
  movieState: MovieData;
  setMovieState: (movieState: MovieData) => void;
  isToEdit: boolean;
}

// Provide a default value that matches the shape of MovieContextType
export const MovieContext = createContext<MovieContextType>({
  movieState: {} as MovieData, // Type assertion as temporary default
  setMovieState: () => {}, // Noop function as temporary default
  isToEdit: false,
});