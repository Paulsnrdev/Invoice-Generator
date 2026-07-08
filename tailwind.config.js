/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14171f',
        muted: '#6b7280',
        line: '#e6e7eb',
        'line-strong': '#cfd2d9',
        accent: '#0f766e',
        'accent-soft': '#e6f2f0',
        danger: '#b4232a',
        focus: '#f3f7f6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
