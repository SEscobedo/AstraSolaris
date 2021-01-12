import * as THREE from './../node_modules/three/build/three.module.js';
import { TransformControls } from './../node_modules/three/examples/jsm/controls/TransformControls.js';
import { GUI } from './../node_modules/three/examples/jsm/libs/dat.gui.module.js';

var splineHelperObjects;
let splinePointsLength = 4;
let scene, camera, gui;
var positions;
var point, startPoint;
let n = 0;
let l = 0;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();
var params;
var scale;
const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
let transformControl;
let AddLine;


const ARC_SEGMENTS = 200;

var splines;



export function InitLineEditor(Oscene, Ocamera, renderer, document, controls, Oscale, OstartPoint){
    splineHelperObjects = [];
    AddLine = false;
    startPoint = OstartPoint;
    scene = Oscene;
    camera = Ocamera;
    scale = Oscale;
    positions = [];
    splines = {};
    point = new THREE.Vector3();
    
    params = {
        uniform: true,
        tension: 0.5,
        markerScale: 5,
        centripetal: true,
        chordal: true,
        addPoint: addPoint,
        removePoint: removePoint,
        finishSpline: exportSpline
    };

    
    gui = new GUI();

    gui.add( params, 'uniform' );
    gui.add( params, 'tension', 0, 1 ).step( 0.01 ).onChange( function ( value ) {

        splines.uniform.tension = value;
        updateSplineOutline();

    } );
    gui.add( params, 'markerScale', 1, 500 ).step( 1 ).onChange( function ( value ) {

        splineHelperObjects.forEach( function(item){

            item.scale.set(value,value,value);

        });
        updateSplineOutline();

    } );
    gui.add( params, 'centripetal' );
    gui.add( params, 'chordal' );
    gui.add( params, 'addPoint' );
    gui.add( params, 'removePoint' );
    gui.add( params, 'finishSpline' );
    gui.open();

    controls.addEventListener( 'change', SplinesRenderSetup );

    transformControl = new TransformControls( camera, renderer.domElement );
    transformControl.addEventListener( 'change', SplinesRenderSetup );
    transformControl.addEventListener( 'dragging-changed', function ( event ) {

        controls.enabled = ! event.value;

    } );
    scene.add( transformControl );

    transformControl.addEventListener( 'objectChange', function () {

        updateSplineOutline();

    } );

    document.addEventListener( 'pointerdown', onPointerDown, false );
    document.addEventListener( 'pointerup', onPointerUp, false );
    document.addEventListener( 'pointermove', onPointerMove, false );

    /*******
     * Curves
     *********/

    for ( let i = 0; i < splinePointsLength; i ++ ) {

        addSplineObject( positions[ i ] );

    }

    positions.length = 0;

    for ( let i = 0; i < splinePointsLength; i ++ ) {

        positions.push( splineHelperObjects[ i ].position );

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( ARC_SEGMENTS * 3 ), 3 ) );

    let curve = new THREE.CatmullRomCurve3( positions );
    curve.curveType = 'catmullrom';
    curve.mesh = new THREE.Line( geometry.clone(), new THREE.LineBasicMaterial( {
        color: 0xff0000,
        opacity: 0.35
    } ) );
    curve.mesh.castShadow = true;
    splines.uniform = curve;

    curve = new THREE.CatmullRomCurve3( positions );
    curve.curveType = 'centripetal';
    curve.mesh = new THREE.Line( geometry.clone(), new THREE.LineBasicMaterial( {
        color: 0x00ff00,
        opacity: 0.35
    } ) );
    curve.mesh.castShadow = true;
    splines.centripetal = curve;

    curve = new THREE.CatmullRomCurve3( positions );
    curve.curveType = 'chordal';
    curve.mesh = new THREE.Line( geometry.clone(), new THREE.LineBasicMaterial( {
        color: 0x0000ff,
        opacity: 0.35
    } ) );
    curve.mesh.castShadow = true;
    splines.chordal = curve;
    let j = 0;
    for ( const k in splines ) {
        j++;
        const spline = splines[ k ];
        spline.mesh.name = "curve" + j;
        scene.add( spline.mesh );

    }
    
    load( [ new THREE.Vector3( startPoint.x + scale*5, startPoint.y + scale*10, startPoint.z),
        new THREE.Vector3( startPoint.x + scale*10, startPoint.y, startPoint.z),
        new THREE.Vector3( startPoint.x, startPoint.y - scale*30, startPoint.z + scale*5),
        new THREE.Vector3( startPoint.x + scale*15, startPoint.y + scale*30, startPoint.z) ] );

}

function addSplineObject( position ) {

    const material = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );
    const object = new THREE.Mesh( geometry, material );

    if ( position ) {

        object.position.copy( position );

    } else {
        
        object.position.x = startPoint.x +  Math.random() * 100 * scale - 50 * scale;
        object.position.y = startPoint.y + Math.random() * 60 * scale;
        object.position.z = startPoint.z + Math.random() * 80 * scale - 40 * scale;

    }

    object.castShadow = true;
    object.receiveShadow = true;
    object.name = "Point" + n;
    n++;
    scene.add( object );
    splineHelperObjects.push( object );
    
    return object;

}

function addPoint() {

    splinePointsLength ++;

    positions.push( addSplineObject().position );

    updateSplineOutline();

}

function removePoint() {

    if ( splinePointsLength <= 4 ) {

        return;

    }

    const point = splineHelperObjects.pop();
    splinePointsLength --;
    positions.pop();

    if ( transformControl.object === point ) transformControl.detach();
    scene.remove( point );

    updateSplineOutline();

}

function updateSplineOutline() {

    for ( const k in splines ) {

        const spline = splines[ k ];

        const splineMesh = spline.mesh;
        const position = splineMesh.geometry.attributes.position;

        for ( let i = 0; i < ARC_SEGMENTS; i ++ ) {

            const t = i / ( ARC_SEGMENTS - 1 );
            spline.getPoint( t, point );
            position.setXYZ( i, point.x, point.y, point.z );

        }

        position.needsUpdate = true;

    }

}

function exportSpline() {

    const strplace = [];

    for ( let i = 0; i < splinePointsLength; i ++ ) {

        const p = splineHelperObjects[ i ].position;
        strplace.push( `(${p.x}, ${p.y}, ${p.z})` );

    }

    //console.log( strplace.join( ',\n' ) );
    const code = '[' + ( strplace.join( ',\n\t' ) ) + ']';
    AddLine = true;
    prompt( 'The line has been added to the model with the name: spline' + l + '; Coordinates are: ', code);
    CloseLineEditor();

}

function load( new_positions ) {

    while ( new_positions.length > positions.length ) {

        addPoint();

    }

    while ( new_positions.length < positions.length ) {

        removePoint();

    }

    for ( let i = 0; i < positions.length; i ++ ) {

        positions[ i ].copy( new_positions[ i ] );

    }

    updateSplineOutline();

}

export function SplinesRenderSetup() {

    splines.uniform.mesh.visible = params.uniform;
    splines.centripetal.mesh.visible = params.centripetal;
    splines.chordal.mesh.visible = params.chordal;

}

function onPointerDown( event ) {

    onDownPosition.x = event.clientX;
    onDownPosition.y = event.clientY;

}

function onPointerUp() {

    onUpPosition.x = event.clientX;
    onUpPosition.y = event.clientY;

    if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) transformControl.detach();

}

function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( splineHelperObjects );

    if ( intersects.length > 0 ) {

        const object = intersects[ 0 ].object;

        if ( object !== transformControl.object ) {

            transformControl.attach( object );

        }

    }

}

export function CloseLineEditor(){

    splineHelperObjects.forEach(function(item){

        scene.remove(item);

    });

    for ( const k in splines ) {

        const spline = splines[ k ];
        scene.remove( spline.mesh );
        
        if (AddLine) {

            const newSpline = spline.mesh.clone()
            newSpline.name = "spline" + l;
            l++
            scene.add(newSpline);
        }
        

    }

    scene.remove(transformControl);
    transformControl = undefined;
    document.removeEventListener( 'pointerdown', onPointerDown, false );
    document.removeEventListener( 'pointerup', onPointerUp, false );
    document.removeEventListener( 'pointermove', onPointerMove, false );
    gui.hide();
}