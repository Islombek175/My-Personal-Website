/* ----------------------------------------------------
   Islombek Matkarimov Personal Portfolio JS
   Handles animations, language toggle, and interactive widgets
   ---------------------------------------------------- */

// Global State
const state = {
	lang: 'en',
	botCart: [],
	botState: 'start', // start, main_menu, category_pizza, category_burger, category_drinks, cart
	menuItems: {
		pizza: [
			{ id: 'p1', name: 'Xiva Special Pizza', price: 45000 },
			{ id: 'p2', name: 'Margherita Pizza', price: 35000 },
		],
		burger: [
			{ id: 'b1', name: 'Cheeseburger', price: 28000 },
			{ id: 'b2', name: 'Double Beef Burger', price: 38000 },
		],
		drinks: [
			{ id: 'd1', name: 'Coca-Cola 0.5L', price: 8000 },
			{ id: 'd2', name: 'Lemon Tea', price: 6000 },
		],
	},
}

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
	initParticles()
	initCustomCursor()
	initTypingEffect()
	initLanguageToggle()
	initNavigation()
	initResumeModal()
	initTelegramBot()
	initPlayground()
	initBackendVisualizer()
	initContactForm()
})

/* ====================================================
   1. Canvas Particles Background
   ==================================================== */
function initParticles() {
	const canvas = document.getElementById('particles-canvas')
	const ctx = canvas.getContext('2d')

	let particlesArray = []
	let w = (canvas.width = window.innerWidth)
	let h = (canvas.height = window.innerHeight)

	window.addEventListener('resize', () => {
		w = canvas.width = window.innerWidth
		h = canvas.height = window.innerHeight
		particlesArray = []
		createParticles()
	})

	class Particle {
		constructor() {
			this.x = Math.random() * w
			this.y = Math.random() * h
			this.size = Math.random() * 2 + 0.5
			this.speedX = Math.random() * 0.4 - 0.2
			this.speedY = Math.random() * 0.4 - 0.2
			this.opacity = Math.random() * 0.5 + 0.1
		}
		update() {
			this.x += this.speedX
			this.y += this.speedY

			if (this.x < 0 || this.x > w) this.speedX = -this.speedX
			if (this.y < 0 || this.y > h) this.speedY = -this.speedY
		}
		draw() {
			ctx.fillStyle = `rgba(0, 242, 254, ${this.opacity})`
			ctx.beginPath()
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
			ctx.fill()
		}
	}

	function createParticles() {
		const numberOfParticles = Math.floor((w * h) / 15000)
		for (let i = 0; i < numberOfParticles; i++) {
			particlesArray.push(new Particle())
		}
	}

	function animate() {
		ctx.clearRect(0, 0, w, h)
		particlesArray.forEach(p => {
			p.update()
			p.draw()
		})
		requestAnimationFrame(animate)
	}

	createParticles()
	animate()
}

/* ====================================================
   2. Glowing Custom Cursor Follower
   ==================================================== */
function initCustomCursor() {
	const cursor = document.getElementById('custom-cursor')
	const dot = document.getElementById('custom-cursor-dot')

	if (!cursor || !dot) return

	document.addEventListener('mousemove', e => {
		// Offset standard scroll
		cursor.style.left = e.clientX + 'px'
		cursor.style.top = e.clientY + 'px'

		dot.style.left = e.clientX + 'px'
		dot.style.top = e.clientY + 'px'
	})

	// Track hoverable elements to expand cursor
	const hoverables = document.querySelectorAll(
		'a, button, input, textarea, .tg-keyboard-btn, .tg-inline-btn, .tab-btn, .skill-card',
	)

	hoverables.forEach(el => {
		el.addEventListener('mouseenter', () => {
			document.body.classList.add('cursor-hover')
		})
		el.addEventListener('mouseleave', () => {
			document.body.classList.remove('cursor-hover')
		})
	})

	// Dynamic Skill Card Glow Effect (3D border glow based on cursor coordinate)
	const skillCards = document.querySelectorAll('.skill-card')
	skillCards.forEach(card => {
		card.addEventListener('mousemove', e => {
			const rect = card.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			card.style.setProperty('--mouse-x', `${x}px`)
			card.style.setProperty('--mouse-y', `${y}px`)

			const glowColor =
				card.getAttribute('data-glow-color') || 'rgba(0, 242, 254, 0.3)'
			card.style.borderColor = glowColor
			card.style.boxShadow = `0 4px 15px -2px ${glowColor}`
		})

		card.addEventListener('mouseleave', () => {
			card.style.borderColor = ''
			card.style.boxShadow = ''
		})
	})
}

/* ====================================================
   3. Typing text animation
   ==================================================== */
function initTypingEffect() {
	const el = document.getElementById('typing-text')
	if (!el) return

	const englishStrings = [
		'Frontend Developer',
		'Backend API Engineer',
		'Telegram Bot Creator',
		'MERN Stack Developer',
	]

	const uzbekStrings = [
		'Frontend Dasturchi',
		'Backend API Muhandisi',
		'Telegram Bot Yaratuvchisi',
		'MERN Stack Dasturchisi',
	]

	let loopNum = 0
	let isDeleting = false
	let txt = ''
	let period = 2000

	function tick() {
		const currentStrings = state.lang === 'en' ? englishStrings : uzbekStrings
		let i = loopNum % currentStrings.length
		let fullTxt = currentStrings[i]

		if (isDeleting) {
			txt = fullTxt.substring(0, txt.length - 1)
		} else {
			txt = fullTxt.substring(0, txt.length + 1)
		}

		el.innerHTML = txt

		let delta = 150 - Math.random() * 100
		if (isDeleting) {
			delta /= 2
		}

		if (!isDeleting && txt === fullTxt) {
			delta = period
			isDeleting = true
		} else if (isDeleting && txt === '') {
			isDeleting = false
			loopNum++
			delta = 500
		}

		setTimeout(tick, delta)
	}

	tick()
}

/* ====================================================
   4. Language toggling state
   ==================================================== */
function initLanguageToggle() {
	const toggle = document.getElementById('lang-toggle')
	if (!toggle) return

	toggle.addEventListener('click', () => {
		state.lang = state.lang === 'en' ? 'uz' : 'en'

		// Update button display text
		toggle.querySelector('.lang-text').innerText = state.lang.toUpperCase()

		// Translate all components using data attributes
		const translatables = document.querySelectorAll('[data-en][data-uz]')
		translatables.forEach(el => {
			el.innerText =
				state.lang === 'en'
					? el.getAttribute('data-en')
					: el.getAttribute('data-uz')
		})

		// Translate form inputs placeholders
		const nameInput = document.getElementById('form-name')
		const msgInput = document.getElementById('form-message')
		const subjectInput = document.getElementById('form-subject')

		if (nameInput)
			nameInput.placeholder =
				state.lang === 'en' ? 'John Doe' : 'Ismingizni kiriting'
		if (msgInput)
			msgInput.placeholder =
				state.lang === 'en'
					? "Let's build something..."
					: 'Xabaringizni kiriting...'
		if (subjectInput)
			subjectInput.placeholder =
				state.lang === 'en' ? 'Project Proposal' : 'Loyiha mavzusi'

		// Trigger update for active elements inside projects (like the bot simulator placeholder/keyboards)
		updateTelegramBotTranslation()
	})
}

/* ====================================================
   5. Sticky Navigation & Scroll Spy
   ==================================================== */
function initNavigation() {
	const navbar = document.getElementById('navbar')
	const menuBtn = document.getElementById('mobile-menu-btn')
	const menu = document.getElementById('nav-menu')
	const navLinks = document.querySelectorAll('.nav-link')
	const sections = document.querySelectorAll('section')

	// Sticky Navbar on Scroll
	window.addEventListener('scroll', () => {
		if (window.scrollY > 50) {
			navbar.classList.add('scrolled')
		} else {
			navbar.classList.remove('scrolled')
		}

		// Scroll Spy active navigation state
		let current = ''
		sections.forEach(sec => {
			const top = sec.offsetTop - varHeight()
			const height = sec.offsetHeight
			if (window.scrollY >= top && window.scrollY < top + height) {
				current = sec.getAttribute('id')
			}
		})

		navLinks.forEach(link => {
			link.classList.remove('active')
			if (link.getAttribute('href').slice(1) === current) {
				link.classList.add('active')
			}
		})
	})

	function varHeight() {
		return navbar.offsetHeight + 20
	}

	// Hamburger menu toggle
	menuBtn.addEventListener('click', () => {
		menuBtn.classList.toggle('active')
		menu.classList.toggle('active')
	})

	// Close nav on mobile click
	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			menuBtn.classList.remove('active')
			menu.classList.remove('active')
		})
	})
}

/* ====================================================
   6. Resume / CV Interactive Modal
   ==================================================== */
function initResumeModal() {
	const openBtn = document.getElementById('open-resume-btn')
	const closeBtn = document.getElementById('close-resume-btn')
	const modal = document.getElementById('resume-modal')

	if (!modal) return

	openBtn.addEventListener('click', () => {
		modal.classList.add('active')
		document.body.style.overflow = 'hidden' // Lock background scroll
	})

	closeBtn.addEventListener('click', () => {
		modal.classList.remove('active')
		document.body.style.overflow = ''
	})

	// Close on outer click
	modal.addEventListener('click', e => {
		if (e.target === modal) {
			modal.classList.remove('active')
			document.body.style.overflow = ''
		}
	})
}

/* ====================================================
   7. Telegram Bot Interactive Simulator
   ==================================================== */
const botDialogues = {
	en: {
		start:
			'👨‍🍳 Welcome to *Chef Food Xiva Bot*!\n\nHere you can explore our restaurant menu, add items to your cart, and place orders directly. Select an option from the menu below:',
		main_menu:
			'🍔 *Main Menu*\n\nChoose a category to browse delicious items or view your current cart details:',
		cat_pizza: '🍕 *Pizza Menu*\n\nSelect a pizza to add it to your order:',
		cat_burger: '🍔 *Burger Menu*\n\nSelect a burger to add it to your order:',
		cat_drinks: '🍹 *Beverage Menu*\n\nSelect a drink to add it to your order:',
		added: '✅ Added *{item}* to cart!',
		cart_empty:
			'🛒 *Your Cart is Empty.*\n\nReturn to categories to add items.',
		cart_view:
			'🛒 *Shopping Cart*:\n\n{items}\nTotal Price: *{total} UZS*\n\nReady to place order?',
		checking_out:
			'⚡ Processing order with Node.js & MongoDB database middleware...',
		ordered:
			'🎉 *Order Confirmed!*\n\nYour Order ID is *#108*\n🚚 It will be delivered in Xiva shortly!\n\nThank you for choosing Chef Food!',
		back_to_menu: '↩️ Main Menu',
		cart_btn: '🛒 View Cart',
		place_order_btn: '🚀 Checkout Order',
	},
	uz: {
		start:
			"👨‍🍳 *Chef Food Xiva Bot*-ga xush kelibsiz!\n\nBu yerda siz restoran menyumizni ko'rishingiz, savatga buyurtmalar qo'shishingiz va to'g'ridan-to'g'ri buyurtma berishingiz mumkin. Quyidagi menyudan birini tanlang:",
		main_menu:
			"🍔 *Asosiy Menyu*\n\nYoqimli taomlar toifasini tanlang yoki savatchangizni ko'ring:",
		cat_pizza:
			"🍕 *Pitsalar Menyusi*\n\nSavatga qo'shish uchun pitsani tanlang:",
		cat_burger:
			"🍔 *Burgerlar Menyusi*\n\nSavatga qo'shish uchun burgerni tanlang:",
		cat_drinks:
			"🍹 *Ichimliklar Menyusi*\n\nSavatga qo'shish uchun ichimlikni tanlang:",
		added: "✅ *{item}* savatga qo'shildi!",
		cart_empty:
			"🛒 *Savatchangiz bo'sh.*\n\nMahsulot qo'shish uchun toifalarga qayting.",
		cart_view:
			'🛒 *Sizning Savatchangiz*:\n\n{items}\nJami Narxi: *{total} UZS*\n\nBuyurtma berishga tayyormisiz?',
		checking_out: '⚡ Node.js & MongoDB orqali buyurtma yuborilmoqda...',
		ordered:
			"🎉 *Buyurtma Qabul Qilindi!*\n\nBuyurtma raqamingiz: *#108*\n🚚 Xiva bo'ylab tez orada yetkaziladi!\n\nChef Food xizmatidan foydalanganingiz uchun rahmat!",
		back_to_menu: '↩️ Asosiy menyu',
		cart_btn: "🛒 Savatni ko'rish",
		place_order_btn: '🚀 Buyurtma berish',
	},
}

function initTelegramBot() {
	const startBtn = document.getElementById('start-simulation-btn')
	if (!startBtn) return

	startBtn.addEventListener('click', () => {
		// Remove start prompt, launch conversation
		const prompt = document.getElementById('tg-start-prompt')
		if (prompt) prompt.remove()
		sendTelegramMessage('/start')
	})
}

function updateTelegramBotTranslation() {
	const chatBody = document.getElementById('tg-chat-body')
	// Check if simulation has run
	if (chatBody.children.length <= 2) return // only system date & start-prompt present

	// Rerender keyboard based on current simulator state
	renderTelegramKeyboard()
}

// Function to handle simulated user commands
function sendTelegramMessage(text) {
	const chatBody = document.getElementById('tg-chat-body')

	// 1. Render user message
	const userMsg = document.createElement('div')
	userMsg.className = 'msg msg-user'
	userMsg.innerHTML = `${text}<span class="msg-time">${getCurrentTime()}</span>`
	chatBody.appendChild(userMsg)
	scrollChatBottom()

	// Disable buttons while bot is typing
	setBotKeyboardDisabled(true)

	// 2. Show Typing Indicator
	const typingBubble = document.createElement('div')
	typingBubble.className = 'msg msg-bot msg-typing'
	typingBubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`
	chatBody.appendChild(typingBubble)
	scrollChatBottom()

	// 3. Process reply delay
	setTimeout(() => {
		typingBubble.remove()

		let replyText = ''
		let inlineKeyboard = null
		let useImage = ''

		const langObj = botDialogues[state.lang]

		// Simple routing logic based on user input & state
		if (
			text === '/start' ||
			text.toLowerCase().includes('main menu') ||
			text.toLowerCase().includes('asosiy menyu')
		) {
			state.botState = 'main_menu'
			replyText = langObj.start
			inlineKeyboard = getMainMenuInlineKeyboard()
		} else if (text.includes('🍕 Pizza') || text.includes('🍕 Pitsalar')) {
			state.botState = 'category_pizza'
			replyText = langObj.cat_pizza
			inlineKeyboard = getPizzaInlineKeyboard()
		} else if (text.includes('🍔 Burgers') || text.includes('🍔 Burgerlar')) {
			state.botState = 'category_burger'
			replyText = langObj.cat_burger
			inlineKeyboard = getBurgerInlineKeyboard()
		} else if (text.includes('🍹 Drinks') || text.includes('🍹 Ichimliklar')) {
			state.botState = 'category_drinks'
			replyText = langObj.cat_drinks
			inlineKeyboard = getDrinksInlineKeyboard()
		} else if (text.includes(langObj.cart_btn.split(' ')[1])) {
			// matches "Cart" or "Savat"
			state.botState = 'cart'
			replyText = getCartViewText()
			inlineKeyboard = getCartInlineKeyboard()
		} else if (text.includes(langObj.place_order_btn.split(' ')[1])) {
			// Checkout Order / Buyurtma berish
			state.botState = 'checkout'
			replyText = langObj.checking_out

			// Trigger log animation on the server console log simulator!
			triggerFlowSimulation(true)

			setTimeout(() => {
				// Remove processing bubble and render actual confirmation
				const checkoutConfirm = document.createElement('div')
				checkoutConfirm.className = 'msg msg-bot'
				checkoutConfirm.innerHTML = `${langObj.ordered.replace(/\n/g, '<br>')}<span class="msg-time">${getCurrentTime()}</span>`
				chatBody.appendChild(checkoutConfirm)
				scrollChatBottom()

				// Reset state
				state.botCart = []
				state.botState = 'main_menu'

				renderTelegramKeyboard()
			}, 2500)
		} else if (text.startsWith('ADD_')) {
			const itemId = text.replace('ADD_', '')
			const item = findMenuItem(itemId)
			if (item) {
				state.botCart.push(item)
				replyText = langObj.added.replace('{item}', item.name)

				// Attach food visual
				if (itemId.startsWith('p')) useImage = 'pizza-img'
				if (itemId.startsWith('b')) useImage = 'burger-img'
				if (itemId.startsWith('d')) useImage = 'drink-img'
			}

			// Keep category view active
			inlineKeyboard = getActiveCategoryKeyboard()
		}

		if (replyText) {
			const botMsg = document.createElement('div')
			botMsg.className = 'msg msg-bot'

			let htmlContent = ''
			if (useImage) {
				htmlContent += `<div class="msg-image ${useImage}"></div>`
			}
			htmlContent += `${replyText.replace(/\n/g, '<br>')}<span class="msg-time">${getCurrentTime()}</span>`
			botMsg.innerHTML = htmlContent
			chatBody.appendChild(botMsg)

			if (inlineKeyboard) {
				chatBody.appendChild(inlineKeyboard)
			}
			scrollChatBottom()
		}

		renderTelegramKeyboard()
		setBotKeyboardDisabled(false)
	}, 1000)
}

// Inline keyboard templates
function getMainMenuInlineKeyboard() {
	const wrapper = document.createElement('div')
	wrapper.className = 'tg-inline-keyboard'

	const textMenu = state.lang === 'en' ? 'Browse Categories' : "Bo'limlar"
	wrapper.innerHTML = `
    <div class="tg-inline-keyboard-row">
      <button class="tg-inline-btn" onclick="sendTelegramMessage('🍕 ' + (state.lang === 'en' ? 'Pizza' : 'Pitsalar'))">🍕 Pizza</button>
      <button class="tg-inline-btn" onclick="sendTelegramMessage('🍔 ' + (state.lang === 'en' ? 'Burgers' : 'Burgerlar'))">🍔 Burgers</button>
    </div>
    <div class="tg-inline-keyboard-row">
      <button class="tg-inline-btn" onclick="sendTelegramMessage('🍹 ' + (state.lang === 'en' ? 'Drinks' : 'Ichimliklar'))">🍹 Drinks</button>
    </div>
  `
	return wrapper
}

function getPizzaInlineKeyboard() {
	const wrapper = document.createElement('div')
	wrapper.className = 'tg-inline-keyboard'
	wrapper.innerHTML = `
    <div class="tg-inline-keyboard-row">
      <button class="tg-inline-btn" onclick="sendTelegramMessage('ADD_p1')">🍕 Xiva Special (45k)</button>
      <button class="tg-inline-btn" onclick="sendTelegramMessage('ADD_p2')">🍕 Margherita (35k)</button>
    </div>
    <div class="tg-inline-keyboard-row">
      <button class="tg-inline-btn" onclick="sendTelegramMessage('${botDialogues[state.lang].back_to_menu}')"><i class="fa-solid fa-house"></i> ${botDialogues[state.lang].back_to_menu}</button>
    </div>
  `
	return wrapper
}

function getBurgerInlineKeyboard() {
	const wrapper = document.createElement('div')
	wrapper.className = 'tg-inline-keyboard'
	wrapper.innerHTML = `
    <div class="tg-inline-keyboard-row">
      <button class="tg-inline-btn" onclick="sendTelegramMessage('ADD_b1')">🍔 Cheeseburger (28k)</button>
      <button class="tg-inline-btn" onclick="sendTelegramMessage('ADD_b2')">🍔 Double Beef (38k)</button>
    </div>
    <div class="tg-inline-keyboard-row">
      <button class="tg-inline-btn" onclick="sendTelegramMessage('${botDialogues[state.lang].back_to_menu}')"><i class="fa-solid fa-house"></i> ${botDialogues[state.lang].back_to_menu}</button>
    </div>
  `
	return wrapper
}

function getDrinksInlineKeyboard() {
	const wrapper = document.createElement('div')
	wrapper.className = 'tg-inline-keyboard'
	wrapper.innerHTML = `
    <div class="tg-inline-keyboard-row">
      <button class="tg-inline-btn" onclick="sendTelegramMessage('ADD_d1')">🥤 Coca-Cola (8k)</button>
      <button class="tg-inline-btn" onclick="sendTelegramMessage('ADD_d2')">🍵 Lemon Tea (6k)</button>
    </div>
    <div class="tg-inline-keyboard-row">
      <button class="tg-inline-btn" onclick="sendTelegramMessage('${botDialogues[state.lang].back_to_menu}')"><i class="fa-solid fa-house"></i> ${botDialogues[state.lang].back_to_menu}</button>
    </div>
  `
	return wrapper
}

function getCartInlineKeyboard() {
	const wrapper = document.createElement('div')
	wrapper.className = 'tg-inline-keyboard'

	if (state.botCart.length === 0) {
		wrapper.innerHTML = `
      <div class="tg-inline-keyboard-row">
        <button class="tg-inline-btn" onclick="sendTelegramMessage('${botDialogues[state.lang].back_to_menu}')"><i class="fa-solid fa-house"></i> ${botDialogues[state.lang].back_to_menu}</button>
      </div>
    `
	} else {
		wrapper.innerHTML = `
      <div class="tg-inline-keyboard-row">
        <button class="tg-inline-btn" onclick="sendTelegramMessage('${botDialogues[state.lang].place_order_btn}')">🚀 ${botDialogues[state.lang].place_order_btn}</button>
      </div>
      <div class="tg-inline-keyboard-row">
        <button class="tg-inline-btn" onclick="sendTelegramMessage('${botDialogues[state.lang].back_to_menu}')"><i class="fa-solid fa-house"></i> ${botDialogues[state.lang].back_to_menu}</button>
      </div>
    `
	}
	return wrapper
}

function getActiveCategoryKeyboard() {
	if (state.botState === 'category_pizza') return getPizzaInlineKeyboard()
	if (state.botState === 'category_burger') return getBurgerInlineKeyboard()
	if (state.botState === 'category_drinks') return getDrinksInlineKeyboard()
	return getMainMenuInlineKeyboard()
}

// bottom Reply Keyboard switcher
function renderTelegramKeyboard() {
	const area = document.getElementById('tg-keyboard-area')
	const langObj = botDialogues[state.lang]

	if (state.botState === 'start') {
		area.innerHTML = `<button class="tg-keyboard-btn" id="start-simulation-btn">/start</button>`
		initTelegramBot() // bind event back
		return
	}

	// Active chat controls
	let html = `
    <div class="tg-keyboard-grid">
      <button class="tg-keyboard-btn" onclick="sendTelegramMessage('🍕 ' + (state.lang === 'en' ? 'Pizza' : 'Pitsalar'))">🍕 Pizza</button>
      <button class="tg-keyboard-btn" onclick="sendTelegramMessage('🍔 ' + (state.lang === 'en' ? 'Burgers' : 'Burgerlar'))">🍔 Burgers</button>
    </div>
    <div class="tg-keyboard-grid">
      <button class="tg-keyboard-btn" onclick="sendTelegramMessage('🍹 ' + (state.lang === 'en' ? 'Drinks' : 'Ichimliklar'))">🍹 Drinks</button>
      <button class="tg-keyboard-btn" onclick="sendTelegramMessage('${langObj.cart_btn}')">${langObj.cart_btn} (${state.botCart.length})</button>
    </div>
  `

	area.innerHTML = html
}

function getCartViewText() {
	const langObj = botDialogues[state.lang]
	if (state.botCart.length === 0) {
		return langObj.cart_empty
	}

	let listStr = ''
	let total = 0

	state.botCart.forEach((item, index) => {
		listStr += `${index + 1}. *${item.name}* - ${item.price.toLocaleString()} UZS\n`
		total += item.price
	})

	return langObj.cart_view
		.replace('{items}', listStr)
		.replace('{total}', total.toLocaleString())
}

function findMenuItem(id) {
	for (const cat in state.menuItems) {
		const found = state.menuItems[cat].find(item => item.id === id)
		if (found) return found
	}
	return null
}

function setBotKeyboardDisabled(disabled) {
	const buttons = document.querySelectorAll('.tg-keyboard-btn, .tg-inline-btn')
	buttons.forEach(btn => (btn.disabled = disabled))
}

function scrollChatBottom() {
	const chatBody = document.getElementById('tg-chat-body')
	chatBody.scrollTop = chatBody.scrollHeight
}

function getCurrentTime() {
	const now = new Date()
	const hours = now.getHours().toString().padStart(2, '0')
	const minutes = now.getMinutes().toString().padStart(2, '0')
	return `${hours}:${minutes}`
}

// Expose simulation helper to window scope for onclick actions
window.sendTelegramMessage = sendTelegramMessage

/* ====================================================
   8. Developer's Playground (Markdown & JSON tool)
   ==================================================== */
function initPlayground() {
	const mdInput = document.getElementById('markdown-input')
	const mdPreview = document.getElementById('markdown-preview')

	const tabBtnMd = document.getElementById('tab-btn-markdown')
	const tabBtnJson = document.getElementById('tab-btn-json')

	const tabContentMd = document.getElementById('tab-markdown')
	const tabContentJson = document.getElementById('tab-json')

	const jsonInput = document.getElementById('json-input')
	const jsonOutput = document.getElementById('json-output')
	const jsonStatus = document.getElementById('json-status-bar')

	const loadJsonBtn = document.getElementById('load-sample-json-btn')
	const beautifyJsonBtn = document.getElementById('beautify-json-btn')
	const minifyJsonBtn = document.getElementById('minify-json-btn')

	// --- Markdown Parser logic ---
	function parseMarkdown(text) {
		let html = text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')

		// Headings
		html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
		html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
		html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')

		// Bold
		html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

		// Blockquotes
		html = html.replace(/^&gt;\s+(.+)$/gm, '<blockquote>$1</blockquote>')

		// Lists (unordered)
		html = html.replace(/^\-\s+(.+)$/gm, '<li>$1</li>')
		// wrap list items in ul
		html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
		// clean nested duplicated ul tags
		html = html.replace(/<\/ul>\s*<ul>/g, '')

		// Paragraphs (lines that aren't headers, list items, lists, or quotes)
		html = html
			.split('\n\n')
			.map(p => {
				p = p.trim()
				if (!p) return ''
				if (
					p.startsWith('<h') ||
					p.startsWith('<blockquote') ||
					p.startsWith('<ul') ||
					p.startsWith('<li')
				) {
					return p
				}
				return `<p>${p}</p>`
			})
			.join('\n')

		return html
	}

	if (mdInput && mdPreview) {
		mdInput.addEventListener('input', () => {
			mdPreview.innerHTML = parseMarkdown(mdInput.value)
		})
		// initial render
		mdPreview.innerHTML = parseMarkdown(mdInput.value)
	}

	// --- Tab Switch Logic ---
	window.switchProjectTab = tab => {
		if (tab === 'markdown') {
			tabBtnMd.classList.add('active')
			tabBtnJson.classList.remove('active')
			tabContentMd.classList.add('active')
			tabContentJson.classList.remove('active')
		} else {
			tabBtnJson.classList.add('active')
			tabBtnMd.classList.remove('active')
			tabContentJson.classList.add('active')
			tabContentMd.classList.remove('active')
		}
	}

	// Bind tabs explicitly
	if (tabBtnMd && tabBtnJson) {
		tabBtnMd.addEventListener('click', () => switchProjectTab('markdown'))
		tabBtnJson.addEventListener('click', () => switchProjectTab('json'))
	}

	// --- JSON Formatter Logic ---
	const sampleJSON = {
		restaurant: 'Chef Food Xiva',
		address: 'Kharezm, Xiva, Uzbekistan',
		order: {
			id: 108,
			items: [
				{ name: 'Xiva Special Pizza', qty: 1, price: 45000 },
				{ name: 'Coca-Cola 0.5L', qty: 2, price: 8000 },
			],
			delivery: true,
			deliveryTime: '25-35 min',
		},
		payment: {
			method: 'Cash on delivery',
			status: 'pending',
		},
	}

	if (loadJsonBtn) {
		loadJsonBtn.addEventListener('click', () => {
			jsonInput.value = JSON.stringify(sampleJSON, null, 2)
			jsonOutput.innerText = ''
			setStatusMsg(
				'Sample loaded. Press Beautify to display formatting.',
				'valid',
			)
		})
	}

	function setStatusMsg(text, type) {
		jsonStatus.className = `json-validation-bar ${type}`
		jsonStatus.innerHTML = `<span>${type === 'valid' ? '✔' : '✖'} ${text}</span>`
	}

	window.formatJSON = beautify => {
		const rawVal = jsonInput.value.trim()
		if (!rawVal) {
			setStatusMsg('Input is empty.', 'invalid')
			return
		}

		try {
			const parsed = JSON.parse(rawVal)
			if (beautify) {
				jsonOutput.textContent = JSON.stringify(parsed, null, 2)
				setStatusMsg('Valid JSON. Beautified successfully!', 'valid')
			} else {
				jsonOutput.textContent = JSON.stringify(parsed)
				setStatusMsg('Valid JSON. Minified successfully!', 'valid')
			}
		} catch (e) {
			jsonOutput.textContent = e.message
			setStatusMsg('Invalid JSON syntax error.', 'invalid')
		}
	}

	if (beautifyJsonBtn)
		beautifyJsonBtn.addEventListener('click', () => formatJSON(true))
	if (minifyJsonBtn)
		minifyJsonBtn.addEventListener('click', () => formatJSON(false))
}

/* ====================================================
   9. NodeJS & MongoDB Request Flow Visualizer
   ==================================================== */
function initBackendVisualizer() {
	const triggerBtn = document.getElementById('trigger-flow-btn')
	if (triggerBtn) {
		triggerBtn.addEventListener('click', () => triggerFlowSimulation())
	}
}

function triggerFlowSimulation(fromTelegram = false) {
	const status = document.getElementById('server-status')
	const logBody = document.getElementById('server-logs-body')

	const clientNode = document.getElementById('node-client')
	const routerNode = document.getElementById('node-router')
	const controllerNode = document.getElementById('node-controller')
	const dbNode = document.getElementById('node-db')

	const conn1 = document.getElementById('conn-1')
	const conn2 = document.getElementById('conn-2')
	const conn3 = document.getElementById('conn-3')

	if (!logBody || !status) return

	// Clear previous active nodes & pulsing connectors
	const nodes = [clientNode, routerNode, controllerNode, dbNode]
	const conns = [conn1, conn2, conn3]

	nodes.forEach(n => (n.className = 'flow-node'))
	conns.forEach(c => {
		c.classList.remove('active', 'pulsing')
	})

	status.innerText = 'BUSY'
	status.className = 'status-indicator busy'

	// Append visual separator in logs
	appendLogLine(
		'----------------- INCOMING API REQUEST -----------------',
		'incoming',
	)

	// Step 1: Client sends request
	clientNode.classList.add('active')
	appendLogLine(
		'[CLIENT] HTTP POST request emitted via Telegram Webhook.',
		'incoming',
	)

	if (fromTelegram) {
		appendLogLine(
			`[PAYLOAD] { order: "Xiva Special Pizza", id: 108 }`,
			'incoming',
		)
	} else {
		appendLogLine(
			`[PAYLOAD] { order: "Test Order Item", price: 30000 }`,
			'incoming',
		)
	}

	// Step 2: Route request
	setTimeout(() => {
		conn1.classList.add('active', 'pulsing')
		clientNode.classList.add('success')
		clientNode.classList.remove('active')

		setTimeout(() => {
			routerNode.classList.add('active')
			appendLogLine(
				"[ROUTER] Express matched path POST '/webhook/chef-bot'. Resolving controller middleware...",
				'processing',
			)
		}, 1000)
	}, 500)

	// Step 3: Controller processes
	setTimeout(() => {
		conn2.classList.add('active', 'pulsing')
		routerNode.classList.add('success')
		routerNode.classList.remove('active')

		setTimeout(() => {
			controllerNode.classList.add('active')
			appendLogLine(
				'[CONTROLLER] OrderController: Validating order payload. Executing model instance. Preparing MongoDB save queries...',
				'processing',
			)
		}, 1000)
	}, 1800)

	// Step 4: MongoDB saves
	setTimeout(() => {
		conn3.classList.add('active', 'pulsing')
		controllerNode.classList.add('success')
		controllerNode.classList.remove('active')

		setTimeout(() => {
			dbNode.classList.add('active')
			appendLogLine(
				"[MONGODB] mongoose.model('Order').save() - Query Executed.",
				'db-op',
			)
			appendLogLine(
				"[MONGODB] Write success! Saved document ID: _id: ObjectId('669911ef628c')",
				'db-op',
			)
		}, 1000)
	}, 3100)

	// Finish Pipeline
	setTimeout(() => {
		dbNode.classList.add('success')
		dbNode.classList.remove('active')

		appendLogLine(
			'[CONTROLLER] Order processed successfully! Sending notification status to Telegram API.',
			'processing',
		)
		appendLogLine(
			'[CLIENT] HTTP Response returned: status code 201 (Created).',
			'success',
		)

		status.innerText = 'ONLINE'
		status.className = 'status-indicator online'
	}, 4500)
}

function appendLogLine(text, className) {
	const logBody = document.getElementById('server-logs-body')
	if (!logBody) return

	const line = document.createElement('p')
	line.className = `log-line ${className || ''}`
	line.innerText = `[${getCurrentTime()}] ${text}`
	logBody.appendChild(line)

	// scroll console
	logBody.scrollTop = logBody.scrollHeight
}

// Expose visualizer to window
window.triggerFlowSimulation = triggerFlowSimulation

/* ====================================================
   10. Contact Form Handler
   ==================================================== */
function initContactForm() {
	const form = document.getElementById('contact-form')
	const status = document.getElementById('form-status')

	if (!form) return

	form.addEventListener('submit', e => {
		e.preventDefault()

		const name = document.getElementById('form-name').value
		const email = document.getElementById('form-email').value
		const subject = document.getElementById('form-subject').value
		const message = document.getElementById('form-message').value

		status.className = 'form-status'
		status.innerText =
			state.lang === 'en' ? 'Sending message...' : 'Xabar yuborilmoqda...'

		// Simulate sending email api request
		setTimeout(() => {
			status.classList.add('success')
			status.innerText =
				state.lang === 'en'
					? `Thank you, ${name}! Your message has been sent successfully.`
					: `Rahmat, ${name}! Xabaringiz muvaffaqiyatli yuborildi.`

			form.reset()
		}, 1500)
	})
}
