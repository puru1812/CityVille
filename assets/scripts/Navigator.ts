

cc.Class({
	extends: cc.Component,

	properties: {
		camera: {
			type: cc.Node,
			default: null
		}
	},

	onLoad() {
		this.deltaY = 0;

		this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.moveY, this, true);
		this.node.on(cc.Node.EventType.MOUSE_MOVE, this.moveX, this, true);
	},

	moveY(y) {

		this.deltaY = y.getScrollY();
		this.camera.setPosition(this.camera.getPosition().x, this.camera.getPosition().y + this.deltaY / 10);

	},

	moveX(x) {
		if (!this.deltaX)
			this.deltaX = x.getLocationX();
		let mag = x.getLocationX() - this.deltaX;
		console.log(x.getLocationX() + ":" + mag);
		//	mag = mag;
		mag = mag / 10;
		this.camera.setPosition(this.camera.getPosition().x + mag, this.camera.getPosition().y);
		this.deltaX = x.getLocationX();
	},

});
