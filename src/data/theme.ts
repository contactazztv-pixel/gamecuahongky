/**
 * THEME & DESIGN TOKENS DEFINITION (TypeScript)
 * Cung cấp hằng số bảng màu và style thống nhất cho các thành phần UI/Canvas
 */

export const GAME_THEME = {
  colors: {
    bgCream: '#FFF8EC',
    warmWhite: '#FFFEFA',
    skyBlue: '#BFE5FF',
    freshGreen: '#B9E8C5',
    peach: '#FFCDAF',
    strawberryPink: '#FFBFD1',
    softYellow: '#FFE79A',

    textPrimary: '#354254',
    textSecondary: '#778394',
    textMuted: '#9BA6B5',
    textDark: '#202833',

    border: '#E9E1D5',
    borderDark: '#4A3B32',
    borderSoft: '#F2ECE1',

    success: '#58A879',
    warning: '#E7A544',
    error: '#DF6B6B',
    info: '#4A90E2',
  },

  fonts: {
    primary: "'Nunito', 'Quicksand', system-ui, -apple-system, sans-serif",
    handwritten: "'Patrick Hand', 'Pangolin', 'Caveat', cursive",
  },

  radii: {
    sm: '10px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    full: '9999px',
  },

  shadows: {
    sm: '0 2px 0 0 rgba(74, 59, 50, 0.12)',
    md: '0 4px 0 0 rgba(74, 59, 50, 0.18)',
    lg: '0 6px 0 0 rgba(74, 59, 50, 0.22)',
    pressed: '0 1px 0 0 rgba(74, 59, 50, 0.18)',
  },
} as const;

export type GameTheme = typeof GAME_THEME;
