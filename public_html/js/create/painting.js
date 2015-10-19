
function create_painting(scene, objects) {
    var path = 'images/fruct.jpeg';

    var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
    THREE.ImageUtils.crossOrigin = '';
    var texture = THREE.ImageUtils.loadTexture(path);
    var material = new THREE.MeshPhongMaterial({
        ambient: 0x808080,
        map: texture,
        specular: 0xFFFFFF,
        shininess: 30,
        shading: THREE.FlatShading,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 300/2;
    mesh.position.y = 300/2;
    scene.add(mesh);
    objects.push( mesh );
    return mesh;
}

function create_ground(scene) {
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

}

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
