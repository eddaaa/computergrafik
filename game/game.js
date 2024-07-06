import { initRoom } from './room.js';
import { loadFurniture } from './furniture.js';
import { initStats, initTrackballControls } from './utils.js';

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

    const trackballControls = initTrackballControls(camera, gl);
    const clock = new THREE.Clock();

    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 87: // W
                camera.position.z -= 0.1;
                break;
            case 65: // A
                camera.position.x -= 0.1;
                break;
            case 83: // S
                camera.position.z += 0.1;
                break;
            case 68: // D
                camera.position.x += 0.1;
                break;
        }
    });

    function draw(time){
        time *= 0.001;
        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        trackballControls.update(clock.getDelta());
        stats.update();

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
