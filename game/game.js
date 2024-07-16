
// source for checkCollision() function:
// https://gist.github.com/ShaneBrumback/e4c328823b48c0ce7c06c3c8eed872f8#file-threejs-examples-first-person-shooter-game-starter-html

// source for controls implementation:
// https://threejs.org/examples/misc_controls_pointerlock.html


import { initRoom } from './room.js';
import { loadFurniture, boundingBoxes, searchItems } from './furniture.js';
import { initStats } from './utils.js';
import { PointerLockControls } from './PointerLockControls.js';

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let boxes = boundingBoxes;
const raycaster = new THREE.Raycaster();
let intersects = [];
let mouse = new THREE.Vector2();

let currentCount = 0;

function main() {
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    const stats = initStats();

    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(angleOfView, aspectRatio, nearPlane, farPlane);
    
    camera.position.set(0.75, 0, -0.5);
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // camera looks into the center of the room

    var controls = new PointerLockControls( camera, document.body );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    initRoom(scene);
    loadFurniture(scene);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.01;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 60, 60);
    scene.add(directionalLight);
    
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );
    const counter = document.getElementById( 'counter' );
    const currentCountElement = document.getElementById( 'currentCount' );
    const endblocker = document.getElementById( 'endblocker' );
    const congratulationsElement = document.getElementById( 'congratulation' );

    counter.style.display = 'none';
    endblocker.style.display = 'none';

    instructions.addEventListener( 'click', function () {

        controls.lock();

    } );

    document.addEventListener('click', function () {

        if (controls.isLocked) {

            controls.unlock();

        }
        else {

            removeByClick();
            controls.lock();

        }
    });
    
    document.addEventListener('mousemove',  function (event) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';
        counter.style.display = 'block';

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
                counter.style.display = 'none';
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
    
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    function getMovementDirection() {

        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection); // Hol die Kamerarichtung
        
        const sideVector = new THREE.Vector3().crossVectors(camera.up, cameraDirection).normalize();
        const direction = new THREE.Vector3();
    
        // normalize movement direction based on movement input (W, A, S, D)
        if (moveForward) direction.add(cameraDirection);
        if (moveBackward) direction.add(cameraDirection.clone().negate());
        if (moveLeft) direction.add(sideVector); 
        if (moveRight) direction.add(sideVector.clone().negate());
        
        return direction.normalize();
    }

    // collision detection
    function checkCollision(position) {

        var gridSizeX = 15;
        var gridSizeZ = 35;// needs to be updated if the room size changes
        var halfGridSizeX = gridSizeX / 2;
        var halfGridSizeZ = gridSizeZ / 2;
        var margin = 0.1;

        if (
            position.x < -halfGridSizeX + margin ||
            position.x > halfGridSizeX - margin ||
            position.z < -halfGridSizeZ + margin ||
            position.z > halfGridSizeZ - margin
        ) {
            return true; // collision with walls detected
        }

        const movementDirection = getMovementDirection();

        // set raycaster
        raycaster.set(camera.position, movementDirection);
        intersects = raycaster.intersectObjects(boxes, false);

        // check for intersection with bounding boxes (furniture) 
        if (intersects.length > 0) {

            for (let i = 0; i < intersects.length; i++) {
                const intersect = intersects[i];
                if (intersect.distance <= 1) {
                    return true; // collision with bounding boxes (furniture) detected
                }
            }
        }
        return false; // no collision at all
    }

    // check if there was a click event pointed at a search item and remove search item from scene if true
    function removeByClick() {

        raycaster.setFromCamera(mouse, camera);
        const searchIntersects = raycaster.intersectObjects(searchItems[0], false);

        if (searchIntersects.length > 0) {
            let intersectedObject = searchIntersects[0].object;
            let index = searchItems[0].indexOf(intersectedObject);
            scene.remove(searchItems[1][index]);
            searchItems[1].splice(index, 1);
            searchItems[0].splice(index, 1);
            updateCounter();
            }

    }

    // update the counter number visible in the corner based on the found objects
    function updateCounter() {
        currentCount += 1;
        currentCountElement.textContent = currentCount;
        const maxCountElement = document.getElementById( 'maxCount' );
        const maxCount = parseInt(maxCountElement.textContent); 
        if (currentCount === maxCount) {
            console.log("Max Count: ", maxCount);
            endblocker.style.display = 'block';
            congratulationsElement.style.display = 'block';
        }
    }
    
    // render loop
    function draw(time){
        
        if (resizeGLToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        time *= 0.001;
        const delta = ( time - prevTime ) / 1000;
        
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
