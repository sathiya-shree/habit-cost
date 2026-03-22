// src/utils/theme.js — uses system fonts (no custom font loading needed)

export const COLORS = {
  bg:        '#F5FDF8',
  bg2:       '#E8F8F0',
  card:      '#FFFFFF',
  cardAlt:   '#F0FAF5',

  coral:     '#FF6B6B',
  coral2:    '#FF8E8E',
  coralDark: '#E04545',
  teal:      '#0CB8A4',
  teal2:     '#3DD6C2',
  tealDark:  '#088A7A',
  lime:      '#7ED321',
  lime2:     '#A4E84A',
  limeDark:  '#5A9B18',

  yellow:    '#FFD166',
  orange:    '#FF9F43',
  purple:    '#A29BFE',

  success:   '#0CB8A4',
  danger:    '#FF6B6B',
  warning:   '#FFD166',
  info:      '#74B9FF',

  text:      '#1A2E25',
  text2:     '#4A6B5A',
  text3:     '#8AB09A',
  textInv:   '#FFFFFF',

  border:    '#D4EDDA',
  border2:   '#B8DFC8',

  gradCoral:  ['#FF6B6B', '#FF9F43'],
  gradTeal:   ['#0CB8A4', '#3DD6C2'],
  gradLime:   ['#7ED321', '#A4E84A'],
  gradCard:   ['#FFFFFF', '#F0FAF5'],
  gradHero:   ['#0CB8A4', '#7ED321'],
  gradDanger: ['#FF6B6B', '#FF8E8E'],
};

// System fonts — no loading required, works instantly on all devices
export const FONTS = {
  display:  'System',
  bold:     'System',
  semibold: 'System',
  medium:   'System',
  regular:  'System',
  light:    'System',
};

export const FONT_WEIGHTS = {
  display:  '800',
  bold:     '700',
  semibold: '600',
  medium:   '500',
  regular:  '400',
  light:    '300',
};

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const RADIUS = {
  sm: 10, md: 16, lg: 24, xl: 32, full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: '#0CB8A4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#0CB8A4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#0CB8A4',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    elevation: 10,
  },
  coral: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};
