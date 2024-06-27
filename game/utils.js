export function initStats() {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    return stats;
}

export function initTrackballControls(camera, renderer) {
    const trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.2;
    trackballControls.panSpeed = 0.8;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    return trackballControls;
}
