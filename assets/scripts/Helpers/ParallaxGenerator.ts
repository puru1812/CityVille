const ParallaxLayer = cc.Class({
	name: "ParallaxLayer",
	properties: {
		speed: 0,
		height: 0,
		sprite: cc.SpriteFrame
	}
});

cc.Class({
	extends: cc.Component,

	properties: {
		layers: {
			default: [],
			type: ParallaxLayer
		}
	},

	onLoad() {
		let canvas = this.node.getComponent(cc.Canvas);
		canvas.fitWidth = true;
		this.node.setScale(1, this.node.getContentSize().height / 720);
		this.screenWidth = this.node.getContentSize().width;
		this.screenHeight = 720;

		for (let layer in this.layers) {
			this.generateParallax(this.layers[layer].sprite, this.layers[layer].speed, this.layers[layer].height * this.screenHeight);
		}
	},

	generateParallax(sprite, speed, height) {
		let spriteWidth = sprite.getOriginalSize().width;
		let numberOfNodes = Math.floor(this.screenWidth / spriteWidth) + 2;

		let triggerRelocationPoint = cc.v2(-0.5 * this.screenWidth - spriteWidth, height);
		let relocationPoint = cc.v2(-0.5 * this.screenWidth + (numberOfNodes - 1) * spriteWidth, height);

		for (let i = 0; i < numberOfNodes; i++) {
			let newNode = new cc.Node();
			this.node.addChild(newNode);
			newNode.addComponent(cc.Sprite).spriteFrame = sprite;
			newNode.setScale(1.01, 1);
			newNode.setAnchorPoint(0.05, 0);
			newNode.setPosition(-0.5 * this.screenWidth + i * spriteWidth, height);
			let movingAction = cc.moveTo((i + 1) / speed, triggerRelocationPoint);
			let relocate = cc.callFunc(() => {
				newNode.setPosition(relocationPoint);
				let newMovingAction = cc.moveTo(numberOfNodes / speed, triggerRelocationPoint);
				let newRelocate = cc.callFunc(() => {
					newNode.setPosition(relocationPoint);
				});
				newNode.runAction(cc.repeatForever(cc.sequence(newMovingAction, newRelocate)));
			});
			newNode.runAction(cc.sequence(movingAction, relocate));
		}
	}
});
