

import {PerspectiveCamera, 
    Vector3, 
    Scene, 
    Color, 
    Fog, 
    Mesh,
    PlaneBufferGeometry, 
    MeshPhongMaterial, 
    TextureLoader,
    HemisphereLight,
    WebGLRenderer,
    DirectionalLight,
    sRGBEncoding
} from 'three';

import Stats from 'three/examples/jsm/libs/stats.module';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//import { RoughnessMipmapper } from './../node_modules/three/examples/jsm/utils/RoughnessMipmapper.js';

let container, stats, asteroid;

let camera, cameraTarget, scene, renderer;

class App
{
    init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );
    
        camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.3, 15 );
        camera.position.set( 2.5, 0.3, 2.5 );
    
        cameraTarget = new Vector3( 0, 0, 0 );
    
        scene = new Scene();
        scene.background = new Color( 0x16161a );
        scene.fog = new Fog( 0x72645b, 0.05, 7 );
    
        // Ground
    
        const plane = new Mesh(
            new PlaneBufferGeometry( 40, 40 ),
            new MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
        );
        plane.rotation.x = - Math.PI / 2;
        plane.position.y = - 0.5;
        scene.add( plane );
    
        plane.receiveShadow = true;
    
    
        // ASCII file
    
        const loader = new STLLoader();
    
        
        //const texture = new THREE.TextureLoader().load('./../models/textures/Bennu_Global_Mosaic.jpg')
        //const material = new THREE.MeshStandardMaterial( { map: texture} );
    
        const material = new MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
        
    
        // Colored binary STL
        loader.load( '../../app/models/stl/Bennu/Bogus_Bennu_Shape.stl', function ( geometry ) {
    
        asteroid = new Mesh( geometry, material );
    
        asteroid.position.set( 0,  0.1, 0 );
        asteroid.rotation.set( 0, 0, 0 );
        asteroid.scale.set( 1, 1, 1 );
    
        asteroid.castShadow = true;
        asteroid.receiveShadow = true;
    
        scene.add( asteroid );
    
        } );
    
        
        //Format gltf
        // Instantiate a loader
        /*const loaderGLtf = new GLTFLoader();
    
        // Load a glTF resource
        loaderGLtf.load(
        // resource URL
        './../models/glTF/Osiris_Rex.glb',
        // called when the resource is loaded
        function ( gltf ) {
    
            gltf.scene.traverse( function ( child ) {
    
            if ( child.isMesh ) {
    
                    child.castShadow = true; 
                    child.receiveShadow = true; 
            }
    
            } );
            
            
    
            gltf.scene.position.set( 1, 0.15, 0);
            gltf.scene.rotation.set( - Math.PI / 2,0, Math.PI / 2 );
            gltf.scene.scale.set( 0.05, 0.05, 0.05 )
    
            scene.add( gltf.scene );
        
        },
    
        // called while loading is progressing
        function ( xhr ) {
    
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened: ' + error );
    
        }
        );*/
    
    /*const loaderGltf = new GLTFLoader().setPath( './../models/glTF/' );
    loaderGltf.load( 'Osiris_Rex.glb', function ( gltf ) {
    
        gltf.scene.traverse( function ( child ) {
    
            if ( child.isMesh ) {
    
                    child.castShadow = true; 
                    child.receiveShadow = true; 
                // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                    //roughnessMipmapper.generateMipmaps( child.material );
    
            }
    
        } );
        
        gltf.scene.position.set( 1, 0.15, 0);
        gltf.scene.rotation.set( - Math.PI / 2,0, Math.PI / 2 );
        gltf.scene.scale.set( 0.05, 0.05, 0.05 );
    
    
        scene.add( gltf.scene );
    
        //roughnessMipmapper.dispose();
    
    } );*/
                
    
        // Lights
    
        scene.add( new HemisphereLight( 0x443333, 0x111122 ) );
    
        addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
        addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );
    
        // renderer
    
        renderer = new WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.outputEncoding = sRGBEncoding;
    
        renderer.shadowMap.enabled = true;
    
    
        container.appendChild( renderer.domElement );
    
        // stats
    
        stats = new Stats();
        container.appendChild( stats.dom );
    
        window.addEventListener( 'resize', onWindowResize, false );
        animate();
    }
}


function addShadowedLight( x, y, z, color, intensity ) {

    const directionalLight = new DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    const d = 1;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;

    directionalLight.shadow.bias = - 0.002;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    

    render();
    stats.update();


}

function render() {

    const timer = Date.now() * 0.0002;

    camera.position.x = Math.cos( timer / 5 ) * 3;
    camera.position.z = Math.sin( timer / 5 ) * 3;
    //asteroid.rotation.set( 0,-2*timer, 0 );

    camera.lookAt( cameraTarget );

    renderer.render( scene, camera );

}

export { App }