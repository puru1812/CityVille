// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		_id: {
			default: null
		},
		_team: {
			default: null
		},
		_isLocalPlayer: {
			default: false
		},
		_isAlive: {
			default: true
		}
	},
	setTeam(team) {
		this._team = team;
	},
	init(id, isLocal = false, manager) {
		this._manager = manager;
		this._id = id;
		this._isLocalPlayer = isLocal;
		if (this._isLocalPlayer == true) {
			console.log("is local player");


		}
	},

	kill() {
		this._isAlive = false;
	}
});
