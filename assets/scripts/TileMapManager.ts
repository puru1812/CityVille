



cc.Class({
	extends: cc.Component,

	properties: {
		canvasNode: {
			type: cc.Node,
			default: null
		},
		tiledMap: {
			type: cc.TiledMap,
			default: null
		},
		tiledLayer: {
			type: cc.TiledLayer,
			default: null
		},
		_invalidTiles: {
			default: []
		}
	},

	onLoad() {
		let self = this;
		this._mode = "walk";
		this._invalidTiles = [];

	},

	getMappedTile(pos) {

		let position = this.tiledLayer.node.convertToNodeSpaceAR(pos);
		pos = this.GetMapPosition(this.tiledLayer, pos);
		if (this.tiledLayer._isInvalidPosition(pos.x, pos.y)) {

			return null;
		}
		let tile = this.tiledLayer.getTiledTileAt(pos.x, pos.y, true);
		return tile;
	},

	checkValidPos(pos) {

		let position = this.tiledLayer.node.convertToNodeSpaceAR(pos);
		pos = this.GetMapPosition(this.tiledLayer, pos);
		if (this.tiledLayer._isInvalidPosition(pos.x, pos.y)) {

			return false;
		}
		let tile = this.tiledLayer.getTiledTileAt(pos.x, pos.y, true);
		let properties = this.tiledMap.getPropertiesForGID(tile.gid);
		if (properties) {
			if (properties["isWalkable"] == false) {
				return false;
			}
		} else {
			return false;
		}
		return true;
	},

	checkValidWalkablePos(pos) {

		let position = this.tiledLayer.node.convertToNodeSpaceAR(pos);
		pos = this.GetMapPosition(this.tiledLayer, pos);
		if (this.tiledLayer._isInvalidPosition(pos.x, pos.y)) {

			return false;
		}
		let tile = this.tiledLayer.getTiledTileAt(pos.x, pos.y, true);
		if (tile) {

			for (let k = 0; k < this._invalidTiles.length; k++) {
				if (this._invalidTiles[k] == tile) {

					return false;
					break;
				}
			}
		}



		let properties = this.tiledMap.getPropertiesForGID(tile.gid);
		if (properties) {
			if (properties["isWalkable"] == false) {
				return false;
			}
		} else {
			return false;
		}
		return true;
	},




	GetMapPosition(mapLayer: cc.TiledLayer, pos: cc.Vec2): cc.Vec2 {
		let tw = mapLayer.getMapTileSize().width;
		let th = mapLayer.getMapTileSize().height;
		let mw = mapLayer.getLayerSize().width;
		let mh = mapLayer.getLayerSize().height;

		let xRatio = pos.x / tw;
		let yRatio = pos.y / th;
		let halfW = mw / 2;

		let x = Math.floor(mh - yRatio + xRatio - halfW);
		let y = Math.floor(mh - yRatio - xRatio + halfW);
		return new cc.Vec2(x, y);
	},

	MapIndexToNodePosition(mapLayer: cc.TiledLayer, x: number, y: number, node: cc.Node): cc.Vec2 {
		// getPositionAt function somehow returns the position offset by 1 tile in y direction, so subtracting that offset.
		let positionInMapSpace = mapLayer.getPositionAt(x, y - 1);
		return positionInMapSpace;
	},

	GetWalkableMatrixMapFromLayer(mapLayer, rows, cols, walkableEdges) {

		let tilesArray = mapLayer.getTileSets();
		//console.log(tilesArray);
		let copy = tilesArray; // Copy all elements.

		let walkableMatrixMap = [];

		var properties = mapLayer.getProperties();
		mapLayer.width = rows;
		mapLayer.height = cols;

		for (let r = 0; r < rows; r++) {
			let row = [];
			for (let c = 0; c < cols; c++) {
				let pos = mapLayer._positionForIsoAt(r, c);

				let i = r * cols + c;

				if (i < copy.length) {
					//		////console.log("value" + JSON.stringify(this.tiledMap.getPropertiesForGID(copy[i])));
					let properties = this.tiledMap.getPropertiesForGID(copy[i]);
					if (properties) {
						if (properties["isWalkable"] == true) {
							let pos = this.MapIndexToNodePosition(mapLayer, r, c, this.node);

							let tile = this.getMappedTile(pos);
							if (tile) {
								let found = false;
								//////console.log("checking"+r+","+c);
								for (let k = 0; k < this._invalidTiles.length; k++) {
									if (this._invalidTiles[k].x == c && this._invalidTiles[k].y == r) {
										////console.log("found invalid" + r + "," + c);
										found = true;
										break;
									}
								}


								if (found) {
									//////console.log("this is invalid tile now" + pos);
									row.push(1);
								} else {

									row.push(0);
								}
							} else {
								//////console.log("no tile" + pos);
								row.push(0);
							}
						} else {
							row.push(1);
						}

					} else {
						row.push(1);
					}
				}
			}
			walkableMatrixMap.push(row);

		}
		return walkableMatrixMap;
	},

	/**
	 * Returns the resolved directional positions from path.
	 * eg: there is a straight path from cell a to cell d, it will return positions of a and d discarding the rest of the cell positions in between to avoid jagged motion.
	 * @param mapLayer
	 * @param path
	 * @constructor
	 */
	ResolveGridPathToPositions(mapLayer: cc.TiledLayer, path, character) {
		if (character == null) {
			return;
		}

		let resolvedPositions = [];

		// Adding first element out of the for loop cos we need access to previous element inside for loop,
		// If first element is added inside for loop, it can lead to Array Index OutOfBounds Exception.

		// Set default locations to that of 1st element
		let previousResolvedX = null;
		let previousResolvedY = null;

		// Dont add first element as we would never go to the location we are already atAdd rest of the elements
		for (let i = 1; i < path.length; i++) {
			let x = path[i][0];
			let y = path[i][1];

			// if both x and y are changed (direction has changed), register the previousCell's position.
			if (previousResolvedX != x && previousResolvedY != y) {
				previousResolvedX = path[i - 1][0];
				previousResolvedY = path[i - 1][1];
				let position = this.MapIndexToNodePosition(mapLayer, previousResolvedX, previousResolvedY, character.node);
				resolvedPositions.push(position);
			}

			// Add last element
			if (i == path.length - 1) {
				let position = this.MapIndexToNodePosition(mapLayer, path[i][0], path[i][1], character.node);
				resolvedPositions.push(position);
			}
		}

		return resolvedPositions;
	}
});
