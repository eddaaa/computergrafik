
// source for controls and collision detection:
// https://gist.github.com/ShaneBrumback/e4c328823b48c0ce7c06c3c8eed872f8#file-threejs-examples-first-person-shooter-game-starter-html


import { initRoom } from './room.js';
import { loadFurniture } from './furniture.js';
import { initStats, initTrackballControls } from './utils.js';
import { PointerLockControls } from './PointerLockControls.js';

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function main() {
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({ canvas, antialias: true });

    const stats = initStats();

    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(angleOfView, aspectRatio, nearPlane, farPlane);
    
    camera.position.set(0.75, 1, 0.5);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Kamera schaut in Richtung des Ursprungs

    var controls = new PointerLockControls( camera, document.body );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    initRoom(scene);
    loadFurniture(scene);

    // const color = 0xffffff;
    // const intensity = 0.4;
    // const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(0, 30, 30);
    // scene.add(light);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // const spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.position.set(-10, 20, -5);
    // spotLight.castShadow = true;
    // scene.add(spotLight);

    const clock = new THREE.Clock();
    
    // const controls = initTrackballControls(camera, gl.domElement);
    // controls.noRotate = false;

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {

        controls.lock();

    } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );


    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38: // up arrow
            case 87: // W key
                moveForward = true;
                break;
            case 37: // left arrow
            case 65: // A key
                moveLeft = true;
                break;
            case 40: // down arrow
            case 83: // S key
                moveBackward = true;
                break;
            case 39: // right arrow
            case 68: // D key
                moveRight = true;
                break;
        }
    };

    var onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38: // up arrow
            case 87: // W key
                moveForward = false;
                break;
            case 37: // left arrow
            case 65: // A key
                moveLeft = false;
                break;
            case 40: // down arrow
            case 83: // S key
                moveBackward = false;
                break;
            case 39: // right arrow
            case 68: // D key
                moveRight = false;
                break;
        }
    };
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // ?? var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // collision detection
    function checkCollision(position) {
        var gridSize = 20;
        var halfGridSize = gridSize / 2;
        var margin = 0.1;

        if (
            position.x < -halfGridSize + margin ||
            position.x > halfGridSize - margin ||
            position.z < -halfGridSize + margin ||
            position.z > halfGridSize - margin
        ) {
            return true; // collision detected
        }

        return false; // no collision
    }
    
    // control player and camera movement
    function move() {
        var delta = clock.getDelta(); // Berechnung der verstrichenen Zeit seit dem letzten Frame
        var moveDistance = 5 * delta; // 5 Einheiten pro Sekunde
    
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        direction.y = 0; // Bewegung nur parallel zum Boden
        direction.normalize();
    
        if (moveForward) {
            controls.moveForward();
            if (checkCollision(camera.position)) {
                controls.moveBackward();            }
        }
    
        if (moveBackward) {
            controls.moveBackward();
            if (checkCollision(camera.position)) {
                controls.moveForward();// Zurück zur vorherigen Position bewegen
            }
        }
    
        if (moveLeft) {
            camera.position.add(new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar(moveDistance));
            if (checkCollision(camera.position)) {
                camera.position.sub(new THREE.Vector3(-direction.z, 0, direction.x).multiplyScalar(moveDistance)); // Zurück zur vorherigen Position bewegen
            }
        }
    
        if (moveRight) {
            camera.position.add(new THREE.Vector3(direction.z, 0, -direction.x).multiplyScalar(moveDistance));
            if (checkCollision(camera.position)) {
                camera.position.sub(new THREE.Vector3(direction.z, 0, -direction.x).multiplyScalar(moveDistance)); // Zurück zur vorherigen Position bewegen
            }
        }
    }
    
    // Render-Schleife
    function draw(time){
        time *= 0.001;
        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        const delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        // move();
        // controls.update(); // TrackballControls aktualisieren

        stats.update();
        prevTime = time;
        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}   

function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}

main();
