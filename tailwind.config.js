/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        card: 'var(--bg-card)',
        'card-hover': 'var(--bg-card-hover)',
        input: 'var(--bg-input)',
        'border-subtle': 'var(--border-subtle)',
        'border-accent': 'var(--border-accent)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',
      },
      textColor: {
        'primary-t': 'var(--text-primary)',
        'secondary-t': 'var(--text-secondary)',
        'tertiary-t': 'var(--text-tertiary)',
      },
      borderRadius: {
        'xl': 'var(--radius-xl)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'slide-down': 'slideDown 0.25s ease forwards',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "accent-gradient": "var(--accent-gradient)",
      },
    },
  },
  plugins: [],
};
