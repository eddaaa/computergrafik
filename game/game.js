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
    camera.position.set(0, 8, 30);

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

    // Create the upright plane
    const planeWidth = 256;
    const planeHeight =  128;
    const planeGeometry = new THREE.PlaneGeometry(
        planeWidth,
        planeHeight
    );

    // MATERIALS
    const textureLoader = new THREE.TextureLoader();
    const planeTextureMap = textureLoader.load('./textures/wood.jpg');
    planeTextureMap.wrapS = THREE.RepeatWrapping;
    planeTextureMap.wrapT = THREE.RepeatWrapping;
    planeTextureMap.repeat.set(16, 16);

    // MESHES
    const plane = new THREE.Mesh(planeGeometry, planeTextureMap);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    //LIGHTS
    const color = 0xffffff;
    const intensity = 0.9;
    const light = new THREE.DirectionalLight(color, intensity);
    light.target = plane;
    light.position.set(0, 30, 30);
    scene.add(light);
    scene.add(light.target);

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