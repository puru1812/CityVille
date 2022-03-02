let exports = { instance: null };

let Sound = cc.Class({
	name: 'Sound',
	properties: {
		name: '',
		clips: {
			type: [cc.AudioClip],
			default: []
		},
		duration: 3,
	}
})

cc.Class({
	extends: cc.Component,

	properties: {
		sfx: {
			type: [Sound],
			default: []
		},
		masterVolume: {
			type: cc.Float,
			default: 1
		},
		backgroundMusic: {
			type: cc.AudioClip,
			default: null
		},
		environmentMusic: {
			type: cc.AudioClip,
			default: null
		},
		voiceOver: {
			type: cc.AudioClip,
			default: null
		},
		_backgroundMusicId: {
			default: null
		},
		_environmentMusicId: {
			default: null
		},
		_voiceOverId: {
			default: null
		},
		_currentSoundId: {
			default: null
		},
		_audioModules: {
			default: []
		}
	},
	isPlaying(name) {

	},
	getSoundByName(name) { return this.sfx.find(x => x.name === name); },

	playSfx: function(soundName, callback, loop = false) {
		let clips = this.getSoundByName(soundName).clips;
		if (clips.length == 0 || clips === null || clips === undefined) {
			console.error("No sound found by name or clips list is empty for", soundName);
			return -1;
		}

		let random = Math.floor(Math.random() * clips.length);
		let id = cc.audioEngine.playEffect(clips[random], loop);
		cc.audioEngine.setFinishCallback(id, () => {
			if (callback) {
				return callback();
			}
		});
		return id;
	},
	getSfxDuration(soundName) {
		let sound = this.getSoundByName(soundName);
		return sound.duration;
	},

	stopSfx: function(soundId) {
		cc.audioEngine.stopEffect(soundId);
	},

	stopAllSfx: function() {
		for (let i = 0; i < this._audioModules.length; i++) {
			this._audioModules.pop().stopAll();
		}
	},

	toggleSound: function() {
		if (this.masterVolume === 0) {
			this.masterVolume = 1;
		} else {
			this.masterVolume = 0;
		}
		cc.audioEngine.setEffectsVolume(this.masterVolume);
	},

	playVoiceOver(callback) {
		if (this.voiceOver) {
			this._voiceOverId = cc.audioEngine.playEffect(this.voiceOver, false);
			cc.audioEngine.setFinishCallback(this._voiceOverId, () => {
				this.playMusic();
				if (callback) {
					return callback();
				}
			});
		} else {
			this._voiceOverId = -1;
			this.playMusic();
			if (callback) {
				return callback();
			}
		}
	},

	playMusic() {
		cc.audioEngine.setEffectsVolume(this.masterVolume);

		if (this.backgroundMusic) {
			this._backgroundMusicId = cc.audioEngine.playEffect(this.backgroundMusic, true);
		}

		if (this.environmentMusic) {
			this._environmentMusicId = cc.audioEngine.playEffect(this.environmentMusic, true);
		}
	},

	onLoad() {
		exports.instance = this;
	},
});

module.exports = exports;
