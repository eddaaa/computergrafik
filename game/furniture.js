
// source for GLFTLoader:
// https://github.com/SuboptimalEng/three-js-tutorials/blob/main/07-import-model/src/App.jsx

export function loadFurniture(scene) {

    loadGLFT(scene, './objects/wooden_table/scene.gltf', -3, -4, 2, 0, 0, 0, 2.5, 2.5, 2.5, false);
    loadGLFT(scene, './objects/pick_up_pack_collectibles_envelope/scene.gltf', -2.5, -2.7, 1, 0, 0, Math.PI / 2, 40, 40, 40, false);
    loadGLFT(scene, './objects/candle_holder/scene.gltf', -3, -2.7, 0.4, 0, Math.PI / 2, 0, 0.004, 0.004, 0.004, true);
}

function loadGLFT(scene, path, posX, posY, posZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, light) {

    const glftLoader = new THREE.GLTFLoader();

    glftLoader.load(path, (gltfScene) => {

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

    });

}
