export function initRoom(scene) {
    const textureLoader = new THREE.TextureLoader();
    const concrete = textureLoader.load('./textures/concrete.jpg');
    concrete.wrapS = THREE.RepeatWrapping;
    concrete.wrapT = THREE.RepeatWrapping;
    concrete.repeat.set(4, 4);

    const wallGeometry = new THREE.BoxGeometry(10, 10, 0.1);
    const wallMaterial = new THREE.MeshBasicMaterial({ map: concrete, side: THREE.DoubleSide });
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

    const woodTexture = textureLoader.load('./textures/wood.jpg');
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(4, 4);

    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshBasicMaterial({ map: woodTexture, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.set(0, -5, 0);
    floor.rotation.x = -Math.PI / 2;

    scene.add(floor);
}