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
const sphereLoader = new THREE.TextureLoader()
const moonTexture = sphereLoader.load('src/textures/moon.jpg')
const earthTexture = sphereLoader.load('src/textures/earth.jpg')
const starTexture = sphereLoader.load('src/textures/star.jpg')
const badstarTexture = sphereLoader.load('src/textures/badstar.jpg')
const planetTexture = sphereLoader.load('src/textures/planet.jpg')


// TODO: Add Lighting
const spotLight = new THREE.SpotLight("white",0.7,10,degrees_to_radians(180));
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
scene.add( directionalLight );


// TODO: Spaceship
// You should copy-paste the spaceship from the previous exercise here

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
head.mesh.applyMatrix4(moveHeadMat)
hull.mesh.add(head.mesh)


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
hull.mesh.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(270)))
hull.mesh.applyMatrix4(new THREE.Matrix4().makeRotationX(degrees_to_radians(90)))
hull.mesh.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(30)))
scene.add(spaceship)
hull.mesh.add( spotLight );
spotLight.applyMatrix4(new THREE.Matrix4().makeTranslation(0,0,1))




// TODO: Planets
// You should add both earth and the moon here
// Planet (Sphere)
const earthPosition = {x: 100, y: 5, z: 100}
const moonPosition = {x: 0, y: 0, z: 0}
const cameraStartPosition = {x: -4, y: 0, z: 0}

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
moveEarth.makeTranslation(earthPosition.x, earthPosition.y , earthPosition.z)
earth.mesh.applyMatrix4(moveEarth)
scene.add(earth.mesh)

//bonus
const planetGeo = new THREE.SphereGeometry(60,35,35)
const planetMat = new THREE.MeshPhongMaterial({color: "pink", map: planetTexture });
const planet = new THREE.Mesh(planetGeo, planetMat)
planet.applyMatrix4(new THREE.Matrix4().makeTranslation(300,-400,200))
scene.add(planet);

const planet2 = new THREE.Mesh(planetGeo, planetMat)
planet2.applyMatrix4(new THREE.Matrix4().makeTranslation(700,-400,200))
scene.add(planet2);



// TODO: Bezier Curves
const startPoint = new THREE.Vector3(moonPosition.x, moonPosition.y, moonPosition.z)
const endPoint = new THREE.Vector3(earthPosition.x, earthPosition.y , earthPosition.z)

const conrolPointA = new THREE.Vector3( 45,10,45 )
const controlPointB = new THREE.Vector3( 50,0,50 )
const controlPointC = new THREE.Vector3( 60,-10,60 )

const c1 = new THREE.QuadraticBezierCurve3(startPoint, conrolPointA, endPoint );
const c2 = new THREE.QuadraticBezierCurve3(startPoint, controlPointB, endPoint );
const c3 = new THREE.QuadraticBezierCurve3(startPoint, controlPointC, endPoint );

const MAX_POINTS = 10000
const curvePointsA = c1.getPoints( MAX_POINTS );
const curvePointsB = c2.getPoints( MAX_POINTS );
const curvePointsC = c3.getPoints( MAX_POINTS );
var currPoints = curvePointsA;
const curves = [curvePointsA, curvePointsB, curvePointsC];

// TODO: Camera Settings
// Set the camera following the spaceship here
const cameraTarget = new THREE.Object3D()
const cameraTranslate = new THREE.Matrix4();
const cameraDist = 12;
let rotation_Z = new THREE.Matrix4().makeRotationZ(degrees_to_radians(270))
let rotation_Y = new THREE.Matrix4().makeRotationY(degrees_to_radians(-100))

camera.applyMatrix4(rotation_Z)
cameraTranslate.makeTranslation(0,0,cameraDist);
camera.applyMatrix4(cameraTranslate)
cameraTranslate.makeTranslation(0,0,-cameraDist);
camera.applyMatrix4(rotation_Y)
cameraTranslate.makeTranslation(0,0,cameraDist);

const vector2 = new THREE.Vector3(2,2,2)
const cameraLane = new THREE.QuadraticBezierCurve3(cameraStartPosition, moon.position.clone().add(earth.position.clone()).divide(vector2), earth.position );
const axisPoints = cameraLane.getPoints(MAX_POINTS)

scene.add(cameraTarget)
cameraTarget.add(camera)


// TODO: Add collectible stars
const starMat = new THREE.MeshPhongMaterial({color: "yellow", map: starTexture });
const batstarMat = new THREE.MeshPhongMaterial({color: "red", map: badstarTexture });
const starGeo = new THREE.DodecahedronGeometry(0.6)
const GoodStar = new THREE.Mesh(starGeo,starMat)
const BadStar = new THREE.Mesh(starGeo, batstarMat)

function Star(curve, t, obj, is_good) {
	this.curve = curve;
	this.t = t;
	this.obj = obj
	this.claimed = false;
	this.is_good = is_good
}

const NUM_STARS = 5
var stars = [];

function addGoodStarsToScene() {
    for (var i = 0; i < NUM_STARS ; i++){
        let curveIndex = Math.floor(Math.random() * 3);
        let tValue = Math.floor(Math.random() * MAX_POINTS);
		if(tValue <= 2){
			tValue++
		}
		let newStar = new Star(curveIndex,tValue, GoodStar.clone(), true)
        stars.push(newStar)
		let pos = curves[curveIndex][tValue]
        newStar.obj.applyMatrix4(new THREE.Matrix4().makeTranslation(pos.x,pos.y,pos.z))
        scene.add(newStar.obj)
    }
}

//bonus bad stars
function addBadStarsToScene() {
    for (var i = 0; i < NUM_STARS - 3 ; i++){
        let curveIndex = Math.floor(Math.random() * 3);
        let tValue = Math.floor(Math.random() * MAX_POINTS);
		if(tValue == 0){
			tValue++
		}
		let newStar = new Star(curveIndex,tValue, BadStar.clone(), false)
        stars.push(newStar)
		let pos = curves[curveIndex][tValue]
        newStar.obj.applyMatrix4(new THREE.Matrix4().makeTranslation(pos.x,pos.y,pos.z))
        scene.add(newStar.obj)
    }
}

addGoodStarsToScene();
addBadStarsToScene()

// TODO: Add keyboard event
const INITIAL_CURVE_INDEX = 1

var curCurveIndex = INITIAL_CURVE_INDEX;
// We wrote some of the function for you
const handle_keydown = (e) => {
	// bonus speed
	if (e.keyCode == '38') {
        GameData.speed+=100
		if (GameData.speed > 2000){
			GameData.speed = 2000
		}
    }
    else if (e.keyCode == '40') {
        GameData.speed-=50
		if(GameData.speed <= 0){
			GameData.speed = 50
		}
    }
    else if (e.keyCode == '37') {
		curCurveIndex = Math.max(0,(curCurveIndex - 1));
    }
    else if (e.keyCode == '39') {
		curCurveIndex = Math.min(2,(curCurveIndex + 1));
    }

	currPoints = curves[curCurveIndex]
}

document.addEventListener('keydown', handle_keydown);

let GameData = {
	score: 0,
	clock: new THREE.Clock(),
	time: 0,
	pos: 0,
	gameFinished: false,
	speed: 400
}

const updateStars = (star) => {
	if (star.curve == curCurveIndex && star.t <= GameData.pos + 50 && star.t >= GameData.pos - 50 && !star.claimed){
		star.claimed = true;
		if (star.is_good){
			GameData.score++;
		} else {
			GameData.score--;
		}
		scene.remove(star.obj);
	}

	let starObj = star.obj;
	var starPosx = starObj.position.x;
	var starPosy = starObj.position.y;
	var starPosz = starObj.position.z;
	starObj.applyMatrix4(new THREE.Matrix4().makeTranslation(-starPosx,-starPosy,-starPosz));
	starObj.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.4)));
	starObj.applyMatrix4(new THREE.Matrix4().makeTranslation(starPosx,starPosy,starPosz));
}

function animate() {

	requestAnimationFrame( animate );

    GameData.pos = Math.floor(GameData.time)
	if (GameData.pos >= MAX_POINTS && !GameData.gameFinished){
	    GameData.gameFinished = true
	    alert("Your Score is: " + GameData.score)
    }
	if (!GameData.gameFinished) {
		moon.mesh.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.5)))
		earth.mesh.applyMatrix4(new THREE.Matrix4().makeTranslation(-earthPosition.x,-earthPosition.y,-earthPosition.z))
		earth.mesh.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.5)))
		earth.mesh.applyMatrix4(new THREE.Matrix4().makeTranslation(earthPosition.x, earthPosition.y, earthPosition.z))

		// TODO: Test for star-spaceship collision
		stars.forEach(updateStars)

		// TODO: Animation for the spaceship position
		let hullPosition = hull.mesh.position
		hull.mesh.applyMatrix4(new THREE.Matrix4().makeTranslation(-hullPosition.x,-hullPosition.y,-hullPosition.z))
		hull.mesh.applyMatrix4(new THREE.Matrix4().makeTranslation(currPoints[GameData.pos].x,currPoints[GameData.pos].y,currPoints[GameData.pos].z))
		let targetPosition = cameraTarget.position
		cameraTarget.applyMatrix4(new THREE.Matrix4().makeTranslation(-targetPosition.x,-targetPosition.y,-targetPosition.z))
		cameraTarget.applyMatrix4(new THREE.Matrix4().makeTranslation(axisPoints[GameData.pos].x,axisPoints[GameData.pos].y,axisPoints[GameData.pos].z))

		GameData.time += GameData.clock.getDelta() * GameData.speed

		renderer.render( scene, camera );
	}

}
animate()