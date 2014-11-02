var scene = _3s({
        camera: { x: 0, y: 150, z: 150 },
        postProcessing: [
            function() {
                var effect = new THREE.ShaderPass( THREE.DotScreenShader );
				effect.uniforms[ 'scale' ].value = 4;
                effect.renderToScreen = true;
                return effect;
            }
        ],
        objArray: [
            {
                elem: new THREE.AmbientLight( 0x040404 )
            },
            {
                elem: new THREE.SpotLight( 0xffffff ),
                init: function() {
                    this.elem.position.set( 400, 1000, 400 );
                }
            },
            {
                elem:  new THREE.Object3D(),
                init: function() {
                    this.elem.rotation.y = 15 * (Math.PI / 180);
                    var bigbox = new THREE.Mesh(new THREE.BoxGeometry(100,100,100),
                        new THREE.MeshBasicMaterial({
                            color: 0x00ff00,
                            wireframe: true
                        }));
                    var box = new THREE.Mesh(
                        new THREE.BoxGeometry(100,100,100),
                        new THREE.MeshPhongMaterial( { 
                            color: 0xffffff, 
                            ambient: 0xffffff, // should generally match color
                            specular: 0xffffff,
                            shininess: 100
                        } ) 
                    );
                    this.elem.add(box);
                },
                anim: function() {
                    this.elem.translateX(-0.1);
                    this.elem.rotation.y += 1 * (Math.PI / 180);
                }
            }
        ]
    });