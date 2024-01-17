
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

		// container_balls
		const container_balls = this.add.container(0, -1);

		// container_shapes
		const container_shapes = this.add.container(0, 0);

		// container_shape_texts
		const container_shape_texts = this.add.container(0, 0);

		// container_header
		const container_header = this.add.container(0, 0);

		// top_bar
		const top_bar = this.add.image(540, 1, "top-bar");
		top_bar.scaleX = 1.85;
		top_bar.scaleY = 1.85;
		top_bar.setOrigin(0.5, 0);
		container_header.add(top_bar);

		// arrow
		const arrow = this.add.image(540, 211, "arrow");
		arrow.setOrigin(0.5, 0);
		container_header.add(arrow);

		// fixed_ball
		const fixed_ball = this.add.image(540, 211, "fixed-ball");
		fixed_ball.scaleX = 1.85;
		fixed_ball.scaleY = 1.85;
		container_header.add(fixed_ball);

		// txt_count_balls
		const txt_count_balls = this.add.text(492, 184, "", {});
		txt_count_balls.setOrigin(1, 0.5);
		txt_count_balls.text = "4x";
		txt_count_balls.setStyle({ "align": "right", "fontFamily": "Square", "fontSize": "44px" });
		container_header.add(txt_count_balls);

		// txt_score
		const txt_score = this.add.text(540, 62, "", {});
		txt_score.setOrigin(0.5, 0.5);
		txt_score.text = "SCORE: 00";
		txt_score.setStyle({ "align": "center", "fontFamily": "Square", "fontSize": "74px" });
		container_header.add(txt_score);

		// txt_bestscore
		const txt_bestscore = this.add.text(1063, 184, "", {});
		txt_bestscore.setOrigin(1, 0.5);
		txt_bestscore.text = "BEST: 00";
		txt_bestscore.setStyle({ "align": "right", "fontFamily": "Square", "fontSize": "46px" });
		container_header.add(txt_bestscore);

		this.container_balls = container_balls;
		this.container_shapes = container_shapes;
		this.container_shape_texts = container_shape_texts;
		this.arrow = arrow;
		this.fixed_ball = fixed_ball;
		this.txt_count_balls = txt_count_balls;
		this.txt_score = txt_score;
		this.txt_bestscore = txt_bestscore;

		this.events.emit("scene-awake");
	}

	/** @type {Phaser.GameObjects.Container} */
	container_balls;
	/** @type {Phaser.GameObjects.Container} */
	container_shapes;
	/** @type {Phaser.GameObjects.Container} */
	container_shape_texts;
	/** @type {Phaser.GameObjects.Image} */
	arrow;
	/** @type {Phaser.GameObjects.Image} */
	fixed_ball;
	/** @type {Phaser.GameObjects.Text} */
	txt_count_balls;
	/** @type {Phaser.GameObjects.Text} */
	txt_score;
	/** @type {Phaser.GameObjects.Text} */
	txt_bestscore;

	/* START-USER-CODE */

	// Write more your code here
	setBallCount = count => {
		this.txt_count_balls.setText((count != null ? count : this.nBalls) + 'x');
	}
	createShape = ({ type, x, y, texture, fontColor }) => {
		const initialNumber = this.oGameManager.nShapeInitialCount;
		let shape;
		let tween
		if (type === 'circle') {
			shape = this.matter.add.image(x, y, texture);
			shape.setCircle(51);
			tween = this.tweens.add({
				targets: shape,
				scaleX: 2.2,
				scaleY: 2.2,
				yoyo: true,
				repeat: -1
			})
		} else if (type === 'square') {
			shape = this.matter.add.image(x, y, texture);
			shape.setRectangle(102, 102);
			tween = this.tweens.add({
				targets: shape,
				duration: Phaser.Math.Between(9500, 10000),
				angle: Math.random() > 0.5 ? 360 : -360,
				repeat: -1
			})
		} else if (type === 'triangle') {
			shape = this.matter.add.image(x, y, texture);
			const vertices = Phaser.Physics.Matter.Matter.Vertices.fromPath("0 -51 51 51 -51 51");
			shape.setBody({ type: 'fromVertices', vertices: vertices });
		}

		const blockText = this.add.text(0, 0, initialNumber.toString(), { fontSize: '94px', fontFamily: 'Square', fill: fontColor });
		blockText.setOrigin(0.5);
		blockText.setPosition(shape.x, shape.y);
		this.container_shape_texts.add(blockText);
		shape.setData('text', blockText);
		shape.setData('tween', tween);

		shape.body.label = 'shape'
		shape.setStatic(true);
		shape.setScale(1.85);
		this.container_shapes.add(shape);
		return shape;
	}
	setGameOver = () => {
		console.log("first")
		localStorage.setItem("ToopsStrikeScore", Math.max(this.nScore, this.nBestScore));
		this.scene.restart('Level');
	}
	updateScore = () => {
		this.nScore++;
		const formattedScore = this.nScore < 10 ? '0' + this.nScore : this.nScore;
		this.txt_score.setText("SCORE: " + formattedScore);
	}
	create() {

		this.editorCreate();

		this.oGameManager = new GameManager(this);
		this.nBalls = this.oGameManager.nInitialBalls;
		this.nScore = 0;
		this.isBallFinished = true;
		this.nBestScore = localStorage.getItem('ToopsStrikeScore') == null ? 0 : Math.max(localStorage.getItem('ToopsStrikeScore'), 0);
		const formattedHighScore = this.nBestScore < 10 ? '0' + this.nBestScore : this.nBestScore;
		this.txt_bestscore.setText("BEST: " + formattedHighScore);

		this.pointerLocation = new Phaser.Math.Vector2();

		this.setBallCount(this.nBalls);
		this.createStaticShapes();

		this.input.on('pointerdown', this.onPointerDown, this);
		this.input.on('pointerup', this.onPointerUp, this);
		this.input.on('pointermove', this.onPointerMove, this);

		this.matter.world.setBounds(0, 211, this.game.config.width, this.game.config.height - 211);
		this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
			if (bodyA.label === 'shape' && bodyB.label === 'ball') {
				this.handleShapeCollision(bodyA.gameObject);
			} else if (bodyB.label === 'shape' && bodyA.label === 'ball') {
				this.handleShapeCollision(bodyB.gameObject);
			}
			if ((bodyA.label === 'ball' && bodyB === this.matter.world.walls.bottom) ||
				(bodyB.label === 'ball' && bodyA === this.matter.world.walls.bottom)) {
				this.destroyBall(bodyA.label === 'ball' ? bodyA.gameObject : bodyB.gameObject);
			}
		});
	}
	getRandomShapeConfig = () => {
		const shapeTypes = ['circle', 'square'];
		const numConfigs = Phaser.Math.Between(1, 2);
		const fontColors = ["#78e777", "#e4d13a", "#de5a4e", "#df5ee3", "#e1a72f"];
		const configs = [];
		const randomY = Phaser.Math.Between(1750, 1800);
		let randomX = Phaser.Math.Between(203, 877);
		let textureIndex = Phaser.Math.Between(0, 4);
		let fontColor = fontColors[textureIndex];
		let shape = shapeTypes[Phaser.Math.Between(0, shapeTypes.length - 1)];
		let texture = `${shape}_${textureIndex}_0`;
		configs.push({
			type: shape,
			x: randomX,
			y: randomY,
			texture: texture,
			fontColor: fontColor,
		});
		if (numConfigs === 2) {
			(randomX <= 540) ? randomX = Phaser.Math.Between(796, 877) : randomX = Phaser.Math.Between(203, 284);
			textureIndex = Phaser.Math.Between(0, 4);
			fontColor = fontColors[textureIndex];
			shape = shapeTypes[Phaser.Math.Between(0, shapeTypes.length - 1)];
			texture = `${shape}_${textureIndex}_0`;
			configs.push({
				type: shape,
				x: randomX,
				y: randomY,
				texture: texture,
				fontColor: fontColor,
			});
		}
		return configs;
		// const shapeTypes = ['circle', 'square'];
		// const shape = shapeTypes[Phaser.Math.Between(0, shapeTypes.length - 1)];
		// const randomX = Phaser.Math.Between(135, 948);
		// const randomY = Phaser.Math.Between(1750, 1800);
		// const textureIndex = Phaser.Math.Between(0, 4);
		// const texture = `${shape}_${textureIndex}_0`;
		// return {
		// 	shape: shape,
		// 	x: randomX,
		// 	y: randomY,
		// 	texture: texture
		// };
	}
	createStaticShapes = () => {
		const configs = this.getRandomShapeConfig();
		configs.forEach(config => this.createShape(config))
	}
	handleShapeCollision = shape => {
		if (shape.getData('text')) {
			const oldTextture = shape.texture.key;
			const texture = oldTextture.split('_');
			const newTexture = texture[0] + '_' + texture[1] + '_' + (parseInt(texture[2]) + 1);
			// shape.setTexture(newTexture);
			const text = shape.getData('text');
			const tween = shape.getData('tween');
			let number = parseInt(text.text);
			number -= this.oGameManager.nShapeCountDecreaseBy;
			if (number <= 0) {
				tween.destroy();
				text.destroy();
				shape.destroy();
				this.updateScore();
			} else {
				text.setText(number.toString());
			}
		}
	}
	destroyBall = ball => {
		ball.destroy();
		this.countBallsAndMoveShapes();
	}
	countBallsAndMoveShapes = () => {
		const count = this.container_balls.getAll().length;
		if (count === 0) {
			this.container_shapes.getAll().forEach(shape => {
				const text = shape.getData('text');
				this.tweens.add({
					targets: [text, shape],
					y: shape.y - 286,
					duration: 200,
					onComplete: () => {
						if (shape.y <= 305) {
							setTimeout(() => {
								this.setGameOver();
								return;
							}, 150);
						}
					}
				})
			});
			setTimeout(() => {
				this.oGameManager.nShapeInitialCount++;
				this.setBallCount(this.nBalls);
				this.isBallFinished = true;
				this.createStaticShapes();
			}, 300);
		}
	}
	onPointerDown = (pointer) => {
		if (this.isBallFinished) {
			this.input.mouse.requestPointerLock();
			this.arrow.setVisible(true);
		}
	}
	onPointerUp = (pointer) => {
		if (this.isBallFinished) {
			this.isBallFinished = false;
			this.input.mouse.releasePointerLock();
			this.arrow.setVisible(false);
			this.pointerLocation.set(pointer.x, pointer.y);
			this.launchBalls();
		}
	}
	onPointerMove = (pointer) => {
		if (this.input.mouse.locked && this.arrow.visible) {
			this.arrow.rotation -= pointer.movementX * 0.008;
			this.arrow.rotation = Phaser.Math.Clamp(this.arrow.rotation, -Math.PI / 2.5, Math.PI / 2.5);
		} else if (pointer.isDown && this.arrow.visible) {
			this.updateArrowDirection(pointer);
		}
	}
	updateArrowDirection = (pointer) => {
		let angle = Phaser.Math.Angle.Between(
			this.arrow.x, this.arrow.y,
			pointer.x, pointer.y
		);
		angle -= Math.PI / 2;
		angle = Phaser.Math.Clamp(angle, -Math.PI / 2.5, Math.PI / 2.5);
		this.arrow.rotation = angle;
	}
	launchBalls = () => {
		for (let i = 0; i < this.nBalls; i++) {
			this.time.delayedCall(i * this.oGameManager.nLaunchDelay, () => this.launchBall(i), [], this);
		}
	}
	launchBall = (i) => {
		this.setBallCount(this.nBalls - (i + 1));
		const reducedSpeed = this.oGameManager.nBallSpeed;
		const ball = this.matter.add.image(this.fixed_ball.x, this.fixed_ball.y, 'ball', null, {
		});
		ball.setStatic(true);
		ball.setCircle(18);
		ball.setMass(5);
		ball.setScale(1.85);
		ball.setName('ball');
		ball.setBounce(0.8);
		ball.body.label = 'ball'

		const direction = new Phaser.Math.Vector2(Math.cos(this.arrow.rotation + Math.PI / 2), Math.sin(this.arrow.rotation + Math.PI / 2));
		const velocityX = reducedSpeed * direction.x;
		const velocityY = reducedSpeed * direction.y;
		ball.setVelocity(velocityX, velocityY);
		this.container_balls.add(ball);
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
