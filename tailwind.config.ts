
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#1a365d',
					foreground: '#ffffff',
					100: '#e6f0ff',
					200: '#b3d1ff',
					300: '#80b3ff',
					400: '#4d94ff',
					500: '#1a76ff',
					600: '#0062e6',
					700: '#0052cc',
					800: '#0041a3',
					900: '#003380',
				},
				secondary: {
					DEFAULT: '#f0b429',
					foreground: '#1a1a1a',
					100: '#fff8e6',
					200: '#ffeeb3',
					300: '#ffe480',
					400: '#ffdb4d',
					500: '#f0b429',
					600: '#e6a800',
					700: '#cc9600',
					800: '#a37800',
					900: '#805c00',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideIn: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				fadeIn: 'fadeIn 0.5s ease-in-out',
				slideIn: 'slideIn 0.5s ease-in-out'
			},
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				opensans: ['Open Sans', 'sans-serif']
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
