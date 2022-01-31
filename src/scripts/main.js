import * as THREE from '../../lib/three.module.js';
import { OrbitControls } from '../../lib/OrbitControls.js';


const scene = new THREE.Scene();
scene.antialias = true;
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
    );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera,renderer.domElement);
controls.update();

camera.position.set(0,0,-200);
camera.lookAt(0,0,0);

let earth,clouds,moon,mercury,pivotPoint,stars,sky_sphere;

load_geo();
load_light();
load_particles();
animate();

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y-=0.002;
    clouds.rotation.y-=0.005;
    moon.rotation.y+=0.01;
    mercury.rotation.y+=0.007;
    pivotPoint.rotation.y+=0.007;
    stars.rotation.y+=0.003;
    sky_sphere.rotation.y-=0.002;

    controls.update();
    renderer.render( scene, camera );
}

function load_geo() {
    //Textures
    const space = new THREE.TextureLoader().load('../../assets/textures/space.jpg');
    const earth_txt = new THREE.TextureLoader().load('../../assets/textures/earth.jpg');
    const clouds_txt = new THREE.TextureLoader().load('../../assets/textures/clouds.jpg');
    const moon_txt = new THREE.TextureLoader().load('../../assets/textures/moon.jpg');
    const mercury_txt = new THREE.TextureLoader().load('../../assets/textures/mercury.jpg');

    //Grid
    const grid = new THREE.GridHelper(400);
    // scene.add(grid);

    //Geometries
    const sky_sphere_geo = new THREE.SphereGeometry(500,100);
    const sky_sphere_mat = new THREE.MeshBasicMaterial({
        color:0xffffff,
        map:space,
        side:THREE.BackSide
    });
    sky_sphere = new THREE.Mesh(sky_sphere_geo, sky_sphere_mat);
    scene.add(sky_sphere);

    const earth_geo = new THREE.SphereGeometry(120,100);
    const earth_mat = new THREE.MeshStandardMaterial({map:earth_txt});
    earth = new THREE.Mesh(earth_geo,earth_mat);
    earth.position.set(150,0,0);
    scene.add(earth);

    const clouds_geo = new THREE.SphereGeometry(121,100);
    const clouds_mat = new THREE.MeshStandardMaterial({
        map:clouds_txt,
        transparent:true,
        opacity:0.4
    });
    clouds = new THREE.Mesh(clouds_geo,clouds_mat);
    clouds.position.set(150,0,0);
    scene.add(clouds);

    // earth_group.add(earth);
    // earth_group.add(clouds);
    // scene.add(earth_group);

    const moon_geo = new THREE.SphereGeometry(5,10);
    const moon_mat = new THREE.MeshStandardMaterial({map:moon_txt});
    moon = new THREE.Mesh(moon_geo,moon_mat);
    moon.position.set(150,0,-130);
    scene.add(moon);

    pivotPoint = new THREE.Object3D();
    earth.add(pivotPoint);
    pivotPoint.rotation.set(0,-250,0);
    pivotPoint.add(moon);

    const merc_geo = new THREE.SphereGeometry(15,32);
    const merc_mat = new THREE.MeshStandardMaterial({map:mercury_txt});
    mercury = new THREE.Mesh(merc_geo,merc_mat);
    mercury.position.set(-250,150,200);
    scene.add(mercury);
}

function load_light() {
    const ambi_light = new THREE.AmbientLight(0x005396,0.5);
    scene.add(ambi_light);

    const dir_light = new THREE.DirectionalLight(0xffffff, 2);
    dir_light.position.set(0,250,250);
    scene.add(dir_light);

    const dir_helper = new THREE.DirectionalLightHelper(dir_light);
    // scene.add(dir_helper);
}

function load_particles() {
    const star_txt = new THREE.TextureLoader().load('../../assets/textures/star.png');

    let points = [];

    for (let i = 0; i < 300; i++) {
        let star = new THREE.Vector3(
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500
        );
        points.push(star);
    }

    const star_geo = new THREE.BufferGeometry().setFromPoints(points);

    const star_mat = new THREE.PointsMaterial({
        color:0xffffff,
        map:star_txt
    });

    stars = new THREE.Points(star_geo,star_mat);
    scene.add(stars);
}