

const TiledMapManager = require('./TileMapManager');
const NetworkManager = require('./NetworkManager');
cc.Class({
	extends: cc.Component,

	properties: {
		objectLayer: {
			type: cc.TiledObjectGroup,
			default: null
		},
		camNode: {
			type: cc.Node,
			default: null
		},
		touchNode: {
			type: cc.Node,
			default: null
		},
		offset: {
			default: cc.v2(0, 0)
		},
		tiledMapManager: {
			type: TiledMapManager,
			default: null
		},
		networkManager: {
			type: NetworkManager,
			default: null
		},
		selectedItem: {
			type: cc.Node,
			default: null
		},
		pointerItem: {
			type: cc.Node,
			default: null
		},
		items: {
			type: [cc.Node],
			default: []
		}
	},
	onLoad() {
		let self = this.node;
		this.touchNode.on(cc.Node.EventType.TOUCH_END, this.HandleClickEvent, this);
		this.touchNode.on(cc.Node.EventType.MOUSE_DOWN, this.HandleClickEvent, this);
		this.touchNode.on(cc.Node.EventType.MOUSE_WHEEL, this.moveY, this, true);
		this.touchNode.on(cc.Node.EventType.TOUCH_START, this.HoverEvent, this, true);
		this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.moveAll, this, true);
		this.touchNode.on(cc.Node.EventType.MOUSE_MOVE, this.moveX, this, true);
		this.touchNode.on(cc.Node.EventType.MOUSE_ENTER, this.HoverEvent, this, true);
		exports.instance = this;
		let manager = cc.director.getCollisionManager();
		cc.director.getPhysicsManager().enabled = true;
		manager.enabled = true;
		//	manager.enabledDebugDraw = true;


		this.createObjects(this.objectLayer);
		this.pointerItem.getComponent(cc.Sprite).spriteFrame = this.selectedItem.getComponent(cc.Sprite).spriteFrame;
		this.pointerItem.anchorX = this.selectedItem.anchorX;
		this.pointerItem.anchorY = this.selectedItem.anchorY;
		this.pointerItem.height = this.selectedItem.height;
		this.pointerItem.width = this.selectedItem.width;
		this.deltaY = 0;
	},
	selectItem(int x) {
		this.selectedItem.active = false;
		this.selectedItem = this.items[x];
		this.selectedItem.active = true;
		this.pointerItem.getComponent(cc.Sprite).spriteFrame = this.selectedItem.getComponent(cc.Sprite).spriteFrame;
		this.pointerItem.anchorX = this.selectedItem.anchorX;
		this.pointerItem.anchorY = this.selectedItem.anchorY;
		this.pointerItem.height = this.selectedItem.height;
		this.pointerItem.width = this.selectedItem.width;
	},
	getLayerWidth() {

		return this.tiledMapManager.tiledLayer.getMapTileSize().width;
	},
	getLayerHeight() {
		return this.tiledMapManager.tiledLayer.getMapTileSize().height;
	},
	addInvalidTile(pos) {
		if (!this.tiledMapManager.checkValidPos(pos)) { return; }
		//	//////////////////////console.log("add inavli" + pos);
		let tile = this.tiledMapManager.getMappedTile(pos);
		this.tiledMapManager._invalidTiles.push(tile);
		////////////////////////console.log("Added tile" + tile.x + "" + tile.y);
		////////////////////////console.log("length was" + this.tiledMapManager._invalidTiles.length);
		//////////////////////console.log("");
	},
	removeInvalidTile(pos) {
		//	//////////////////////console.log("check inValidTiledone " + pos);
		if (!this.tiledMapManager.checkValidPos(pos)) { return; }
		//	//////////////////////console.log("remov inavlid" + pos);
		let tile = this.tiledMapManager.getMappedTile(pos);
		if (tile) {

			for (let k = 0; k < this.tiledMapManager._invalidTiles.length; k++) {
				if (this.tiledMapManager._invalidTiles[k] == tile) {
					//	//////////////////////console.log("removed");
					this.tiledMapManager._invalidTiles.splice(k, 1);
					break;
				}
			}
		}
		//	//////////////////////console.log("length now" + this.tiledMapManager._invalidTiles.length);
		//////////////////////console.log("");
	},




	onKeyUp: function(event) {

	},
	createObjects(layer) {
		this.objects = layer.getObjects();
		let i = 0;
		if (this.objects) {
			this.objects.forEach(element => {
				//////////////////////console.log("Object Layer properties" + JSON.stringify(element));

			});
		}
	},
	getValidTiles(position) {
		////////////console.log("getvalid tiles" + position);
		let row = this.selectedItem.getComponent("Item").x;
		let col = this.selectedItem.getComponent("Item").y;
		let validCount = row * col;
		////////console.log("need" + validCount);
		let tw = this.tiledMapManager.tiledLayer.getMapTileSize().width;
		let th = this.tiledMapManager.tiledLayer.getMapTileSize().height;
		//////console.log(tw + "," + th);
		let validTiles = [];
		let currentPos = cc.v2(position.x, position.y);
		if (this.tiledMapManager.checkValidPos(currentPos) && this.tiledMapManager.checkValidWalkablePos(currentPos)) {
			//	//////////////////console.log("isWalkable2" + newpos);
			let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, currentPos);

			let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(mappedPosition.x, mappedPosition.y, true);
			let tileNode = tile.node;
			if (validTiles.indexOf(tile) < 0)
				validTiles.push(tile);

		}
		let tilePos = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, currentPos);
		let exactPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(this.tiledMapManager.tiledLayer.getPositionAt(mappedPosition.x, mappedPosition.y))

		//	let tempPos = cc.v2(exactPos.x + this.offset.x, exactPos.y - (col - 1) * th + this.offset.y);

		let tempPos = cc.v2(exactPos.x + (col - 1) * tw + this.offset.x, exactPos.y + this.offset.y);

		////////console.log("check" + tempPos);
		if (this.tiledMapManager.checkValidPos(tempPos) && this.tiledMapManager.checkValidWalkablePos(tempPos)) {

			let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, tempPos);

			let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(mappedPosition.x, mappedPosition.y, true);
			let tileNode = tile.node;
			if (validTiles.indexOf(tile) < 0)
				validTiles.push(tile);
			////////console.log("valid" + tempPos);

		}
		////////console.log("currentPos" + currentPos);
		for (let i = 0; i < row; i++) {

			let tempPos = cc.v2(exactPos.x + i * tw / 2 + this.offset.x, exactPos.y + i * th / 2 + this.offset.y);
			////////console.log("check" + tempPos);
			if (this.tiledMapManager.checkValidPos(tempPos) && this.tiledMapManager.checkValidWalkablePos(tempPos)) {

				let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, tempPos);

				let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(mappedPosition.x, mappedPosition.y, true);
				let tileNode = tile.node;
				if (validTiles.indexOf(tile) < 0)
					validTiles.push(tile);
				////////console.log("valid" + tempPos);
			} else {
				////////console.log("invalid" + tempPos);
			}

		}
		for (let i = 0; i < col; i++) {

			let tempPos = cc.v2(exactPos.x + i * tw / 2 + this.offset.x, exactPos.y - i * th / 2 + this.offset.y);
			////////console.log("check" + tempPos);
			if (this.tiledMapManager.checkValidPos(tempPos) && this.tiledMapManager.checkValidWalkablePos(tempPos)) {

				let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, tempPos);

				let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(mappedPosition.x, mappedPosition.y, true);
				let tileNode = tile.node;
				if (validTiles.indexOf(tile) < 0)
					validTiles.push(tile);
				////////console.log("valid" + tempPos);
			} else {
				////////console.log("invalid" + tempPos);
			}

		}
		/*	for (let i = 0; i < row; i++) {
				//	for (let j = 0; j < col; j++) {

				let tempPos = cc.v2(exactPos.x + i * tw + this.offset.x, exactPos.y + this.offset.y);
				////////console.log("check" + tempPos);
				if (this.tiledMapManager.checkValidPos(tempPos) && this.tiledMapManager.checkValidWalkablePos(tempPos)) {

					let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, tempPos);

					let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(mappedPosition.x, mappedPosition.y, true);
					let tileNode = tile.node;
					if (validTiles.indexOf(tile) < 0)
						validTiles.push(tile);
					////////console.log("valid" + tempPos);
				} else {
					////////console.log("invalid" + tempPos);
				}

				//}

			}*/
		for (let i = 1; i < row; i++) {
			for (let j = 1; j < col - 1; j++) {

				let tempPos = cc.v2(exactPos.x + i * tw / 2 + this.offset.x, exactPos.y + this.offset.y);
				////////console.log("check" + tempPos);
				if (this.tiledMapManager.checkValidPos(tempPos) && this.tiledMapManager.checkValidWalkablePos(tempPos)) {

					let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, tempPos);

					let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(mappedPosition.x, mappedPosition.y, true);
					let tileNode = tile.node;
					if (validTiles.indexOf(tile) < 0)
						validTiles.push(tile);


					////////console.log("valid" + tempPos);
				} else {
					////////console.log("invalid" + tempPos);
				}
				tempPos = cc.v2(exactPos.x + tw + i * tw / 2 + this.offset.x, exactPos.y + j * th / 2 + this.offset.y);
				////////console.log("check" + tempPos);
				if (this.tiledMapManager.checkValidPos(tempPos) && this.tiledMapManager.checkValidWalkablePos(tempPos)) {

					let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, tempPos);

					let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(mappedPosition.x, mappedPosition.y, true);
					let tileNode = tile.node;
					if (validTiles.indexOf(tile) < 0)
						validTiles.push(tile);


					////////console.log("valid" + tempPos);
				} else {
					////////console.log("invalid" + tempPos);
				}
				tempPos = cc.v2(exactPos.x + tw + i * tw / 2 + this.offset.x, exactPos.y - j * th / 4 + this.offset.y);
				////////console.log("check" + tempPos);
				if (this.tiledMapManager.checkValidPos(tempPos) && this.tiledMapManager.checkValidWalkablePos(tempPos)) {

					let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, tempPos);

					let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(mappedPosition.x, mappedPosition.y, true);
					let tileNode = tile.node;
					if (validTiles.indexOf(tile) < 0)
						validTiles.push(tile);


					////////console.log("valid" + tempPos);
				} else {
					////////console.log("invalid" + tempPos);
				}
			}

		}
		return validTiles;

	},
	checkValidMovePos(touchPos) {
		let row = this.selectedItem.getComponent("Item").x;
		let col = this.selectedItem.getComponent("Item").y;
		let validCount = row * col;
		let validTiles = this.getValidTiles(touchPos);
		//console.log(validCount + "got" + validTiles.length);
		if (validCount != validTiles.length)
			return;

		let index = this.items.indexOf(this.selectedItem);
		let data = {
			"index": index,
			"touchPos": touchPos
		}
		this.networkManager.sendTeamEvent("request", data);
	},
	createItem(index, touchPos) {
		this.selectedItem = this.items[index];
		let newItem = cc.instantiate(this.selectedItem);
		newItem.parent = this.selectedItem.parent;
		let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, touchPos);
		let exactPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(this.tiledMapManager.tiledLayer.getPositionAt(mappedPosition.x, mappedPosition.y))
		newItem.setPosition(cc.v2(exactPos.x + this.offset.x, exactPos.y + this.offset.y));
		newItem.opacity = 255;
		validTiles.forEach(element => {
			this.tiledMapManager._invalidTiles.push(element);
		});
	},
	HoverEvent(event) {

		//////////////console.log("click");
		if (!this.selectedItem) {
			return;
		}
		////////////console.log("moving");
		let map = this.tiledMapManager.node.getComponent(cc.TiledMap);
		let rows = map.getMapSize().height;
		let cols = map.getMapSize().width;

		let touch = event.getLocation();
		// Offset touch position cos we are offsetting camera
		touch.x += this.camNode.position.x;
		touch.y += this.camNode.position.y;
		//console.log(touch + " " + this.camNode.position);
		let touchPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(touch);
		////////////console.log("touch " + this.tiledMapManager.checkValidPos(touchPos));
		if (!this.tiledMapManager.checkValidPos(touchPos))
			return;,
		if (this.tiledMapManager.checkValidWalkablePos(touchPos)) {
			////////////console.log("valid " + touchPos);
		} else {
			////////////console.log("invalid " + touchPos);
		}
		//
		let newpos = touchPos;
		if (this.tiledMapManager.checkValidWalkablePos(newpos)) {
			////////////console.log("touchpos" + touchPos);
			////////////console.log("getvalid tiles" + newpos);
			let tiles = this.getValidTiles(newpos);
			////////console.log("got tiles" + tiles.length);
			if (this.currentTiles) {
				this.currentTiles.forEach(element => {
					let tileNode = element.node;
					let exactPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(this.tiledMapManager.tiledLayer.getPositionAt(newpos.x, newpos.y))
					let sprite = tileNode.getComponent(cc.Sprite);

					tileNode.color = cc.Color.WHITE;
				});
			}
			this.currentTiles = tiles;
			tiles.forEach(element => {
				let tileNode = element.node;
				let exactPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(this.tiledMapManager.tiledLayer.getPositionAt(newpos.x, newpos.y))
				this.pointerItem.setPosition(cc.v2(exactPos.x + this.offset.x, exactPos.y + this.offset.y));

				let sprite = tileNode.addComponent(cc.Sprite);

				//////console.log(element.x + "," + element.y + "pos" + cc.v2(newpos.x, newpos.y));
				//	sprite.spriteFrame = this.selectedItem.getComponent(cc.Sprite).spriteFrame;
				tileNode.color = cc.Color.YELLOW;
				this.node.runAction(cc.sequence(
					cc.delayTime(0.5),
					cc.callFunc(() => {
						tileNode.color = cc.Color.WHITE;
					})
				));
			});


			let mappedPosition = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, touchPos);
			let exactPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(this.tiledMapManager.tiledLayer.getPositionAt(mappedPosition.x, mappedPosition.y))
			//	this.selectedItem.setPosition(cc.v2(exactPos.x + this.offset.x, exactPos.y + this.offset.y));
			//	sprite.spriteFrame = this.pointerItem.getComponent(cc.Sprite).spriteFrame;
			this.pointerItem.setPosition(cc.v2(exactPos.x + this.offset.x, exactPos.y + this.offset.y));
			this.selectItem.opacity = 50;

		}
	},


	HandleClickEvent(event) {

		//////////////console.log("click");
		if (!this.selectedItem) {
			return;
		}

		let map = this.tiledMapManager.node.getComponent(cc.TiledMap);
		let rows = map.getMapSize().height;
		let cols = map.getMapSize().width;

		let touch = event.getLocation();
		// Offset touch position cos we are offsetting camera
		touch.x += this.camNode.position.x;
		touch.y += this.camNode.position.y;
		let touchPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(touch);

		if (!this.tiledMapManager.checkValidPos(touchPos))
			return;,
		if (this.tiledMapManager.checkValidWalkablePos(touchPos)) {
			this.checkValidMovePos(touchPos)
		}
		//	this.selectedItem.parent = this.tiledMapManager.tiledLayer.node;
		//	this.checkValidMovePos(touchPos);

	},
	moveAll(x) {


		this.HoverEvent(x);
	},
	lateUpdate(dt) {

	},
	moveY(y) {

		this.deltaY = y.getScrollY();
		this.camNode.setPosition(this.camNode.getPosition().x, this.camNode.getPosition().y + this.deltaY / 10);

	},

	moveX(x) {
		this.HoverEvent(x);
		if (!this.deltaX)
			this.deltaX = x.getLocationX();
		let mag = x.getLocationX() - this.deltaX;
		//////////////////////console.log(x.getLocationX() + ":" + mag);
		mag = mag + Math.sign(mag) * 1;
		this.camNode.setPosition(this.camNode.getPosition().x + mag, this.camNode.getPosition().y);
		this.deltaX = x.getLocationX();
	},



});
