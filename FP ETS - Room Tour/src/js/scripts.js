import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import tembok from '../img/tembok.png';
import fcl from '../img/groundtop.png';

const sabreUrl = new URL('../assets/sabre.glb', import.meta.url);

const tableUrl = new URL('../assets/wooden_table.glb', import.meta.url);
const chairUrl = new URL('../assets/office_chair.glb', import.meta.url);
const wardrobeUrl = new URL('../assets/wardrobe.glb', import.meta.url);
const shelfUrl = new URL('../assets/shelf__woode_metal.glb', import.meta.url);
const bedUrl = new URL('../assets/messy_bed.glb', import.meta.url);
const guitarUrl = new URL('../assets/guitar_acoustic.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();                //setup buat render scene / canvas
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);    //setup buat size scene/canvas
document.body.appendChild(renderer.domElement);             //connect elemen html

const scene = new THREE.Scene();                            //create scene/canvas baru

// scene.fog = new THREE.Fog(0x333333, 0, 200);    //fog cara1
// scene.fog = new THREE.FogExp2(0xACACAC, 0.01);     //fog cara2
renderer.setClearColor(0xACACAC);                  //ganti warna background
const textureLoader = new THREE.TextureLoader();      //external background texture
const cubeTextureLoader = new THREE.CubeTextureLoader();
const assetLoader = new GLTFLoader();

const cubeBGTexture = cubeTextureLoader.load([
    tembok,
    tembok,
    fcl,
    fcl,
    tembok,
    tembok
]);
cubeBGTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = cubeBGTexture;

//global variable
let step = 0;
// let speed = 0.01;
let mixer;
const clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(                 //entitas kamera perspektif 
    45,                                                     //fov: field of view
    window.innerWidth / window.innerHeight,                 //aspect ratio
    0.1,                                                    //near view
    1000                                                    //far view
);

const axesHelper = new THREE.AxesHelper(3);                     //entitas helper (sumbu)
scene.add(axesHelper);                                          //menambahkan helper ke scene/canvas

camera.position.set(-10, 30, 30);                               //set posisi camera
const orbit = new OrbitControls(camera, renderer.domElement);   //entitas orbit control
orbit.update();                                                 //update posisi kontrol ketika diubah

//bikin kubus start
const boxGeometry = new THREE.BoxGeometry();                        //skeleton dari box
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00}); //skin(mesh) dari box
const box = new THREE.Mesh(boxGeometry, boxMaterial);               //fusion dari skeleton dan skin
scene.add(box);                                                     //menambahkan objek ke scene (canvas)
//bikin kubus end

//bikin alas dan grid start
const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xDBDBDB,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
// plane.position.y = -100;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(10000);
scene.add(gridHelper);
//bikin alas dan grid end 

//light start
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.left = -10

const dLigthHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
scene.add(dLigthHelper);

const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(dLightShadowHelper);
//light end

//spotlight start
const spotLight = new THREE.SpotLight(0xFFFFFF, 9000);
scene.add(spotLight);
spotLight.position.set(-80, 80, 30);
spotLight.castShadow = true;
spotLight.angle = 0;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);
//spotlight end

//sabre
assetLoader.load(sabreUrl.href, function(gltf){
    const sabre = gltf.scene;
    scene.add(sabre);

    mixer = new THREE.AnimationMixer(sabre);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Attack'); //ubah manual
    const action = mixer.clipAction(clip);
    action.play();

    const scaleFactor = 5; // You can adjust this value as needed
    sabre.scale.set(scaleFactor, scaleFactor, scaleFactor);
    sabre.position.set(-10, 0, -5);
    sabre.lookAt(new THREE.Vector3(20, 0, 0));

    sabre.castShadow = true;
    sabre.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
            child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//sabre

//table
assetLoader.load(tableUrl.href, function(gltf){
    const table = gltf.scene;
    scene.add(table);

    const scaleFactor = 1; // You can adjust this value as needed
    table.scale.set(scaleFactor, scaleFactor, scaleFactor);
    table.position.set(-20, 1, 0);
    // table.lookAt(new THREE.Vector3(20, 0, 0));

    table.castShadow = true;
    table.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
            child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//table


//chair
assetLoader.load(chairUrl.href, function(gltf){
    const chair = gltf.scene;
    scene.add(chair);

    const scaleFactor = 0.03; // You can adjust this value as needed
    chair.scale.set(scaleFactor, scaleFactor, scaleFactor);
    chair.position.set(-15, 0, 0);
    // chair.lookAt(new THREE.Vector3(20, 0, 0));

    chair.castShadow = true;
    chair.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
            child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//chair

//wardrobe
assetLoader.load(wardrobeUrl.href, function(gltf){
    const wardrobe = gltf.scene;
    scene.add(wardrobe);

    const scaleFactor = 1; // You can adjust this value as needed
    wardrobe.scale.set(scaleFactor, scaleFactor, scaleFactor);
    wardrobe.position.set(-10, 0, 0);
    // wardrobe.lookAt(new THREE.Vector3(20, 0, 0));

    wardrobe.castShadow = true;
    wardrobe.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
            child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//wardrobe

//shelf
assetLoader.load(shelfUrl.href, function(gltf){
    const shelf = gltf.scene;
    scene.add(shelf);

    const scaleFactor = 5; // You can adjust this value as needed
    shelf.scale.set(scaleFactor, scaleFactor, scaleFactor);
    shelf.position.set(-5, 0, 0);
    // shelf.lookAt(new THREE.Vector3(20, 0, 0));

    shelf.castShadow = true;
    shelf.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
            child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//shelf

//bed
assetLoader.load(bedUrl.href, function(gltf){
    const bed = gltf.scene;
    scene.add(bed);

    const scaleFactor = 0.05; // You can adjust this value as needed
    bed.scale.set(scaleFactor, scaleFactor, scaleFactor);
    bed.position.set(5, 0, 0);
    // bed.lookAt(new THREE.Vector3(20, 0, 0));

    bed.castShadow = true;
    bed.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
            child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//bed

//guitar
assetLoader.load(guitarUrl.href, function(gltf){
    const guitar = gltf.scene;
    scene.add(guitar);

    const scaleFactor = 0.5; // You can adjust this value as needed
    guitar.scale.set(scaleFactor, scaleFactor, scaleFactor);
    guitar.position.set(10, 0, 0);
    // guitar.lookAt(new THREE.Vector3(20, 0, 0));

    guitar.castShadow = true;
    guitar.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
            child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//guitar


// scene.background = textureLoader.load(galaxy4);  //satu image buat texture background

// const cubeBGTexture = cubeTextureLoader.load([
//     galaxy1,
//     galaxy1,
//     galaxy1,
//     galaxy1,
//     galaxy1,
//     galaxy1
// ]);
// cubeBGTexture.colorSpace = THREE.SRGBColorSpace;
// scene.background = cubeBGTexture;


const gui = new dat.GUI();  //instansiasi dat.gui
const options = {
    // sphereColor: '#ffea00',
    // wireframe: false,
    speed: 0.01,
    spotLightAngle: 0,
    spotLightPenumbra: 0,
    spotLightIntensity: 9000
    // spotLightPositionX: -80
};
// gui.addColor(options, 'sphereColor').onChange(function(e){
//     sphere.material.color.set(e);
// });
// gui.add(options, 'wireframe').onChange(function(e){
//     sphere.material.wireframe = e;
// });
gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'spotLightAngle', 0, 1);
gui.add(options, 'spotLightPenumbra', 0, 1);
gui.add(options, 'spotLightIntensity', 0, 50000);




function animate(){ //fungsi untuk bikin animasi rotasi
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    // step +=options.speed;
    // sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.spotLightAngle;
    spotLight.penumbra = options.spotLightPenumbra;
    spotLight.intensity = options.spotLightIntensity;
    sLightHelper.update();

    if(mixer)
        mixer.update(clock.getDelta()); 

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate); //agar renderer dijalankan setiap satuan detik

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidht, window.innerHeight);
});