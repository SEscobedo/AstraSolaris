import * as THREE from './../node_modules/three/build/three.module.js';



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