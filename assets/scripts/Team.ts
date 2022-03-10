// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let Player = require("./Player")
let NetworkManager = require("./NetworkManager")
cc.Class({
	extends: cc.Component,

	properties: {
		players: {
			type: Player,
			default: []
		},
		_id: {
			default: ""
		},
		_gameId: {
			default: ""

		},
		_clientId: {
			default: ""
		},
		teamName: {
			type: cc.Label,
			default: null
		},
		joinTeamButton: {
			type: cc.Node,
			default: null
		},
		playerParent: {
			type: cc.Node,
			default: null
		},
		gameManager: {
			type: cc.Node,
			default: null
		},
		networkManager: {
			type: NetworkManager,
			default: null
		},
		rankLabel: {
			type: cc.Label,
			default: null
		},
	},
	showRank() {
		this.joinTeamButton.active = false;
		this.playerParent.active = false;
		this.rankLabel.node.active = true;
	},
	init(teamId, gameId) {
		this._id = teamId;
		this._gameId = gameId;
		this.teamName.string = "" + teamId;
	},
	isTeam(teamId, gameId) {
		if (this._id == teamId && this._gameId == gameId)
			return true;
		return false;
	},
	removeMember(player) {

		if (this.players.indexOf(player) >= 0) {
			let index = this.players.indexOf(player);
			this.players.push(index, 1);
		}


	},
	addMember(player) {

		if (this.players.indexOf(player) < 0)
			this.players.push(player);
		//console.log("add member" + player._name + "to" + this._id);
		player.node.parent = this.playerParent;
		player.node.setPosition(cc.v2(0, 0));
	},

	joinTeam() {
		this.networkManager.joinTeam(this._id, this._gameId);
	}

	// update (dt) {},
});
