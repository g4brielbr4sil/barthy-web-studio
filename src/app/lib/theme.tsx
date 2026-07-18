import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "barthy-theme";
const THEME_BACKGROUNDS: Record<Theme, string> = {
  dark: "#0A1931",
  light: "#EAF1F7",
};

/** Lê a preferência salva. Dark é o padrão quando não há nada salvo. */
export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/** Aplica todas as partes do tema em uma única execução síncrona. */
export function applyTheme(theme: Theme, persist = false): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const isDark = theme === "dark";
  const background = THEME_BACKGROUNDS[theme];

  root.dataset.theme = theme;
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = theme;
  root.style.backgroundColor = background;
  if (document.body) document.body.style.backgroundColor = background;

  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  meta.content = background;

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* armazenamento indisponível; o tema visual continua aplicado */
    }
  }
}

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next, true);
    setTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === "dark", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme deve ser usado dentro de <ThemeProvider>");
  return ctx;
}
