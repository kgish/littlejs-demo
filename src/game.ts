/*
    LittleJS Hello World Starter Game using TypeScript
*/

// popup errors if there are any (help diagnose issues on mobile devices)
//onerror = (...parameters)=> alert(parameters);

// game variables
let particleEmitter: ParticleEmitter;

// sound effects
const sound_click = new Sound([ .5, .5 ]);

// medals
const medal_example = new Medal(0, 'Example Medal', 'Welcome to LittleJS!');
medalsInit('Hello World');

// canvas
const canvas = document.getElementById('littlejs-canvas') as HTMLCanvasElement


///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    // create tile collision and visible tile layer
    initTileCollision(vec2(32, 16));
    const tileLayer = new TileLayer(vec2(), tileCollisionSize);
    const pos = vec2();

    // get level data from the tiles image
    const imageLevelDataRow = 1;
    mainContext.drawImage(canvas, 0, 0);
    for (pos.x = tileCollisionSize.x; pos.x--;)
        for (pos.y = tileCollisionSize.y; pos.y--;) {
            const data = mainContext.getImageData(pos.x, 16 * (imageLevelDataRow + 1) - pos.y - 1, 1, 1).data;
            if (data[0]) {
                setTileCollisionData(pos, 1);

                const tileIndex = 1;
                const direction = randInt(4);
                const mirror = !!randInt(2);
                const color = randColor();
                const data = new TileLayerData(tileIndex, direction, mirror, color);
                tileLayer.setData(pos, data);
            }
        }
    tileLayer.redraw();

    // move camera to center of collision
    cameraPos = tileCollisionSize.scale(.5);
    cameraScale = 32;

    // enable gravity
    gravity = -.01;

    // create particle emitter
    const center = tileCollisionSize.scale(.5).add(vec2(0, 9));
    particleEmitter = new ParticleEmitter(
        center, 0, 1, 0, 500, PI, // pos, angle, emitSize, emitTime, emitRate, emitCone
        0, 16,                            // tileIndex, tileSize
        new Color(1, 1, 1), new Color(0, 0, 0),   // colorStartA, colorStartB
        new Color(1, 1, 1, 0), new Color(0, 0, 0, 0), // colorEndA, colorEndB
        2, .2, .2, .1, .05,     // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
        .99, 1, 1, PI, .05,     // damping, angleDamping, gravityScale, particleCone, fadeRate,
        .5, true, true                // randomness, collide, additive, randomColorLinear, renderOrder
    );
    particleEmitter.elasticity = .3; // bounce when it collides
    particleEmitter.trailScale = 2;  // stretch in direction of motion
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
    if (mouseWasPressed(0)) {
        // play sound when mouse is pressed
        sound_click.play(mousePos);

        // change particle color and set to fade out
        particleEmitter.colorStartA = new Color;
        particleEmitter.colorStartB = randColor();
        particleEmitter.colorEndA = particleEmitter.colorStartA.scale(1, 0);
        particleEmitter.colorEndB = particleEmitter.colorStartB.scale(1, 0);

        // unlock medals
        medal_example.unlock();
    }

    // move particles to mouse location if on screen
    if (mousePosScreen.x)
        particleEmitter.pos = mousePos;
}

///////////////////////////////////////////////////////////////////////////////
// eslint-disable-next-line @typescript-eslint/no-empty-function
function gameUpdatePost() {

}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
    // draw a grey square in the background without using webgl
    drawRect(cameraPos, tileCollisionSize.add(vec2(5)), new Color(.2, .2, .2), 0, false);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
    // draw to overlay canvas for hud rendering
    drawTextScreen('Hello World', vec2(overlayCanvas.width / 2, 80), 80, new Color, 9);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'tiles.png');
