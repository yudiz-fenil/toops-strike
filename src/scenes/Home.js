
// You can write more code here

/* START OF COMPILED CODE */

class Home extends Phaser.Scene {

	constructor() {
		super("Home");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// bg
		this.add.image(540, 960, "bg");

		// btn_play
		const btn_play = this.add.image(540, 1476, "btn_play");
		btn_play.setInteractive(new Phaser.Geom.Rectangle(29, 31, 263.59729946047327, 57.2763229317018), Phaser.Geom.Rectangle.Contains);
		btn_play.scaleX = 1.85;
		btn_play.scaleY = 1.85;

		// logo
		const logo = this.add.image(556, 648, "logo");
		logo.scaleX = 1.85;
		logo.scaleY = 1.85;

		this.btn_play = btn_play;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	btn_play;

	/* START-USER-CODE */

	// Write your code here
	pointerOver = (btn, scale) => {
		this.input.setDefaultCursor('pointer');
		this.tweens.add({
			targets: btn,
			scaleX: scale + 0.04,
			scaleY: scale + 0.04,
			duration: 100
		})
	}
	pointerOut = (btn, scale) => {
		this.input.setDefaultCursor('default');
		this.tweens.add({
			targets: btn,
			scaleX: scale,
			scaleY: scale,
			duration: 100,
			onComplete: () => {
				btn.setScale(scale);
			}
		})
	}
	create() {

		this.editorCreate();
		this.btn_play.setInteractive()
			.on("pointerover", () => {
				this.pointerOver(this.btn_play, 1.85);
			}).on("pointerout", () => {
				this.pointerOut(this.btn_play, 1.85);
			}).on("pointerup", () => {
				this.scene.stop("Home");
				this.scene.start("Level");
			});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
