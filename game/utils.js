export function initStats() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    return stats;
}

export function initTrackballControls(camera, renderer) {
    var controls = new THREE.OrbitControls(camera, document.body);
    // controls.target.set(0, 0.5, 0);
    controls.update();
    return controls;
}
