

const TiledMapManager = require('./TileMapManager');

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
		tiledMapManager: {
			type: TiledMapManager,
			default: null
		},
		selectedItem: {
			type: cc.Node,
			default: null
		}
	},
	getLayerWidth() {

		return this.tiledMapManager.tiledLayer.getMapTileSize().width;
	},
	getLayerHeight() {
		return this.tiledMapManager.tiledLayer.getMapTileSize().height;
	},
	addInvalidTile(pos) {
		if (!this.tiledMapManager.checkValidPos(pos)) { return; }
		//	////////console.log("add inavli" + pos);
		let tile = this.tiledMapManager.getMappedTile(pos);
		this.tiledMapManager._invalidTiles.push(tile);
		//////////console.log("Added tile" + tile.x + "" + tile.y);
		//////////console.log("length was" + this.tiledMapManager._invalidTiles.length);
		////////console.log("");
	},
	removeInvalidTile(pos) {
		//	////////console.log("check inValidTiledone " + pos);
		if (!this.tiledMapManager.checkValidPos(pos)) { return; }
		//	////////console.log("remov inavlid" + pos);
		let tile = this.tiledMapManager.getMappedTile(pos);
		if (tile) {

			for (let k = 0; k < this.tiledMapManager._invalidTiles.length; k++) {
				if (this.tiledMapManager._invalidTiles[k] == tile) {
					//	////////console.log("removed");
					this.tiledMapManager._invalidTiles.splice(k, 1);
					break;
				}
			}
		}
		//	////////console.log("length now" + this.tiledMapManager._invalidTiles.length);
		////////console.log("");
	},




	onKeyUp: function(event) {

	},
	createObjects(layer) {
		this.objects = layer.getObjects();
		let i = 0;
		if (this.objects) {
			this.objects.forEach(element => {
				////////console.log("Object Layer properties" + JSON.stringify(element));

			});
		}
	},
	checkValidMovePos(touchPos) {
		////////console.log("got" + touchPos);

		let row = this.selectedItem.getComponent("Item").x;
		let col = this.selectedItem.getComponent("Item").y;

		let tw = this.tiledMapManager.tiledLayer.getMapTileSize().width;
		let th = this.tiledMapManager.tiledLayer.getMapTileSize().height;
		let newpos = touchPos;
		////////console.log(row + "," + col + "hw" + tw + "," + th);
		let valid = true;
		let tilesToBook = [];
		let newpos2 = cc.v2(newpos.x, newpos.y);
		if (this.tiledMapManager.checkValidPos(newpos2) && this.tiledMapManager.checkValidWalkablePos(newpos2)) {
			//	////console.log("isWalkable2" + newpos);
			let pos = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, newpos2);

			let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(pos.x, pos.y, true);
			let tileNode = tile.node;
			tilesToBook.push(tile);

		}
		if (this.tiledMapManager.checkValidWalkablePos(touchPos)) {
			for (i = 1; i < row; i++) {
				newpos2 = cc.v2(newpos.x - row * tw, newpos.y);
				if (this.tiledMapManager.checkValidPos(newpos2) && this.tiledMapManager.checkValidWalkablePos(newpos2)) {
					//	////console.log("isWalkable2" + newpos);
					let pos = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, newpos2);

					let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(pos.x, pos.y, true);
					let tileNode = tile.node;
					tilesToBook.push(tile);

				} else {
					////console.log("not isWalkable3" + newpos);
					valid = false;
				}
			}
			for (i = 1; i < col; i++) {
				newpos2 = cc.v2(newpos.x, newpos.y - col * th);
				if (this.tiledMapManager.checkValidPos(newpos2) && this.tiledMapManager.checkValidWalkablePos(newpos2)) {
					//	////console.log("isWalkable" + newpos);
					let pos = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, newpos2);

					let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(pos.x, pos.y, true);
					let tileNode = tile.node;

					tilesToBook.push(tile);

				} else {
					////console.log("not isWalkable2" + newpos);
					valid = false;
				}
			}

			if (valid == false)
				return;
			let newItem = cc.instantiate(this.selectedItem);
			newItem.parent = this.selectedItem.parent;
			newpos = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, touchPos);
			let exactPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(this.tiledMapManager.tiledLayer.getPositionAt(newpos.x, newpos.y))
			this.selectedItem.setPosition(cc.v2(exactPos.x + 170, exactPos.y + 192));

			//	this.selectedItem.setPosition(touchPos);
			tilesToBook.forEach(element => {
				this.tiledMapManager._invalidTiles.push(element);
			});

		}
	},
	HoverEvent(event) {
		//	//////console.log("moving");

		let map = this.tiledMapManager.node.getComponent(cc.TiledMap);
		let rows = map.getMapSize().height;
		let cols = map.getMapSize().width;

		let touch = event.getLocation();
		//	let touches = event.getTouches();
		//	let touch = touches[0].getLocation();
		// Offset touch position cos we are offsetting camera

		touch.x += this.camNode.position.x;
		touch.y += this.camNode.position.y;
		let touchPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(touch);
		//console.log("touchpos" + touchPos);
		//	this.selectedItem.setPosition(cc.v2(touchPos.x - 5, touchPos.y + 5));
		let newpos = touchPos;

		if (this.tiledMapManager.checkValidWalkablePos(newpos)) {
			//////console.log("isWalkable" + newpos);
			newpos = this.tiledMapManager.GetMapPosition(this.tiledMapManager.tiledLayer, newpos);
			//console.log("newpos" + newpos);
			let tile = this.tiledMapManager.tiledLayer.getTiledTileAt(newpos.x, newpos.y, true);
			let tileNode = tile.node;
			let exactPos = this.tiledMapManager.tiledLayer.node.convertToNodeSpaceAR(this.tiledMapManager.tiledLayer.getPositionAt(newpos.x, newpos.y))
			this.selectedItem.setPosition(cc.v2(exactPos.x + 100, exactPos.y + 170));

			let sprite = tileNode.addComponent(cc.Sprite);
			//	sprite.spriteFrame = this.selectedItem.getComponent(cc.Sprite).spriteFrame;
			tileNode.color = cc.Color.YELLOW;
			this.node.runAction(cc.sequence(
				cc.delayTime(0.5),
				cc.callFunc(() => {
					tileNode.color = cc.Color.WHITE;
				})
			));
		}
	},

	HandleClickEvent(event) {

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
	onLoad() {
		let self = this.node;
		this.touchNode.on(cc.Node.EventType.TOUCH_START, this.HandleClickEvent, this);
		this.touchNode.on(cc.Node.EventType.MOUSE_DOWN, this.HandleClickEvent, this);
		this.touchNode.on(cc.Node.EventType.MOUSE_WHEEL, this.moveY, this, true);
		this.touchNode.on(cc.Node.EventType.MOUSE_MOVE, this.moveX, this, true);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
		exports.instance = this;
		let manager = cc.director.getCollisionManager();
		cc.director.getPhysicsManager().enabled = true;
		manager.enabled = true;
		//	manager.enabledDebugDraw = true;


		this.createObjects(this.objectLayer);


		this.deltaY = 0;



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
		////////console.log(x.getLocationX() + ":" + mag);
		mag = mag + Math.sign(mag) * 1;
		this.camNode.setPosition(this.camNode.getPosition().x + mag, this.camNode.getPosition().y);
		this.deltaX = x.getLocationX();
	},



});
