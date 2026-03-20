export const theme = {
  colors: {
    ink: '#0a0a0a',
    paper: '#f6f5f2',
    white: '#ffffff',
    black: '#000000',
    muted: 'rgba(255,255,255,0.72)',
    mutedDark: 'rgba(10,10,10,0.72)',
    lineOnDark: 'rgba(255,255,255,0.12)',
    lineOnLight: 'rgba(10,10,10,0.12)',
  },
  fonts: {
    heading: "'Oswald', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    body: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    serif:
      "'Cormorant Garamond', ui-serif, Georgia, 'Times New Roman', Times, serif",
  },
  easing: {
    smoothOut: 'power3.out',
    expoOut: 'expo.out',
  },
  layout: {
    max: 1200,
    gutter: 28,
  },
} as const

export type AppTheme = typeof theme
