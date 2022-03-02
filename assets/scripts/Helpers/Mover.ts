
let DirectionX = cc.Enum({
	None: 0,
	Left: 1,
	Right: 2,
});

let DirectionY = cc.Enum({
	None: 0,
	Up: 1,
	Down: 2,
});

cc.Class({
	extends: cc.Component,

	properties: {
		nodes: {
			type: [cc.Node],
			default: []
		},
		deltaDistance: {
			default:
				cc.v2(0, 0)
		},
		maxdistance: {
			default:
				cc.v2(0, 0)
		},
		directionX: {
			type: DirectionX,
			default:
				DirectionX.None
		},
		directionY: {
			type: DirectionY,
			default:
				DirectionY.None
		},
		_initialPosition: {
			default:
				cc.v2(0, 0)
		}
	},

	onLoad() {
		this._initialPosition = this.nodes[this.nodes.length - 1].getPosition();

		if (this.directionX == DirectionX.Left) {
			this.deltaDistance.x = -1 * this.deltaDistance.x;
		}
		if (this.directionY == DirectionY.Down) {
			this.deltaDistance.y = -1 * this.deltaDistance.y;
		}
	},

	checkIfOutOfView() {

		for (let i = 0; i < this.nodes.length; i++) {
			let element = this.nodes[i];
			let currentPosition = element.getPosition();

			if (this.directionX == DirectionX.Left) {
				if (currentPosition.x < (-1 * (this.maxdistance.x - 1))) {

					element.setPosition(this._initialPosition);
				}
			} else if (this.directionX == DirectionX.Right) {
				if (currentPosition.x > (this.maxdistance.x - 1)) {
					element.setPosition(this._initialPosition);
				}
			}

			if (this.directionY == DirectionY.Up) {
				if (currentPosition.y > (this.maxdistance.y - 1)) {
					element.setPosition(this._initialPosition);
				}
			} else if (this.directionY == DirectionY.Down) {
				if (currentPosition.y < (-1 * (this.maxdistance.y - 1))) {
					element.setPosition(this._initialPosition);
				}
			}

		}

	},

	move(steps = 1) {
		let delta = cc.v2(0, 0);;
		delta.x = this.deltaDistance.x * steps;
		delta.y = this.deltaDistance.y * steps;

		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].runAction(
				cc.sequence(
					cc.moveBy(1, delta),
					cc.callFunc(() => { this.checkIfOutOfView(); })
				)
			);
		}

	},

	moveBack(steps = 1) {
		let delta = cc.v2(0, 0);;
		delta.x = -1 * this.deltaDistance.x * steps;
		delta.y = -1 * this.deltaDistance.y * steps;

		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].runAction(
				cc.sequence(
					cc.moveBy(1, delta),
					cc.callFunc(() => { this.checkIfOutOfView(); })
				)
			);
		}

	},

});
