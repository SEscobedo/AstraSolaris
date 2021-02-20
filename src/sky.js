import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import CameraControls from 'camera-controls';
import {AddStars, SkyReference, CreateReferenceGeometry} from './model_constructor.js';

let container, stats, cameraControls, time;
let camera, cameraTarget, scene, renderer;
const clock = new THREE.Clock();

const UA = 23454.8;

class App {

    init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );
        
        CameraControls.install( { THREE: THREE } );

        camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth/window.innerHeight,
        0.1,
        60000*UA
        );
        camera.position.set(0,0,UA);

        cameraTarget = new THREE.Vector3( 0, 0, 0 );

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x16161a );
    // scene.fog = new THREE.Fog( 0x16161a, 890 * UA, 900 * UA );

        const size = 6000 * UA;
        const divisions = 500;

    //const gridHelper = new THREE.GridHelper( size, divisions , 0xA01010, 0x101010 );
    // scene.add( gridHelper );

    
        //Stars
        AddStars(UA,scene);

        //Lines
        SkyReference(1000*UA,scene);
        

        

    var manager = new THREE.LoadingManager();

    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    progressElement.style.width = (itemsLoaded / itemsTotal * 100) + '%';
    };

    var Loaders = {
    Texture: new THREE.TextureLoader(manager)
    }
                

    

    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.shadowMap.enabled = true;


    container.appendChild( renderer.domElement );
    
    //camera controls
    cameraControls = new CameraControls( camera, renderer.domElement );
    cameraControls.dampingFactor = 0.05;
    cameraControls.draggingDampingFactor=0.25;
    cameraControls.verticalDragToForward = true;

    // stats

    stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize, false );

    animate();

    }

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    const updated = cameraControls.update( delta );


    render();
    stats.update();


}

function render() {

    camera.lookAt( cameraTarget );

    renderer.render( scene, camera );

}

export { App }