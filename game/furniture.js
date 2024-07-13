
// source for GLFTLoader:
// https://github.com/SuboptimalEng/three-js-tutorials/blob/main/07-import-model/src/App.jsx

let boundingBoxes = [];
let searchItems = [];

export { boundingBoxes, searchItems }

export function loadFurniture(scene) {

    // load furniture and create bounding boxes
    return Promise.all([

        loadGLTF(scene, './objects/wooden_table/scene.gltf', -3, -4, 2, 0, 0, 0, 2.5, 2.5, 2.5, false),
        loadGLTF(scene, './objects/pick_up_pack_collectibles_envelope/scene.gltf', -2.5, -2.7, 1, 0, 0, Math.PI / 2, 40, 40, 40, false),
        loadGLTF(scene, './objects/candle_holder/scene.gltf', -3, -2.7, 0.4, 0, Math.PI / 2, 0, 0.004, 0.004, 0.004, true)

    ]).then((boxes) => {

        // save bounding boxes and search items only AFTER all the gltf models are loaded
        boundingBoxes.push(...boxes);
        searchItems.push(boxes[1]);

    });
}

function loadGLTF(scene, path, posX, posY, posZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, light) {

    const gltfLoader = new THREE.GLTFLoader();

    return new Promise((resolve, reject) => {
        gltfLoader.load(path, (gltfScene) => {

            gltfScene.scene.position.set(posX, posY, posZ);
            gltfScene.scene.rotation.set(rotX, rotY, rotZ);
            gltfScene.scene.scale.set(scaleX, scaleY, scaleZ);
            if (light) {
                const color = 0xffffff;
                const intensity = 7;
                const distance = 0;
                const light = new THREE.PointLight(color, intensity, distance);
                light.castShadow = true;
                light.position.set(posX, posY, posZ);
                scene.add(light);
            }
            scene.add(gltfScene.scene);

            // calculate bounding box based on gltf object
            let box3 = new THREE.Box3().setFromObject(gltfScene.scene);

            // adjust height to ensure collision even with smaller objects
            box3.max.y = Math.max(box3.max.y, 1.0);

            // create an invisible box
            const boxGeometry = new THREE.BoxGeometry(
                box3.max.x - box3.min.x,
                box3.max.y - box3.min.y,
                box3.max.z - box3.min.z
            );
            const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });
            const boundingBoxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

            // adjust the position of the box
            boundingBoxMesh.position.set(
                (box3.max.x + box3.min.x) / 2,
                (box3.max.y + box3.min.y) / 2,
                (box3.max.z + box3.min.z) / 2
            );

            scene.add(boundingBoxMesh);
            resolve(boundingBoxMesh);
            
        }, undefined, reject);
    });
}
