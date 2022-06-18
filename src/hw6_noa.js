// Scene Declartion
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//to delete later
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(-50, 100, -50);
camera.applyMatrix4(cameraTranslate)

renderer.render(scene, camera);

// helper function for later on
function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
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
const earthTexture = new THREE.TextureLoader().load('src/textures/earth.jpg');
const moonTexture = new THREE.TextureLoader().load('src/textures/moon.jpg');
const starTexture = new THREE.TextureLoader().load('src/textures/star.jpg');


// TODO: Add Lighting
let ambientLight, directional_light_as_sun, spot_light_to_spaceship;
let space_ship
const createLights = () => {
        // an ambient light modifies the global color of a scene and makes the shadows softer
        ambientLight = new THREE.AmbientLight(0xccb8b4, 0.6);

        // A directional light shines from a specific direction.
        // It acts like the sun, that means that all the rays produced are parallel.
        directional_light_as_sun = new THREE.DirectionalLight(0xffffff, 0.8);

        // // Set the direction of the light
        directional_light_as_sun.position.set(0, 150, 0);
        directional_light_as_sun.castShadow = true;

        // // define the visible area of the projected shadow
        directional_light_as_sun.shadow.camera.left = -800;
        directional_light_as_sun.shadow.camera.right = 800;
        directional_light_as_sun.shadow.camera.top = 800;
        directional_light_as_sun.shadow.camera.bottom = -800;
        directional_light_as_sun.shadow.camera.near = 1;
        directional_light_as_sun.shadow.camera.far = 1200;

        // res of shadow
        directional_light_as_sun.shadow.mapSize.width = 2048;
        directional_light_as_sun.shadow.mapSize.height = 2048;
        //

        spot_light_to_spaceship = new THREE.SpotLight(0xffffff);
        const pos = space_ship.getWorldPosition()
        spot_light_to_spaceship.position.set(pos.x + 15, pos.y + 15, pos.z + 15);

        spot_light_to_spaceship.castShadow = true;

        spot_light_to_spaceship.shadow.mapSize.width = 1024;
        spot_light_to_spaceship.shadow.mapSize.height = 1024;

        spot_light_to_spaceship.shadow.camera.near = 500;
        spot_light_to_spaceship.shadow.camera.far = 4000;
        spot_light_to_spaceship.shadow.camera.fov = 30;
        spot_light_to_spaceship.target = space_ship

        scene.add(directional_light_as_sun);
        scene.add(ambientLight);
        scene.add(spot_light_to_spaceship);

    }
    // TODO: Spaceship
const shapes_arr = []

function add_to_scane(self, to_where) {
    to_where.add(self);
    shapes_arr.push(self);
}

function createSpaceShip() {
    const hull_radius = 5
    const hull_height = hull_radius * 3
    const cone_height = 7.5
    const space_ship = new THREE.Group();

    const hullGeometry = new THREE.CylinderGeometry(hull_radius, hull_radius, hull_height, 32);
    const hullMaterial = new THREE.MeshPhongMaterial({ color: 'red' });

    const hull = new THREE.Mesh(hullGeometry, hullMaterial);

    add_to_scane(hull, space_ship)

    //wings
    const FinGeometry = new THREE.Shape();
    const finHeight = hull_height / 3;
    FinGeometry.moveTo(0, 0);
    FinGeometry.lineTo(0, finHeight);
    FinGeometry.lineTo(finHeight / 2, 0);
    FinGeometry.lineTo(0, 0);

    const extrudeSettings = {
        amount: 1,
        bevelEnabled: false
    };

    const FinMaterial = new THREE.MeshPhongMaterial({ color: 'pink', side: THREE.DoubleSide });
    const finShape = new THREE.ExtrudeGeometry(FinGeometry, extrudeSettings);

    let x_fins = [finHeight, 0, -finHeight, 0];
    let z_fins = [0, -finHeight, 0, finHeight];
    var i = 0,
        mesh;
    while (i < 4) {
        mesh = new THREE.Mesh(finShape, FinMaterial);
        mesh.applyMatrix4(new THREE.Matrix4().makeTranslation(x_fins[i], -(finHeight + finHeight / 2), z_fins[i]));
        mesh.lookAt(0, -(finHeight + finHeight / 2), 0);
        mesh.rotateY(Math.PI * 0.5);
        add_to_scane(mesh, hull);
        i += 1;
    }

    //windows
    const windowGeometry = new THREE.RingGeometry((hull_radius / 4) / 2, hull_radius / 4, 32);
    const windowMaterial = new THREE.MeshPhongMaterial({ color: 'turquoise', side: THREE.DoubleSide });
    const fst_window = new THREE.Mesh(windowGeometry, windowMaterial);
    const sec_window = fst_window.clone();
    fst_window.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, hull_radius));
    sec_window.applyMatrix4(new THREE.Matrix4().makeTranslation(0, (hull_radius / 1.5), hull_radius));
    add_to_scane(fst_window, hull);
    add_to_scane(sec_window, hull);

    //cone 
    const coneGeometry = new THREE.ConeGeometry(hull_radius, cone_height, 32);
    const coneMaterial = new THREE.MeshPhongMaterial({ color: 'while' });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    add_to_scane(cone, space_ship)
    cone.applyMatrix4(new THREE.Matrix4().makeTranslation(0, (hull_height + cone_height) / 2, 0));


    return space_ship
}

space_ship = createSpaceShip()
scene.add(space_ship)
createLights();


// TODO: Planets
// You should add both earth and the moon here
const earthSize = 70;
const earthGeometry = new THREE.SphereGeometry(earthSize, 32, 16);
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.applyMatrix4(new THREE.Matrix4().makeTranslation(500, 5, 500));
scene.add(earth);

const moonSize = earthSize / 4;
const moonGeometry = new THREE.SphereGeometry(moonSize, 32, 16);
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0));
scene.add(moon);


// TODO: Bezier Curves
let curves_list = []
let moon_location = moon.getWorldPosition()
let earth_location = earth.getWorldPosition()
const curve_a = new THREE.QuadraticBezierCurve3(
    moon_location,
    new THREE.Vector3(0, 50, 50),

    earth_location
);
const curve_b = new THREE.QuadraticBezierCurve3(
    moon_location,
    new THREE.Vector3(50, 50, 0),

    earth_location
);
const curve_c = new THREE.QuadraticBezierCurve3(
    moon_location,
    new THREE.Vector3(50, 0, 50),
    earth_location
);
curves_list.push(curve_a)
curves_list.push(curve_b)
curves_list.push(curve_c)
let curr_curve_idx = 0


const points_a = curve_a.getPoints(10000);
const points_c = curve_c.getPoints(10000);
const points_b = curve_b.getPoints(10000);

const geometry_a = new THREE.BufferGeometry().setFromPoints(points_a);
const geometry_b = new THREE.BufferGeometry().setFromPoints(points_b);
const geometry_c = new THREE.BufferGeometry().setFromPoints(points_c);

const material = new THREE.LineBasicMaterial({ color: 0xff0000 });



// TODO: Camera Settings
// Set the camera following the spaceship here
const set_the_camera_settings = () => {

    camera.position.set(-100 + newPosition.x, 100, -100 + newPosition.z);
    // change the camera and spot light based on the space ship postion
    const pos = space_ship.getWorldPosition()
    camera.lookAt(pos)
    spot_light_to_spaceship.position.set(pos.x + 20, pos.y + 20, pos.z + 20);
    spot_light_to_spaceship.target = space_ship
}
const increase_speed = () => {
    fraction += speed
    if (fraction >= 1) {
        //    end game
        handle_end_game()

    }
    if (fraction < 0) {
        fraction = 0
        speed = start_speed
    }
}

const handle_end_game = () => {
    let game_points = 0
    goodStartObj.forEach(element => {
        if (element.starShape.visible == false) {
            game_points += 1
        }
    })
    badStartObj.forEach(element => {
        if (element.starShape.visible == false) {
            game_points -= 1
        }
    })

    alert("This is the end of the game, you got " + game_points + " points!")
    if (confirm("Do you want another game")) {
        start_new_game()
    } else {
        finish_games()

    }
}
const start_new_game = () => {
    fraction = 0
    starsList.forEach(element => element.starShape.visible = true)
    game_points = 0
    curr_curve_idx = 0
    speed = start_speed
}
const finish_games = () => {
        alert("it was lovley, see you next time")
        fraction = break_bond_for_end_game
    }
    // TODO: Add collectible stars
const starSize = 2;
const starGeometry = new THREE.DodecahedronGeometry(starSize);
const starGoodMaterial = new THREE.MeshPhongMaterial({ color: 'orange' });
const starBadMaterial = new THREE.MeshPhongMaterial({ color: 'red' });


const collectibleGoodStar = class {
    constructor(curve, locationOnCurve) {
        this.curve = curve;
        this.locationOnCurve = locationOnCurve;
        this.starShape = new THREE.Mesh(starGeometry, starGoodMaterial);
        add_to_scane(this.starShape, scene);
        this.starShape.position.copy(curve.getPoint(this.locationOnCurve))
    }
};
const collectibleBadStar = class {
    constructor(curve, locationOnCurve) {
        this.curve = curve;
        this.locationOnCurve = locationOnCurve;
        this.starShape = new THREE.Mesh(starGeometry, starBadMaterial);
        add_to_scane(this.starShape, scene);
        this.starShape.position.copy(curve.getPoint(this.locationOnCurve))
    }
};

const goodStartsAtr = [
    [curve_a, randomIntFromInterval()],
    [curve_a, randomIntFromInterval()],
    [curve_b, randomIntFromInterval()],
    [curve_b, randomIntFromInterval()],
    [curve_c, randomIntFromInterval()],
    [curve_c, randomIntFromInterval()]
]



const badStartsAtr = [
    [curve_a, randomIntFromInterval()],
    [curve_a, randomIntFromInterval()],
    [curve_b, randomIntFromInterval()],
    [curve_b, randomIntFromInterval()],
    [curve_c, randomIntFromInterval()],
    [curve_c, randomIntFromInterval()]

]

function randomIntFromInterval() { // min and max included 
    const min = 0.2
    const max = 0.9
    return Math.random() * (max - min) + min;
}

const goodStartObj = []
const badStartObj = []

goodStartsAtr.forEach(element => goodStartObj.push(new collectibleGoodStar(element[0], element[1])))
badStartsAtr.forEach(element => badStartObj.push(new collectibleBadStar(element[0], element[1])))
const starsList = goodStartObj.concat(badStartObj)

starsList.sort((a, b) => (a.locationOnCurve > b.locationOnCurve) ? 1 : -1)


// TODO: Add keyboard event
// We wrote some of the function for you

const handle_keydown = (e) => {

    if (e.code == 'ArrowRight') {
        if (curr_curve_idx == curves_list.length - 1) {
            curr_curve_idx = 0
        } else {
            curr_curve_idx++
        }

    } else if (e.code == 'ArrowLeft') {

        if (curr_curve_idx == 0) {
            curr_curve_idx = curves_list.length - 1
        } else {
            curr_curve_idx--
        }
    } else if (e.code == "ArrowUp") {
        speed += speed_incrment
        if (speed >= max_speed) {
            speed = max_speed
        }

    } else if (e.code == "ArrowDown") {
        speed -= speed_incrment
        if (speed <= min_speed) {
            speed = min_speed
        }
    }
}
document.addEventListener('keydown', handle_keydown);


let fraction = 0;
const up = new THREE.Vector3(0, 1, 0);
const axis = new THREE.Vector3();
let radians = degrees_to_radians(90)

let newPosition
let tangent

const start_speed = 0.001
const max_speed = 0.01
const min_speed = 0.0005
const speed_incrment = 0.001
let speed = start_speed
let game_points = 0
let diff = 0
const break_bond_for_end_game = 50

function animate() {
    if (fraction < break_bond_for_end_game) {

        requestAnimationFrame(animate);
        newPosition = curves_list[curr_curve_idx].getPoint(fraction);
        tangent = curves_list[curr_curve_idx].getTangent(fraction);

        space_ship.position.copy(newPosition);
        axis.crossVectors(up, tangent).normalize();

        space_ship.quaternion.setFromAxisAngle(axis, radians);

        set_the_camera_settings()
        renderer.render(scene, camera);

        increase_speed()

        // Test for star-spaceship collision
        starsList.forEach(element => {
            diff = Math.abs(element.locationOnCurve - fraction)
            if ((curves_list[curr_curve_idx] == element.curve) &&
                (diff <= speed)) {
                element.starShape.visible = false;
            }
        });



        increase_speed()


    }

}

animate()