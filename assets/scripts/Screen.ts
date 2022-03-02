cc.Class({
	extends: cc.Component,

	onLoad() {
		this.canvas = this.node.getComponent(cc.Canvas);
		Screen.canvasNode = this.node;
		//	this.canvas.fitWidth = true;
		this.resizeCanvas();
		//	this.screenHeight = 720;
		cc.view.resizeWithBrowserSize(true);
		cc.view.setResizeCallback(this.resizeCanvas.bind(this));
	},

	resizeCanvas() {
		//	this.node.setScale(1, this.node.getContentSize().height / 720);
		//	this.screenWidth = this.node.getContentSize().width;
	},

	statics: {
		canvasNode: 0,
		getCanvasPosition(node) {
			let position = node.parent.convertToWorldSpaceAR(node.getPosition());
			return Screen.canvasNode.convertToNodeSpaceAR(position);
		},
	}
});
