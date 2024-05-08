// theme.js
import { createTheme } from '@mui/material/styles';
import { pink, grey } from '@mui/material/colors';

export const getTheme = (mode : 'light' | 'dark') =>
  createTheme({
    palette: {
      primary: {
        main: pink[400],
      },
      secondary: grey,
      mode,
      ...(mode === 'light'
        ? {
            background: {
              default: '#f5f5f5', // or any other slightly gray-ish white color you prefer
            },
          }
        : {}),
    },
  });