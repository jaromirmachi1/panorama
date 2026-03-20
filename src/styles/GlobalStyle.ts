import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root{
    color-scheme: dark;
  }

  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    height: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.ink};
    color: rgba(255,255,255,0.9);
    font-family: ${({ theme }) => theme.fonts.body};
    letter-spacing: 0.02em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: geometricPrecision;
    overflow-x: hidden;
  }

  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; }

  ::selection {
    background: rgba(255,255,255,0.12);
  }

  /* Slightly reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
`

