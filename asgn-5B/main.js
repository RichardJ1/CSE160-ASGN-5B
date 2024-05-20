import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
// 3D model used: Little Fox by Rachael Hosein [CC-BY] via Poly Pizza


function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	// const aspect = 2; // the canvas default
	const aspect = canvas.clientWidth / canvas.clientHeight;
	// const aspect = window.innerWidth / window.innerHeight;
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	// camera.position.z = 5;
	camera.position.set(0, 10, 20);

	const controls = new OrbitControls(camera, canvas);
	controls.target.set(0, 5, 0);
	controls.update();




	const scene = new THREE.Scene();


	const planeSize = 40;
     
	const loader = new THREE.TextureLoader();
	const texture = loader.load('public/checker.png');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.magFilter = THREE.NearestFilter;
	texture.colorSpace = THREE.SRGBColorSpace;
	const repeats = planeSize / 2;
	texture.repeat.set(repeats, repeats);


	const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
	const planeMat = new THREE.MeshPhongMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(planeGeo, planeMat);
	mesh.rotation.x = Math.PI * -.5;
	scene.add(mesh);


	{
		const cubeSize = 4;
		const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
		const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
		const mesh = new THREE.Mesh(cubeGeo, cubeMat);
		mesh.position.set(cubeSize + 1, cubeSize / 2 + 6, 0);
		scene.add(mesh);
	}
	{
		const sphereRadius = 3;
		const sphereWidthDivisions = 32;
		const sphereHeightDivisions = 16;
		const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
		const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
		const mesh = new THREE.Mesh(sphereGeo, sphereMat);
		mesh.position.set(-sphereRadius - 1, sphereRadius + 5, 0);
		scene.add(mesh);
	}


	class ColorGUIHelper {

		constructor( object, prop ) {

			this.object = object;
			this.prop = prop;

		}
		get value() {

			return `#${this.object[ this.prop ].getHexString()}`;

		}
		set value( hexString ) {

			this.object[ this.prop ].set( hexString );

		}

	}

	class DegRadHelper {
		constructor(obj, prop) {
			this.obj = obj;
			this.prop = prop;
		}
		get value() {
			return THREE.MathUtils.radToDeg(this.obj[this.prop]);
		}
		set value(v) {
			this.obj[this.prop] = THREE.MathUtils.degToRad(v);
		}
	}


	function makeXYZGUI( gui, vector3, name, onChangeFn ) {

		const folder = gui.addFolder( name );
		folder.add( vector3, 'x', - 10, 10 ).onChange( onChangeFn );
		folder.add( vector3, 'y', 0, 10 ).onChange( onChangeFn );
		folder.add( vector3, 'z', - 10, 10 ).onChange( onChangeFn );
		folder.open();

	}

	{

		const color = 0xFFFFFF;
		const intensity = 150;
		const light = new THREE.SpotLight( color, intensity );
		light.position.set( 0, 10, 0 );
		light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		scene.add( light.target );

		const helper = new THREE.SpotLightHelper( light );
		// scene.add( helper );

		function updateLight() {

			light.target.updateMatrixWorld();
			helper.update();

		}

		const color2 = 0xFFFFFF;
		const intensity2 = 1;
		const light2 = new THREE.AmbientLight( color2, intensity2 );
		scene.add( light2 );

		const color3 = 0xFFFFFF;
		const intensity3 = 3;
		const light3 = new THREE.DirectionalLight( color3, intensity3 );
		light3.position.set( - 1, 2, 4 );
		light3.target.position.set( 0, 0, 0 );
		scene.add( light3 );
		scene.add( light3.target );


		updateLight();

		const gui = new GUI();

		gui.addColor( new ColorGUIHelper( light2, 'color' ), 'value' ).name( 'ambient color' );
		gui.add( light2, 'intensity', 0, 5, 0.01 ).name( 'ambient intensity' );

		gui.addColor( new ColorGUIHelper( light3, 'color' ), 'value' ).name( 'directional color' );
		gui.add( light3, 'intensity', 0, 5, 0.01 ).name( 'directional intensity' );


		gui.addColor( new ColorGUIHelper( light, 'color' ), 'value' ).name( 'spotlight color' );
		gui.add( light, 'intensity', 0, 250, 1 ).name( 'spotlight intensity' );
		gui.add( light, 'distance', 0, 40 ).name("spotlight distance").onChange( updateLight );
		gui.add( new DegRadHelper( light, 'angle' ), 'value', 0, 90 ).name( 'spotlight angle' ).onChange( updateLight );
		gui.add( light, 'penumbra', 0, 1, 0.01 ).name( 'spotlight penumbra' );

		makeXYZGUI( gui, light.position, 'spotlight position', updateLight );
		makeXYZGUI( gui, light.target.position, 'spotlight target', updateLight );

		makeXYZGUI( gui, light3.position, 'directional position', updateLight );
		makeXYZGUI( gui, light3.target.position, 'directional target', updateLight );



	}


	{
		const loader = new THREE.CubeTextureLoader();
		const texture = loader.load([
			'public/Background.png',
			'public/Background.png',
			'public/Background.png',
			'public/Background.png',
			'public/Background.png',
			'public/Background.png'
		]);
		scene.background = texture;
	}








	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	function makeInstance( geometry, color, x, y, z, textured = false) {

		// const material = new THREE.MeshPhongMaterial( { color } );
    let material;

    if (textured) {
      function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      }

      const loader = new THREE.TextureLoader();
      material = [
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama1.webp')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama2.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama3.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama4.jpg')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama5.png')}),
        new THREE.MeshBasicMaterial({map: loadColorTexture('public/Obama6.png')})
      ];
    }
    else {
      material = new THREE.MeshPhongMaterial( { color } );
    }

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;

		return cube;

	}

	const cubes = [
		makeInstance( geometry, 0x44aa88, 0, 3.5, 0, true ),
		makeInstance( geometry, 0x8844aa, - 2, 2.5, 0 ),
		makeInstance( geometry, 0xaa8844, 2, 1.5, 0),
	];

	// draw cubes from -15 to 15 in both x and z dimensions
	for (let x = -15; x <= 15; x ++) {
		for (let z = -15; z <= 15; z++) {
			const y = 30 - (Math.abs(x) + Math.abs(z));

			// make a random color using hexadecimal
			const cube_color = Math.random() * 0xffffff;

			makeInstance(geometry, cube_color, x, y, z);
		}
	}

	// pedastal
	// third place (brown)
	const brown = 0x8B4513;
	makeInstance( geometry, brown, 2, 0, 0)
	// second place (silver)
	const silver = 0xC0C0C0;
	makeInstance( geometry, silver, -2, 0, 0)
	makeInstance( geometry, silver, -2, 1, 0)
	// first place (gold)
	const gold = 0xFFD700;
	makeInstance( geometry, gold, 0, 0, 0)
	makeInstance( geometry, gold, 0, 1, 0)
	makeInstance( geometry, gold, 0, 2, 0)




  {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
     mtlLoader.load('public/materials.mtl', (mtl) => {
       mtl.preload();
       objLoader.setMaterials(mtl);
     });

    objLoader.load('public/model.obj', (root) => {
      root.position.set(5, 0.6, 0); // Move the model 5 units to the right
      scene.add(root);
    });
    // });
  }

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = window.innerWidth;
		const height = window.innerHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
				renderer.setSize(width, height, false);
		}
		return needResize;
}

	function render( time ) {

		time *= 0.001; // convert time to seconds

		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
	}

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();