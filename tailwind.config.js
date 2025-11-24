/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                green: {
                    400: '#2ecc71',
                    500: '#006233', // Algeria Green
                },
                red: {
                    500: '#D21034', // Algeria Red
                }
            }
        },
    },
    plugins: [],
}
