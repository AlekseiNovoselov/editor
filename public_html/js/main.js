var container, stats;
var camera, controls, scene, renderer;
var objects = [], plane;
var painting; // my vars
var gui_controls;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED;

init();
animate();

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    controls.update();

    renderer.render( scene, camera );

}
