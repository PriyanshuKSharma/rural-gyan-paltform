export const COLORS = {
  background: '#111827', // Gray 900
  surface: '#1f2937',    // Gray 800
  primary: '#00f3ff',    // Neon Cyan
  secondary: '#a855f7',  // Neon Purple
  text: '#ffffff',
  textSecondary: '#94a3b8', // Slate 400
  border: '#0e7490',     // Cyan 700 (dimmer)
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

export const FONTS = {
  // Assuming default system fonts for now, can be customized later
  regular: 'System',
  bold: 'System',
  mono: 'System', // Ideally would be a monospace font
};

export const SHADOWS = {
  neon: {
    shadowColor: '#00f3ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  }
};
