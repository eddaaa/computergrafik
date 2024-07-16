
// source for GLTFLoader:
// https://github.com/SuboptimalEng/three-js-tutorials/blob/main/07-import-model/src/App.jsx


let boundingBoxes = [];
let searchItems = [[], []];
let maxCountElement = 0;


export { boundingBoxes, searchItems }

export function loadFurniture(scene) {

    // load furniture and create bounding boxes
    return Promise.all([
        loadGLTF(scene, './objects/pick_up_pack_collectibles_envelope/scene.gltf', 7.42, 2.2, -14.2, 20 * Math.PI / 180, 0, 180 * Math.PI / 180, 45, 45, 45, false, true, true),
        loadGLTF(scene, './objects/pick_up_pack_collectibles_envelope/scene.gltf', -6, -2.4, -12.8, 0, Math.PI / 4, Math.PI / 2, 45, 45, 45, false, true, true),
        loadGLTF(scene, './objects/pick_up_pack_collectibles_envelope/scene.gltf', 1, -5, -14.2, 0, - Math.PI / 4, Math.PI / 2, 45, 45, 45, false, true, true),
        loadGLTF(scene, './objects/pick_up_pack_collectibles_envelope/scene.gltf', 4.9, -4.25, 11, 0, 110 * Math.PI / 180, Math.PI / 2, 45, 45, 45, false, true, true),
        loadGLTF(scene, './objects/pick_up_pack_collectibles_envelope/scene.gltf', -6.8, -2.2, 6, 0, 0, Math.PI / 2, 45, 45, 45, false, true, true),

        loadGLTF(scene, './objects/voodoo_doll/scene.gltf', 4, -2.6, -15.0, 0, 120 * Math.PI / 180, 0, 0.1, 0.1, 0.1, false, false, true),
        loadGLTF(scene, './objects/mirror_a/scene.gltf', -6.3, -5, -16, 0, 45 * Math.PI / 180, 0, 3, 3, 3, false, false, true),
        loadGLTF(scene, './objects/old_wooden_table/scene.gltf', -6, -2.5, -10, 0, 0, 0, 0.9, 0.9, 0.9, false, false, true),
        // lädt nicht :( loadGLTF(scene, './objects/occult_books/scene.gltf', 0, 0, 0, 0, 0, 0, 150, 150, 150, false, false, true),
        loadGLTF(scene, './objects/book_open/scene.gltf', -5.7, -2.4, -10.2, 0, 180 * Math.PI / 180, 0, 0.03, 0.03, 0.03, true, false, true),
        loadGLTF(scene, './objects/candle_holder/scene.gltf', -6.3, -2.4, -11.6, 0, Math.PI / 2, 0, 0.004, 0.004, 0.004, true, false, true),
        loadGLTF(scene, './objects/painting_by_zdzislaw_beksinski_3/scene.gltf', 7.38, 0.8, -14.4, 0, - 90 * Math.PI / 180, 0, 0.5, 0.5, 0.5, false, false, true),
        loadGLTF(scene, './objects/portrait_of_adam_mickiewicz/scene.gltf', -7.4, 0, -11, 0, 0, 0, 1.5, 1.5, 1.5, false, false, true),
        loadGLTF(scene, './objects/death_crowning_innocence_1896/scene.gltf', -7.4, 0, -9, 0, 0, 0, 1.5, 1.5, 1.5, false, false, true),
        // loadGLTF(scene, './objects/vintage_metal_trunkchestsuitcase_1scaniverse/scene.gltf', 3, -6.5, -3, 0, 2, 0, 3.5, 3.5, 3.5, false, false),
        loadGLTF(scene, './objects/wooden_door/scene.gltf', -3, -1.4, 17.2, 0, Math.PI / 2, 0, 4, 4, 4, false, false, true),
        loadGLTF(scene, './objects/viking_axe/scene.gltf', -4.5, -1.75, -9.5, 70 * Math.PI / 180, 35 * Math.PI / 180, 30 * Math.PI / 180, 0.05, 0.05, 0.05, false, false),
        loadGLTF(scene, './objects/armchair/scene.gltf', 4.8, -5, -15.3, 0, -Math.PI / 4, 0, 4, 4, 4, false, false, true),
        loadGLTF(scene, './objects/double_barrel_stand/scene.gltf', 6, -5, 10, 0, 180 * Math.PI / 180, 0, 0.5, 0.5, 0.5, false, false, true),
        loadGLTF(scene, './objects/chandelier/scene.gltf', 0, 3, 8, 0, 180 * Math.PI / 180, 0, 0.1, 0.1, 0.1, true, false, false),
        loadGLTF(scene, './objects/carpet/scene.gltf', 0, -4.95, -10, 0, Math.PI / 2, 0, 0.1, 0.1, 0.1, false, false, false),
        loadGLTF(scene, './objects/the_weasley_clock/scene.gltf', 7, -6.1, -5, 0, 270 * Math.PI / 180, 0, 2.5, 2.5, 2.5, false, false, true),
        loadGLTF(scene, './objects/candle/scene.gltf', -6.6, -0.75, 5.5, 0, 0, 0, 0.05, 0.05, 0.05, false, false, true),
        loadGLTF(scene, './objects/old_wooden_bookshelves/scene.gltf', -6.75, -4.9, 6, 0, 0, 0, 1.5, 1.5, 1.5, false, false, true)

    ]).then((results) => {
        results.forEach(result => {
            if (result.boundingBox) {
                boundingBoxes.push(result.boundingBox);
            }
        });

        // save search items (envelopes) in 3D-array to enable click & remove event for them
        searchItems[0].push(results[0].boundingBox);
        searchItems[1].push(results[0].model);
        searchItems[0].push(results[1].boundingBox);
        searchItems[1].push(results[1].model);
        searchItems[0].push(results[2].boundingBox);
        searchItems[1].push(results[2].model);
        searchItems[0].push(results[3].boundingBox);
        searchItems[1].push(results[3].model);
        searchItems[0].push(results[4].boundingBox);
        searchItems[1].push(results[4].model);

        maxCountElement = document.getElementById( 'maxCount' );
        maxCountElement.textContent = searchItems[0].length;
    });
}

function loadGLTF(scene, path, posX, posY, posZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, light, collectable, boundingbox) {
    const gltfLoader = new THREE.GLTFLoader();

    return new Promise((resolve, reject) => {
        gltfLoader.load(path, (gltfScene) => {

            gltfScene.scene.position.set(posX, posY, posZ);
            gltfScene.scene.rotation.set(rotX, rotY, rotZ);
            gltfScene.scene.scale.set(scaleX, scaleY, scaleZ);

            if (light) {
                const color = 0xffffff;
                const intensity = 2;
                const distance = 0;
                const light = new THREE.PointLight(color, intensity, distance);
                light.castShadow = true;
                light.position.set(posX, posY, posZ);
                scene.add(light);
            }

            scene.add(gltfScene.scene);

            if (boundingbox){
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

                } else {
                    resolve({ boundingBox: null, model: gltfScene.scene });
                }


        }, undefined, reject);
    });
}

