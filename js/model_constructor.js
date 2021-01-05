//import { XRHitTestTrackableType } from 'three';
import * as THREE from './../node_modules/three/build/three.module.js';
import Papa from "./../node_modules/papaparse/papaparse.js";

let mars, marsAtmos, mercury, venus, earth, moon, earthAtmos, jupiter, saturn, ring, neptune, uranus,
 sun, crown, Orbit_mercury, Orbit_venus, Orbit_earth, Orbit_mars, Orbit_jupiter, Orbit_saturn, Orbit_uranus, Orbit_neptune, Orbit_moon;

 var tm = new Date();
 var JulianDateIndex;

 //var mesh;
 var strDownloadMime = "image/octet-stream";

 //vínculos a datos de efemérides
 var url = [];
 url[0] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/sun_2000-2024.csv";
 url[1] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/mercury_2000-2024.csv";
 url[2] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/venus_2000-2024.csv";
 url[3] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/earth_2000-2024.csv";
 url[9] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/moon_2000-2024.csv";
 url[4] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/mars_2000-2024.csv";
 url[5] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/jupiter_2000-2024.csv";
 url[6] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/saturn_2000-2024.csv";
 url[7] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/uranus_2000-2024.csv";
 url[8] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/neptune_2000-20024.csv";
 url[20] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/halley_2000-2024.csv";

 //datos ephemerides orbita osculadora
 
 url[10] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/mercury_oscul_200-2024.csv";
 url[11] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/venus_oscul_2000-2024.csv";
 url[12] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/earth_oscul_2000-2024.csv";
 url[19] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/moon_oscul_2000-2024.csv";
 url[13] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/mars_oscul_2000-2024.csv";
 url[14] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/jupiter_oscul_2000-2024.csv";
 url[15] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/saturn_oscul_2000-2024.csv";
 url[16] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/uranus_oscul_2000-2024.csv";
 url[17] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/neptune_oscul_2000-2024.csv";
 url[18] = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/ephemeris/halley_oscul_2000-2024.csv";

export function CreateOrbits(UA,scene){
    //Import orbit parameters

    const urlPlanets = "https://raw.githubusercontent.com/SEscobedo/AstraSolaris/master/data/planets_run.csv";
    
    Papa.parse(urlPlanets, {
        download: true,
        dynamicTyping: false,
        header: true,
        error: function(error) {
            console.log("Error found:", error);
        },
        complete: function(results) { 
             //Parámetros orbitales
             for(i=1;i < 9;i++){
                const EC = Number(results.data[i]["6"]); //Eccentricity
                const IN = Number(results.data[i]["5"]) ; //Inclination
                const OM = Number(results.data[i]["8"]) ; //Longitud of ascending node
                const W = Number(results.data[i]["7"]); //Argument of periapsis
                const A = Number(results.data[i]["4"]); //Semi-major axis
               scene.add(CreateOsculOrbit2(0,0,0,EC,IN,OM,W,A))
            }
        }
        });

}

export function AddStars(UA, scene){
    
    
    // stars
    const radius = 30*UA;
    var i, r = radius, starsGeometry = [ new THREE.BufferGeometry(), new THREE.BufferGeometry() ];
    
    var vertices1 = [];
    var vertices2 = [];
    
    var vertex = new THREE.Vector3();
    
    for ( i = 0; i < 250; i ++ ) {
    
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );
    
        vertices1.push( vertex.x, vertex.y, vertex.z );
    
    }
    
    for ( i = 0; i < 1500; i ++ ) {
    
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar( r );
    
        vertices2.push( vertex.x, vertex.y, vertex.z );
    
    }
    
    starsGeometry[ 0 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices1, 3 ) );
    starsGeometry[ 1 ].setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );
    
    var stars;
    var starsMaterials = [
        new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
    ];
    
    for ( i = 10; i < 30; i ++ ) {
    
        stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
    
        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar( i * 10 );
    
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();
    
        scene.add( stars );
    
    }

}

export function SkyReference(radius, scene){
    var i;
    let Group = new THREE.Group();
    
    //paralelos
    for (i=0;i < 18; i++){
    const curve = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        radius, radius,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );
    

    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    var color1;
    if (i==0) color1 =  0xe64949;
    else color1 =  0x101010;
    const material = new THREE.LineBasicMaterial( { color : color1} );
    
    // Create the final object to add to the scene
    const ellipse = new THREE.Line( geometry, material );
    ellipse.rotation.y += 10*i / 180 * Math.PI;

    Group.add(ellipse); 

    }

    //Meridianos
    for (i=0;i < 9; i++){
        const h = radius * Math.sin(10*i / 180* Math.PI);
        const r = radius * Math.cos(10*i / 180* Math.PI);
        const curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            r, r,           // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        
    
        const points = curve.getPoints( 50 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        var color2;
        if (i==0) color2 =  0xe64949;
        else color2 =  0x101010;
        const material = new THREE.LineBasicMaterial( { color : color2 } );
        
        // Create the final object to add to the scene
        const ellipse = new THREE.Line( geometry, material );
        ellipse.rotation.x = 90 / 180* Math.PI;
        const ellipse2 = ellipse.clone();
        ellipse.position.set(0,h,0);
        ellipse2.position.set(0,-h,0);

    
        Group.add(ellipse); 
        Group.add(ellipse2); 
    
        }
        scene.add(Group);
}

export function CreateReferenceGeometry(UA, scene){
    
    var materialX = new THREE.LineBasicMaterial({color: 'green'});
    var materialY = new THREE.LineBasicMaterial({color: 'red'});
    var materialZ = new THREE.LineBasicMaterial({color: 'yellow'});

    var pointsX = [];
    pointsX.push( new THREE.Vector3( 0, 0, 0 ) );
    pointsX.push( new THREE.Vector3( 10*UA, 0, 0 ) );
    var geometryX = new THREE.BufferGeometry().setFromPoints( pointsX );

    var pointsY = [];
    pointsY.push( new THREE.Vector3( 0, 0, 0 ) );
    pointsY.push( new THREE.Vector3( 0, 10*UA, 0 ) );
    var geometryY = new THREE.BufferGeometry().setFromPoints( pointsY );

    var pointsZ = [];
    pointsZ.push( new THREE.Vector3( 0, 0, 0 ) );
    pointsZ.push( new THREE.Vector3( 0, 0, 10*UA ) );    
    var geometryZ = new THREE.BufferGeometry().setFromPoints( pointsZ );
    
    var lineEquinoxX = new THREE.Line( geometryX, materialX );
    var lineEquinoxY= new THREE.Line( geometryY, materialY );
    var lineEquinoxZ = new THREE.Line( geometryZ, materialZ );

    scene.add( lineEquinoxX );
    scene.add( lineEquinoxY );
    scene.add( lineEquinoxZ );
}

/*function LoadEpheme(item, index){
    Papa.parse(item, {
        download: true,
        dynamicTyping: false,
        complete: function(results) {
            //console.log(results);
            //colocar a cada planeta en su correspondiente lugar
            //Cordenadas cartesianas
            const x = Number(results.data[JulianDateIndex]["2"])*UA;
            const y = Number(results.data[JulianDateIndex]["4"])*UA;
            const z = Number(results.data[JulianDateIndex]["3"])*UA;
            //Parámetros orbitales
            const EC = Number(results.data[JulianDateIndex + 1]["2"]);
            const IN = Number(results.data[JulianDateIndex + 1]["4"]) * Math.PI / 180;
            const OM = Number(results.data[JulianDateIndex + 1]["5"]) * Math.PI / 180;
            const W = Number(results.data[JulianDateIndex + 1]["6"]) * Math.PI / 180 ;
            const A = Number(results.data[JulianDateIndex + 1]["11"] * UA);

            if (index == 0){
               
                sun.position.set(0,0,0);
                crown.position.set(0,0,0);
               
            }else if (index == 1){
               console.log('mercury');
               console.log(results.data[JulianDateIndex]["1"]);
               console.log(results);

                mercury.position.set(x,y,z);
                console.log(mercury.position);
                console.log(JulianDateIndex);
            }else if (index == 2){
                console.log('venus');
                
                 venus.position.set(x,y,z);
                 console.log(venus.position);
            }else if (index == 3){
                console.log(index + " earth");
                earth.position.set(x,y,z);
                earthAtmos.position.set(x,y,z);
                
                console.log(earth.position);
            }else if (index == 9){
                console.log(index + " moon");
                console.log(results);
                moon.position.set(x,y,z);
                moon.lookAt(new THREE.Vector3(earth.position.x, earth.position.y, earth.position.z));
                moon.rotation.x += Math.PI/2;
                console.log(moon.position);   
            }else if (index == 4){
                console.log(index);
                mars.position.set(x,y,z);
                console.log(mars.position);    
            }else if (index == 5){
                console.log(index);
                jupiter.position.set(x,y,z);
                console.log(jupiter.position);
            }else if (index == 6){
                console.log(index);
                saturn.position.set(x,y,z);
                ring.position.set(x,y,z);
                console.log(saturn.position); 
            }else if (index == 7){
                console.log(index);
                uranus.position.set(x,y,z);
                console.log(uranus.position);   
            }else if (index == 8){
                console.log(index);
                neptune.position.set(x,y,z);
                console.log(neptune.position);    

            }else if (index == 20){
                const xc = Number(results.data[JulianDateIndex + 17]["2"])*UA;
                const yc = Number(results.data[JulianDateIndex + 17]["4"])*UA;
                const zc = Number(results.data[JulianDateIndex + 17]["3"])*UA;
                console.log('comet xyz ' +  results.data[JulianDateIndex + 17]["1"]);
                console.log(results);
                halley.position.set(xc,yc,zc);

            //ORBITAS OSCULADORAS
          
            }else if ((index > 9) && (index < 18)){
                console.log(results.data[JulianDateIndex + 1]["1"]);
                CreateOsculOrbit(0,0,0,EC,IN,OM,W,A);

            }else if ((index == 18) && (index < 19)){
                //cometa halley
                const ECc = Number(results.data[JulianDateIndex + 18]["2"]);
                const INc = Number(results.data[JulianDateIndex + 18]["4"]) * Math.PI / 180;
                const OMc = Number(results.data[JulianDateIndex + 18]["5"]) * Math.PI / 180;
                const Wc = Number(results.data[JulianDateIndex + 18]["6"]) * Math.PI / 180 ;
                const Ac = Number(results.data[JulianDateIndex + 18]["11"] * UA);
                console.log('comet osc ' + results.data[JulianDateIndex + 18]["1"])
                console.log(results);
                CreateOsculOrbit2(0,0,0,ECc,INc,OMc,Wc,Ac);

            }else if (index == 19){
                  
            //Parámetros orbitales (centrados el la tierra)
            const ECm = Number(results.data[JulianDateIndex + 3]["2"]);
            const INm = Number(results.data[JulianDateIndex + 3]["4"]) * Math.PI / 180;
            const OMm = Number(results.data[JulianDateIndex + 3]["5"]) * Math.PI / 180;
            const Wm = Number(results.data[JulianDateIndex + 3]["6"]) * Math.PI / 180 ;
            const Am = Number(results.data[JulianDateIndex + 3]["11"] * UA);


                console.log('moon orbit to create'); 
                console.log('IN=' + INm + ', OM=' + OMm + 'W' + Wm);
                CreateOsculOrbit(earth.position.x,earth.position.z, earth.position.y,ECm,INm,OMm,Wm,Am);
                console.log(results);
                console.log('moon orbit created');

            }
            
            
        }
        });
}*/

function CreateOsculOrbit2(X,Y,Z,EC,IN,OM,W,A){
  
  //osculator orbit
  const Orbit_Line = new THREE.EllipseCurve(
    -EC * A, 0,          // ax, aY (center at focus)
    A, A * Math.sqrt( 1 - Math.pow( EC , 2 ) ), // xRadius (semieje mayor), yRadius (semieje menor)
    0,  2 * Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0//W  - 90 / 180* Math.PI // aRotation argument of periapsis
    );

var points = Orbit_Line.getPoints( 5000 );
var geometryOrbit = new THREE.BufferGeometry().setFromPoints( points );

var materialOrbit = new THREE.LineBasicMaterial( { color : 'blue' } );

// Create the final object to add to the scene
oscul2 = new THREE.Line( geometryOrbit, materialOrbit );

oscul2.rotation.x = 90 / 180 * Math.PI ;
oscul2.rotation.z = -W - OM ; //- 90 / 180* Math.PI // aRotation argument of periapsis
oscul2.rotateOnAxis(new THREE.Vector3(Math.cos(OM),Math.sin(OM),0),1 * IN); //Inclinación al rededor del eje de nodos

console.log('OM = ' + OM * 180/ Math.PI);
console.log('W = ' + W * 180/Math.PI);
//



console.log('X='+ X/UA + 'Y='+ Y/UA +'Z='+ Z/UA +'IN=' + IN + ', OM=' + OM);
console.log('W=' + W + 'A = ' + A /UA);
oscul2.position.x  = X;
oscul2.position.z  = Y;
oscul2.position.y  = Z;
//scene.add(oscul2);
return oscul2;
}

function CreateOsculOrbit(X,Y,Z,EC,IN,OM,W,A){
    var oscul
    //osculator orbit
    const Orbit_Line = new THREE.EllipseCurve(
         -EC * A, 0,          // ax, aY (center at focus)
      A, A * Math.sqrt( 1 - Math.pow( EC , 2 ) ), // xRadius (semieje mayor), yRadius (semieje menor)
      0,  2 * Math.PI,  // aStartAngle, aEndAngle
      false,            // aClockwise
      0 // aRotation argument of periapsis
  );
  
  var points = Orbit_Line.getPoints( 1000 );
  var geometryOrbit = new THREE.BufferGeometry().setFromPoints( points );
  
  var materialOrbit = new THREE.LineBasicMaterial( { color : 'red' } );
  
  // Create the final object to add to the scene
  oscul = new THREE.Line( geometryOrbit, materialOrbit );

  oscul.rotation.x = 90 / 180* Math.PI ;
  oscul.rotation.z = -W - OM;
  oscul.rotateOnAxis(new THREE.Vector3(Math.cos(-OM),Math.sin(-OM),0), -IN);   //inclination
 
  console.log('X='+ X/UA + 'Y='+ Y/UA +'Z='+ Z/UA +'IN=' + IN + ', OM=' + OM);
  console.log('W=' + W + 'A = ' + A /UA);
  oscul.position.x  = X;
  oscul.position.z  = Y;
  oscul.position.y  = Z;
  //scene.add(oscul);
  return oscul;
  }