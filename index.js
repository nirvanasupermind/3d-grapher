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
var pointCloud;

// function createPoint(x, y, z) {
//     const geometry = new THREE.SphereGeometry(0.02, 32, 16);
//     const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//     const point = new THREE.Mesh(geometry, material);

//     point.position.set(x, y, z);
//     scene.add(point);
//     points.push(point);

//     point.cursor = "pointer";
//     // point.on("click", (ev) => {
//     //     alert(1);
//     // });
// }

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
}

function graph() {
    points.forEach((point) => scene.remove(point));
    points = [];

    const exp = document.querySelector("#exp").value;

    const xdata = makeArr(-10, 10, 200);
    const ydata = makeArr(-10, 10, 200);
    console.log(xdata);

    xdata.forEach((x) => {
        ydata.forEach((y) => {
            const z = evalMathExp(exp, x, y);
            points.push(new THREE.Vector3(x, y, z));
        });
        if(pointCloud) {
        scene.remove(pointCloud);
        }
        // var geometry = new THREE.ConvexGeometry(points);
        var geometry = new THREE.BufferGeometry();
        var vertices = [];
        for (var i = 0; i < points.length; i++) {
            vertices.push(points[i].x);
            vertices.push(points[i].y);
            vertices.push(points[i].z);
        }
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));

        var material = new THREE.PointsMaterial({
            color: "white",
            size: 2,
            sizeAttenuation: false
        });
        // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        
        pointCloud = new THREE.Points(geometry,material);
        scene.add(pointCloud);
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