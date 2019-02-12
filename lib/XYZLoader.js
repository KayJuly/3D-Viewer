/**
 * @author Kay Shoji / 
 *
 * Description: A THREE loader for Gdal xzy-format.
 *              modification of PCDLoader.js from threejs
 *
 */

THREE.XYZLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	this.littleEndian = true;

};

THREE.XYZLoader.prototype = {

	constructor: THREE.XYZLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.FileLoader( scope.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function ( data ) {

			try {
				onLoad( scope.parse( data, url ) );
			} catch ( exception ) {
				if ( onError ) {
					onError( exception );
				}
			}

		}, onProgress, onError );

	},

	parse: function ( data, url ) {

		var textData = THREE.LoaderUtils.decodeText( data );

		var position = [];
		var color = [];

		var lines = textData.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			var line = lines[ i ].split( ',' );

			position.push( parseFloat( line[ 0 ] ) );
			position.push( parseFloat( line[ 1 ] ) );
			position.push( parseFloat( line[ 2 ] ) );

			if (line[ 3 ] < 256) {
				color.push( parseInt( line[ 3 ] ) / 256 );
			} else {
				color.push( parseInt( line[ 3 ]  / 256) / 256 );
			} 
			if (line[ 4 ] < 256) {
				color.push( parseInt( line[ 4 ] ) / 256 );
			} else {
				color.push( parseInt( line[ 4 ]  / 256) / 256 );
			} 
			if (line[ 5 ] < 256) {
				color.push( parseInt( line[ 5 ] ) / 256 );
			} else {
				color.push( parseInt( line[ 5 ]  / 256) / 256 );
			} 
		}

		// build geometry

		var geometry = new THREE.BufferGeometry();

		if ( position.length > 0 ) geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
		if ( color.length > 0 ) geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( color, 3 ) );

		geometry.computeBoundingSphere();

		// build material
		var material;
		if (navigator.platform.indexOf("Win") != -1) {
			material = new THREE.PointsMaterial( { size: 0.005 } );
		} else {
			material = new THREE.PointsMaterial( { size: 5.000 } );
		}

		if ( color.length > 0 ) {
			material.vertexColors = true;
		} else {
			// material.color.setHex( Math.random() * 0xffffff );
			material.color.setHex( 0xffffff );
		}

		// build mesh

		var mesh = new THREE.Points( geometry, material );
//		var name = url.split( '' ).reverse().join( '' );
//		name = /([^\/]*)/.exec( name );
//		name = name[ 1 ].split( '' ).reverse().join( '' );
//		mesh.name = name;

		return mesh;

	}

};
