"use strict";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.zoom = 10;
const renderer = new THREE.WebGLRenderer({ antialiasing: true });
renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.update();

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

var points = [];

function createPoint(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.02, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const point = new THREE.Mesh(geometry, material);

    point.position.set(x, y, z);
    scene.add(point);
    points.push(point);

    point.cursor = "pointer";
    // point.on("click", (ev) => {
    //     alert(1);
    // });
}

function graph() {
    points.forEach((point) => scene.remove(point));
    points = [];

    const exp = document.querySelector("#exp").value;

    const xdata = Array(100).fill().map((_, i) => i * 0.2 - 10);
    const ydata = Array(100).fill().map((_, i) => i * 0.2 - 10);

    xdata.forEach((x) => {
        ydata.forEach((y) => {
            const z = evalMathExp(exp, x, y);
            createPoint(x, y, z);
        });
    });
}

camera.position.z = 5;


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
};

animate();