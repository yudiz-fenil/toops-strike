
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1080,
		height: 1920,
		type: Phaser.AUTO,
		backgroundColor: "#242424",
		parent: "game-division",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		audio: {
			disableWebAudio: false
		},
		dom: {
			createContainer: true
		},
		physics: {
			default: 'matter',
			matter: {
				gravity: {
					y: 2,
				},
				debug: false,
			}
		}
	});

	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Boot", Boot, true);
	// console.clear();
});

class Boot extends Phaser.Scene {

	preload() {

		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Preload");
	}
}