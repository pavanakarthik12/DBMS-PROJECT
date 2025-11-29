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
                sans: ['Outfit', 'Open Sans', 'system-ui', '-apple-system', 'sans-serif'],
            },
            fontSize: {
                xs: '0.8125rem',
                sm: '0.9375rem',
                base: '1.125rem',
                lg: '1.25rem',
                xl: '1.375rem',
                '2xl': '1.625rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
                '5xl': '3rem',
            },
            colors: {
                primary: {
                    dark: '#0A0A0A',
                    DEFAULT: '#111111',
                },
                surface: {
                    dark: '#171717',
                    DEFAULT: '#1A1A1A',
                },
                accent: {
                    blue: '#2563EB',
                },
                border: {
                    light: '#E5E7EB',
                    dark: '#262626',
                },
            },
            maxWidth: {
                '8xl': '90rem',
            },
        },
    },
    plugins: [],
}
