import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		colors: {
			firebird: {
				DEFAULT: '#D92344',
				50: '#F5BFC9',
				100: '#F2ADBA',
				200: '#EC8A9C',
				300: '#E6677E',
				400: '#E14460',
				500: '#D92344',
				600: '#A91B35',
				700: '#781326',
				800: '#480C17',
				900: '#180407',
				950: '#000000'
			},
			babyblue: {
				DEFAULT: '#C4E1F2',
				50: '#FFFFFF',
				100: '#FFFFFF',
				200: '#E5F2F9',
				300: '#C4E1F2',
				400: '#96CAE8',
				500: '#68B2DE',
				600: '#3A9BD4',
				700: '#277DAF',
				800: '#1C5C81',
				900: '#123B53',
				950: '#0D2B3C'
			},
			aqua: {
				DEFAULT: '#042626',
				50: '#91F3F3',
				100: '#7FF2F2',
				200: '#5AEEEE',
				300: '#35EAEA',
				400: '#17DFDF',
				500: '#14BABA',
				600: '#109595',
				700: '#0C7070',
				800: '#084B4B',
				900: '#042626',
				950: '#010D0D'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Roboto Slab', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
