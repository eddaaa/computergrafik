
// source for GLFTLoader:
// https://github.com/SuboptimalEng/three-js-tutorials/blob/main/07-import-model/src/App.jsx

export function loadFurniture(scene) {
    loadOBJ(scene, './objects/wooden_table/scene.gltf', 0, 0.2, 0, -Math.PI / 2, 0, 0, 1, 1, 1);
    // loadOBJ(scene, 'The_Holy_Bible.obj', 'The_Holy_Bible.mtl', 0, 0.2, 0, -Math.PI / 2, 0, 0, 1, 1, 1);
    // loadOBJ(scene, './objects/FolderMail.obj', './textures/bible_material.mtl', 4, 2, 2, -Math.PI / 2, 0, 0, 1, 1, 1);

}

function loadOBJ(scene, path, posX, posY, posZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {

    const glftLoader = new THREE.GLTFLoader();
    let loadedModel;

    glftLoader.load(path, (gltfScene) => {
      loadedModel = gltfScene;
      console.log(loadedModel);

      gltfScene.scene.rotation.y = Math.PI / 8;
      gltfScene.scene.position.y = posY;
      gltfScene.scene.scale.set(scaleX, scaleY, scaleZ);
      scene.add(gltfScene.scene);
    });

}
