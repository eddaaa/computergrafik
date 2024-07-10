
// source for checkCollision() function:
// https://gist.github.com/ShaneBrumback/e4c328823b48c0ce7c06c3c8eed872f8#file-threejs-examples-first-person-shooter-game-starter-html

// source for controls implementation:
// https://threejs.org/examples/misc_controls_pointerlock.html


import { initRoom } from './room.js';
import { loadFurniture } from './furniture.js';
import { initStats } from './utils.js';
import { PointerLockControls } from './PointerLockControls.js';

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function main() {
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

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

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.2;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    // directional light - parallel sun rays
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 32, 64);
    scene.add(directionalLight);

    // const spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.position.set(-10, 20, -5);
    // spotLight.castShadow = true;
    // scene.add(spotLight);
    
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {

        controls.lock();

    } );

    document.addEventListener('click', function () {

        if (controls.isLocked) {

            controls.unlock();

        }
        else {

            controls.lock();

        }
    });

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );

    scene.add( controls.getObject() );

    const onKeyDown = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Escape':
            case 'Esc':
                blocker.style.display = 'block';
                instructions.style.display = '';
                break;
        }
    };

    const onKeyUp = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // TODO: Raycaster needs to be added for collision detection with objects

    // var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    // collision detection
    function checkCollision(position) {

        var gridSize = 10; // needs to be updated if the room size changes
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
    
    // Render-Schleife
    function draw(time){
        
        if (resizeGLToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        time *= 0.001;
        const delta = ( time - prevTime ) / 1000;

        // raycaster.ray.origin.copy( controls.getObject().position );
        // raycaster.ray.origin.y -= 10;
        // const intersections = raycaster.intersectObjects( objects, false );
        // const onObject = intersections.length > 0;

        velocity.x -= velocity.x * 1000.0 * delta;
        velocity.z -= velocity.z * 1000.0 * delta;

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) {

            velocity.z -= direction.z * 20000000.0 * delta;
            const distance = - velocity.z * delta;
            controls.moveForward(distance);

            if (checkCollision(controls.getPosition())) {
                controls.moveForward(-distance)
            }    
        }

        if ( moveLeft || moveRight ) {

            velocity.x -= direction.x * 20000000.0 * delta;
            const distance = - velocity.x * delta;
            controls.moveRight(distance);

            if (checkCollision(controls.getPosition())) {
                controls.moveRight(-distance)
            }  
        }   

        stats.update();
        prevTime = time;
        renderer.render(scene, camera);
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

function resizeGLToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

main();
