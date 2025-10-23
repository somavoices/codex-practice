import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7C4DFF"
    },
    secondary: {
      main: "#FF6F61"
    },
    background: {
      default: "#F3F1FA",
      paper: "#FFFFFF"
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: "Inter, 'Segoe UI', sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 600
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600
    },
    subtitle1: {
      color: "#6B7280"
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 10px 25px rgba(124, 77, 255, 0.08)",
          borderRadius: 16
        }
      }
    }
  }
});
