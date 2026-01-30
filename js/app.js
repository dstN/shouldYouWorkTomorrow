(function () {
	'use strict';

	const CONFIG = {
		API_URL: 'https://naas.isalman.dev/no',
		THEME_KEY: 'shouldWorkTomorrow_theme',
	};

	let elements;

	function initElements() {
		elements = {
			themeToggle: document.getElementById('theme-toggle'),
			loading: document.getElementById('loading'),
			answerWrapper: document.getElementById('answer-wrapper'),
			answer: document.getElementById('answer'),
			copyBtn: document.getElementById('copy-btn'),
			refreshBtn: document.getElementById('refresh-btn'),
			error: document.getElementById('error'),
		};
	}

	function initTheme() {
		const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
		if (savedTheme) {
			setTheme(savedTheme);
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			setTheme(prefersDark ? 'dark' : 'light');
		}
	}

	function setTheme(theme) {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem(CONFIG.THEME_KEY, theme);
	}

	function toggleTheme() {
		const currentTheme = document.documentElement.getAttribute('data-theme');
		setTheme(currentTheme === 'dark' ? 'light' : 'dark');
	}

	async function fetchReason() {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		try {
			const response = await fetch(CONFIG.API_URL, {
				method: 'GET',
				headers: { Accept: 'application/json' },
				signal: controller.signal,
			});
			clearTimeout(timeoutId);

			if (!response.ok) throw new Error(`API error: ${response.status}`);

			const data = await response.json();
			if (!data.reason) throw new Error('Invalid response');

			return data.reason;
		} catch (err) {
			clearTimeout(timeoutId);
			throw err;
		}
	}

	function showLoading() {
		elements.loading.hidden = false;
		elements.answerWrapper.hidden = true;
		elements.error.hidden = true;
	}

	function showAnswer(text) {
		elements.loading.hidden = true;
		elements.answerWrapper.hidden = false;
		elements.answer.textContent = text;
		elements.error.hidden = true;
	}

	function showError() {
		elements.loading.hidden = true;
		elements.answerWrapper.hidden = true;
		elements.error.hidden = false;
	}

	async function copyToClipboard() {
		const text = elements.answer.textContent;
		try {
			await navigator.clipboard.writeText(text);
			elements.copyBtn.classList.add('copied');
			setTimeout(() => elements.copyBtn.classList.remove('copied'), 2000);
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			elements.copyBtn.classList.add('copied');
			setTimeout(() => elements.copyBtn.classList.remove('copied'), 2000);
		}
	}

	function getRandomDelay() {
		return Math.floor(Math.random() * 2000) + 500;
	}

	function delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function loadNewReason() {
		showLoading();
		const loadDelay = getRandomDelay();

		try {
			const [reason] = await Promise.all([fetchReason(), delay(loadDelay)]);
			showAnswer(reason);
		} catch {
			await delay(loadDelay);
			showError();
		}
	}

	class Physics {
		constructor() {
			this.objects = [];
			this.container = document.getElementById('bg-decorations');
			this.initialized = false;
			this.bounds = { width: 0, height: 0, minY: 0, maxY: 0 };
			this.rafId = null;
		}

		init() {
			if (this.initialized) return;

			this.updateBounds();

			for (let i = 0; i < 8; i++) {
				this.createBlob();
			}

			this.initialized = true;
			console.log('Physics V5.8 initialized');
			this.start();

			window.addEventListener('resize', () => this.updateBounds());
		}

		updateBounds() {
			this.bounds.width = document.documentElement.clientWidth;
			this.bounds.height = document.documentElement.clientHeight;
			this.bounds.minY = 120;
			this.bounds.maxY = document.documentElement.clientHeight - 180;
		}

		createBlob(x, y, radius) {
			const el = document.createElement('div');
			const variant = Math.floor(Math.random() * 4) + 1;
			el.className = `deco-blob blob-${variant}`;
			el.style.animation = 'none';
			el.style.transition = 'none';
			el.style.top = '0';
			el.style.left = '0';
			el.style.willChange = 'transform';

			const r = radius || Math.random() * 40 + 30;
			const size = r * 2;
			el.style.width = `${size}px`;
			el.style.height = `${size}px`;

			const safeH = Math.max(50, this.bounds.maxY - this.bounds.minY);
			const localMinY = this.bounds.minY;

			const posX = x !== undefined ? x : Math.random() * (this.bounds.width - size);
			const posY = y !== undefined ? y : localMinY + Math.random() * (safeH - size);

			this.container.appendChild(el);

			const speed = 0.025 + Math.random() * 0.125; // Quarter speed (very slow)
			const angle = Math.random() * Math.PI * 2;

			this.objects.push({
				el,
				x: posX,
				y: posY,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				radius: r,
			});
		}

		start() {
			const update = () => {
				try {
					this.update();
				} catch (e) {
					console.error('Physics update error:', e);
					cancelAnimationFrame(this.rafId);
					return;
				}
				this.rafId = requestAnimationFrame(update);
			};
			this.rafId = requestAnimationFrame(update);
		}

		update() {
			for (let i = 0; i < this.objects.length; i++) {
				const obj = this.objects[i];
				const size = obj.radius * 2;

				obj.x += obj.vx;
				obj.y += obj.vy;

				if (obj.x < -obj.radius && obj.vx < 0) obj.vx *= -1;
				if (obj.x > this.bounds.width - obj.radius && obj.vx > 0) obj.vx *= -1;

				if (obj.y < this.bounds.minY && obj.vy < 0) obj.vy *= -1;
				if (obj.y + size > this.bounds.maxY && obj.vy > 0) obj.vy *= -1;

				obj.y = Math.max(this.bounds.minY, Math.min(obj.y, this.bounds.maxY - size));

				obj.el.style.transform = `translate(${obj.x}px, ${obj.y}px)`;
			}
		}
	}

	async function init() {
		try {
			initElements();
			initTheme();
			if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleTheme);
			if (elements.copyBtn) elements.copyBtn.addEventListener('click', copyToClipboard);
			if (elements.refreshBtn) elements.refreshBtn.addEventListener('click', loadNewReason);

			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
				if (!localStorage.getItem(CONFIG.THEME_KEY)) {
					setTheme(e.matches ? 'dark' : 'light');
				}
			});

			const physics = new Physics();
			physics.init();

			await loadNewReason();
		} catch (error) {
			console.error('Initialization error:', error);
			if (elements && elements.loading) elements.loading.hidden = true;
			if (elements && elements.error) elements.error.hidden = false;
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
