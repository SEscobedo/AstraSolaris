import * as THREE from './../node_modules/three/build/three.module.js';
import CameraControls from './../node_modules/camera-controls/dist/camera-controls.module.js';
import * as MC from './model_constructor.js';



let camera, scene, renderer, cameraControls, controls,
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
		0.01,
		60000*UA
        );
        camera.position.set(0,UA,3 * UA);
        

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

        //CRATE SOLAR SYSTEM MODEL
        //Add stars and sun
        MC.AddStars(UA, scene);
        MC.CreateSun(escala,scene);

        //Add planets
        MC.CreatePlanets(escala,UA,scene);
        

        //camera controls
        cameraControls = new CameraControls( camera, renderer.domElement );
        cameraControls.dampingFactor = 0.05;
        cameraControls.draggingDampingFactor=0.25;
        cameraControls.verticalDragToForward = true;


        //Travel Menu
        const buttonSol = document.getElementById( "Sol");
        buttonSol.addEventListener( 'click', function () {

            GoPlanet(scene.getObjectByName('Sun'));

        }, false );

        const buttonMer = document.getElementById( "Mercurio");        
        buttonMer.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Mercury'));

        }, false );

        const buttonVen = document.getElementById( "Venus");        
        buttonVen.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Venus'));

        }, false );

        const buttonTi = document.getElementById( "Tierra");        
        buttonTi.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Earth'));

        }, false );

        const buttonLu = document.getElementById( "Luna");        
        buttonLu.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Moon'));

        }, false );

        const buttonMar = document.getElementById( "Marte");        
        buttonMar.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Mars'));

        }, false );

        const buttonJup = document.getElementById( "Jupiter");        
        buttonJup.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Jupiter'));

        }, false );

        const buttonSat = document.getElementById( "Saturno");        
        buttonSat.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Saturn'));

        }, false );

        const buttonUr = document.getElementById( "Urano");        
        buttonUr.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Uranus'));

        }, false );

        const buttonNe = document.getElementById( "Neptuno");        
        buttonNe.addEventListener( 'click', function () {
            
            GoPlanet(scene.getObjectByName('Neptune'));

        }, false );

    }
    

function animate() {

        const delta = clock.getDelta();
	    const elapsed = clock.getElapsedTime();
        const updated = cameraControls.update( delta );
        
        requestAnimationFrame(animate);
        MC.SolarSystemUpdate(scene, camera);
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
    

//terminal & commands

export function CommandExecute(COMMAND){
    var response, curr_line;

    if ( COMMAND.match(/goto .*/)) {
        
        // find target
        const SplitArray = COMMAND.split(" ");
        var Target;
        if (SplitArray.length > 1) {
            Target = scene.getObjectByName(SplitArray[1]);
            if (Target != undefined){
                GoPlanet(Target, true);
                response = "\r\n Traveling to " + Target.name; 
            }
            else{
                response = "\r\n Object not found."; 
            }
        }

    } else if ( COMMAND.match(/jump to .*/)) {
        
        // find target
        const SplitArray = COMMAND.split(" ");
        var Target;
        if (SplitArray.length > 2) {
            Target = scene.getObjectByName(SplitArray[2]);
            if (Target != undefined){
                GoPlanet(Target, false);
                response = "\r\n Jumping to " + Target.name;
            }
            else{
                response = "\r\n Object not found."; 
            }
        }

    } else if ( COMMAND.match(/target .*/)) {
        
            // find target
            const SplitArray = COMMAND.split(" ");
            var Target;
            if (SplitArray.length > 1) {
                Target = scene.getObjectByName(SplitArray[1]);
                if (Target != undefined){
                    var pos =  new THREE.Vector3();
                    Target.getWorldPosition(pos);
                    cameraControls.setTarget(pos.x,pos.y,pos.z, true)
                    response = "\r\n Target set to " + Target.name; 
                }
                else{
                    response = "\r\n Target not found."; 
                }
            }

    } else if ( COMMAND == "approach") {
        
        var tar = new THREE.Vector3();
        cameraControls.getTarget( tar );
        const l = tar.distanceTo(camera.position)/6;
        cameraControls.dolly(l, true );
        response = "\r\n Apporaching target.";   

    } else if ( COMMAND == "away") {
        
        var tar = new THREE.Vector3();
        cameraControls.getTarget( tar );
        const l = tar.distanceTo(camera.position)/6;
        cameraControls.dolly(-l, true );
        response = "\r\n Away from target.";    

    } else if ( COMMAND == "zoom") {
        cameraControls.zoom( camera.zoom / 2, true )
        response = "\r\n zoom in.";  

    } else if ( COMMAND == "-zoom") {
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

    } else if ( COMMAND == "hide lens flares") {
        scene.getObjectByName('LensFlare').visible = false;
        response = "\r\n Lens flares off";  

    } else if ( COMMAND == "show lens flares") {
        scene.getObjectByName('LensFlare').visible = true;
        response = "\r\n Lens flares on";  

    

    } else if ( COMMAND == "clear") {
      curr_line = "";
    
    } else if ( COMMAND == "hide orbits") {
        
        /*for (var i = 1;scene.children.length;i++){
            console.log(scene.children);
            const item = scene.children[i];*/
            
         //   if ( item.name.match(/OrbitOf.*/)) {
         /*       item.visible = false;
                console.log("hiden orbit of " + item.name);
            }

        }*/
        
        
        scene.getObjectByName('OrbitOfMercury').visible=false;   
        scene.getObjectByName('OrbitOfVenus').visible=false;
        scene.getObjectByName('OrbitOfEarth').visible = false;
        scene.getObjectByName('OrbitOfMars').visible=false;
        scene.getObjectByName('OrbitOfJupiter').visible = false;
        scene.getObjectByName('OrbitOfSaturn').visible = false;
        scene.getObjectByName('OrbitOfUranus').visible = false;
        scene.getObjectByName('OrbitOfNeptune').visible = false;
        scene.getObjectByName('OrbitOfMoon').visible = false;
        scene.getObjectByName('OrbitOfIo').visible=false;   
        scene.getObjectByName('OrbitOfEuropa').visible=false;   
        scene.getObjectByName('OrbitOfGanymede').visible=false;   
        scene.getObjectByName('OrbitOfCallisto').visible=false;   
        
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
        scene.getObjectByName('OrbitOfIo').visible=true;   
        scene.getObjectByName('OrbitOfEuropa').visible=true;   
        scene.getObjectByName('OrbitOfGanymede').visible=true;   
        scene.getObjectByName('OrbitOfCallisto').visible=true;   
        
        response = "\r\n orbits shown"; 
        
    } else if ( COMMAND.match(/hide .*/)) {
    
        // find target
        const SplitArray = COMMAND.split(" ");
        var Object;
        if (SplitArray.length > 1) {
            Object = scene.getObjectByName(SplitArray[1]);
            console.log(Object);
            if (Object != undefined){
                Object.visible = false;
                response =  "\r\n" + Object.name + " hiden"; 
            }
            else{
                response = "\r\n Object not found."; 
            }
        }

    } else if ( COMMAND.match(/show .*/)) {
    
        // find target
        const SplitArray = COMMAND.split(" ");
        var Object;
        if (SplitArray.length > 1) {
            Object = scene.getObjectByName(SplitArray[1]);
            if (Object != undefined){
                Object.visible = true;
                response =  "\r\n" + Object.name + " shown"; 
            }
            else{
                response = "\r\n Object not found."; 
            }
        }
      

    } else {
        curr_line = COMMAND;
        response = "\r\n Unknown command <<" + curr_line + ">>";  
    }
    return response;
}

function GoPlanet(object, transition = true){

        var pos = new THREE.Vector3(); 
        object.getWorldPosition(pos);
        
        cameraControls.setTarget(
            pos.x, 
            pos.y, 
            pos.z, 
            transition
        );
        var d = object.UserData;
        if (object.name == 'Sun') d = d * 5;
        const l = pos.distanceTo(camera.position) - (d * 2.5 + escala * 2.5);
        cameraControls.dolly(l, transition );

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

    
    