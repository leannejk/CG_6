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

function create_material(color,texture = null){
    return new THREE.MeshPhongMaterial({color: color, map: texture });
}


// TODO: Texture Loading
// We usually do the texture loading before we start everything else, as it might take processing time
const sphereLoader = new THREE.TextureLoader();
const moonTexture = sphereLoader.load('src/textures/moon.jpg');
const earthTexture = sphereLoader.load('src/textures/earth.jpg');
const starTexture = sphereLoader.load('src/textures/star.jpg');


// TODO: Add Lighting
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
scene.add( directionalLight );
const shipSpotLight = new THREE.SpotLight("white",0.8,10,degrees_to_radians(180));


// TODO: Spaceship
const cylinder = new THREE.CylinderGeometry(0.2,0.2,0.6,20,20)
const hullMaterial = create_material("red")
const hull = new THREE.Mesh( cylinder, hullMaterial );
scene.add(hull);
hull.add( shipSpotLight );
shipSpotLight.applyMatrix4(new THREE.Matrix4().makeTranslation(0,0,1))

//----------------- BONUS -----------------
const fartPlacer = new THREE.Mesh()
fartPlacer.applyMatrix4(new THREE.Matrix4().makeTranslation(0,-cylinder.parameters.height / 2,0))
hull.add(fartPlacer)
const smokeRing = new THREE.TorusGeometry(cylinder.parameters.radiusTop / 1.5,0.04,20,20)
const smokeRingMat = new THREE.MeshPhongMaterial({color: "white", side: THREE.DoubleSide})

const cone = new THREE.ConeGeometry(cylinder.parameters.radiusTop,cylinder.parameters.height / 2,20,20)
const coneMaterial = create_material("purple")
const head = new THREE.Mesh( cone, coneMaterial );
head.applyMatrix4(new THREE.Matrix4().makeTranslation(0,(cylinder.parameters.height + cone.parameters.height)/ 2,0))
hull.add(head);

const shape = new THREE.Shape();

shape.moveTo(-cylinder.parameters.radiusTop, -cylinder.parameters.radiusTop);
shape.lineTo(0 , - cylinder.parameters.radiusTop);
shape.lineTo(0, cylinder.parameters.radiusTop / 2);

const TriangleGeometry = new THREE.ShapeGeometry(shape);
const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xbd112a, side: THREE.DoubleSide });
const wing = new THREE.Mesh(TriangleGeometry, wingMaterial)
wing.applyMatrix4(new THREE.Matrix4().makeTranslation(-cylinder.parameters.radiusTop / 1.1, -cylinder.parameters.height / 3.5, 0 ))
wing.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(30)))
const wing2 = wing.clone()
wing2.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(120)))
const wing3 = wing2.clone()
wing3.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(120)))
hull.add(wing)
hull.add(wing2)
hull.add(wing3)

const ring = new THREE.RingGeometry(cylinder.parameters.radiusTop / 5,cylinder.parameters.radiusTop / 3,20)
const ringMat = create_material(0xff6200)
const window1 = new THREE.Mesh(ring, ringMat)
window1.applyMatrix4(new THREE.Matrix4().makeTranslation( 0, 0, cylinder.parameters.radiusTop ))
hull.add(window1)
const window2 = window1.clone()
window1.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(180)))
window2.applyMatrix4(new THREE.Matrix4().makeTranslation( 0, cylinder.parameters.height / 4 + ring.parameters.outerRadius / 2, 0))
hull.add(window2)
hull.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(270)))
hull.applyMatrix4(new THREE.Matrix4().makeRotationX(degrees_to_radians(90)))
hull.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(30)))

// You should copy-paste the spaceship from the previous exercise here


// TODO: Planets
// You should add both earth and the moon here
const sphere = new THREE.SphereGeometry((cone.parameters.height + cylinder.parameters.height) * 2.5,30,30)
const sphereMat = create_material("white",moonTexture)

const moon = new THREE.Mesh(sphere, sphereMat)
const earthMat = create_material("white",earthTexture)
const earth = new THREE.Mesh(sphere, earthMat)
earth.applyMatrix4(new THREE.Matrix4().makeTranslation(100,5,100))
scene.add(earth)
scene.add(moon)

//----------------- BONUS -----------------
const bigSphere = new THREE.SphereGeometry(100,30,30)
const bigSphereMat = create_material("purple",moonTexture)
const thanosStar = new THREE.Mesh(bigSphere, bigSphereMat)
thanosStar.applyMatrix4(new THREE.Matrix4().makeTranslation(300,-300,300))
scene.add(thanosStar);


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
const cameraDist = 9;
camera.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(270)))
cameraTranslate.makeTranslation(0,0,cameraDist);
camera.applyMatrix4(cameraTranslate)
cameraTranslate.makeTranslation(0,0,-cameraDist);
camera.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(-100)))
cameraTranslate.makeTranslation(0,0,cameraDist);
const cameraLane = new THREE.QuadraticBezierCurve3(moon.position, moon.position.clone().add(earth.position.clone()).divide(new THREE.Vector3(2,2,2)), earth.position );
const axisPoints = cameraLane.getPoints(7000)
const cameraTarget = new THREE.Object3D()

scene.add(cameraTarget)
cameraTarget.add(camera)


// TODO: Add collectible stars
class Star{
    constructor(curve, t, obj, isBad = false) {
        this.curve = curve;
        this.t = t;
        this.obj = obj
        this.isActive = true;
        this.isBad = isBad;
        let pos = curves[curve][t]
        obj.applyMatrix4(new THREE.Matrix4().makeTranslation(pos.x,pos.y,pos.z))
        scene.add(obj)
    }
}

const starMat = create_material("white", starTexture);
const starGeo = new THREE.DodecahedronGeometry(0.6)
const star = new THREE.Mesh(starGeo,starMat)

//----------------- BONUS -----------------
const badStarMat = create_material("red", starTexture);
const badStarGeo = new THREE.OctahedronGeometry(0.6)
const badStar = new THREE.Mesh(badStarGeo,badStarMat)

var stars = [];
CreateStars();

function CreateStars() {
    for (var i = 0; i < 5 ; i++){
        let randCurve = Math.floor(Math.random() * 3);
        let randT = Math.floor(Math.random() * 6000) + 500;
        stars.push(new Star(randCurve,randT, star.clone()))
    }

    //----------------- BONUS -----------------
    for (var i = 0; i < 3 ; i++){
        let randCurve = Math.floor(Math.random() * 3);
        let randT = Math.floor(Math.random() * 6000) + 500;
        stars.push(new Star(randCurve,randT, badStar.clone(),true))
    }
}




// TODO: Add keyboard event

var curCurveIndex = 1;
var speed = 150;
// We wrote some of the function for you
const handle_keydown = (e) => {
	if(e.code == 'ArrowLeft'){
		curCurveIndex = Math.max(0,(curCurveIndex - 1));
	} else if (e.code == 'ArrowRight'){
		curCurveIndex = Math.min(2,(curCurveIndex + 1));
	} else if (e.code == 'ArrowUp'){
        //----------------- BONUS -----------------
        speed = Math.min(speed + 20, 300);

    } else if (e.code == 'ArrowDown'){
        //----------------- BONUS -----------------
        speed = Math.max(speed - 20, 50);
    }
	currPoints = curves[curCurveIndex]
}
document.addEventListener('keydown', handle_keydown);


var i = 0;
var playerScore = 0;
let farts = []
var clock = new THREE.Clock();
var time = 0;
var gameEnded = false;
var fartBuffer = true;

function animate() {

	requestAnimationFrame( animate );

    i = Math.floor(time)
	if (i >= 6999 && !gameEnded){
	    gameEnded = true
	    alert("Your Score is: " + playerScore)
    }

	moon.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.5)));

    earth.applyMatrix4(new THREE.Matrix4().makeTranslation(-100,-5,-100));
    earth.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.5)));
    earth.applyMatrix4(new THREE.Matrix4().makeTranslation(100,5,100));

    thanosStar.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.015)))
    var thanosPosx = thanosStar.position.x;
    var thanosPosy = thanosStar.position.y;
    var thanosPosz = thanosStar.position.z;
    thanosStar.applyMatrix4(new THREE.Matrix4().makeTranslation(-thanosPosx,-thanosPosy,-thanosPosz));
    thanosStar.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.2)));
    thanosStar.applyMatrix4(new THREE.Matrix4().makeTranslation(thanosPosx,thanosPosy,thanosPosz));

    // TODO: Test for star-spaceship collision
    for (let x = 0 ; x < stars.length ; x++){
        let curStar = stars[x];
        if (curStar.curve == curCurveIndex && curStar.t <= i + 50 && curStar.t >= i - 50 && curStar.isActive){
            curStar.isActive = false;
            if (curStar.isBad) {
                playerScore--;
            }
            else {
                playerScore++;
            }
            scene.remove(curStar.obj);
        }

        let starObj = curStar.obj;
        var starPosx = starObj.position.x;
        var starPosy = starObj.position.y;
        var starPosz = starObj.position.z;
        starObj.applyMatrix4(new THREE.Matrix4().makeTranslation(-starPosx,-starPosy,-starPosz));
        starObj.applyMatrix4(new THREE.Matrix4().makeRotationZ(degrees_to_radians(0.4)));
        starObj.applyMatrix4(new THREE.Matrix4().makeTranslation(starPosx,starPosy,starPosz));

    }


    // TODO: Animation for the spaceship position
    let posX = hull.position.x
    let posY = hull.position.y
    let posZ = hull.position.z
    hull.applyMatrix4(new THREE.Matrix4().makeTranslation(-posX,-posY,-posZ))

    hull.applyMatrix4(new THREE.Matrix4().makeTranslation(currPoints[i].x,currPoints[i].y,currPoints[i].z))
    let tposX = cameraTarget.position.x
    let tposY = cameraTarget.position.y
    let tposZ = cameraTarget.position.z
    cameraTarget.applyMatrix4(new THREE.Matrix4().makeTranslation(-tposX,-tposY,-tposZ))
    cameraTarget.applyMatrix4(new THREE.Matrix4().makeTranslation(axisPoints[i].x,axisPoints[i].y,axisPoints[i].z))





    if (fartBuffer){
        let fart = new THREE.Mesh(smokeRing.clone(),smokeRingMat.clone())
        fart.material.wireframe = hull.material.wireframe
        let worldPos = fartPlacer.getWorldPosition(fartPlacer.position.clone())
        let m =  new THREE.Matrix4().makeTranslation(worldPos.x,worldPos.y , worldPos.z )
        m = m.multiply(new THREE.Matrix4().makeRotationFromEuler(hull.rotation.clone()))
        m = m.multiply(new THREE.Matrix4().makeRotationX(degrees_to_radians(90)))
        fart.applyMatrix4(m)
        scene.add(fart)
        farts.push(fart)
    }
    fartBuffer = !fartBuffer;
    time += clock.getDelta() * speed

    for (const element of farts) {
        let xpos = element.position.x
        let ypos = element.position.y
        let zpos = element.position.z

        element.applyMatrix4(new THREE.Matrix4().makeTranslation(-xpos,-ypos,-zpos))
        element.applyMatrix4(new THREE.Matrix4().makeScale(1.01,1.01,1.01))
        element.applyMatrix4(new THREE.Matrix4().makeTranslation(xpos,ypos,zpos))

        element.material.transparent = true;
        element.material.opacity *= 0.97;
        if (element.scale.x > 10){
            scene.remove(element)
        }
    }

	renderer.render( scene, camera );

}
animate()