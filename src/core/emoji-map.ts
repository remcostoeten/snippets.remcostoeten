/**
 * EmojiMap - A comprehensive mapping of categories to relevant emojis
 * Use this to easily access commonly used emojis by semantic category
 */
export type EmojiMap = {
	// Web Development Categories
	frontend: '🖥️' | '🎨' | '🖌️' | '📱' | '⚛️'
	backend: '🔌' | '⚙️' | '🗄️' | '🛠️' | '🧮'
	database: '💾' | '🗃️' | '📊' | '📁' | '📋'
	deployment: '🚀' | '☁️' | '🌐' | '🔄' | '📤'
	security: '🔒' | '🛡️' | '🔐' | '🔑' | '⚠️'
	performance: '⚡' | '🏎️' | '⏱️' | '📈' | '🚄'

	// UI/UX Categories
	ui: '🎯' | '👁️' | '📐' | '✨' | '🎭'
	design: '🎨' | '🖌️' | '🧩' | '🔍' | '🖼️'
	animation: '🎬' | '✨' | '💫' | '🌟' | '🎭'

	// Development Process
	code: '👨‍💻' | '💻' | '📝' | '🧠' | '🔣'
	debug: '🐛' | '🔍' | '🧪' | '🔧' | '🔬'
	testing: '✅' | '🧪' | '📋' | '🔄' | '✔️'

	// Documentation
	note: '📝' | '📌' | '📒' | '📑' | '🔖'
	tip: '💡' | '✨' | '📌' | '🔍' | '🎯'
	warning: '⚠️' | '🚨' | '⛔' | '🔔' | '❗'
	important: '🔑' | '💯' | '❗' | '‼️' | '📢'
	example: '🔍' | '👉' | '🧪' | '📋' | '🔎'

	// General Purpose
	success: '✅' | '🎉' | '👍' | '🏆' | '💯'
	error: '❌' | '💔' | '🛑' | '🚫' | '⛔'
	info: 'ℹ️' | '📝' | '📌' | '📊' | '📢'
	progress: '🔄' | '⏳' | '📊' | '📈' | '🚧'
	navigation: '👉' | '👈' | '👆' | '👇' | '🔍'
}

/**
 * Get a specific emoji from the map
 * @param category - Category from the EmojiMap
 * @param index - Index of the emoji in the array (0-4)
 * @returns A single emoji string
 */
export const getEmoji = (category: keyof EmojiMap, index = 0): string => {
	const emojiOptions: Record<keyof EmojiMap, string[]> = {
		frontend: ['🖥️', '🎨', '🖌️', '📱', '⚛️'],
		backend: ['🔌', '⚙️', '🗄️', '🛠️', '🧮'],
		database: ['💾', '🗃️', '📊', '📁', '📋'],
		deployment: ['🚀', '☁️', '🌐', '🔄', '📤'],
		security: ['🔒', '🛡️', '🔐', '🔑', '⚠️'],
		performance: ['⚡', '🏎️', '⏱️', '📈', '🚄'],

		ui: ['🎯', '👁️', '📐', '✨', '🎭'],
		design: ['🎨', '🖌️', '🧩', '🔍', '🖼️'],
		animation: ['🎬', '✨', '💫', '🌟', '🎭'],

		code: ['👨‍💻', '💻', '📝', '🧠', '🔣'],
		debug: ['🐛', '🔍', '🧪', '🔧', '🔬'],
		testing: ['✅', '🧪', '📋', '🔄', '✔️'],

		note: ['📝', '📌', '📒', '📑', '🔖'],
		tip: ['💡', '✨', '📌', '🔍', '🎯'],
		warning: ['⚠️', '🚨', '⛔', '🔔', '❗'],
		important: ['🔑', '💯', '❗', '‼️', '📢'],
		example: ['🔍', '👉', '🧪', '📋', '🔎'],

		success: ['✅', '🎉', '👍', '🏆', '💯'],
		error: ['❌', '💔', '🛑', '🚫', '⛔'],
		info: ['ℹ️', '📝', '📌', '📊', '📢'],
		progress: ['🔄', '⏳', '📊', '📈', '🚧'],
		navigation: ['👉', '👈', '👆', '👇', '🔍']
	}

	return emojiOptions[category][index % emojiOptions[category].length]
}
