
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// bg
		this.add.image(540, 960, "bg");

		// top_bar
		const top_bar = this.add.image(540, 1, "top-bar");
		top_bar.scaleX = 1.85;
		top_bar.scaleY = 1.85;
		top_bar.setOrigin(0.5, 0);

		// arrow
		const arrow = this.add.image(540, 211, "arrow");
		arrow.setOrigin(0.5, 0);

		// fixed_ball
		const fixed_ball = this.add.image(540, 211, "fixed-ball");
		fixed_ball.scaleX = 1.85;
		fixed_ball.scaleY = 1.85;

		// txt_count_balls
		const txt_count_balls = this.add.text(494, 196, "", {});
		txt_count_balls.setOrigin(1, 0.5);
		txt_count_balls.text = "4x";
		txt_count_balls.setStyle({ "align": "right", "fontFamily": "Square", "fontSize": "36px" });

		// container_balls
		const container_balls = this.add.container(0, 0);

		this.arrow = arrow;
		this.fixed_ball = fixed_ball;
		this.txt_count_balls = txt_count_balls;
		this.container_balls = container_balls;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Image} */
	arrow;
	/** @type {Phaser.GameObjects.Image} */
	fixed_ball;
	/** @type {Phaser.GameObjects.Text} */
	txt_count_balls;
	/** @type {Phaser.GameObjects.Container} */
	container_balls;

	/* START-USER-CODE */

	// Write more your code here
	setBallCount = count => {
		this.txt_count_balls.setText((count ? count : this.nBalls) + 'x');
	}
	create() {

		this.editorCreate();
		this.oGameManager = new GameManager(this);
		this.nBalls = this.oGameManager.nInitialBalls;
		this.setBallCount(this.nBalls);
		this.ballsGroup = this.add.group();
		this.pointerLocation = new Phaser.Math.Vector2();
		this.matter.world.setBounds();
		this.input.on('pointerdown', this.onPointerDown, this);
		this.input.on('pointerup', this.onPointerUp, this);
		this.input.on('pointermove', this.onPointerMove, this);

	}
	onPointerDown(pointer) {
		this.arrow.setVisible(true);
	}

	onPointerUp(pointer) {
		this.arrow.setVisible(false);
		this.pointerLocation.set(pointer.x, pointer.y);
		this.launchBalls();
	}
	onPointerMove(pointer) {
		if (pointer.isDown) {
			this.updateArrowDirection(pointer);
		}
	}
	updateArrowDirection(pointer) {
		let angle = Phaser.Math.Angle.Between(
			this.arrow.x, this.arrow.y,
			pointer.x, pointer.y
		);
		angle -= Math.PI / 2;
		angle = Phaser.Math.Clamp(angle, -Math.PI / 2.5, Math.PI / 2.5);
		this.arrow.rotation = angle;
	}
	launchBalls() {
		for (let i = 0; i < this.nBalls; i++) {
			this.time.delayedCall(i * 100, this.launchBall, [], this);
		}
	}
	launchBall() {
		const reducedSpeed = 30;
		const ball = this.matter.add.image(this.fixed_ball.x, this.fixed_ball.y, 'ball');
		ball.setCollidesWith(this.matter.world.walls);
		ball.setBounce(1);
		ball.setCircle(18);
		ball.setFriction(0);
		ball.setFrictionAir(0);

		const direction = this.pointerLocation.clone().subtract(new Phaser.Math.Vector2(this.fixed_ball.x, this.fixed_ball.y)).normalize();
		const velocityX = reducedSpeed * direction.x;
		const velocityY = reducedSpeed * direction.y;
		ball.setVelocity(velocityX, velocityY);
		// Assign ball to its collision category
		ball.setCollisionCategory(this.ballCategory);
		ball.setCollidesWith([this.prefabCategory]);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
