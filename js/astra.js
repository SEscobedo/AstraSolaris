import * as THREE from './../node_modules/three/build/three.module.js';
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


        //Add stars and sun
        MC.AddStars(UA, scene);
        MC.CreateSun(escala,scene);

        //Add planets
        MC.CreatePlanets(escala,UA,scene);

        cameraControls = new CameraControls( camera, renderer.domElement );
        cameraControls.dampingFactor = 0.05;
        cameraControls.draggingDampingFactor=0.25;
        cameraControls.verticalDragToForward = true;


        //Menu
        const buttonSol = document.getElementById( "Sol");
        buttonSol.addEventListener( 'click', function () {

            GoPlanet('Sun');

        }, false );

        const buttonMer = document.getElementById( "Mercurio");        
        buttonMer.addEventListener( 'click', function () {
            
            GoPlanet('Mercury');

        }, false );

        const buttonVen = document.getElementById( "Venus");        
        buttonVen.addEventListener( 'click', function () {
            
            GoPlanet('Venus');

        }, false );

        const buttonTi = document.getElementById( "Tierra");        
        buttonTi.addEventListener( 'click', function () {
            
            GoPlanet('Earth');

        }, false );

        const buttonLu = document.getElementById( "Luna");        
        buttonLu.addEventListener( 'click', function () {
            
            GoPlanet('Moon');

        }, false );

        const buttonMar = document.getElementById( "Marte");        
        buttonMar.addEventListener( 'click', function () {
            
            GoPlanet('Mars');

        }, false );

        const buttonJup = document.getElementById( "Jupiter");        
        buttonJup.addEventListener( 'click', function () {
            
            GoPlanet('Jupiter');

        }, false );

        const buttonSat = document.getElementById( "Saturno");        
        buttonSat.addEventListener( 'click', function () {
            
            GoPlanet('Saturn');

        }, false );

        const buttonUr = document.getElementById( "Urano");        
        buttonUr.addEventListener( 'click', function () {
            
            GoPlanet('Uranus');

        }, false );

        const buttonNe = document.getElementById( "Neptuno");        
        buttonNe.addEventListener( 'click', function () {
            
            GoPlanet('Neptune');

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
    
    
function SolarSystemAnimate(){
    // Rotate cube (Change values to change speed)
    
    scene.getObjectByName("Sun").rotation.y += 0.0005;
    scene.getObjectByName("crown").lookAt(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z));
    
    //mercury.rotation.y = (tm.getHours() +  60 * tm.getMinutes()) *  2 * Math.PI / (1440 * 176);
    //venus.rotation.y -= 0.001;
   
    const desfase = 3.2; //desfase resepcto a la hora local
    //earth.rotation.y = (tm.getHours() +  60 * tm.getMinutes()) *  2 * Math.PI / 1440 + desfase;
    //earthAtmos.rotation.y += 0.00005;
    const earth = scene.getObjectByName("Earth");
    
    if (earth != undefined) {
        const moon = scene.getObjectByName("Moon");
        moon.lookAt(new THREE.Vector3(earth.position.x, earth.position.y, earth.position.z));
        moon.rotation.y = -80 / 180 * Math.PI ;
    }
    
    //mars.rotation.y += 0.001;
    //marsAtmos.rotation.y += 0.001;
    
    //scene.getObjectByName("Jupiter").rotation.y += 0.001;
    //saturn.rotation.y += 0.001;
    //ring.rotation.x += -0.01;
    
    //uranus.rotation.y += 0.001;
    //neptune.rotation.y += 0.001;
    
}
    
//terminal & commands

export function CommandExecute(COMMAND){
    var response, curr_line;

    if(COMMAND == "goto earth"){
        GoPlanet('Earth');
      response = "\r\n Camera relocated at earth."; 
    } else if ( COMMAND == "goto moon") {
        GoPlanet('Moon');
        response = "\r\n Camera relocated at Moon."; 
    } else if ( COMMAND == "goto sun") {
        GoPlanet('Sun');
        response = "\r\n Camera relocated at Sun.";  
    } else if ( COMMAND == "goto mercury") {
      GoPlanet('Mercury');
      response = "\r\n Camera relocated at Mercury.";
    } else if ( COMMAND == "goto venus") {
      GoPlanet('Venus');
      response = "\r\n Camera relocated at Venus.";  
    } else if ( COMMAND == "goto mars") {
        GoPlanet('Mars');
        response = "\r\n Camera relocated at Mars.";  
    } else if ( COMMAND == "goto jupiter") {
        GoPlanet('Jupiter');
        response = "\r\n Camera relocated at Jupiter."; 
    } else if ( COMMAND == "goto saturn") {
        GoPlanet('Saturn')
        response = "\r\n Camera relocated at Saturn.";  
    } else if ( COMMAND == "goto uranus") {
        GoPlanet('Uranus')
        response = "\r\n Camera relocated at Uranus.";
    } else if ( COMMAND == "goto neptune") {
        GoPlanet('Neptune')
        response = "\r\n Camera relocated at Neptune."; 

    } else if ( COMMAND == "approach") {
        //camera.position.z += 0.5 * escala;
        var tar = new THREE.Vector3();
        cameraControls.getTarget( tar );
        const l = tar.distanceTo(camera.position)/6;
        cameraControls.dolly(l, true );
        response = "\r\n Apporaching target.";    
    } else if ( COMMAND == "zoom") {
        cameraControls.zoom( camera.zoom / 2, true )
        response = "\r\n zoom in.";    
    } else if ( COMMAND == "zoom out") {
        cameraControls.zoom( -camera.zoom / 2, true )
        response = "\r\n zoom out.";    
      
    } else if ( COMMAND == "around") {
        cameraControls.rotate( Math.PI/2, 0, true )
        response = "\r\n Camera rotation around target enabled."; 
    } else if ( COMMAND == "-around") {
        cameraControls.rotate( -Math.PI/2, 0, true )
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
        scene.getObjectByName('Sun').material = new THREE.MeshStandardMaterial({emissiveMap : textureSun,emissive: 0xFFFFFF,emissiveIntensity:1});
        //ocultar la corona
        scene.getObjectByName('crown').material.opacity = 0.3;
        //crown.visible = false;
        response = "\r\n solar filter applied. STEREO Heliographic data.";  
      
    } else if ( COMMAND == "solar filter off") {
    scene.getObjectByName('Sun').material =  new THREE.MeshStandardMaterial({color:0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity:1});
    //mostrar la corona
    scene.getObjectByName('crown').material.opacity = 1;
    //crown.visible = true;
    response = "\r\n solar filter removed.";  
      
    } else if ( COMMAND == "hide earth atmosphere") {
        scene.getObjectByName('AtmosEarth').visible = false;
        response = "\r\n earth atmosphere hidden";  
      
    } else if ( COMMAND == "show earth atmosphere") {
        scene.getObjectByName('AtmosEarth').visible = true;
        response = "\r\n earth atmosphere shown";  

    } else if ( COMMAND == "hide venus atmosphere") {
        const NewVenusSurface = new THREE.TextureLoader().load('textures/8k_venus_surface.jpg');
        scene.getObjectByName('Venus').material = new THREE.MeshStandardMaterial({map: NewVenusSurface});
        response = "\r\n Venus atmosphere hidden";  
      
    } else if ( COMMAND == "show venus atmosphere") {
        scene.getObjectByName('Venus').material = new THREE.MeshStandardMaterial({map:new THREE.TextureLoader().load('textures/4k_venus_atmosphere.jpg')});
        response = "\r\n Venus atmosphere shown";  

    } else if ( COMMAND == "clear") {
      curr_line = "";
    
    } else if ( COMMAND == "hide orbits") {

        scene.getObjectByName('OrbitOfMercury').visible=false;
        scene.getObjectByName('OrbitOfVenus').visible=false;
        scene.getObjectByName('OrbitOfEarth').visible = false;
        scene.getObjectByName('OrbitOfMars').visible=false;
        scene.getObjectByName('OrbitOfJupiter').visible = false;
        scene.getObjectByName('OrbitOfSaturn').visible = false;
        scene.getObjectByName('OrbitOfUranus').visible = false;
        scene.getObjectByName('OrbitOfNeptune').visible = false;
        scene.getObjectByName('OrbitOfMoon').visible = false;
        
        response = "\r\n orbits hidden";  

    } else if ( COMMAND == "show orbits") {

        scene.getObjectByName('OrbitOfMercury').visible=true;
        scene.getObjectByName('OrbitOfVenus').visible=true;
        scene.getObjectByName('OrbitOfEarth').visible = true;
        scene.getObjectByName('OrbitOfMars').visible=true;
        scene.getObjectByName('OrbitOfJupiter').visible = true;
        scene.getObjectByName('OrbitOfSaturn').visible = true;
        scene.getObjectByName('OrbitOfUranus').visible = true;
        scene.getObjectByName('OrbitOfNeptune').visible = true;
        scene.getObjectByName('OrbitOfMoon').visible = true;
        
        response = "\r\n orbits shown";  
      

    } else {
        curr_line = COMMAND;
        response = "\r\n Unknown command <<" + curr_line + ">>";  
    }
    return response;
}

function GoPlanet(planeta){
    const object = scene.getObjectByName(planeta);
    var pos = new THREE.Vector3(); 
    object.getWorldPosition(pos);

    //console.log(object);
    if (planeta == 'Sun') {
        cameraControls.setTarget(
            object.position.x, 
            object.position.y, 
            object.position.z, 
            true
        );
        cameraControls.setLookAt( 
            object.position.x + 0.08 * UA, 
            object.position.y, 
            object.position.z - 0.08 *UA, 
            object.position.x, 
            object.position.y, 
            object.position.z, 
            true);
    }
    else{
    
    cameraControls.setTarget(
        pos.x, 
        pos.y, 
        pos.z, 
        true
    ); 
    
    cameraControls.setLookAt( 
        pos.x + object.UserData * 1.9 + escala * 2.5, 
        pos.y, 
        pos.z - (object.UserData * 1.9 + escala * 2.5), 
        pos.x, 
        pos.y, 
        pos.z, 
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

    
    