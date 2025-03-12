import React, { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Create the theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  // Define our nature-inspired theme
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#5D4037', // Brown - representing wood/cabin
        light: '#8B6B61',
        dark: '#321911',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#2E7D32', // Green - representing forest/nature
        light: '#60AD5E',
        dark: '#005005',
        contrastText: '#FFFFFF',
      },
      background: {
        default: mode === 'light' ? '#F5F5F5' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#FFFFFF',
        secondary: mode === 'light' ? '#757575' : '#AAAAAA',
      },
      error: {
        main: '#D32F2F',
      },
      warning: {
        main: '#FFA000',
      },
      info: {
        main: '#1976D2',
      },
      success: {
        main: '#388E3C',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 500,
      },
      h2: {
        fontWeight: 500,
      },
      h3: {
        fontWeight: 500,
      },
      h4: {
        fontWeight: 500,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8, // Smooth, rounded corners
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 25, // Rounded buttons
            textTransform: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16, // Rounded cards
            boxShadow: mode === 'light' 
              ? '0px 4px 12px rgba(0, 0, 0, 0.05)' 
              : '0px 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Rounded papers
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
    },
  }), [mode]);

  // Toggle between light and dark mode
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = {
    mode,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
