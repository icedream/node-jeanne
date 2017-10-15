const s = require('lib/mumble/stumble-instance.js')
const logger = require('lib/logger.js')('speech-commands')
const between = (a, b, c) => c < a ? a : (c > b ? b : c)
const { BreakException } = require('lib/utils.js')
const commands = {
	volume: {
		detector: /(?:.* )?lautstärke +(\d+)/i,
		func: function (matches, tr) {
			let vol = parseFloat(matches[1], 10) / 100.0
			vol = between(0, 1, vol)
			this.config.extensions.audio.gain = vol
			if (this.io.input)
				this.io.input.setGain(vol)

			this.execute("info::gain")
		}
	},
	stop: {
		detector: /\bstop|halt( stop)?\b/i,
		func: function (matches, tr) {
			this.invoke('stop')
		}
	},
	next: {
		detector: /(.* )?nächste(?:s video)?/i,
		func: function (matches, tr) {
			this.invoke('next')
		}
	},
	play: {
		detector: /\b(?:spiele?(?:\s+ab)?|abspielen) (.+?)(?:\s+ab)?$/i,
		func: function (matches, tr) {
			let terms = matches.slice(1).join(' ')
			logger.log("Setting video/song: " + terms)
			this.invoke('yt', {
				message: terms
			})
		}
	},
	reboot: {
		detector: /(.* )?neu\s+starten/i,
		func: function (matches, tr) {
			this.invoke('reboot')
		}
	},
	volumedown: {
		detector: /\bleiser\b/i,
		func: function (matches, tr) {
			this.invoke("volumedown")
		}
	},
	volumeup: {
		detector: /\blauter\b/i,
		func: function (matches, tr) {
			this.invoke("volumeup")
		}
	},
	addnext: {
		detector: /(?:als nächstes) (.+)/i,
		func: function (matches, tr) {
			this.invoke("addnext", {
				message: matches.slice(1).join(' ')
			})
		}
	},
	add: {
		detector: /(?:füge hinzu|hinzufügen) (.+)/i,
		func: function (matches, tr) {
			this.invoke("add", {
				message: matches.slice(1).join(' ')
			})
		}
	},
	mute: {
		detector: /(mute|stumm|schnauze)/i,
		func: function (matches, tr) {
			this.invoke("mute")
		}
	},
	radio: {
		detector: /radio (.+)/i,
		func: function (matches, tr) {
			this.invoke("radio", {
				message: matches.slice(1).join(' ')
			})
		}
	},
	playlist: {
		detector: /liste wiedergeben (.+)/i,
		func: function (matches, tr) {
			const terms = matches[1]
			logger.log("Playing playlist: " + terms)
			this.invoke('playList', {
				message: terms
			})
		}
	},
	playlists: {
		detector: /playlisten ?lists?/i,
		func: function (matches, tr) {
			this.invoke('playlists')
		}
	},
	pause: {
		detector: /(pause)|(anhalten)/i,
		func: function (matches, tr) {
			this.invoke("pause")
		}
	},
	resume: {
		detector: /\bweiter\b/i,
		func: function (matches, tr) {
			this.invoke("play")
		}
	},
	search: {
		detector: /\bsuche\s+(?:nach\s+)?(.+)/i,
		func: function (matches, tr) {
			let terms = matches.slice(1).join(' ')
			this.invoke("search", {
				message: terms
			})
		}
	},
	description: {
		detector: /description/i,
		func: function (matches, tr) {
			this.invoke("description")
		}
	},
	move_forward: {
		detector: /springe\s+vor/i,
		func: function (matches, tr) {
			const player = this.space.get('youtube-player')
			player.jumpForward()
		}
	},
	move_backward: {
		detector: /springe\s+zurück/i,
		func: function (matches, tr) {
			const player = this.space.get('youtube-player')
			player.jumpBackward()
		}
	},
	history: {
		detector: /\bhistorie\b/i,
		func: function (matches, tr) {
			this.invoke("history")
		}
	},
	hits: {
		detector: /\bhits\b/i,
		func: function (matches, tr) {
			this.invoke("hits")
		}
	},
	trending: {
		detector: /(trending)|(beliebte(?:ste)?)/i,
		func: function (matches, tr) {
			this.invoke("playList", { message: 'trending' })
		}
	},
	previous: {
		detector: /\bvorherige\b/,
		func: function (matches, tr) {
			this.invoke('previous')
		}
	},
	related: {
		detector: /\brelevante\b/,
		func: function (matches, tr) {
			this.invoke('related')
		}
	},
	news: {
		detector: /news/i,
		func: function (matches, tr) {
			this.invoke("playList", { message: 'news' })
		}
	}
}

module.exports = commands
