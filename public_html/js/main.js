var container, stats;
var camera, controls, scene, renderer;
var objects = [], plane;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
    offset = new THREE.Vector3(),
    INTERSECTED, SELECTED;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;
    camera.position.x = 500;
    camera.position.y = 500;

    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0; // не нравится, когда > 1
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    scene = new THREE.Scene();

    var axes = new THREE.AxisHelper( 400 );
    scene.add(axes);

    scene.add( new THREE.AmbientLight( 0x505050 ) );

    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    light.castShadow = true;

    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;

    light.shadowBias = -0.00022;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    scene.add( light );

    var geometry = new THREE.BoxGeometry( 40, 40, 40 );

    //createPlane("right");
    //createPlane("left");

    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
        new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true } )
    );
    plane.visible = false;
    scene.add( plane );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.sortObjects = false;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    container.appendChild( renderer.domElement );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - draggable cubes';
    container.appendChild( info );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );


    // GROUND
    function mipmap( size, color ) {

        var imageCanvas = document.createElement( "canvas" ),
            context = imageCanvas.getContext( "2d" );

        imageCanvas.width = imageCanvas.height = size;

        context.fillStyle = "#444";
        context.fillRect( 0, 0, size, size );

        context.fillStyle = color;
        context.fillRect( 0, 0, size / 2, size / 2 );
        context.fillRect( size / 2, size / 2, size / 2, size / 2 );
        return imageCanvas;

    }

    var canvas = mipmap( 128, '#f00' );
    var textureCanvas1 = new THREE.Texture( canvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping );
    textureCanvas1.repeat.set( 1000, 1000 );
    textureCanvas1.mipmaps[ 0 ] = canvas;
    textureCanvas1.mipmaps[ 1 ] = mipmap( 64, '#0f0' );
    textureCanvas1.mipmaps[ 2 ] = mipmap( 32, '#00f' );
    textureCanvas1.mipmaps[ 3 ] = mipmap( 16, '#400' );
    textureCanvas1.mipmaps[ 4 ] = mipmap( 8,  '#040' );
    textureCanvas1.mipmaps[ 5 ] = mipmap( 4,  '#004' );
    textureCanvas1.mipmaps[ 6 ] = mipmap( 2,  '#044' );
    textureCanvas1.mipmaps[ 7 ] = mipmap( 1,  '#404' );
    textureCanvas1.needsUpdate = true;

    materialCanvas1 = new THREE.MeshBasicMaterial( { map: textureCanvas1 } );

    var textureCanvas2 = textureCanvas1.clone();
    textureCanvas2.magFilter = THREE.NearestFilter;
    textureCanvas2.minFilter = THREE.NearestMipMapNearestFilter;
    textureCanvas2.needsUpdate = true;
    materialCanvas2 = new THREE.MeshBasicMaterial( { color: 0xffccaa, map: textureCanvas2 } );

    var geometry = new THREE.PlaneBufferGeometry( 30, 30 );

    var meshCanvas1 = new THREE.Mesh( geometry, materialCanvas1 );
    meshCanvas1.rotation.x = -Math.PI / 2;
    meshCanvas1.scale.set(1000, 1000, 1000);
    scene.add( meshCanvas1 );

    // PAINTING

    var callbackPainting = function () {

        var image = texturePainting1.image;

        texturePainting2.image = image;
        texturePainting2.needsUpdate = true;

        scene.add( meshCanvas1 );

        var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
        var mesh1 = new THREE.Mesh( geometry, materialPainting1 );

        addPainting( scene, mesh1 );

        function addPainting( zscene, zmesh ) {

            zmesh.scale.x = image.width / 100;
            zmesh.scale.y = image.height / 100;

            zscene.add( zmesh );

            var meshFrame = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x000000, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 5 } ) );
            //meshFrame.scale.x = 0.1 * image.width / 100;
            //meshFrame.scale.y = 0.1 * image.height / 100;

            zscene.add( meshFrame );

            var meshShadow = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.75, transparent: true } ) );
            //meshShadow.position.y = -1.1 * image.height / 2;
            //meshShadow.position.z = -1.1 * image.height / 2;
            meshShadow.rotation.x = -Math.PI / 2;
            meshShadow.scale.x = 0.1 * image.width / 100;
            meshShadow.scale.y = 0.1 * image.height / 100;
            zscene.add( meshShadow );

            var floorHeight = -1.117 * image.height / 2;

        }
    };


    var texturePainting1 = THREE.ImageUtils.loadTexture( "images/grape.jpg", THREE.UVMapping, callbackPainting ),
        texturePainting2 = new THREE.Texture(),
        materialPainting1 = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texturePainting1 } ),
        materialPainting2 = new THREE.MeshBasicMaterial( { color: 0xffccaa, map: texturePainting2 } );

    texturePainting2.minFilter = texturePainting2.magFilter = THREE.NearestFilter;
    texturePainting1.minFilter = texturePainting1.magFilter = THREE.LinearFilter;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    //

    raycaster.setFromCamera( mouse, camera );

    if ( SELECTED ) {

        var intersects = raycaster.intersectObject( plane );
        SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
        return;

    }

    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

        if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

            plane.position.copy( INTERSECTED.position );
            plane.lookAt( camera.position );

        }

        container.style.cursor = 'pointer';

    } else {

        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

        INTERSECTED = null;

        container.style.cursor = 'auto';

    }

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( camera );

    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

        controls.enabled = false;

        SELECTED = intersects[ 0 ].object;

        var intersects = raycaster.intersectObject( plane );
        offset.copy( intersects[ 0 ].point ).sub( plane.position );

        container.style.cursor = 'move';

    }

}

function onDocumentMouseUp( event ) {

    event.preventDefault();

    controls.enabled = true;

    if ( INTERSECTED ) {

        plane.position.copy( INTERSECTED.position );

        SELECTED = null;

    }

    container.style.cursor = 'auto';

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    controls.update();

    renderer.render( scene, camera );

}

// my functions

function createPlane(side) {

    var planeWidth = 300;
    var planeHeight = 300;

    var planeGeometry = new THREE.PlaneGeometry(planeWidth,planeHeight,1,1);
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xff00ff});
    var plane = new THREE.Mesh(planeGeometry,planeMaterial);

    if (side == "left") {
        plane.rotation.y = Math.PI/2;
    }
    if (side == "right") {
        plane.position.x = planeWidth/2;
    }
    plane.position.y = planeHeight/2;
    if (side == "left") {
        plane.position.z = planeWidth/2;
    }
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add( plane );
    objects.push( plane );

}
