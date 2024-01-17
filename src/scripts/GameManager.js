class GameManager {
    constructor(oScene) {
        this.oScene = oScene;
        this.nInitialBalls = 1;
        this.nBallSpeed = 35;
        this.nShapeInitialCount = 1;
        this.nLaunchDelay = 500;
        this.nShapeCountIncreaseBy = 1;
        this.nShapeCountDecreaseBy = 1;
    }
}