import * as THREE from './../node_modules/three/build/three.module.js';
import { OrbitControls } from './../node_modules/three/examples/jsm/controls/OrbitControls.js';
import CameraControls from './../node_modules/camera-controls/dist/camera-controls.module.js';
import * as MC from './model_constructor.js';


let camera, scene, renderer, cameraControls, controls,
 mars, marsAtmos, mercury, venus, earth, moon, earthAtmos, jupiter, saturn, ring, neptune, uranus,
 sun, crown,
 Orbit_mercury, Orbit_venus, Orbit_earth, Orbit_mars, Orbit_jupiter, Orbit_saturn, Orbit_uranus, Orbit_neptune, Orbit_moon,
 escala, UA;
 var tm = new Date();
 const clock = new THREE.Clock();

    //var mesh;
    var strDownloadMime = "image/octet-stream";
    
    init();
    animate();

    function init() {

        escala = 5 //Tamaño del radio terrestre (referencia para todos demás cuerpos celestes)
        
        UA = 23454.8 * escala //Unidad astronómica (distancia media entre la tiera y el sol)
        

        CameraControls.install( { THREE: THREE } );

        // Init scene
	    scene = new THREE.Scene();
	    scene.background = new THREE.Color( 'black' );


	    //CAMERA
	    camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth/window.innerHeight,
		0.1,
		60000*UA
        );
        camera.position.set(0,UA,10 * UA);
        
        //LUCES
        const light = new THREE.PointLight( {color:0xFFFFFF, decay: 2, intensity: 1} );
        light.position.set( 0, 0, 0 );
        light.castShadow = true;
        //Set up shadow properties for the light
        light.shadow.mapSize.width = 5;  // default
        light.shadow.mapSize.height = 5; // default
        light.shadow.camera.near = 0.5;       // default
        light.shadow.camera.far = UA      // default
        scene.add( light );

        //screenshots
        var saveLink = document.createElement('div');
        saveLink.style.position = 'absolute';
        saveLink.style.top = '10px';
        saveLink.style.width = '100%';
        saveLink.style.color = 'white !important';
        saveLink.style.textAlign = 'center';
        saveLink.innerHTML =
            '<button href="#" id="saveLink">Capturar imagen</button>';
        document.body.appendChild(saveLink);
        document.getElementById("saveLink").addEventListener('click', saveAsImage);

        //render
        renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio( window.devicePixelRatio );
        document.body.appendChild(renderer.domElement);


        //Lines
        //CreateOrbits();
        //MC.CreateOrbits(UA,scene);
        
        //Agregar planetas
        CreatePlanets();

        //Agregar Estrellas
        MC.AddStars(UA, scene);


        cameraControls = new CameraControls( camera, renderer.domElement );
        cameraControls.dampingFactor = 0.05;
        cameraControls.draggingDampingFactor=0.25;
        cameraControls.verticalDragToForward = true;

        //Init Orbit Controls
        //controls = new OrbitControls( camera, renderer.domElement );
        //controls.minDistance = 1;
        //controls.maxDistance = 60000*UA;
        // controls.autoRotate = true;
        // controls.autoRotateSpeed = 0.1;
        //controls.enableDamping = true;
        //controls.dampingFactor = 0.2;
        //controls.enableKeys = true;

        //Menu
        const buttonSol = document.getElementById( "Sol");
        buttonSol.addEventListener( 'click', function () {

            GoPlanet('Sol');

        }, false );

        const buttonMer = document.getElementById( "Mercurio");        
        buttonMer.addEventListener( 'click', function () {
            
            GoPlanet('Mercurio');

        }, false );

        const buttonVen = document.getElementById( "Venus");        
        buttonVen.addEventListener( 'click', function () {
            
            GoPlanet('Venus');

        }, false );

        const buttonTi = document.getElementById( "Tierra");        
        buttonTi.addEventListener( 'click', function () {
            
            GoPlanet('Tierra');

        }, false );

        const buttonLu = document.getElementById( "Luna");        
        buttonLu.addEventListener( 'click', function () {
            
            GoPlanet('Luna');

        }, false );

        const buttonMar = document.getElementById( "Marte");        
        buttonMar.addEventListener( 'click', function () {
            
            GoPlanet('Marte');

        }, false );

        const buttonJup = document.getElementById( "Jupiter");        
        buttonJup.addEventListener( 'click', function () {
            
            GoPlanet('Jupiter');

        }, false );

        const buttonSat = document.getElementById( "Saturno");        
        buttonSat.addEventListener( 'click', function () {
            
            GoPlanet('Saturno');

        }, false );

        const buttonUr = document.getElementById( "Urano");        
        buttonUr.addEventListener( 'click', function () {
            
            GoPlanet('Urano');

        }, false );

        const buttonNe = document.getElementById( "Neptuno");        
        buttonNe.addEventListener( 'click', function () {
            
            GoPlanet('Neptuno');

        }, false );

    }
    

function animate() {

        const delta = clock.getDelta();
	    const elapsed = clock.getElapsedTime();
        const updated = cameraControls.update( delta );
        
        requestAnimationFrame(animate);
        SolarSystemAnimate();
        
        renderer.render(scene, camera);
        
}

function saveAsImage() {
        var imgData, imgNode;

        try {
            var strMime = "image/jpeg";
            imgData = renderer.domElement.toDataURL(strMime);

            saveFile(imgData.replace(strMime, strDownloadMime), "Astra_Solaris_Screenshot.jpg");

        } catch (e) {
            console.log(e);
            return;
        }

}

var saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
}
    
//construct objects
    
function CreateOrbits(){
    //Orbits
    
        //Mercury
        const mercuryOrbit_Line = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            0.37882573285 * UA, 0.387098 * UA, // xRadius (semieje menor), yRadius (semieje mayor)
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
        var points = mercuryOrbit_Line.getPoints( 100 );
        var geometryOrbit = new THREE.BufferGeometry().setFromPoints( points );
        
        var materialOrbit = new THREE.LineBasicMaterial( { color : 0x4E4E4E } );
        
        // Create the final object to add to the scene
        Orbit_mercury = new THREE.Line( geometryOrbit, materialOrbit );
        Orbit_mercury.rotation.x = 90 / 180* Math.PI + 0.22180757; //90 grados + 7° 0' 16''
        
        scene.add(Orbit_mercury);
    
        //Venus
        const venusOrbit_Line = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            0.723228 * UA, 0.72333 * UA, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
        const pointsV = venusOrbit_Line.getPoints( 200 );
        const geometryOrbitV = new THREE.BufferGeometry().setFromPoints( pointsV );
        
        const materialOrbitV = new THREE.LineBasicMaterial( { color : 0x4E4E4E } );
        
        // Create the final object to add to the scene
        Orbit_venus = new THREE.Line( geometryOrbitV, materialOrbitV );
        Orbit_venus.rotation.x = 90 / 180* Math.PI + 0.05924424232; //90 grados + 3° 23' 40''
        scene.add(Orbit_venus);
    
        //Earth
        const earthOrbit_Line = new THREE.EllipseCurve(
            0,  0,            // ax, aY
             UA, UA, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
        const pointsE = earthOrbit_Line.getPoints( 400 );
        const geometryOrbitE = new THREE.BufferGeometry().setFromPoints( pointsE );
        
        const materialOrbitE = new THREE.LineBasicMaterial( { color : 0x4E4E4E } );
        
        // Create the final object to add to the scene
        Orbit_earth = new THREE.Line( geometryOrbitE, materialOrbitE );
        Orbit_earth.rotation.x = 90 / 180* Math.PI;
        scene.add(Orbit_earth);
    
    
         //Moon
        const moonOrbit_Line = new THREE.EllipseCurve(
            0, 0,            // ax, aY
            30 * escala, 30 * escala, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
        const pointsL = moonOrbit_Line.getPoints( 400 );
        const geometryOrbitL = new THREE.BufferGeometry().setFromPoints( pointsL );
        
        const materialOrbitL = new THREE.LineBasicMaterial( { color : 0x4F2E1A } );
        
        // Create the final object to add to the scene
        Orbit_moon = new THREE.Line( geometryOrbitL, materialOrbitL );
        Orbit_moon.rotation.x = 90 / 180* Math.PI;
        Orbit_moon.position.z = UA;
        scene.add(Orbit_moon);
    
    
    
    
        //Mars
        const marsOrbit_Line = new THREE.EllipseCurve(
            0,  0,            // ax, aY
             1.52*UA, 1.52*UA, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
        const pointsM = marsOrbit_Line.getPoints( 500 );
        const geometryOrbitM = new THREE.BufferGeometry().setFromPoints( pointsM );
        
        const materialOrbitM = new THREE.LineBasicMaterial( { color : 0x4E4E4E } );
        
        // Create the final object to add to the scene
        Orbit_mars = new THREE.Line( geometryOrbitM, materialOrbitM );
        Orbit_mars.rotation.x = 90 / 180* Math.PI;
        scene.add(Orbit_mars);
    
        //Jupiter
        const jupiterOrbit_Line = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            5.2*UA, 5.2*UA, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
    
        const pointsJ = jupiterOrbit_Line.getPoints( 600 );
        const geometryOrbitJ = new THREE.BufferGeometry().setFromPoints( pointsJ );
    
        const materialOrbitJ = new THREE.LineBasicMaterial( { color : 0x4E4E4E } );
    
        // Create the final object to add to the scene
        Orbit_jupiter = new THREE.Line( geometryOrbitJ, materialOrbitJ );
        Orbit_jupiter.rotation.x = 90 / 180* Math.PI;  
        scene.add(Orbit_jupiter);
    
        //Saturn
        const saturnOrbit_Line = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            9.54*UA, 9.54*UA, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
    
        const pointsS = saturnOrbit_Line.getPoints( 700 );
        const geometryOrbitS = new THREE.BufferGeometry().setFromPoints( pointsS );
    
        const materialOrbitS = new THREE.LineBasicMaterial( { color : 0x4E4E4E } );
    
        // Create the final object to add to the scene
        Orbit_saturn = new THREE.Line( geometryOrbitS, materialOrbitS );
        Orbit_saturn.rotation.x = 90 / 180* Math.PI;
        scene.add(Orbit_saturn)
    
    
        //Uranus
        const uranusOrbit_Line = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            19.19 * UA, 19.19 * UA, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
    
        const pointsU = uranusOrbit_Line.getPoints( 800 );
        const geometryOrbitU = new THREE.BufferGeometry().setFromPoints( pointsU );
    
        const materialOrbitU = new THREE.LineBasicMaterial( { color : 0x4E4E4E } );
    
        // Create the final object to add to the scene
        Orbit_uranus = new THREE.Line( geometryOrbitU, materialOrbitU );
        Orbit_uranus.rotation.x = 90 / 180* Math.PI;
        scene.add(Orbit_uranus)
    
    
        //Neptune
        const neptuneOrbit_Line = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            30.06 * UA, 30.06 * UA, // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
        const pointsN = neptuneOrbit_Line.getPoints( 1000 );
        const geometryOrbitN = new THREE.BufferGeometry().setFromPoints( pointsN );
        
        const materialOrbitN = new THREE.LineBasicMaterial( { color : 0x4E4E4E } );
        
        // Create the final object to add to the scene
        Orbit_neptune = new THREE.Line( geometryOrbitN, materialOrbitN );
        Orbit_neptune.rotation.x = 90 / 180* Math.PI;
        scene.add(Orbit_neptune)
    
}
    
    
function CreatePlanets(){
    //PLANETS   
    
    const geometrySun = new THREE.SphereBufferGeometry( 109.076 * escala, 100, 100 );
    const geometryCrown = new THREE.PlaneBufferGeometry( 180 * 109.076 * escala, 180 * 109.076 * escala );
    
    const geometryMercury = new THREE.SphereBufferGeometry( 0.39 * escala, 50, 55 );
    
    const geometryVenus = new THREE.SphereBufferGeometry( 0.95 * escala, 90, 90 );
    
    const geometryEarth = new THREE.SphereBufferGeometry( escala, 100, 100 );
    const geometryEarthAtmos = new THREE.SphereBufferGeometry( escala + 0.001 * escala, 100, 100 );
    
    const geometryMoon = new THREE.SphereBufferGeometry( 0.2727 * escala, 100, 100 );
    
    const geometryMars = new THREE.SphereBufferGeometry( 0.53 * escala , 95, 95 );
    const geometryMarsAtmosphere = new THREE.SphereBufferGeometry( 0.53 * escala + 5, 95, 95 );
    
    const geometryJupiter = new THREE.SphereBufferGeometry(11.2 * escala, 300, 300);
    
    const geometrySaturn = new THREE.SphereBufferGeometry(9.41 * escala, 250, 250);
    const geometryRing = new THREE.CylinderBufferGeometry((2.326 * 9.41 * escala),(2.326 * 9.41 * escala),0.001,95);
    
    const geometryUranus = new THREE.SphereBufferGeometry(3.98 * escala, 250, 250);
    
    const geometryNeptune = new THREE.SphereBufferGeometry(3.81 * escala, 250, 250);
    
    
    
    // Add textures - 
     //const textureSun = new THREE.TextureLoader().load('textures/heliographic_negative_bw2.jpg');
     const textureCrown = new THREE.TextureLoader().load('textures/star_flare.png');
    
     const textureMercury = new THREE.TextureLoader().load('textures/8k_mercury.jpg');
     const textureVenus = new THREE.TextureLoader().load('textures/4k_venus_atmosphere.jpg');
    
     const textureEarth = new THREE.TextureLoader().load('textures/earth_blue_NASA_2.jpg');
     const textureEarthSpec = new THREE.TextureLoader().load('textures/earth_specular_2048_g.jpg');
     const textureEarthNormal = new THREE.TextureLoader().load('textures/earth_normal_2048.jpg');
     const textureEarthAtmos = new THREE.TextureLoader().load('textures/8k_earth_clouds.jpg');
    
     const textureMoon =  new THREE.TextureLoader().load('textures/moon.jpg');
     const textureMoonNormal =  new THREE.TextureLoader().load('textures/moon_normal.jpg');
    
     const textureMars = new THREE.TextureLoader().load('textures/mars.jpg');
     //const normalMapMars = new THREE.TextureLoader().load('textures/8k_earth_normal_map.tif');
     //const specularMapMars = new THREE.TextureLoader().load('textures/earth_specular_2048_g.jpg');
    
     const textureJupiter = new THREE.TextureLoader().load('textures/jupiter.jpg');
    
     const textureSaturn = new THREE.TextureLoader().load('textures/8k_saturn.jpg');
     const textureRing = new THREE.TextureLoader().load('textures/saturn_rings_black2.png');
     //const textureRingAlpha = new THREE.TextureLoader().load('textures/saturn_rings_alpha.png');
     //textureRing.encoding = THREE.sRGBEncoding;
     textureRing.anisotropy = 16;
     //textureRingAlpha.anisotropy = 16;
    
     const textureUranus = new THREE.TextureLoader().load('textures/2k_uranus.jpg');
    
     const textureNeptune = new THREE.TextureLoader().load('textures/2k_neptune.jpg');
     
    
    // Create material with texture
     
     //const materialSun = new THREE.MeshStandardMaterial({emissiveMap : textureSun,emissive: 0xFFFFFF,emissiveIntensity:1});
     const materialSun = new THREE.MeshStandardMaterial({color:0xFFFFFF,emissive: 0xFFFFFF,emissiveIntensity:1});
     const materialCrown = new THREE.MeshStandardMaterial({emissiveMap : textureCrown, alphaMap:textureCrown, emissive: 0xFFFFFF,emissiveIntensity:1,transparent:true,opacity:1});
    
     const materialMercury = new THREE.MeshStandardMaterial({map : textureMercury});
     const materialVenus = new THREE.MeshStandardMaterial({map : textureVenus});
    
     const materialEarth = new THREE.MeshStandardMaterial({map : textureEarth,
        normalMap:textureEarthNormal,
        normalScale: new THREE.Vector2(0.05,0),
        roughnessMap:textureEarthSpec,
        roughness:0.5});
     const materialEarthAtmos = new THREE.MeshStandardMaterial({color:0xFFFFFF, alphaMap : textureEarthAtmos,opacity: 1,transparent: true});
     const materialMoon = new THREE.MeshStandardMaterial({map : textureMoon,
         normalMap:textureMoonNormal,
         normalScale: new THREE.Vector2(0.05,0.05)});
    
     const materialMars = new THREE.MeshStandardMaterial({map : textureMars});
     const materialMarsAtmos = new THREE.MeshStandardMaterial({ color: 0xF6723C , opacity: 0.3,
        transparent: true});
    
    const materialJupiter = new THREE.MeshStandardMaterial({map : textureJupiter});
    
    const materialSaturn = new THREE.MeshStandardMaterial({map : textureSaturn});
    
    const materialRing = new THREE.MeshBasicMaterial({map : textureRing,transparent:true});
    
    //materialRing.castShadow = true;
    
    const materialUranus = new THREE.MeshStandardMaterial({map : textureUranus});
    
    const materialNeptune = new THREE.MeshStandardMaterial({map : textureNeptune});
    
    
    // Create mesh with geometry and material
    sun = new THREE.Mesh(geometrySun, materialSun);
    crown = new THREE.Mesh(geometryCrown, materialCrown);
    
    mercury = new THREE.Mesh(geometryMercury, materialMercury);
    venus = new THREE.Mesh(geometryVenus, materialVenus);
    
    earth = new THREE.Mesh(geometryEarth, materialEarth);
    earthAtmos = new THREE.Mesh(geometryEarthAtmos, materialEarthAtmos);
    
    mars = new THREE.Mesh(geometryMars, materialMars);
    marsAtmos = new THREE.Mesh(geometryMarsAtmosphere, materialMarsAtmos);
    
    moon = new THREE.Mesh(geometryMoon, materialMoon);
    
    jupiter = new THREE.Mesh(geometryJupiter, materialJupiter);
    
    saturn = new THREE.Mesh(geometrySaturn, materialSaturn);
    ring = new THREE.Mesh(geometryRing, materialRing);
    
    uranus = new THREE.Mesh(geometryUranus, materialUranus);
    
    neptune = new THREE.Mesh(geometryNeptune, materialNeptune);
    
    sun.position.set(0,0,0);
    crown.position.set(0,0,0);
    crown.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    
    mercury.position.set(0,-0.08*UA,0.39 * UA-1200);
    
    venus.position.set(0,0,0.72*UA);
    
    earth.position.set(0,0,UA);
    earthAtmos.position.set(0,0,UA);
    moon.position.set(earth.position.x, earth.position.y, earth.position.z + 30 * escala);
    moon.rotation.y = Math.PI/2;
    
    mars.position.set(0,0,1.52 * UA);
    //marsAtmos.position.set(0,0,1.52 * UA)
    
    jupiter.position.set(0,0,5.20 * UA);
    
    saturn.position.set(0,0,9.54 * UA);
    ring.position.set(0,0,9.54 * UA);
    
    
    
    uranus.position.set(0,0,19.19 * UA);
    
    neptune.position.set(0,0,30.06 * UA);
    
    // Add to scene
    scene.add(sun);
    scene.add(crown);
    
    scene.add(mercury);
    scene.add(venus);
    
    scene.add(earth);
    scene.add(earthAtmos);
    scene.add(moon);
    
    scene.add(mars);
    scene.add(marsAtmos);
    
    scene.add(jupiter);
    
    scene.add(saturn);
    scene.add(ring);
    
    scene.add(uranus);
    
    scene.add(neptune);
}
    
    
function SolarSystemAnimate(){
    // Rotate cube (Change values to change speed)
    
    sun.rotation.y += 0.0005;
    crown.lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    
    mercury.rotation.y = (tm.getHours() +  60 * tm.getMinutes()) *  2 * Math.PI / (1440 * 176);
    venus.rotation.y -= 0.001;
   
    const desfase = 3.2; //desfase resepcto a la hora local
    earth.rotation.y = (tm.getHours() +  60 * tm.getMinutes()) *  2 * Math.PI / 1440 + desfase;
    earthAtmos.rotation.y += 0.00005;
    //moon.rotation.y += 0.00015;
    
    mars.rotation.y += 0.001;
    marsAtmos.rotation.y += 0.001;
    
    jupiter.rotation.y += 0.001;
    saturn.rotation.y += 0.001;
    //ring.rotation.x += -0.01;
    
    uranus.rotation.y += 0.001;
    neptune.rotation.y += 0.001;
    
}
    
//terminal & commands

export function CommandExecute(COMMAND){
    var response;

    if(COMMAND == "goto earth"){
        GoPlanet('Tierra');
      response = "\r\n Camera relocated at earth."; 
    } else if ( COMMAND == "goto moon") {
        GoPlanet('Luna');
        response = "\r\n Camera relocated at Moon."; 
    } else if ( COMMAND == "goto sun") {
        GoPlanet('Sol');
        response = "\r\n Camera relocated at Sun.";  
    } else if ( COMMAND == "goto mercury") {
      GoPlanet('Mercurio');
      response = "\r\n Camera relocated at Mercury.";
    } else if ( COMMAND == "goto venus") {
      GoPlanet('Venus');
      response = "\r\n Camera relocated at Venus.";  
    } else if ( COMMAND == "goto mars") {
        GoPlanet('Marte');
        response = "\r\n Camera relocated at Mars.";  
    } else if ( COMMAND == "goto jupiter") {
        GoPlanet('Jupiter');
        response = "\r\n Camera relocated at Jupiter."; 
    } else if ( COMMAND == "goto saturn") {
        GoPlanet('Saturno')
        response = "\r\n Camera relocated at Saturn.";  
    } else if ( COMMAND == "goto uranus") {
        GoPlanet('Urano')
        response = "\r\n Camera relocated at Uranus.";
    } else if ( COMMAND == "goto neptune") {
        GoPlanet('Neptuno')
        response = "\r\n Camera relocated at Neptune."; 

    } else if ( COMMAND == "approach") {
        camera.position.z += 0.5 * escala;
        controls.update();
        response = "\r\n Apporaching target.";    
      
    } else if ( COMMAND == "around") {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.update();
        response = "\r\n Camera rotation around target enabled."; 

    } else if ( COMMAND == "stop around") {
        controls.autoRotate = false;
        //controls.autoRotateSpeed = 0.2;
        response = "\r\n Camera rotation around target disabled.";    
      
    } else if ( COMMAND == "filters") {
        response = "\r\n (1) solar filter";  
    } else if ( COMMAND == "solar filter on") {
        //cargar textura solar
        const textureSun = new THREE.TextureLoader().load('textures/heliographic_negative_bw2.jpg');
        sun.material = new THREE.MeshStandardMaterial({emissiveMap : textureSun,emissive: 0xFFFFFF,emissiveIntensity:1});
        //ocultar la corona
        crown.material.opacity = 0.3;
        //crown.visible = false;
        response = "\r\n solar filter applied. STEREO Heliographic data.";  
      
    } else if ( COMMAND == "solar filter off") {
    sun.material =  new THREE.MeshStandardMaterial({color:0xFFFFFF,emissive: 0xFFFFFF,emissiveIntensity:1});
    //mostrar la corona
    crown.material.opacity = 1;
    //crown.visible = true;
    response = "\r\n solar filter removed.";  
      
    } else if ( COMMAND == "hide earth atmosphere") {
        earthAtmos.visible = false;
        response = "\r\n earth atmosphere hidden";  
      
    } else if ( COMMAND == "show earth atmosphere") {
        earthAtmos.visible = true;
        response = "\r\n earth atmosphere shown";  

    } else if ( COMMAND == "hide venus atmosphere") {
        const NewVenusSurface = new THREE.TextureLoader().load('textures/8k_venus_surface.jpg');
        venus.material = new THREE.MeshStandardMaterial({map: NewVenusSurface});
        response = "\r\n Venus atmosphere hidden";  
      
    } else if ( COMMAND == "show venus atmosphere") {
        venus.material = new THREE.MeshStandardMaterial({map:new THREE.TextureLoader().load('textures/4k_venus_atmosphere.jpg')});
        response = "\r\n Venus atmosphere shown";  

    } else if ( COMMAND == "clear") {
      curr_line = "";
    
    } else if ( COMMAND == "hide orbits") {

        Orbit_mercury.visible=false;
        Orbit_venus.visible=false;
        Orbit_earth.visible = false;
        Orbit_mars.visible=false;
        Orbit_jupiter.visible = false;
        Orbit_saturn.visible = false;
        Orbit_uranus.visible = false;
        Orbit_neptune.visible = false;
        
        response = "\r\n orbits hidden";  

    } else if ( COMMAND == "show orbits") {

        Orbit_mercury.visible=true;
        Orbit_venus.visible=true;
        Orbit_earth.visible = true;
        Orbit_mars.visible=true;
        Orbit_jupiter.visible = true;
        Orbit_saturn.visible = true;
        Orbit_uranus.visible = true;
        Orbit_neptune.visible = true;
        
        response = "\r\n orbits shown";  
      

    } else {
        response = "\r\n Unknown command <<" + curr_line + ">>";  
      
    }
    return response;
}

function GoPlanet(planeta){

    if (planeta == 'Sol') {
        cameraControls.setTarget(
            sun.position.x, 
            sun.position.y, 
            sun.position.z, 
            true
        );
        cameraControls.setLookAt( 
            sun.position.x + 0.08 * UA, 
            sun.position.y, 
            sun.position.z - 0.08 *UA, 
            sun.position.x, 
            sun.position.y, 
            sun.position.z, 
            true);

    } else if (planeta == 'Mercurio'){
        cameraControls.setTarget(
            mercury.position.x, 
            mercury.position.y, 
            mercury.position.z, 
            true
        );
        cameraControls.setLookAt( 
            mercury.position.x + 2.5 * escala, 
            mercury.position.y, 
            mercury.position.z - 2.5 * escala, 
            mercury.position.x, 
            mercury.position.y, 
            mercury.position.z, 
            true);

    } else if (planeta == 'Venus'){
        cameraControls.setTarget(
            venus.position.x, 
            venus.position.y, 
            venus.position.z, 
            true
        );
        cameraControls.setLookAt( 
            venus.position.x + 2.5 * escala, 
            venus.position.y, 
            venus.position.z - 2.5 * escala, 
            venus.position.x, 
            venus.position.y, 
            venus.position.z, 
            true);

    } else if (planeta == 'Tierra'){

        cameraControls.setTarget(
            earth.position.x, 
            earth.position.y, 
            earth.position.z, 
            true
        );
        cameraControls.setLookAt( 
            earth.position.x + 2.5 *escala, 
            earth.position.y, 
            earth.position.z - 2.5 *escala, 
            earth.position.x, 
            earth.position.y, 
            earth.position.z, 
            true);

    } else if (planeta == 'Luna'){
           cameraControls.setTarget(
            moon.position.x, 
            moon.position.y, 
            moon.position.z, 
            true
        );
        cameraControls.setLookAt( 
            moon.position.x + 2.5 *escala, 
            moon.position.y, 
            moon.position.z - 2.5 *escala, 
            moon.position.x, 
            moon.position.y, 
            moon.position.z, 
            true);


     } else if (planeta == 'Marte'){
        cameraControls.setTarget(
            mars.position.x, 
            mars.position.y, 
            mars.position.z, 
            true
        );       

        cameraControls.setLookAt( 
            mars.position.x + 2.5 *escala, 
            mars.position.y, 
            mars.position.z - 2.5 *escala, 
            mars.position.x, 
            mars.position.y, 
            mars.position.z, 
            true);

     } else if(planeta == 'Jupiter'){
        cameraControls.setTarget(
            jupiter.position.x, 
            jupiter.position.y, 
            jupiter.position.z, 
            true
        ); 
        
        cameraControls.setLookAt( 
            jupiter.position.x + 20 *escala, 
            jupiter.position.y, 
            jupiter.position.z - 20 *escala, 
            jupiter.position.x, 
            jupiter.position.y, 
            jupiter.position.z, 
            true);


    } else if(planeta == 'Saturno'){
        cameraControls.setTarget(
            saturn.position.x, 
            saturn.position.y, 
            saturn.position.z, 
            true
        ); 
        cameraControls.setLookAt( 
            saturn.position.x + 20 *escala, 
            saturn.position.y + 1.5 * escala, 
            saturn.position.z - 20 *escala, 
            saturn.position.x, 
            saturn.position.y, 
            saturn.position.z, 
            true);


    } else if(planeta == 'Urano'){
        cameraControls.setTarget(
            uranus.position.x, 
            uranus.position.y, 
            uranus.position.z, 
            true
        ); 
        cameraControls.setLookAt( 
            uranus.position.x + 20 *escala, 
            uranus.position.y, 
            uranus.position.z - 20 *escala, 
            uranus.position.x, 
            uranus.position.y, 
            uranus.position.z, 
            true);

    } else if(planeta == 'Neptuno'){
        cameraControls.setTarget(
            neptune.position.x, 
            neptune.position.y, 
            neptune.position.z, 
            true
        ); 

        cameraControls.setLookAt( 
            neptune.position.x + 20 *escala, 
            neptune.position.y, 
            neptune.position.z - 20 *escala, 
            neptune.position.x, 
            neptune.position.y, 
            neptune.position.z, 
            true);

     }

}

//window

function onWindowResize() {
    // Camera frustum aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    // After making changes to aspect
    camera.updateProjectionMatrix();
    // Reset size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );
}

window.addEventListener('resize', onWindowResize, false);

    
    