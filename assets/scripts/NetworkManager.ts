
let GameManager = require("./GameManager")
cc.Class({
	extends: cc.Component,

	properties: {
		_gameId: {
			default: null
		},
		_team: {
			default: null
		},
		gameIdLabel: {
			type: cc.Label,
			default: null
		},
		teamIdLabel: {
			type: cc.Label,
			default: null
		},
		_clientId: {
			default: "null"
		},
		gameManager: {
			type: GameManager,
			default: null
		},
		createGameButton: {
			type: cc.Node,
			default: null
		},
		joinGameButton: {
			type: cc.Node,
			default: null
		},
		teamsContainer: {
			type: cc.Node,
			default: null
		},
		touchArea: {
			type: cc.Node,
			default: null
		},
		generatedGameIDLabel: {
			type: cc.Node,
			default: null
		},
		lobby: {
			type: cc.Node,
			default: null
		},
		confirmPopUp: {
			type: cc.Node,
			default: null
		},
		confirmLabel: {
			type: cc.Label,
			default: null
		},
		confirmButton: {
			type: cc.Node,
			default: null
		},
		confirmExit: {
			type: cc.Node,
			default: null
		},
		playerTeamParent: {
			type: cc.Node,
			default: null
		},
		playerTeamsAllParent: {
			type: cc.Node,
			default: null
		},

	},


	// Create a new Game
	createGame() {
		let id = this._clientId;
		const payLoad = {
			"method": "createGame",
		}
		payLoad["clientId"] = id;
		this.websocket.send(JSON.stringify(payLoad));
	},
	// create a new team
	createTeam(inputText) {
		let teamName = inputText.textLabel.string;
		let id = this._clientId;
		let gameid = this._gameId;
		let teamid = "" + teamName;
		const payLoad = {
			"method": "createTeam",
		}
		payLoad["clientId"] = id;
		payLoad["gameId"] = gameid;
		payLoad["teamId"] = teamid;
		this.websocket.send(JSON.stringify(payLoad));
	},
	// join a team
	joinTeam(teamId, gameId) {
		if (this.gameManager.myPlayer._team) {
			// confirm exit from current team
			const payLoad = {
				"method": "joinTeam",
			}
			oldTeamId = this.gameManager.myPlayer.team._id;
			payLoad["PrevteamId"] = oldTeamId;
			payLoad["clientId"] = this._clientId;
			payLoad["gameId"] = gameId;
			payLoad["teamId"] = teamId;
			this.confirmPopUp.active = true;
			this.confirmLabel.string = "Confirm exit from " + oldTeamId + " to join " + teamId;
			this.confirmButton.on(cc.Node.EventType.MOUSE_DOWN, () => {

				let val = JSON.stringify(payLoad);
				this.websocket.send(val);
				this.teamIdLabel.string = "" + teamId;
				this.confirmPopUp.active = false;
			});
			this.confirmExit.on(cc.Node.EventType.MOUSE_DOWN, () => {
				this.confirmPopUp.active = false;
			});
		} else {
			const payLoad = {
				"method": "joinTeam",
			}
			payLoad["clientId"] = this._clientId;
			payLoad["gameId"] = gameId;
			payLoad["teamId"] = teamId;
			//	//console.log("sending" + JSON.stringify(payLoad));
			this.websocket.send(JSON.stringify(payLoad));
			this.teamIdLabel.string = "" + teamId;
		}

	},

	// join an existing game
	joinGame(inputText) {
		let gameId = inputText.textLabel.string;
		const payLoad = {
			"method": "joinGame",
		}
		payLoad["clientId"] = this._clientId;
		payLoad["gameId"] = gameId;
		this.websocket.send(JSON.stringify(payLoad));
	},
	// save id
	updateId(id) {
		if (this._clientId.length > 4)
			return;
		this._clientId = id;
	},

	// start game
	startGame() {
		this.touchArea.active = true;
		this.lobby.active = false;
		this.gameManager.myPlayer._team.players.forEach(player => {
			player.node.parent = this.playerTeamParent;
			player.node.setPosition(cc.v2(0, 0));
		});
		this.gameManager.teams.forEach(team => {
			team.node.parent = this.playerTeamsAllParent;
			team.node.setPosition(cc.v2(0, 0));
			team.joinTeamButton.active = false;
		});
	},

	onLoad() {
		this.i = 0;
		this._clientId = "";
		this._gameId = "";
		this.lobby.active = true;
		this.touchArea.active = false;
		let id = "";
		//console.log("WebSocket start");
		this.gameIdLabel.node.on("click", this.copyTextToClipboard, this);
		//	this.websocket = new WebSocket("wss://cityville-server.glitch.me/");
		this.websocket = new WebSocket("ws://localhost:3000/");
		var self = this;
		this.websocket.onopen = function(evt) {
			console.log("WebSocket start" + evt);
			self.isConnected = true;
		};

		this.websocket.onmessage = function(evt) {
			let data = JSON.parse(evt.data);
			console.log('method: ' + data["method"]);

			switch (data["method"]) {
				case "connected": {
					let id = data["clientId"];
					self.updateId(id);
					self.gameManager.init(self);
				}
					break;
				case "gameCreated": {
					self._gameId = data.game.id;
					self.gameIdLabel.string = self._gameId;
				}
					break;
				case "createdTeam": {
					self.gameManager.createTeam(data["teamId"], data["gameId"]);
				}
					break;
				case "addToTeam": {
					this._team = data.teamId;
					self.gameManager.addToTeam(data["clientId"], data["teamId"], data["gameId"]);
				}
					break;
				case "joinedGame": {
					self.createGameButton.active = false;
					self.joinGameButton.active = false;
					self.teamsContainer.active = true;
					self._gameId = data.game.id;
					self.gameIdLabel.string = self._gameId;
					self.generatedGameIDLabel.active = true;

					data.game.clients.forEach((element) => {
						if (element["clientId"] == self._clientId) {

							self.gameManager.createPlayer(element["clientId"], element["color"], true);
						} else {
							self.gameManager.createPlayer(element["clientId"], element["color"], false);
						}

					});
					data.game.clients.forEach((element) => {
						if (element["clientId"] == self._clientId) {

							self.gameManager.createPlayer(element["clientId"], element["color"], true);
						} else {
							self.gameManager.createPlayer(element["clientId"], element["color"], false);
						}

					});
					data.game.teams.forEach((element) => {

						self.gameManager.createTeam(element["id"], element["game"]);
						let clients = element["clients"];
						let teamId = element["id"];
						let gameId = element["game"];

						clients.forEach((cliID) => {
							if (cliID == self._clientId)
								this._team = data.teamId;
							self.gameManager.addToTeam(cliID, teamId, gameId);

						});

					});

				}

					break;
				default:

			}

		}

		this.websocket.onclose = function(event) {
			console.log("Closed ");
			self.isConnected = false;
		}

	},
	copyTextToClipboard() {
		//console.log("clicked");
		let text = this.gameIdLabel.string + "";
		if (!navigator.clipboard) {
			fallbackCopyTextToClipboard(text);
			return;
		}

		navigator.clipboard.writeText(text).then(function() {
			//console.log('Async: Copying to clipboard was successful!');
		}, function(err) {
			console.error('Async: Could not copy text: ', err);
		});
	},

	send() {
		let data = "send" + this.i;

		this.i++;
		if (this.websocket != null && this.isConnected == true) {
			//console.log("send " + data);
			this.websocket.send(data);
		}
	},

	// update (dt) {},
});
