import * as THREE from 'three';
import CameraControls from 'camera-controls';
import * as MC from './model_constructor.js';
import {PostProcessing, UpdatePostProcessingEffect, CloseGui} from './effects.js';
import * as GE from './geometry_editor.js';

var Postprocess = false;
var LineEditing = false;

let camera, scene, renderer, cameraControls,
escala, UA;

 var tm = new Date();
 const clock = new THREE.Clock();

    //var mesh;
    var strDownloadMime = "image/octet-stream";
class App {

    init() {

        escala = 5 //Earth size (refference for all celestial bodies)
        
        UA = 23454.8 * escala //Astronomical Unit (Mean distance from Earth to Sun)
        

        CameraControls.install( { THREE: THREE } );

        // Init scene
        scene = new THREE.Scene();
        scene.name = "Solar System";
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

        //Add planets with natural satellites
        MC.CreatePlanets(escala,UA,scene);
        //Add dwarf planets with natural satellites
        MC.CreatePlanets(escala,UA,scene,"./../data/dwarf_planets_run.csv", 0x5E4E4E);
        
        

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

        animate();
    }

    CommandExecute(COMMAND){
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
          
        } else if ( COMMAND == "post processor on") {
            Postprocess = true;
            PostProcessing(renderer);
            response = "\r\n post processor on";  
    
        } else if ( COMMAND == "post processor off") {
            Postprocess = false;
            CloseGui();
            response = "\r\n post processor off";  
    
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
    
        } else if ( COMMAND == "create spline") {
        var InitialPoint = new THREE.Vector3();
        cameraControls.getPosition(InitialPoint);
        GE.InitLineEditor(scene, camera, renderer, document, cameraControls, escala, InitialPoint);
        LineEditing = true;
        response = "\r\n spline editor opened";  
    
        } else if ( COMMAND == "close spline editor") {
        GE.CloseLineEditor();
        LineEditing = false;
        response = "\r\n spline editor opened";  
        
        } else if ( COMMAND == "create reference sphere") {
    
            const sph = scene.getObjectByName('reference sphere');
            if (sph == undefined){
                MC.SkyReference(100*UA,scene);
                response = "\r\n reference sphere created";  
            }
            else{
                sph.visible = true;
                response = "\r\n reference sphere already existed: shown.";  
            }
          
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
            
            /*for(var i = 1;scene.children.length;i++){
                const item = scene.children[i];
                console.log(item);*/
                //if ( item.name.match(/OrbitOf.*/)) {
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
            scene.getObjectByName('OrbitOfMimas').visible=false;   
            scene.getObjectByName('OrbitOfCeres').visible=false;   
            scene.getObjectByName('OrbitOfPluto').visible=false;   
            scene.getObjectByName('OrbitOfEnceladus').visible=false;   
            scene.getObjectByName('OrbitOfPhobos').visible=false;   
            scene.getObjectByName('OrbitOfDeimos').visible=false;   
            
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
            scene.getObjectByName('OrbitOfMimas').visible=true;   
            scene.getObjectByName('OrbitOfCeres').visible=true;
            scene.getObjectByName('OrbitOfPluto').visible=true; 
            scene.getObjectByName('OrbitOfEnceladus').visible=true;
            scene.getObjectByName('OrbitOfPhobos').visible=true;
            scene.getObjectByName('OrbitOfDeimos').visible=true;
            
            response = "\r\n orbits shown"; 
            
        } else if ( COMMAND.match(/hide .*/)) {
        
            // find target
            const SplitArray = COMMAND.split(" ");
            var Object;
            if (SplitArray.length > 1) {
                SplitArray.shift();
                const ObjectName = SplitArray.join(" ");
                Object = scene.getObjectByName(ObjectName);
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
                SplitArray.shift();
                const ObjectName = SplitArray.join(" ");
                Object = scene.getObjectByName(ObjectName);
                if (Object != undefined){
                    Object.visible = true;
                    response =  "\r\n" + Object.name + " shown"; 
                }
                else{
                    response = "\r\n Object not found."; 
                }
            }
       
        } else if ( COMMAND == "load xyz") {
    
        /*// creating input on-the-fly
        var input = document.createElement("input");
        input.attr("type", "file");
        // add onchange handler if you wish to get the file :)
        input.trigger("click"); // opening dialog
        //return false; // avoiding navigation
        var file = document.getElementById("file").files[0];
    
        //scene.add(GE.LoadXYZ(file));*/
    
        response = "\r\n not implemented fucntion";
            
        } else {
            curr_line = COMMAND;
            response = "\r\n Unknown command <<" + curr_line + ">>";  
        }
        return response;
    }
}
    

function animate() {

        const delta = clock.getDelta();
	    const elapsed = clock.getElapsedTime();
        const updated = cameraControls.update( delta );
        
        requestAnimationFrame(animate);
        MC.SolarSystemUpdate(scene, camera);
        if (LineEditing === true) GE.SplinesRenderSetup();
        renderer.render(scene, camera);
        if (Postprocess === true) UpdatePostProcessingEffect(scene,camera);
        
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



function GoPlanet(object, transition = true){
       
        var pos = new THREE.Vector3(); 
        object.getWorldPosition(pos);
       
        cameraControls.setTarget(
            pos.x, 
            pos.y, 
            pos.z, 
            transition
        );
        var d = object.UserData.Radius;
       
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

    
export { App }