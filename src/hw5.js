import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// ============================================================================================
let isWireframeEnabled = false; // Flag that determines whether the wireframe should be enabled or not.
let materialsList = []; // Holds all the materials in the scene to support wireframe toggling on and off.

// A wrapper function to make sure that all of the mateirals that are being created 
// for this scene, will be stored in materialsList variable to support wireframe toggling.
const createMaterial = (material) => {
	materialsList.push(material)
	return material;
}

const spaceship = new THREE.Group();

// Constant geometries sizes
const sizes = {}
sizes.hullRadius = 0.5; 
sizes.hullLength = 3 * sizes.hullRadius

sizes.headRadius = sizes.hullRadius 
sizes.headLength = 2 * sizes.hullRadius

sizes.shipSize = sizes.hullRadius + sizes.headRadius; 
sizes.planetSize = 5 * sizes.shipSize

// Ship's Hull (Cylinder)
const hull = {}
hull.color = 0x00739C;
hull.material = createMaterial(new THREE.MeshBasicMaterial({color: hull.color}))
hull.geometry = new THREE.CylinderGeometry(sizes.hullRadius, sizes.hullRadius, sizes.hullLength)
hull.mesh = new THREE.Mesh(hull.geometry, hull.material)
spaceship.add(hull.mesh)

// Ship's Head (Cone)
const head = {}
head.color = 0xAE0000;
head.material = createMaterial(new THREE.MeshBasicMaterial({color: head.color}))
head.geometry = new THREE.ConeGeometry(sizes.headRadius, sizes.headLength)
head.mesh = new THREE.Mesh(head.geometry, head.material)
const moveHeadMat = new THREE.Matrix4()
moveHeadMat.makeTranslation(0,1.25,0)
spaceship.add(head.mesh)
head.mesh.applyMatrix4(moveHeadMat)


// Ship's wings (Two-sided mesh plane)
const wings = new THREE.Group()
const wing = {}
wing.color = 0x443152;
wing.height = 1;
wing.width = 0.5;
wing.geometry = new THREE.BufferGeometry();
const wingVertices = new Float32Array( [
	wing.height, -wing.width,  0.0,
	wing.width, -wing.width,  0.0,
	wing.width,  wing.height,  0.0,
] );
wing.geometry.setAttribute( 'position', new THREE.BufferAttribute( wingVertices, 3 ) );
wing.material = createMaterial(new THREE.MeshBasicMaterial({color: wing.color}))
wing.material.side = THREE.DoubleSide

// First wing
wing.mesh = new THREE.Mesh(wing.geometry, wing.material) 
wings.add(wing.mesh)

// Second wing 
wing.mesh = new THREE.Mesh(wing.geometry, wing.material) 
wings.add(wing.mesh)
const rotateWingMat = new THREE.Matrix4();
rotateWingMat.makeRotationY(degrees_to_radians(120));
wing.mesh.applyMatrix4(rotateWingMat);

// Third wing
wing.mesh = new THREE.Mesh(wing.geometry, wing.material) 
wings.add(wing.mesh)
rotateWingMat.makeRotationY(degrees_to_radians(240));
wing.mesh.applyMatrix4(rotateWingMat);

hull.mesh.add(wings)
const moveWingsMat = new THREE.Matrix4()
moveWingsMat.makeTranslation(0, -1, 0)
wings.applyMatrix4(moveWingsMat)

// Ship's windows (Rings)
const shipWindows = new THREE.Group()
const shipWindow = {}
shipWindow.color = 0xffff00;
shipWindow.material = createMaterial(new THREE.MeshBasicMaterial({color: shipWindow.color}))
shipWindow.geometry = new THREE.RingGeometry(0.1, 0.15, 30)

// First Window
shipWindow.mesh = new THREE.Mesh(shipWindow.geometry, shipWindow.material)
shipWindows.add(shipWindow.mesh)

// Second Window
shipWindow.mesh = new THREE.Mesh(shipWindow.geometry, shipWindow.material)
shipWindows.add(shipWindow.mesh)

// Move second window to be next to the first one
const moveWindowMat = new THREE.Matrix4();
moveWindowMat.makeTranslation(0,0.4,0);
shipWindow.mesh.applyMatrix4(moveWindowMat);

// Move all windows to be on the ship's hull
const moveAllWindowsMat = new THREE.Matrix4();
moveAllWindowsMat.makeTranslation(0,0,sizes.hullRadius);
shipWindows.applyMatrix4(moveAllWindowsMat);

hull.mesh.add(shipWindows)

scene.add(spaceship)

// Planet (Sphere)
const planet = {}
planet.color = 0xD3D3D3;
planet.material = createMaterial(new THREE.MeshBasicMaterial({color: planet.color}))
planet.geometry = new THREE.SphereGeometry(sizes.planetSize / 2, 64, 32)
planet.mesh = new THREE.Mesh(planet.geometry, planet.material)
const movePlanetMat = new THREE.Matrix4()
movePlanetMat.makeTranslation(-5, 0 , 0)
planet.mesh.applyMatrix4(movePlanetMat)
scene.add(planet.mesh)

// ============================================================================================

// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0,0,5);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );

// ============================================================================================
//animation functions
const controls = new OrbitControls( camera, renderer.domElement );

let isOrbitEnabled = true; 
let isAnimation1 = false;
let isAnimation2 = false;
let isAnimation3 = false;

const toggleOrbit = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
}

const toggleWireframe = (e) => {
	if (e.key == "w") {
		console.log("Toggling wireframe")
		isWireframeEnabled = !isWireframeEnabled
		for (let material of materialsList) {
			material.wireframe = isWireframeEnabled
		}
	}
}

const transAnimation = new THREE.Matrix4();
transAnimation.makeTranslation(2+sizes.planetSize ,0,0);
const transAnimationInvert = new THREE.Matrix4();
transAnimationInvert.copy(transAnimation).invert()

let animation1 = (e) => {
	if (e.key == "1") {
		console.log("animation1")
		isAnimation1 = !isAnimation1
	}
}

let animation2 = (e) => {
	if (e.key == "2") {
		console.log("animation 2")
		isAnimation2 = !isAnimation2
	}
}

let animation3 = (e) => {
	if (e.key == "3") {
		console.log("animation 3")
		isAnimation3 = !isAnimation3
	}
}

document.addEventListener('keydown',toggleOrbit)
document.addEventListener('keydown',toggleWireframe)
document.addEventListener('keydown',animation1)
document.addEventListener('keydown',animation2)
document.addEventListener('keydown',animation3)

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	if (isAnimation1) {
		let rotateAnimation1 = new THREE.Matrix4();
		rotateAnimation1.makeRotationZ(degrees_to_radians(1));
		spaceship.applyMatrix4(transAnimation);
		spaceship.applyMatrix4(rotateAnimation1);
		spaceship.applyMatrix4(transAnimationInvert);
	}

	if (isAnimation2){
		let rotateAnimation2 = new THREE.Matrix4();
		rotateAnimation2.makeRotationY(degrees_to_radians(1));
		spaceship.applyMatrix4(transAnimation);
		spaceship.applyMatrix4(rotateAnimation2);
		spaceship.applyMatrix4(transAnimationInvert);
	}

	if (isAnimation3) {
		let transAnimation3 = new THREE.Matrix4();
		transAnimation3.makeTranslation(-0.02,0,-0.02);
		spaceship.applyMatrix4(transAnimation3)
	}

	controls.update();
	renderer.render( scene, camera );

}
animate()