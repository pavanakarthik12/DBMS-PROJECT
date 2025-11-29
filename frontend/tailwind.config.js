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
                sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
            },
            fontSize: {
                xs: '0.8125rem',
                sm: '0.9375rem',
                base: '1.0625rem',
                lg: '1.1875rem',
                xl: '1.375rem',
                '2xl': '1.625rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
            },
            colors: {
                accent: {
                    DEFAULT: '#2563EB',
                    hover: '#1D4ED8',
                },
            },
        },
    },
    plugins: [],
}
