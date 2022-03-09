// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		players: {
			default: []
		},
		teamIds: {
			default: []
		},
		teams: {
			default: []
		},
		playersIds: {
			default: []
		},
		playerPref: {
			type: cc.Node,
			default: null
		},
		playerIcon: {
			type: cc.Node,
			default: null
		},
		teamPref: {
			type: cc.Node,
			default: null
		},
		myPlayer: {
			default: null
		},
		inputManager: {
			type: cc.Node,
			default: null
		}
	},
	onLoad() {
		this.playerIcon.active = false;
		this.myPlayer = null;
		this._networkManager = null;
		//	this.startPositions = this.shuffle(this.startPositions);
	},
	createItem(data) {
		this.inputManager.getComponent("InputManager").createItem(data["index"], data["touchPos"])
	},
	init(manager) {
		this.playersIds = [];
		this.players = [];
		this._networkManager = manager;
	},
	updatePosition(id, position) {

	},
	movedPlayer(position) {
		this._networkManager.movePlayer(position);
	},

	createTeam(teamId, gameId) {
		if (this.teamIds.indexOf(teamId) >= 0)
			return;
		//console.log("creating team");
		let newTeam = cc.instantiate(this.teamPref);
		newTeam.parent = this.teamPref.parent;
		newTeam.active = true;
		newTeam.getComponent("Team").init(teamId, gameId);
		this.teamIds.push(teamId);
		this.teams.push(newTeam.getComponent("Team"));
	},

	addToTeam(clientId, teamId, gameId) {
		if (this.teamIds.indexOf(teamId) < 0)
			return;
		this.teams.forEach(element => {

			if (element.isTeam(teamId, gameId)) {
				let player = this.getPlayer(clientId);
				//console.log("player" + player);
				element.addMember(player);
				player.setTeam(element);
			}
		});
	},

	getPlayer(clientId) {
		for (let i = 0; i < this.players.length; i++) {
			//console.log(this.players[i]._id + "compare" + clientId);
			if (this.players[i]._id == clientId) {
				//console.log("found player");
				return this.players[i];
			}

		}

		//console.log("not found player");
	},
	createPlayer(id, color, isSelf = false) {
		//console.log("Player create");
		if (this.playersIds.indexOf(id) >= 0)
			return;
		let player = cc.instantiate(this.playerPref);

		if (isSelf == true) {
			console.log("found mine" + color);
			this.playerIcon.active = true;
			this.setColor(this.playerIcon, color);
		}
		//console.log("color" + color + "id" + id);
		this.setColor(player, color);
		player.active = true;
		player.getComponent("Player").init(color, id, isSelf, this);
		player.parent = this.playerPref.parent;
		this.players.push(player.getComponent("Player"));
		this.playersIds.push(id);
		if (isSelf == true) {
			this.myPlayer = player.getComponent("Player")
		}

	},
	shuffle(array) {
		let currentIndex = array.length, randomIndex;

		// While there remain elements to shuffle...
		while (currentIndex != 0) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
		}

		return array;
	},

	setColor(node, color) {
		switch (color) {
			case "WHITE":
				node.color = cc.Color.WHITE;
				break;
			case "CYAN":
				node.color = cc.Color.CYAN;
				break;
			case "MAGENTA":
				node.color = cc.Color.MAGENTA;
				break;
			case "ORANGE":
				node.color = cc.Color.ORANGE;
				break;
			case "YELLOW":
				node.color = cc.Color.YELLOW;
				break;
			case "BLUE":
				node.color = cc.Color.BLUE;
				break;
			case "GREEN":
				node.color = cc.Color.GREEN;
				break;
			case "RED":
				node.color = cc.Color.RED;
				break;
			case "GRAY":
				node.color = cc.Color.GRAY;
				break;
			case "BLACK":
				node.color = cc.Color.BLACK;
				break;
			default:
				break;
		}

	}
});
