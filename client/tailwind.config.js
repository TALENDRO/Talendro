import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        comfortaa: ["var(--font-comfortaa)"]
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.white'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-lead': theme('colors.pink[700]'),
            '--tw-prose-links': theme('colors.blue[900]'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.green[600]'),
            '--tw-prose-bullets': theme('colors.gray[400]'),
            '--tw-prose-hr': theme('colors.green[300]'),
            '--tw-prose-quotes': theme('colors.green[900]'),
            '--tw-prose-quote-borders': theme('colors.yellow[300]'),
            '--tw-prose-captions': theme('colors.yellow[700]'),
            '--tw-prose-code': theme('colors.pink[900]'),
            '--tw-prose-invert-code-bg': 'rgba(255, 255, 255, 0.2)',
            '--tw-prose-pre-code': theme('colors.white'),
            '--tw-prose-pre-bg': theme('colors.gray[800]'),
            '--tw-prose-th-borders': theme('colors.yellow[300]'),
            '--tw-prose-td-borders': theme('colors.pink[200]'),
          },
        },
        invert: {
          css: {
            '--tw-prose-invert-body': theme('colors.black'),
            '--tw-prose-invert-headings': theme('colors.black'),
            '--tw-prose-invert-lead': theme('colors.blue[300]'),
            '--tw-prose-invert-links': theme('colors.blue[500]'),
            '--tw-prose-invert-bold': theme('colors.black'),
            '--tw-prose-invert-counters': theme('colors.gray[600]'),
            '--tw-prose-invert-bullets': theme('colors.gray[600]'),
            '--tw-prose-invert-hr': theme('colors.red[700]'),
            '--tw-prose-invert-quotes': theme('colors.pink[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.pink[700]'),
            '--tw-prose-invert-captions': theme('colors.pink[400]'),
            '--tw-prose-invert-code': theme('colors.red[900]'),
            '--tw-prose-invert-code-bg': 'rgba(128, 128, 128, 0.1)',
            '--tw-prose-invert-pre-code': theme('colors.white'),
            '--tw-prose-invert-pre-bg': theme('colors.gray[800]'),
            '--tw-prose-invert-th-borders': theme('colors.pink[600]'),
            '--tw-prose-invert-td-borders': theme('colors.pink[700]'),
            },
          },
      }),
    },
  },
  darkMode: "class",
  plugins: [nextui(), require('@tailwindcss/typography')],
}
