function d3() {
	var container, stats, camera, scene, renderer, mesh;
	init();
	animate();

	function init(fun) {
		container = qS('#container');
		container.innerHTML = ''
		camera = new THREE.PerspectiveCamera(27, innerWidth / innerHeight, 5, 3500);
		// camera.position.x = 200
		// camera.position.y = 200
		camera.position.z = 2000;
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x050505, 2000, 3500);

		var particles = qS('#IFSPIterNum3D').value * 10000;
		var geometry = new THREE.BufferGeometry();
		var positions = new Float32Array(particles * 3);
		var colors = new Float32Array(particles * 3);
		var color = new THREE.Color();

		var CS = data.IFS_CS[$("#IFS3DType").val()]
		var row = $("#IFS_dg3D").datagrid("getRows");
		for (var i = 0; i < row.length; i++) {
			for (var key in row[i]) {
				row[i][key] = parseFloat(row[i][key])
			}
		}
		var tmp = 0,p = []
		for (var i = 0; i < row.length; i++) tmp += row[i].p
		for (var i = 0; i < row.length; i++) p[i] = (row[i].p / tmp)
		for (var i = 1; i < p.length; i++) p[i] += p[i - 1]
		var x = 0,y = 0,z = 0

		for (var i = 0; i < positions.length; i += 3) {
			tmp = Math.random()
			var j = 0
			while (tmp > p[j]) j++
			tmp = row[j].c * x + row[j].d * y + row[j].f
			x = row[j].a * x + row[j].b * y + row[j].e
			y = tmp
			positions[i] = CS[0] * x
			positions[i + 1] = CS[0] * y
			positions[i + 2] = z

			var vx = (x / 1) + 0.5, vy = (y / 1) + 0.5, vz = (z / 1) + 0.5;
			color.setRGB(vx, vy, vz)
			colors[i] = color.r
			colors[i + 1] = color.g
			colors[i + 2] = color.b
		}

		geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

		geometry.computeBoundingSphere();

		var material = new THREE.PointsMaterial({
			size: 2,
			vertexColors: THREE.VertexColors
		});

		particleSystem = new THREE.Points(geometry, material);
		scene.add(particleSystem);

		renderer = new THREE.WebGLRenderer({antialias: false});
		renderer.setClearColor(scene.fog.color, 1);
		renderer.setSize( window.innerWidth,  window.innerHeight);

		container.appendChild(renderer.domElement);

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = 0;
		container.appendChild(stats.domElement);

		window.addEventListener('resize', onWindowResize, false);
	}

	function onWindowResize() {
		camera.aspect =  window.innerWidth /  window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth,  window.innerHeight);
	}

	function animate() {
		rAF(animate);
		var time = Date.now() * 0.001;

		particleSystem.rotation.x = time * 0.25;
		particleSystem.rotation.y = time * 0.5;
		// particleSystem.rotation.z = time * 0.25;

		renderer.render(scene, camera);
		stats.update();
	}
}