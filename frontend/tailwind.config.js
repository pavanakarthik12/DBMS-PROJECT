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
                base: '1.0625rem',
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
