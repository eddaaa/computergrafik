export function loadFurniture(scene) {
    loadOBJ(scene, './objects/FolderMail.obj', 4, 2, 2, -Math.PI / 2, 0, 0, 1, 1, 1);
}

function loadOBJ(scene, path, posX, posY, posZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
    const loader = new THREE.OBJLoader();
    loader.load(path,
        function(mesh) {
            mesh.children.forEach(function(child) {
                child.castShadow = true;
            });

            mesh.position.set(posX, posY, posZ);
            mesh.rotation.set(rotX, rotY, rotZ);
            mesh.scale.set(scaleX, scaleY, scaleZ);

            scene.add(mesh);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened', error);
        }
    );
}
