var renderer;
var scene;
var camera;
var controls;
var stats;
var objects = {};

var T = 0.0;
var lastT = 0;
var clock = new THREE.Clock();

var cameraDistance = 20;
var container;

function createRenderer() {
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.physicallyCorrectLights = true;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.bias = 0.0001;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    var w = container.clientWidth;
    var h = container.clientHeight;
    console.log("create", w, h)
    renderer.setSize(w, h);
    container.appendChild( renderer.domElement );
    return renderer;
}

function update() {
    //resize()
    //objects['lightMain'].position.set(camera.position.x,camera.position.y,camera.position.z);
    stats.update();
    controls.update();
    render()
}

function render() {
    renderer.clear();
    renderer.render( scene, camera );
}

function resize() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    console.log("resize", w, h)
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    controls.handleResize();
    return [w, h];
}

function onWindowResize() {
    var [w, h] = resize();
    renderer.setSize(w, h);
    renderer.domElement.style.width = w
    renderer.domElement.style.height = h
    render();
}


function createScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 60, container.innerWidth / container.innerHeight, 1, 1000 );
    camera.position.z = cameraDistance;

    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    controls.minDistance = 2;
    controls.maxDistance = 100;
    //controls.addEventListener( 'change', render );

	axesHelper = new THREE.AxesHelper(1);
	scene.background = new THREE.Color(0xAAAACC);
	scene.add(createLight(1000, new THREE.Vector3(20,100,100)));
    scene.add(createLight(200, new THREE.Vector3(-40,30,150)));
    scene.add(createLight(300, new THREE.Vector3(0,-50,-100)));
	scene.add(createHemisphereLight());
	scene.add( axesHelper );
}

function createLight(intensity, pos) {
    var light = new THREE.PointLight(0xffeebb, 1, 1000, 2);
    light.power = intensity*1000;
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.heigth = 512;
    light.shadow.radius = 1.5;
    light.position.set(pos.x, pos.y, pos.z);
    objects['lightMain'] = light;
    return light;
}

function createHemisphereLight() {

    return new THREE.HemisphereLight(0x202080, 0x101040, 1);
}

function initViewer(GLcontainer) {
    container = GLcontainer;
    createRenderer(container);
    createScene();
    resize(); 
    window.addEventListener( 'resize', onWindowResize, true );
    window.addEventListener( 'keydown', keyup, false );
    stats = new Stats();
    document.body.appendChild( stats.dom );
    return this;
}

function keyup(event ) {
    if ( controls.enabled === false ) return;
    //event.preventDefault();
    //event.stopPropagation();
    switch (event.keyCode) {
        case 82: //key R
            controls.reset();
            break;
    }
    
}

function isDefined(variable){
    return !(typeof variable == 'undefined');
}