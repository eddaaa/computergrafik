
// source for GLTFLoader:
// https://github.com/SuboptimalEng/three-js-tutorials/blob/main/07-import-model/src/App.jsx

let boundingBoxes = [];
let searchItems = [[], []];

export { boundingBoxes, searchItems }

export function loadFurniture(scene) {

    // load furniture and create bounding boxes
    return Promise.all([

        loadGLTF(scene, './objects/wooden_table/scene.gltf', -3, -4, 2, 0, 0, 0, 2.5, 2.5, 2.5, false, false),
        loadGLTF(scene, './objects/pick_up_pack_collectibles_envelope/scene.gltf', -2.7, -2.7, -0.8, 0, Math.PI / 4, Math.PI / 2, 40, 40, 40, false, true),
        loadGLTF(scene, './objects/candle_holder/scene.gltf', -3, -2.7, 0.4, 0, Math.PI / 2, 0, 0.004, 0.004, 0.004, true, false),
        loadGLTF(scene, './objects/painting_by_zdzislaw_beksinski_3/scene.gltf', -4.8, 0, 2, 0, 1.5, 0, 0.5, 0.5, 0.5, false, false),
        loadGLTF(scene, './objects/vintage_metal_trunkchestsuitcase_1scaniverse/scene.gltf', 3, -6.5, -3, 0, 2, 0, 3.5, 3.5, 3.5, false, false)

    ]).then((results) => {
        results.forEach(result => {
            boundingBoxes.push(result.boundingBox);
        });

        // save search items (envelopes) in 3D-array to enable click & remove event for them
        searchItems[0].push(results[1].boundingBox);
        searchItems[1].push(results[1].model);
    });
}

function loadGLTF(scene, path, posX, posY, posZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, light, collectable) {

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

            // scale factor of collectables can be adjusted for optimal player experience
            const scaleFactor = 1.5;

            if (collectable) boundingBoxMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

            scene.add(boundingBoxMesh);

            resolve({ boundingBox: boundingBoxMesh, model: gltfScene.scene });

        }, undefined, reject);
    });
}
