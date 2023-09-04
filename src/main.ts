import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const texture = new THREE.TextureLoader().load('gsoc2-1.webp');
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
    map: texture
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

let pointLight = new THREE.SpotLight(0xffffff, 1000);
pointLight.position.set(-10, -20, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);


scene.add(camera);
scene.add(pointLight, ambientLight,);


// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
//  scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {


    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3)
        .fill(0)
        .map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill(0).forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('image.png');
scene.background = spaceTexture;

// torus
const loader = new GLTFLoader();


const jeffTexture = new THREE.TextureLoader().load('Chromium_Logo.svg.png');

const jeff = new THREE.Mesh(new THREE.CircleGeometry(2, 32), new THREE.MeshStandardMaterial({
    map: jeffTexture, metalness: 0.4,
    roughness: 0.8
}));

scene.add(jeff);

// google_logo


let google_logo;
// Load the GLTF model
loader.load(
    './google_logo/scene.gltf',
    (gltf) => {
        // Here you can set the position, rotation, and scale
        gltf.scene.position.z = 35; // example position
        gltf.scene.position.x = -30;// example position
        gltf.scene.scale.set(2.5 * window.innerWidth / window.innerHeight, 2.5 * window.innerWidth / window.innerHeight, 2.5 * window.innerWidth / window.innerHeight); // example scale
        scene.add(gltf.scene)
        google_logo = gltf.scene
    },
    undefined, // This is where you can add a progress callback
    (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
    }
);


jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    if (google_logo) {
        google_logo.rotation.x += 0.005;
        google_logo.rotation.y += 0.0075;
        google_logo.rotation.z += 0.005;
    }


    jeff.rotation.y += 0.01;
    jeff.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    if (google_logo)
        google_logo.rotation.y += 0.005;
    jeff.rotation.y += 0.01;
    jeff.rotation.z += 0.01;
    // controls.update();

    renderer.render(scene, camera);
}

animate();





