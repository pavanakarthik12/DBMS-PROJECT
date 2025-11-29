/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Open Sans', 'sans-serif'],
            },
            fontSize: {
                base: '1.125rem',
                xs: '0.875rem',
                sm: '1rem',
                lg: '1.25rem',
                xl: '1.375rem',
                '2xl': '1.625rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
            },
            colors: {
                primary: {
                    dark: '#0F172A',
                    DEFAULT: '#1E293B',
                },
                surface: {
                    dark: '#111827',
                    DEFAULT: '#1E293B',
                },
                accent: {
                    blue: '#3B82F6',
                },
            },
        },
    },
    plugins: [],
}
