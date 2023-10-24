import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import tembok from '../img/tembok.png';
import fcl from '../img/groundtop.png';

import skyposx from '../img/Daylight Box_Right.png';
import skynegx from '../img/Daylight Box_Left.png';
import skyposy from '../img/Daylight Box_Top.png';
import skynegy from '../img/Daylight Box_Bottom.png';
import skyposz from '../img/Daylight Box_Front.png';
import skynegz from '../img/Daylight Box_Back.png';

const sabreUrl = new URL('../assets/sabre.glb', import.meta.url);

const bedUrl = new URL('../assets/messy_bed.glb', import.meta.url);
const guitarUrl = new URL('../assets/guitar_acoustic.glb', import.meta.url);
const roomUrl = new URL('../assets/roomfiixbanget.glb', import.meta.url);
const mejaUrl = new URL('../assets/desk.glb', import.meta.url);
const shelfUrl = new URL('../assets/bookshelf.glb', import.meta.url);
const galonUrl = new URL('../assets/gallon_of_water.glb', import.meta.url);
const lampuUrl = new URL('../assets/ceiling_light.glb', import.meta.url);
const lemariUrl = new URL('../assets/lemarii.glb', import.meta.url);
const acUrl = new URL('../assets/ac_indoor.glb', import.meta.url);
const foamUrl = new URL('../assets/acoustic_foam_tile.glb', import.meta.url);
const trashUrl = new URL('../assets/trashbin2.glb', import.meta.url);
const fanUrl = new URL('../assets/electric_fan.glb', import.meta.url);
const dumbellUrl = new URL('../assets/dumbell.glb', import.meta.url);
const dumbellrackUrl = new URL('../assets/dumbell_rack.glb', import.meta.url);
const sofaUrl = new URL('../assets/sofa.glb', import.meta.url);
const sapupelUrl = new URL('../assets/sapupel.glb', import.meta.url);
const carpetUrl = new URL('../assets/carpet.glb', import.meta.url);
const treadmilUrl = new URL('../assets/treadmil.glb', import.meta.url);
const cathouseUrl = new URL('../assets/cat_house.glb', import.meta.url);

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
    skyposx,
    skynegx,
    skyposy,
    skynegy,
    skyposz,
    skynegz
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

// const axesHelper = new THREE.AxesHelper(3);                     //entitas helper (sumbu)
// scene.add(axesHelper);                                          //menambahkan helper ke scene/canvas

camera.position.set(0, 15, 55);                               //set posisi camera
// const orbit = new OrbitControls(camera, renderer.domElement);   //entitas orbit control
// orbit.update();                                                 //update posisi kontrol ketika diubah

//-------------------------------------------------------------------------------------------------------------
//mousemove raycaster start
const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX/window.innerWidth)*2-1;
    mousePosition.y = - (e.clientY/window.innerHeight)*2+1;
});

const raycasterMouse = new THREE.Raycaster();
//mousemove raycaster end


let raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let plcontrols = new PointerLockControls(camera, document.body);

const blocker = document.getElementById( 'blocker' );
const instructions = document.getElementById( 'instructions' );

instructions.addEventListener( 'click', function () {

    plcontrols.lock();

} );

plcontrols.addEventListener( 'lock', function () {

    instructions.style.display = 'none';
    blocker.style.display = 'none';
    // animate();
} );

plcontrols.addEventListener( 'unlock', function () {

    blocker.style.display = 'block';
    instructions.style.display = '';
    // plcontrols.unlock();
    // animate();
} );

scene.add( plcontrols.getObject() );

const onKeyDown = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if ( canJump === true ) velocity.y += 200;
            canJump = false;
            break;

    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );
// raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
//------------------------------------------------------------------------------------------------------


//light start
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 4);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 30, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -20;
// directionalLight.shadow.camera.left = -10

// const dLigthHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
// scene.add(dLigthHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);
//light end

//spotlight start
const spotLight = new THREE.SpotLight(0xFFFFFF, 9000);
scene.add(spotLight);
spotLight.position.set(50, 30, -35);
spotLight.castShadow = true;
spotLight.angle = 0;
spotLight.target.position.set(-10, 0, -20);

const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);
//spotlight end

//spotlight2 start
const spotlight2 = new THREE.SpotLight(0xFFFFFF, 4000);
scene.add(spotlight2);
spotlight2.position.set(0, 35, 0);
spotlight2.castShadow = true;
spotlight2.angle = 2;
// spotlight2.target.position.set(-10, 0, -20);

const sLightHelper2 = new THREE.SpotLightHelper(spotlight2);
// scene.add(sLightHelper2);
//spotlight2 end

//sabre
let sabreObject;
assetLoader.load(sabreUrl.href, function(gltf){
    const sabre = gltf.scene;
    scene.add(sabre);

    mixer = new THREE.AnimationMixer(sabre);
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, 'Sitting'); //ubah manual
    const action = mixer.clipAction(clip);
    action.play();

    const scaleFactor = 5; // You can adjust this value as needed
    sabre.scale.set(scaleFactor, scaleFactor, scaleFactor);
    sabre.position.set(7, 0, 40);
    sabre.rotateY(1.15);
    // sabre.lookAt(new THREE.Vector3(20, 0, 0));

    sabre.castShadow = true;
    sabre.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
        }
    });
    sabreObject = sabre;

}, undefined, function(error){
    console.error(error);
});
//sabre

//bed
assetLoader.load(bedUrl.href, function(gltf){
    const bed = gltf.scene;
    scene.add(bed);

    const scaleFactor = 0.20; // You can adjust this value as needed
    bed.scale.set(scaleFactor, 0.15, scaleFactor);
    bed.position.set(-16, 0, -30);
    // bed.lookAt(new THREE.Vector3(20, 0, 0));

    bed.castShadow = true;
    bed.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
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

    const scaleFactor = 1.5; // You can adjust this value as needed
    guitar.scale.set(scaleFactor, scaleFactor, scaleFactor);
    guitar.position.set(-27, 0, -5);
    guitar.rotateY(1.55);
    // guitar.lookAt(new THREE.Vector3(20, 0, 0));

    guitar.castShadow = true;
    guitar.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//guitar

//mejagaming
assetLoader.load(mejaUrl.href, function(gltf){
    const meja = gltf.scene;
    scene.add(meja);

    const scaleFactor = 0.6; // You can adjust this value as needed
    meja.scale.set(scaleFactor, scaleFactor, scaleFactor);
    meja.rotateY(-1.5);
    meja.position.set(24, 0, -35);
    // meja.lookAt(new THREE.Vector3(20, 0, 0));

    meja.castShadow = true;
    meja.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//mejagaming

//shelf
assetLoader.load(shelfUrl.href, function(gltf){
    const shelf = gltf.scene;
    scene.add(shelf);

    const scaleFactor = 0.7; // You can adjust this value as needed
    shelf.scale.set(scaleFactor, scaleFactor, scaleFactor);
    shelf.rotateY(-1.5);
    shelf.position.set(24, 0, -5);
    // shelf.lookAt(new THREE.Vector3(20, 0, 0));

    shelf.castShadow = true;
    shelf.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//shelf

//galon
assetLoader.load(galonUrl.href, function(gltf){
    const galon = gltf.scene;
    scene.add(galon);

    const scaleFactor = 0.06; // You can adjust this value as needed
    galon.scale.set(scaleFactor, scaleFactor, scaleFactor);
    galon.rotateY(-1.5);
    galon.position.set(27, 3, -10);
    // galon.lookAt(new THREE.Vector3(20, 0, 0));

    galon.castShadow = true;
    galon.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//galon

//lampu
assetLoader.load(lampuUrl.href, function(gltf){
    const lampu = gltf.scene;
    scene.add(lampu);

    const scaleFactor = 3; // You can adjust this value as needed
    lampu.scale.set(scaleFactor, scaleFactor, scaleFactor);
    lampu.position.set(0, 37, 0);
    // lampu.lookAt(new THREE.Vector3(20, 0, 0));

    lampu.castShadow = true;
    lampu.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//lampu

//lemari
assetLoader.load(lemariUrl.href, function(gltf){
    const lemari = gltf.scene;
    scene.add(lemari);

    const scaleFactor = 3; // You can adjust this value as needed
    lemari.scale.set(scaleFactor, scaleFactor, scaleFactor);
    lemari.position.set(38, 0, 6);
    lemari.rotateY(-1.56);
    // lemari.lookAt(new THREE.Vector3(20, 0, 0));

    // lemari.castShadow = true;
    lemari.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//lemari

//ac
assetLoader.load(acUrl.href, function(gltf){
    const ac = gltf.scene;
    scene.add(ac);

    const scaleFactor = 13; // You can adjust this value as needed
    ac.scale.set(scaleFactor, scaleFactor, scaleFactor);
    ac.position.set(0, 32, 55);
    ac.rotateY(3.15)
    ac.scale.setX(17);
    // ac.lookAt(new THREE.Vector3(20, 0, 0));

    ac.castShadow = true;
    ac.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//ac

//foam
assetLoader.load(foamUrl.href, function(gltf){
    const foam = gltf.scene;
    scene.add(foam);

    const scaleFactor = 100; // You can adjust this value as needed
    foam.scale.set(scaleFactor, scaleFactor, scaleFactor);
    foam.position.set(0, 20, -55);
    foam.rotateY(3.15);
    foam.scale.setX(150);

    foam.castShadow = true;
    foam.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            
            child.material.shadowSide = THREE.DoubleSide;
            // child.material.shadowMap.autoUpdate = true;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//foam

//trash
assetLoader.load(trashUrl.href, function(gltf){
    const trash = gltf.scene;
    scene.add(trash);

    const scaleFactor = 0.07; // You can adjust this value as needed
    trash.scale.set(scaleFactor, scaleFactor, scaleFactor);
    trash.position.set(-5, 1, 54);
    trash.rotateY(1.55);

    // trash.castShadow = true;
    trash.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//trash

//fan
assetLoader.load(fanUrl.href, function(gltf){
    const fan = gltf.scene;
    scene.add(fan);

    const scaleFactor = 0.17; // You can adjust this value as needed
    fan.scale.set(scaleFactor, scaleFactor, scaleFactor);
    fan.position.set(20, 0, -13);
    fan.rotateY(-1.55);

    // fan.castShadow = true;
    fan.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//fan

//dumbell
let dumbellObject;
assetLoader.load(dumbellUrl.href, function(gltf){
    const dumbell = gltf.scene;
    scene.add(dumbell);

    const scaleFactor = 1; // You can adjust this value as needed
    dumbell.scale.set(scaleFactor, scaleFactor, scaleFactor);
    dumbell.position.set(-10, 1, 22);
    dumbell.rotateY(1.15);

    // dumbell.castShadow = true;
    dumbell.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });
    dumbellObject = dumbell;

}, undefined, function(error){
    console.error(error);
});
//dumbell

//------------------------------------------------------------------------------------------------------
// let dragControl;
// dragControl = new DragControls([dumbellObject], camera, renderer.domElement);
// dragControl.addEventListener('drag', animate);


// const onClick = function ( event ) {

//     event.preventDefault();

//     const draggableObjects = dragControl.getObjects();
//     draggableObjects.length = 0;

//     mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     mousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//     raycasterMouse.setFromCamera( mouse, camera );

//     const dragIntersection = raycaster.intersectObject( dumbellObject, true );

//     if ( dragIntersection.length > 0 ) {

//         // const object = dragIntersection[ 0 ].object;
//         // scene.attach(dumbellObject);a

//         dragControl.transformGroup = true;
//         draggableObjects.push( dumbellObject );

//     }

//     // if ( group.children.length === 0 ) {

//     //     controls.transformGroup = false;
//     //     draggableObjects.push( ...objects );

//     // }

//     animate();
// }

// document.addEventListener( 'click', onClick );
//------------------------------------------------------------------------------------------------------






//dumbellrack
assetLoader.load(dumbellrackUrl.href, function(gltf){
    const dumbellrack = gltf.scene;
    scene.add(dumbellrack);

    const scaleFactor = 15; // You can adjust this value as needed
    dumbellrack.scale.set(scaleFactor, scaleFactor, scaleFactor);
    dumbellrack.position.set(25, 0, 23);
    dumbellrack.rotateY(-1.55);

    // dumbellrack.castShadow = true;
    dumbellrack.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//dumbellrack

//sofa
assetLoader.load(sofaUrl.href, function(gltf){
    const sofa = gltf.scene;
    scene.add(sofa);

    const scaleFactor = 0.3; // You can adjust this value as needed
    sofa.scale.set(scaleFactor, scaleFactor, scaleFactor);
    sofa.position.set(-23, 0, 16);
    sofa.rotateY(3.15);
    sofa.scale.setZ(0.4);

    // sofa.castShadow = true;
    sofa.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//sofa

//sapupel
assetLoader.load(sapupelUrl.href, function(gltf){
    const sapupel = gltf.scene;
    scene.add(sapupel);

    const scaleFactor = 0.08; // You can adjust this value as needed
    sapupel.scale.set(scaleFactor, scaleFactor, scaleFactor);
    sapupel.position.set(-28, 0, 45);
    sapupel.rotateY(1.55);

    // sapupel.castShadow = true;
    sapupel.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//sapupel

//carpet
assetLoader.load(carpetUrl.href, function(gltf){
    const carpet = gltf.scene;
    scene.add(carpet);

    const scaleFactor = 0.25; // You can adjust this value as needed
    carpet.scale.set(scaleFactor, scaleFactor, scaleFactor);
    carpet.position.set(-10, -2.4, 16.5);
    carpet.rotateY(1.55);

    // carpet.castShadow = true;
    carpet.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//carpet

//treadmil
assetLoader.load(treadmilUrl.href, function(gltf){
    const treadmil = gltf.scene;
    scene.add(treadmil);

    const scaleFactor = 0.01; // You can adjust this value as needed
    treadmil.scale.set(scaleFactor, scaleFactor, scaleFactor);
    treadmil.position.set(20, 0, 43);
    // treadmil.rotateY(1.55);

    // treadmil.castShadow = true;
    treadmil.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//treadmil

//cathouse
assetLoader.load(cathouseUrl.href, function(gltf){
    const cathouse = gltf.scene;
    scene.add(cathouse);

    const scaleFactor = 150; // You can adjust this value as needed
    cathouse.scale.set(scaleFactor, scaleFactor, scaleFactor);
    cathouse.position.set(7, 0, 50);
    cathouse.rotateY(3.15);

    // cathouse.castShadow = true;
    cathouse.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//cathouse

//room
assetLoader.load(roomUrl.href, function(gltf){
    const room = gltf.scene;
    scene.add(room);



    const scaleFactor = 0.1; // You can adjust this value as needed
    room.scale.set(scaleFactor, scaleFactor, scaleFactor);
    room.position.set(0, 0, 0);
    // room.lookAt(new THREE.Vector3(20, 0, 0));

    room.castShadow = true;
    room.traverse((child) => {
        if (child.isMesh) {
            // child.castShadow = true;
            child.receiveShadow = true;
            child.material.shadowSide = THREE.DoubleSide;
        }
    });


}, undefined, function(error){
    console.error(error);
});
//room


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

    spotLightAngle: 0,
    spotLightPenumbra: 0,
    spotLightIntensity: 9000,
    LampColor: 0xFFFFFF,
    ToggleLamp: false
    // spotLightPositionX: -80
};
// gui.addColor(options, 'sphereColor').onChange(function(e){
//     sphere.material.color.set(e);
// });
// gui.add(options, 'wireframe').onChange(function(e){
//     sphere.material.wireframe = e;
// });
gui.add(options, 'spotLightAngle', 0, 1);
gui.add(options, 'spotLightPenumbra', 0, 1);
gui.add(options, 'spotLightIntensity', 0, 50000);
gui.addColor(options, 'LampColor').onChange(function(e){
    spotlight2.color.set(e);
});
gui.add(options, 'ToggleLamp').onChange(function(e){
    if(e > 0){
        spotlight2.angle = 0;
    } else if(e == 0){
        spotlight2.angle = 2;
    }
});



animate();
function animate(){ //fungsi untuk bikin animasi rotasi
    requestAnimationFrame( animate );
    const time = performance.now();

    spotLight.angle = options.spotLightAngle;
    spotLight.penumbra = options.spotLightPenumbra;
    spotLight.intensity = options.spotLightIntensity;
    sLightHelper.update();

    if(mixer)
        mixer.update(clock.getDelta()); 

        //POINTER LOCK CONTROL START
    

        if ( plcontrols.isLocked === true ) {

            raycaster.ray.origin.copy( plcontrols.getObject().position );
            raycaster.ray.origin.y -= 10;
    
            // const intersections = raycaster.intersectObjects( objects, false );
    
            // const onObject = intersections.length > 0;
    
            const delta = ( time - prevTime ) / 1000;
    
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
    
            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    
            direction.z = Number( moveForward ) - Number( moveBackward );
            direction.x = Number( moveRight ) - Number( moveLeft );
            direction.normalize(); // this ensures consistent movements in all directions
    
            if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
            if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
    
    
            plcontrols.moveRight( - velocity.x * delta );
            plcontrols.moveForward( - velocity.z * delta );
    
            plcontrols.getObject().position.y += ( velocity.y * delta ); // new behavior
    
            if ( plcontrols.getObject().position.y < 15 ) {
    
                velocity.y = 0;
                plcontrols.getObject().position.y = 15;
    
                canJump = true;
            } 
            if(plcontrols.getObject().position.x > 30){
                plcontrols.getObject().position.x = 30;
            } else if(plcontrols.getObject().position.x < -30){
                plcontrols.getObject().position.x = -30;
            } else if(plcontrols.getObject().position.z > 55){
                plcontrols.getObject().position.z = 55;
            } else if(plcontrols.getObject().position.z < -55){
                plcontrols.getObject().position.z = -55;
            }
    
        }
    
        prevTime = time;
        //POINTER LOCK CONTROL END

        raycasterMouse.setFromCamera(mousePosition, camera);
        const intersectDumbell = raycasterMouse.intersectObject(dumbellObject, true);
        const intersectSabre = raycasterMouse.intersectObject(sabreObject, true);

        if (intersectDumbell.length > 0) {
            dumbellObject.rotation.y += 0.02; // Contoh: putar objek 
            // dumbellObject.position.x +=0.02
        }
        if (intersectSabre.length > 0) {
            sabreObject.rotation.y += 0.02; // Contoh: putar objek 
            sabreObject.position.z -=0.02
        }
    
    renderer.render(scene, camera);
}

// renderer.setAnimationLoop(animate); //agar renderer dijalankan setiap satuan detik

window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
