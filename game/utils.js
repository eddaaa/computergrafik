export function initStats() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    return stats;
}

export function initTrackballControls(camera, renderer) {
    var controls;
    controls = new THREE.OrbitControls(camera, document.body);
    controls.target.set(0, 20, 0);
    controls.update();
    return controls;
}
