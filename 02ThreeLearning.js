//console.log("connected");
var camera, scene, render;
var disZ = 2;
var f = 0.01;
var keyboard = {};
var player = { height: 18 , speed: 0.05 };
var meshFloor;
var USE_WIREFRAME = true;

var mdoel, modelTexture, modelNormalMap, modelBumpMap;
var modelHeight = -50;
var modelSpeed = 0.2;
var text2;
var cylinder = [1000];
var mesh;

//init();

var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );

var song;
var vol;
var size;

//p5js - sound analyser
function setup() {
  // put setup code here
  song = loadSound('sounds/Liquid Feat.mp3', loaded);  
  noCanvas();
  amp = new p5.Amplitude();
}

function draw() {
	//background(200);
    // put drawing code here
  	vol = amp.getLevel();
    //console.log(vol);  
}

function loaded() {
	song.loop();
}
//----------functions--------//
function init() {
    var overlay = document.getElementById( 'overlay' );
    overlay.remove();

    //scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x666666 );

    //camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-60, player.height, 90);
    camera.lookAt(new THREE.Vector3(0, player.height,disZ));
    
    
    //audio player
    var listener = new THREE.AudioListener();
    camera.add( listener );
    //var audioLoader = new THREE.AudioLoader();
    /*
    audioLoader.load( song , function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.5 );
        //sound.loop = true;
        sound.play();
    }); 
    /*
    var sound = new THREE.Audio( listener );
    var analyser = new THREE.AudioAnalyser( sound, 32 );
    
    uniforms = {
        tAudioData: { value: new THREE.DataTexture( analyser.data, 32 / 2, 1, THREE.LuminanceFormat ) }
    };

    var data = analyser.getAverageFrequency(); 
    console.log(data);
    */
    //controls
    controls = new THREE.OrbitControls( camera );
    //----------draw------------//
    //the cylinder
    for(var i = 0; i < 1000; i += 2){
        cylinder[i] = new THREE.Mesh(
            new THREE.BoxGeometry( 4, 4, 4 ),
            new THREE.MeshNormalMaterial({
                color:0xffffff, 
                wireframe: false
            })
        )
        cylinder[i].position.x = ( Math.random() - 0.5 ) * 600;
        cylinder[i].position.y = ( Math.random() - 0.5 ) * 600;
        cylinder[i].position.z = ( Math.random() - 0.5 ) * 600; 
        cylinder[i].receiveShadow = true;
        cylinder[i].castShadow = true;  
        scene.add( cylinder[i] );
        //cylinder.rotation.x += 0.1;
    }
    //meshFloor
    meshFloor1 = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200, 20, 20),
        new THREE.MeshPhongMaterial({color: 0xdddddd, wireframe: USE_WIREFRAME})
    );
    meshFloor1.position.set(0, -100, 0);
    meshFloor1.rotation.x -= Math.PI / 2;
    meshFloor1.receiveShadow = true;
    scene.add( meshFloor1 );

    /*
    meshFloor2 = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200, 20, 20),
        new THREE.MeshPhongMaterial({color: 0xdddddd, wireframe: USE_WIREFRAME})
    );
    meshFloor2.position.set(0, 100, 0);
    meshFloor2.rotation.x -= Math.PI / 2;
    meshFloor2.receiveShadow = true;
    scene.add( meshFloor2 );
    */

    //setup the texture loader
    var textureLoader = new THREE.TextureLoader();
    modelTexture = new textureLoader.load('textures/lava/lavatile.jpg');
    modelBumpMap = new textureLoader.load('textures/brick_bump.jpg');
    
    
    //setup the obj loader
    var objLoader = new THREE.OBJLoader();
    objLoader.load("models/obj/walt/WaltHead.obj", function(mesh){      
        mesh.scale.set(2 * size, 1.5 * size, 2 * size);
        //modelHeight += modelSpeed;
        mesh.position.set(0, modelHeight, 0);
        scene.add(mesh);
    });


    //draw water
    light = new THREE.DirectionalLight( 0xffffff, 0.8 );
    scene.add( light );
    var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );
	water = new THREE.Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			} ),
			alpha: 1.0,
			sunDirection: light.position.clone().normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 3.7,
			fog: scene.fog !== undefined
		}
    );
    water.position.set(0 , 0 , 0);
	water.rotation.x = - Math.PI / 2;
	scene.add( water );     
    
    /*
    torusknot = new THREE.Mesh(
        new THREE.TorusKnotGeometry( 4, 2, 100, 16 ),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: modelTexture
        })
    );
    torusknot.position.set(-5, 15, -15);
    scene.add( torusknot );
    torusknot.receiveShadow = true;
    torusknot.castShadow = true;
    
    //the torus
    torus = new THREE.Mesh(
        new THREE.TorusGeometry(4, 2, 16, 100),
        new THREE.MeshPhongMaterial({
            color: 0xFF69B4,
            //map: modelTexture
        })
    );
    torus.position.set(-1, 1.5, -2.5);
    scene.add( torus );
    torus.receiveShadow = true;
    torus.castShadow = true; 
    */
    //-------------------------//

    //-----------info----------//
    /*
    text2 = document.createElement('div');
    text2.style.position = 'absolute';
    //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    text2.style.font = "italic bold 60px arial,serif";
    text2.style.color = 'white';
    text2.style.width = 100;
    text2.style.height = 100;
    //text2.style.backgroundColor = "blue";
    text2.innerHTML = "Poly World:)";
    text2.style.textAlign = "center";
    text2.style.top = window.innerHeight / 2 + 'px';
    text2.style.left = -120 + window.innerWidth / 2 + 'px';
    document.body.appendChild(text2); 
    */

    //-------------------------//
    //renderer
    render = new THREE.WebGLRenderer({ alpha:true });
    render.setSize( window.innerWidth, window.innerHeight);
    render.shadowMap.enabled = true; //tell three to enable shadow map
    render.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild( render.domElement );

    //lights
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8, 200 );
    pointLight.position.set = (-80, 60, -60);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 80;
    camera.add( pointLight );
    scene.add( camera );

    var pointLight2 = new THREE.PointLight( 0xffffff, 0.8, 200 );
    pointLight2.position.set = (-80, 60, 60);
    pointLight2.castShadow = true;
    pointLight2.shadow.camera.near = 0.1;
    pointLight2.shadow.camera.far = 80;
    //camera.add( pointLight );
    scene.add( pointLight2 );    

    animate();

}

function render() {
    requestAnimationFrame( render );
    //uniforms.tAudioData.value.needsUpdate = true;
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt(new THREE.Vector3(0, player.height,disZ));
    controls.update();
    render.render( scene, camera );
}

function animate() {
    requestAnimationFrame( animate );
    for(var i = 0; i < 1000; i += 2){
        cylinder[i].rotation.x += 0.02;
        cylinder[i].rotation.y += 0.02;
        cylinder[i].scale.set(size, size, size);
    }
    console.log(vol);
    size = vol * 4 - 1;

    //
    modelHeight += modelSpeed;
    player.height +=modelSpeed;
    if (modelHeight > 50) modelSpeed = -0.2;
    else if (modelHeight < -50) modelSpeed = 0.2;
    /*
    torus.rotation.x +=0.02;
    torus.rotation.y +=0.01;
    torusknot.rotation.x +=0.01;
    torusknot.rotation.y +=0.01;
    */
    //mesh.rotation.x +=0.02;
    //mesh.rotation.y +=0.01;

    //control by keys

    //sound control
    //vol = amp.getLevel();
    size = map(vol, 0, 1, 1, 2);
    //-----------
    if(keyboard[37]) { //left 
        camera.rotation.y += Math.PI * 0.01;
    }

    if(keyboard[39]) { //right
        camera.rotation.y -= Math.PI * 0.01;
    }

    if(keyboard[38]) { //up
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= Math.cos(camera.rotation.y) * player.speed;
    }

    if(keyboard[40]) { //down
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += Math.cos(camera.rotation.y) * player.speed;
    }   
    //add renderer
    render.render( scene, camera );
}

//window resize
function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    cameraOrtho.left = - width / 2;
    cameraOrtho.right = width / 2;
    cameraOrtho.top = height / 2;
    cameraOrtho.bottom = - height / 2;
    cameraOrtho.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    updateSpritePosition();
}

//---------------------interactions---------------//
function keyUp() {
    keyboard[event.keyCode] = false;
}
function keyDown() {
    keyboard[event.keyCode] = true;
}
window.addEventListener('keyup', keyUp);
window.addEventListener('keydown', keyDown);
//window.onload = init;

/*
function mouseOver() {
    text2.style.color = "blue";
}  
function mouseOut() {
    text2.style.color = "0x999999";
}
text2.onmouseover = function() {mouseOver()};
text2.onmouseout = function() {mouseOut()};


function mouseDown() {
    text2.innerHTML = "Poly World:)";
    text2.style.color = "blue";
    disZ += f;
    if (disZ = 20) f = -0.2;
    else if (disZ =-10) f =0.2;    
}

function mouseUp() {
    text2.innerHTML = "Poly World:)";
   
}
text2.onmouseup =function() {mouseUp()};
text2.onmousedown =function() {mouseDown()};
*/