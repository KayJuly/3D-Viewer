
if (!Detector.webgl) Detector.addGetWebGLMessage();

const dataUri =  'data/';
const data = ['points.pcd', '28XXX00030002-1 - 111-mid.txt'];
const Information = ['X Mountain construction', 'Z bridge construction'];

let stats, axis, guiObj, groundMesh;
let camera, controls, scene, light, renderer, root, center;

const init = () => {

	// scene
	scene = new THREE.Scene();

	// camera
    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.up.set(0, 0, 1);
	scene.add(camera);

	// light
	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 0, 1);
	scene.add(light);

	// helper
	axis = new THREE.AxesHelper(10000);
	axis.up.set(0, 0, 1);
    scene.add(axis);

	// root
	root = new THREE.Group();
	scene.add(root);

	// renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

	// control
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.maxDistance = 6000.0;
	controls.autoRotate = true; 

	// loader 
	load(dataUri + data[0]);

	// dat.GUI
	guiObjLoad();

	// stats
	stats = new Stats();
	stats.domElement.style.left = '';
	stats.domElement.style.right = '0px';
    container.appendChild(stats.dom);

	// event listener
	window.addEventListener('resize', onWindowResize, false);

}

const onWindowResize = () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render();

}

const animate = () => {
	
	camera.fov = guiObj2.Perspective;
	camera.updateProjectionMatrix();

	controls.autoRotateSpeed = guiObj2.Speed; 
    controls.update();

	requestAnimationFrame(animate);
	render();

	stats.update();

}

const render = () => {

    renderer.render(scene, camera);

}

const load = (filePath) => {
	console.log(`load: path = ${filePath}`);

	while ( root.children.length > 0 ) {
		let object = root.children[ 0 ];
		object.parent.remove( object );
	}

	/*  points */
	// let loader = new THREE.XYZLoader
	let loader = new THREE.PCDLoader
	loader.load(
		// resource URL
		filePath,
		
		// called when the resource is loaded
		function ( mesh ) {

			root.add( mesh );

			// set center position 		
			center = mesh.geometry.boundingSphere.center;
			controls.target.set(center.x, center.y, center.z);
			axis.position.set(center.x, center.y, center.z);
			camera.position.set(center.x-1000, center.y+2000, center.z+1000);
			controls.update();

			$('#center_x').html(center.x);
			$('#center_y').html(center.y);
			$('#center_z').html(center.z);

			setTimeout(function(){
				$('#overlay').fadeOut(100);
			},100);
		},
		// called when loading is in progresses
		function ( xhr ) {
			$('#overlay').fadeIn(100);　
		},
		// called when loading has errors
		function ( error ) {
			setTimeout(function(){
				$('#overlay').fadeOut(100);
			},100);
			console.log( 'PCD file Load error' );
		}
	);
}

const guiObjLoad = () => {

	let gui1 = new dat.gui.GUI();
	let gui2 = new dat.gui.GUI();

	guiObj1 = {
        '3D Points': 'points.pcd',
        'Information':'X bridge construction',
    };
	guiObj2 = {
        'Background': '',
        'Image': '',
        'XYZ Helper': true,
        'Rocate': true,
        'Speed': 0.5,
        'Perspective': 10,
    };

	gui1.add(guiObj1, '3D Points', data).onChange( function( value ) {
		load(dataUri + value);
		render();
	});

	gui1.add(guiObj1, 'Information');

	gui2.add(guiObj2, 'Background', [ '',  'Black', 'White', 'Dark Blue', 'Gray' ] ).onChange( function( value ) { 

		(value=='Black') ? scene.background = new THREE.Color(0X000000): (value=='White') ? scene.background = new THREE.Color(0xffffff):
		(value=='Dark Blue') ? scene.background = new THREE.Color(0X0a1319): (value=='Gray') ? scene.background = new THREE.Color(0x808080):
		scene.background = new THREE.Color(0X000000);
		(value=='Black') ? scene.fog = new THREE.Fog(0X000000, 5000, 10000): (value=='White') ? scene.fog = new THREE.Fog(0xffffff, 5000, 10000):
		(value=='Dark Blue') ? scene.fog = new THREE.Fog(0X0a1319, 5000, 10000): (value=='Gray') ? scene.fog = new THREE.Fog(0x808080, 5000, 10000):
		scene.fog = new THREE.Fog(0X000000, 5000, 10000);

	});
	
    gui2.add(guiObj2, 'Image', [ '', 'earth', 'sky', 'sea' ] ).onChange( function( value ) { 
		let groundFile;
		(value=='earth') ? groundFile = 'lib/img/earth.jpg': (value=='sky') ? groundFile = 'lib/img/sky.jpg': 
		(value=='sea') ? groundFile = 'lib/img/sea.jpg': groundFile = '';

		let texture = new THREE.TextureLoader();
		let groundTexture = texture.load(groundFile);
		let groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
		let groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(10000, 10000), groundMaterial );
		scene.add( groundMesh );
		groundMesh.position.set(center.x, center.y, center.z-800);
		scene.fog = new THREE.Fog(0X0a1319, 5000, 10000);

	});

	gui2.add(guiObj2, 'XYZ Helper').onChange( function( value ) { 
		(value) ? axis.position.set(center.x, center.y, center.z):axis.position.set(0, 0, 0);
	});

	gui2.add(guiObj2, 'Rocate').onChange( function( value ) { controls.autoRotate = value; } );
	gui2.add(guiObj2, 'Speed', -10, 10 );

	gui2.add(guiObj2, 'Perspective', 0, 50 );
}

init();
animate();

