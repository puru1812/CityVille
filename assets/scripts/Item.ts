

cc.Class({
	extends: cc.Component,

	properties: {
		x: {
			type: cc.Integer,
			default: 1
		},
		y: {
			type: cc.Integer,
			default: 1
		}
	},

	onLoad() {
		//console.log("loaded" + this.node.name);
	}

});
