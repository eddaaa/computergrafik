main();

function main() {
    // create context
    const canvas = document.querySelector("#c");
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

    var stats = initStats();

    // create camera
    const angleOfView = 55;
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const nearPlane = 0.1;
    const farPlane = 100;
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(10, -10, -37);

    // create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);
    // const fog = new THREE.Fog("grey", 1,90);
    // scene.fog = fog;

    // GEOMETRY
    var loader = new THREE.OBJLoader();

    loader.load("./objects/FolderMail.obj",
        function(mesh) {
            // var material = new THREE.MeshPhongMaterial({map:texture});

            mesh.children.forEach(function(child) {
                // child.material = material;
                child.castShadow = true;
            });

            mesh.position.set(4, 2, 2);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mesh.scale.set(0.005, 0.005, 0.005);

            scene.add(mesh);
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log(error);
            console.log( 'An error happened' );
        }
    );

    const wallGeometry = new THREE.BoxGeometry(10, 10, 0.1);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x492935 });
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
    const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);

    wall1.position.set(0, 0, -5);
    wall2.position.set(0, 0, 5);
    wall3.position.set(-5, 0, 0);
    wall3.rotation.y = Math.PI / 2;
    wall4.position.set(5, 0, 0);
    wall4.rotation.y = Math.PI / 2;

    scene.add(wall1);
    scene.add(wall2);
    scene.add(wall3);
    scene.add(wall4);

    const ceilingGeometry = new THREE.PlaneGeometry(10, 10);
    const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x404040, side: THREE.DoubleSide });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.set(0, 5, 0);
    ceiling.rotation.x = Math.PI / 2;

    scene.add(ceiling);

// Boden des Raums erstellen
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load('./textures/wood.jpg');
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(4, 4);

    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    // const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x404040, side: THREE.DoubleSide });
    const floorMaterial = new THREE.MeshBasicMaterial({ map: woodTexture, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, -5, 0);
    floor.rotation.x = -Math.PI / 2;

    scene.add(floor);

// Kamera-Position setzen
    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);

    //LIGHTS
    const color = 0xffffff;
    const intensity = 0.9;
    const light = new THREE.DirectionalLight(color, intensity);
    // light.target = plane;
    light.position.set(0, 30, 30);
    scene.add(light);
    // scene.add(light.target);

    const ambientColor = 0xffffff;
    const ambientIntensity = 0.5;
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    scene.add(ambientLight);

    //SHADOW
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-10, 20, -5);
    spotLight.castShadow = true;
    scene.add(spotLight);
    //
    // var controls = new function () {
    //     this.rotationSpeed = 0.02;
    // }
    //
    // var gui = new dat.GUI();
    // gui.add(controls, 'rotationSpeed', 0, 0.5);

    var trackballControls = initTrackballControls(camera, gl);
    var clock = new THREE.Clock();

    // DRAW
    function draw(time){
        time *= 0.001;
        if (resizeGLToDisplaySize(gl)) {
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            console.log(camera.position)
        }

        trackballControls.update(clock.getDelta());

        stats.update();

        gl.render(scene, camera);
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

// UPDATE RESIZE
function resizeGLToDisplaySize(gl) {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if (needResize) {
        gl.setSize(width, height, false);
    }
    return needResize;
}