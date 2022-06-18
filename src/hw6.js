// Scene Declartion
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// helper function for later on
function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}


// Here we load the cubemap and skymap, you may change it

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  'src/skybox/right.png',
  'src/skybox/left.png',
  'src/skybox/top.png',
  'src/skybox/bottom.png',
  'src/skybox/front.png',
  'src/skybox/back.png',
]);
scene.background = texture;


// TODO: Texture Loading
// We usually do the texture loading before we start everything else, as it might take processing time
const sphereLoader = new THREE.TextureLoader();
const moonTexture = sphereLoader.load('src/textures/moon.jpg');
const earthTexture = sphereLoader.load('src/textures/earth.jpg');
const starTexture = sphereLoader.load('src/textures/star.jpg');


// TODO: Add Lighting
const spotLight = new THREE.SpotLight("white",0.7,10,degrees_to_radians(180));
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
scene.add( directionalLight );



// TODO: Spaceship
// You should copy-paste the spaceship from the previous exercise here
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




// TODO: Planets
// You should add both earth and the moon here
// Planet (Sphere)
const moon = {}
moon.color = 0xffffff;
moon.material = new THREE.MeshPhongMaterial({color: moon.color, map: moonTexture });
moon.geometry = new THREE.SphereGeometry(sizes.planetSize / 2, 64, 32)
moon.mesh = new THREE.Mesh(moon.geometry, moon.material)
moon.position = moon.mesh.position
scene.add(moon.mesh)

const earth = {}
earth.color = 0xffffff;
earth.material = new THREE.MeshPhongMaterial({color: earth.color, map: earthTexture });
earth.geometry = new THREE.SphereGeometry(sizes.planetSize / 2, 64, 32)
earth.mesh = new THREE.Mesh(earth.geometry, earth.material)
earth.position = earth.mesh.position
const moveEarth = new THREE.Matrix4()
moveEarth.makeTranslation(100, 5 , 100)
earth.mesh.applyMatrix4(moveEarth)
scene.add(earth.mesh)


// TODO: Bezier Curves
const start = new THREE.Vector3( 0, 0, 0 )
const end = new THREE.Vector3( 100,5,100 )

const v1 = new THREE.Vector3( 45,10,45 )
const v2 = new THREE.Vector3( 50,0,50 )
const v3 = new THREE.Vector3( 60,-10,60 )

const curve1 = new THREE.QuadraticBezierCurve3(start, v1, end );
const curve2 = new THREE.QuadraticBezierCurve3(start, v2, end );
const curve3 = new THREE.QuadraticBezierCurve3(start, v3, end );

const points = curve1.getPoints( 7000 );
const points2 = curve2.getPoints( 7000 );
const points3 = curve3.getPoints( 7000 );
var currPoints = points2;
const curves = [points,points2,points3];

// TODO: Camera Settings
// Set the camera following the spaceship here
const cameraTranslate = new THREE.Matrix4();
const cameraDist = 10;
rotation_Z = new THREE.Matrix4().makeRotationZ(degrees_to_radians(270))
camera.applyMatrix4(rotation_Z)
cameraTranslate.makeTranslation(0,0,cameraDist);
camera.applyMatrix4(cameraTranslate)
cameraTranslate.makeTranslation(0,0,-cameraDist);
rotation_Y = new THREE.Matrix4().makeRotationY(degrees_to_radians(-100))
camera.applyMatrix4(rotation_Y)
cameraTranslate.makeTranslation(0,0,cameraDist);
const cameraLane = new THREE.QuadraticBezierCurve3(moon.position, moon.position.clone().add(earth.position.clone()).divide(new THREE.Vector3(2,2,2)), earth.position );
const axisPoints = cameraLane.getPoints(7000)
const cameraTarget = new THREE.Object3D()

scene.add(cameraTarget)
cameraTarget.add(camera)

// TODO: Add collectible stars





// TODO: Add keyboard event
// We wrote some of the function for you
const handle_keydown = (e) => {
	if(e.code == 'ArrowLeft'){
		// TODO
	} else if (e.code == 'ArrowRight'){
		// TODO
	}
}
document.addEventListener('keydown', handle_keydown);



function animate() {

	requestAnimationFrame( animate );

	// TODO: Animation for the spaceship position


	// TODO: Test for star-spaceship collision

	
	renderer.render( scene, camera );

}
animate()