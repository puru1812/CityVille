cc.Class({
	extends: cc.Component,

	properties: {
		wholePart: {
			type: cc.Label,
		default:
			null
		},
		numerator: {
			type: cc.Label,
		default:
			null
		},
		denominator: {
			type: cc.Label,
		default:
			null
		},
		fractionLine: {
			type: cc.Node,
		default:
			null
		},
		fontSize: {
			type: cc.Integer,
		default:
			100
		}
	},

	onLoad() {},

	setValues(text, maxWidth = null) {
		if (!text) {
			this.wholePart.node.active = false;
			this.numerator.node.active = false;
			this.denominator.node.active = false;
			this.fractionLine.active = false;
			totalWidth = 100;
			return;
		}

		let totalWidth = null;
		let values = text.split(",");
		if (values.length === 1) {
			this.wholePart.node.active = true;
			this.numerator.node.active = false;
			this.denominator.node.active = false;
			this.fractionLine.active = false;
			this.wholePart.string = values[0];
			this.wholePart.fontSize = this.fontSize;
			this.wholePart.node.setPosition(0, 0);
			this.wholePart.horizontalAlign = cc.Label.HorizontalAlign.CENTER;

			totalWidth = Math.min(120, 45 * this.wholePart.string.length);
		} else if (values.length === 2) {
			this.wholePart.node.active = false;
			this.numerator.node.active = true;
			this.denominator.node.active = true;
			this.fractionLine.active = true;

			this.numerator.string = values[0];
			this.numerator.fontSize = this.fontSize;
			this.denominator.string = values[1];
			this.denominator.fontSize = this.fontSize;

			let fractionLineXscale = Math.min(1, 0.25 * Math.max(this.numerator.string.length, this.denominator.string.length));
			this.fractionLine.scaleX = fractionLineXscale;

			this.numerator.node.setPosition(0, 25);
			this.denominator.node.setPosition(0, -25);
			this.fractionLine.setPosition(0, 0);

			totalWidth = fractionLineXscale * 115;
		} else if (values.length === 3) {
			this.wholePart.node.active = true;
			this.numerator.node.active = true;
			this.denominator.node.active = true;
			this.fractionLine.active = true;

			this.numerator.string = values[0];
			this.numerator.fontSize = this.fontSize;
			this.denominator.string = values[1];
			this.denominator.fontSize = this.fontSize;
			this.wholePart.string = values[2];
			this.wholePart.fontSize = this.fontSize;

			let fractionLineXscale = Math.min(1, 0.25 * Math.max(this.numerator.string.length, this.denominator.string.length));
			this.fractionLine.scaleX = fractionLineXscale;

			this.wholePart.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;

			let fractionWidth = fractionLineXscale * 115;
			let fractionWholeWidth = Math.min(120, 45 * this.wholePart.string.length);
			this.numerator.node.setPosition(fractionWholeWidth / 2, 25);
			this.denominator.node.setPosition(fractionWholeWidth / 2, -25);
			this.fractionLine.setPosition(fractionWholeWidth / 2, 0);
			this.wholePart.node.setPosition(-60 - (fractionWidth - fractionWholeWidth) / 2, 0);

			totalWidth = fractionWidth + fractionWholeWidth;
		} else {
			this.wholePart.node.active = false;
			this.numerator.node.active = false;
			this.denominator.node.active = false;
			this.fractionLine.active = false;

			totalWidth = 100;
		}

		if (maxWidth !== null && totalWidth > maxWidth) {
			this.node.scale = maxWidth / totalWidth;
		}
	}
});
