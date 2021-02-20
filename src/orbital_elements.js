

import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';


let container, stats, planet, cameraControls, satellite, Orbit_Line, OrbitPlane, Orbit, time,
dirNorm, dirY, SatPosVector, PerigeeVector, origin, orbitGroup, lineOfNodes, materialOrbit;
let camera, cameraTarget, scene, renderer;
let a, e, w, i, n;

const GRADTORAD =   Math.PI / 180;
const clock = new THREE.Clock();
time = 0;

class App {
    init() {

    
        const params = {
            Semimajor_axis: 1.7,
            Eccentricity: 0.5,
            Argument_of_periapsis: 50,
            Longitude_of_ascending_node: 80,
            Inclination: 30,
            Background_Color : 0x16161a
        };
        
        
        a = params.Semimajor_axis;
        e = params.Eccentricity;
        n = params.Longitude_of_ascending_node;
        w = params.Argument_of_periapsis;
        i = params.Inclination;
    
        //scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x16161a );
        scene.fog = new THREE.Fog( 0x72645b, 0.05, 70 );
    
        //gui
        const gui = new GUI({ width: 430 });
    
        gui.add( params, 'Semimajor_axis' , 0.5, 5 ).step( 0.01 ).onChange( function ( value ) {
            a = value;
            ElementsUpdate();
        });
        gui.add( params, 'Eccentricity' , 0, 0.99 ).step( 0.01 ).onChange( function ( value ) {
            e = value;
            ElementsUpdate();
        });
        gui.add( params, 'Argument_of_periapsis', 0, 360 ).step( 0.1 ).onChange( function ( value ) {
            w = value;
            ElementsUpdate();
        } );
        gui.add( params, 'Longitude_of_ascending_node', 0, 360 ).step( 0.1 ).onChange( function ( value ) {
            n = value;
            ElementsUpdate();
        } );
        gui.add( params, 'Inclination', 0, 180).step( 0.1 ).onChange( function ( value ) {
            i = value;
            ElementsUpdate();
        });
        gui.addColor( params, 'Background_Color').onChange( function ( value ) {
            scene.background = new THREE.Color( value );
        });
        gui.open();
    
        //container
        container = document.createElement( 'div' );
        document.body.appendChild( container );

         //add informatio
         var div = document.createElement( 'div' );
         div.innerHTML = `<h3><a href="https://spaceflight.nasa.gov/realdata/elements/index.html" target="_blank" rel="noopener">Elementos orbitales</a></h3>
         Animación y modelo para <a href="http://www.astrasolaris.org" target="_blank" rel="noopener">AstraSolaris</a>.<br/>
         Proyecto en construcción. <a href="https://github.com/SEscobedo/AstraSolaris/tree/master/galery/orbital_elements.html" target="_blank" rel="noopener">Ver Código fuente</a>.<br/>`;   
         
        


    
        //camera
        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.3, 100 );
        camera.position.set( 10, 4, 10 );
        cameraTarget = new THREE.Vector3( 0, 0, 0 );
    
    
        // ecuatorial plane
        const material = new THREE.MeshPhongMaterial( { 
            color: 0x999999,
            specular: 0x101010,  
            side: THREE.DoubleSide, 
            transparent: true,
            opacity: 0.9
        });
    
        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 4, 4 ),
            material
        );
        plane.rotation.x = - Math.PI / 2;
        plane.position.y = 0;
        scene.add( plane );
    
        plane.receiveShadow = true;
    
        
        //Planet
        const planet = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 0.5, 40, 40),
            new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
        );
        planet.position.set(0,0,0);
        scene.add( planet );
    
    
        //Vernal equinox and orthogonal axis
        const dirX = new THREE.Vector3( 0, 0, 1 );
        origin = new THREE.Vector3( 0, 0, 0 );
        const VernalEquinox = new THREE.ArrowHelper( dirX, origin, 2, 0xffff00 );
        scene.add( VernalEquinox );
    
        const dirZ = new THREE.Vector3( 1, 0, 0 );
        const VernalEquinoxOrto = new THREE.ArrowHelper( dirZ, origin, 2, 0xffff00 );
        scene.add( VernalEquinoxOrto );
    
        dirY = new THREE.Vector3( 0, 1, 0 );
        const VernalEquinoxOrtoY = new THREE.ArrowHelper( dirY, origin, 2, 0xffff00 );
        scene.add( VernalEquinoxOrtoY );
    
        //Line of nodes                
        lineOfNodes = CreateLineOfNodes(n);
    
        //OrbitPath
        Orbit_Line = GetOrbitLine(a,e);
        materialOrbit = new THREE.LineBasicMaterial( { color : 0x1AB1CD } );
    
        // Create the final object to add to the scene
        Orbit = new THREE.Line( GetGeometryOrbit(Orbit_Line), materialOrbit);
    
        //Orbiting object
        satellite = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 0.05, 10, 20),
            new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
        );
        const r = Orbit_Line.getPoint(0.5);
        satellite.position.set(r.x,r.y,r.z);
        
        //Position Vector
        const dirSat = satellite.position.clone();
        dirSat.normalize();
        SatPosVector = new THREE.ArrowHelper( dirSat, origin, origin.distanceTo(satellite.position), 0xff0000 );
    
        //Perigee direction
        const per = Orbit_Line.getPoint(0.5);
        const dirPer = new THREE.Vector3( per.x, per.y, per.z);
        dirPer.normalize();
        PerigeeVector = new THREE.ArrowHelper( dirPer, origin, origin.distanceTo(satellite.position), 0x000fff);
        
        //Normal axis to the orbit plane
        const NormalAxis = new THREE.ArrowHelper( Orbit.normal, origin, 1.5, 0x228811 );
        const Inpoint = Orbit_Line.getPoint(0);
        const dirInpoint = new THREE.Vector3( Inpoint.x, Inpoint.y, Inpoint.z);
        dirNorm = new THREE.Vector3();
        dirNorm.crossVectors(dirInpoint, dirPer);
        dirNorm.normalize();
    
        //orbit plane
        const material2 = new THREE.MeshPhongMaterial( { 
            color: 0xBEBEBE,
            specular: 0x101010,  
            side: THREE.DoubleSide, 
            transparent: true,
            opacity: 0.5
        });
    
        OrbitPlane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 5.5, 4 ),
            material2
        );
        OrbitPlane.receiveShadow = true;
        
        //Add all orbit stuff to a group
        orbitGroup = new THREE.Group();
        orbitGroup.add(Orbit);
        orbitGroup.add(satellite);
        orbitGroup.add(SatPosVector);
        orbitGroup.add(OrbitPlane);
        orbitGroup.add(PerigeeVector);
        orbitGroup.add(NormalAxis);
    
        //rotate the group
        dirNorm.applyQuaternion(orbitGroup.quaternion);
        OrbitRotationParam(i * GRADTORAD, n * GRADTORAD,w * GRADTORAD, orbitGroup, dirNorm);
    
            
        scene.add( lineOfNodes );
    
        scene.add(orbitGroup);  
                    
    
        // Lights
        scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
    
        addShadowedLight( 1, 1, 1, 0xffffff, .8 );
        addShadowedLight( 0.5, 1, - 1, 0xffaa00, .7 );
    
        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        container.appendChild( renderer.domElement );
    
            //camera controls
        CameraControls.install( { THREE: THREE } );
        cameraControls = new CameraControls( camera, renderer.domElement );
        cameraControls.dampingFactor = 0.05;
        cameraControls.draggingDampingFactor=0.25;
        cameraControls.verticalDragToForward = true;
    
    
        //window
        window.addEventListener( 'resize', onWindowResize, false );

        animate();
    }
}

export { App }

function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();
    const updated = cameraControls.update( delta );

    time += 0.0005;
    const distance = origin.distanceTo(satellite.position);

    const r = Orbit_Line.getPoint(time);
    satellite.position.set(r.x,r.y,r.z);
    const dirSat = satellite.position.clone();
    dirSat.normalize();
    SatPosVector.setDirection(dirSat);
    SatPosVector.setLength(distance); 

    render();

}

function render() {

    camera.lookAt( cameraTarget );

    renderer.render( scene, camera );

}

function GetOrbitLine(a,e){

    const b = a * Math.sqrt(1 - Math.pow(e,2)); //semiminor axis
    const f = a * e; //focal distance
    
    const OrbitPath = new THREE.EllipseCurve(
        f,  0,            // ax, aY
        a, b, // xRadius (semimajor axis), yRadius (semiminor axis)
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );
    return OrbitPath;
}

function GetGeometryOrbit(OrbitLine){

    var points = Orbit_Line.getPoints( 100 );

    return  new THREE.BufferGeometry().setFromPoints( points );
    
}

function CreateLineOfNodes(n){

    const dirNodes = new THREE.Vector3(Math.sin(n),0,Math.cos(n));
    dirNodes.normalize();

    return new THREE.ArrowHelper( dirNodes, origin, 1, 0xEE11FF);
}

function ElementsUpdate(){

    Orbit_Line = GetOrbitLine(a,e); //get new curve
    Orbit.geometry.setFromPoints( Orbit_Line.getPoints(100) ); // replaces the position buffer
    
    if (i==0 || i== 180) {
        OrbitPlane.visible = false;
        lineOfNodes.visible = false;
        //n = 0; 
    }
    else{ 
        OrbitPlane.visible = true;
        lineOfNodes.visible = true;
    }

    if (e==0) PerigeeVector.visible = false;
    else PerigeeVector.visible = true;

    OrbitRotationParam(i * GRADTORAD,n  * GRADTORAD,w * GRADTORAD,orbitGroup);
    
}

function addShadowedLight( x, y, z, color, intensity ) {

    const directionalLight = new THREE.DirectionalLight( color, intensity );
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

function OrbitRotationParam( i ,n ,w, Group){

    Group.rotation.x = -90 * GRADTORAD;
    Group.rotation.y = 0;
    Group.rotation.z = 90 * GRADTORAD;
    Group.rotateOnWorldAxis(dirY, n); //longitude of ascending node
    Group.rotation.z += w; //Argument of periapsis

    const dirNodes = new THREE.Vector3(Math.sin(n),0,Math.cos(n));
    dirNodes.normalize();

    if (lineOfNodes) lineOfNodes.setDirection(dirNodes);                                

    Group.rotateOnWorldAxis(dirNodes, i); //Inclination

}		
        
		