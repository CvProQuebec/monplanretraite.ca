import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === PALETTE OFFICIELLE MONPLANRETRAITE.CA ===
        // Ancrée dans le logo (fleur de lis + flèche financière)

        // Bleu marine — couleur maîtresse du logo, confiance institutionnelle
        'mpr-navy':           '#1B3868',
        'mpr-navy-dark':      '#142B52',
        'mpr-navy-mid':       '#243F80',

        // Bleu interactif — boutons, liens, focus (dérivé du marine, plus clair)
        'mpr-interactive':    '#2B5BA8',
        'mpr-interactive-dk': '#1F4A8F',
        'mpr-interactive-lt': '#EBF0FA',

        // Or MPR — accent flèche/éclair du logo, CTA, éléments d'importance
        'mpr-gold':           '#C8922A',
        'mpr-gold-dark':      '#A87620',
        'mpr-gold-light':     '#F5D89B',
        'mpr-gold-faint':     '#FDF6E3',

        // Texte
        'mpr-text':           '#1a2744',
        'mpr-text-muted':     '#4A5568',

        // Fonds et bordures
        'mpr-bg-section':     '#F8FAFC',
        'mpr-border':         '#E2E8F0',
        'mpr-border-strong':  '#CBD5E0',

        // Statuts
        'mpr-success':        '#16A34A',
        'mpr-error':          '#DC2626',
        // Note: mpr-warning réutilise mpr-gold pour cohérence visuelle
      },
      fontFamily: {
        // Police d'affichage — grands titres, accroches (écho au logo)
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        // Police de corps — UI, formulaires, texte courant
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
