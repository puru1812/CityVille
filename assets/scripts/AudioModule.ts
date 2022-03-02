const AudioManager = require('AudioManager');

cc.Class({
	properties: {
		audioReferences: {
			default: {}
		}
	},

	__ctor__() {
		this._previousClip = null;
		this._isPlaying = false;
		AudioManager.instance._audioModules.push(this);
	},

	playSfx(clipName, callback, loop = false) {
		// If sound doesn't exists, return
		let sound = AudioManager.instance.getSoundByName(clipName);
		if (sound === null || sound === undefined) {
			return;
		}

		// If key with clipname doesn't exists, create one with empty array
		if (this.audioReferences[clipName] === null || this.audioReferences[clipName] === undefined) {
			this.audioReferences[clipName] = [];
		}

		// Play sound and delete when done
		let id = AudioManager.instance.playSfx(clipName, () => {
			if (callback) {
				callback();
			}

			delete this.audioReferences[clipName];
		}, loop);

		this.audioReferences[clipName].push(id);
	},
	playSfxOnly(clipName, callback, loop = false) {
		// If sound doesn't exists, return
		let sound = AudioManager.instance.getSoundByName(clipName);
		if (sound === null || sound === undefined) {
			return;
		}

		// If key with clipname doesn't exists, create one with empty array
		if (this.audioReferences[clipName] === null || this.audioReferences[clipName] === undefined) {
			this.audioReferences[clipName] = [];
		}

		// Play sound and delete when done
		if (this._previousClip) {
			if (this.audioReferences[this._previousClip] > 0) {
				this.stopSfx(this._previousClip);
			}
		}


		if (this._previousClip) {
			this.stopSfx(this._previousClip);
		}
		this._previousClip = clipName;


		let id = AudioManager.instance.playSfx(clipName, () => {

			if (callback) {
				callback();
			}

			delete this.audioReferences[clipName];
		}, loop);
		if (id && this.audioReferences[clipName])
			this.audioReferences[clipName].push(id);

	},
	getSfxDuration(clipName) {
		return AudioManager.instance.getSfxDuration(clipName);
	},

	stopSfx(clipName) {
		let ids = this.audioReferences[clipName]
		if (ids === null || ids === undefined) {
			return;
		}

		for (let i = 0; i < ids.length; i++) {
			AudioManager.instance.stopSfx(ids[i]);
		}

		delete this.audioReferences[clipName];
	},

	stopAllSfx() {
		Object.keys(this.audioReferences).forEach(function(key) {
			this.stopSfx(this.audioReferences[key]);
		});
	}
})
