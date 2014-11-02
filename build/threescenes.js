(function(THREE) {
    
    function ThreeScenes(obj) {
        var scene, 
            camera, 
            renderer,
            renderFunc,
            composer = false,
            objArray = [];
        
        var init = function() {
            var doc = document,
                win = window,
                elem = obj.elem ? obj.elem : doc.body,
                cx = obj.camera && obj.camera.x ? obj.camera.x : 0,
                cy = obj.camera && obj.camera.y ? obj.camera.y : 5,
                cz = obj.camera && obj.camera.z ? obj.camera.z : 5;
            
            objArray = obj.objArray;
            scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(75, win.innerWidth/win.innerHeight, 0.1, 1000);

			renderer = new THREE.WebGLRenderer({ alpha: true, antialiasing: true });
			renderer.setSize(win.innerWidth, win.innerHeight);
            
			elem.appendChild(renderer.domElement);
            
            camera.position.set(cx,cy,cz);

            var i = objArray.length - 1;

            while (i > -1) {
                if (objArray[i].elem != undefined) {
                    scene.add(objArray[i].elem);
                    if (objArray[i].init != undefined) {
                        objArray[i].init();
                    }    
                }
                i--;
            }
            
            if (obj.postProcessing) {
                composer = new THREE.EffectComposer(renderer);
				composer.addPass(new THREE.RenderPass( scene, camera ));
                
                var i = obj.postProcessing.length - 1;
                
                while (i > -1) {
                    if (obj.postProcessing[i] != undefined) {
                        var effect = obj.postProcessing[i]();
                        composer.addPass(effect);
                    }
                    i--;
                }
                
                renderFunc = function() {
                    composer.render();
                };
            } else {
                renderFunc = function() {
                    renderer.render(scene, camera);
                };
            }
        };
        
        var anim = function() {
            requestAnimationFrame(anim);
            
            camera.lookAt(scene.position);
            
            var i = objArray.length - 1;

            while (i > -1) {
                if (objArray[i].anim != undefined) {
                    objArray[i].anim();
                }
                i--;
            }
            
            renderFunc();
        };
        
        init();
        anim();
    }
    
    var helper = {};
        
    helper.textSprite = function() {
        var canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 200;
        var context = canvas.getContext('2d');
        context.font="30px Verdana";
        context.fillText("ThreeScenes", 600, 200);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var sprite = new THREE.Sprite({
            map: texture,
            transparent: true,
            useScreenCoordinates: false
        });

        return texture;
    };
    
    window._3helper = helper;
    window._3s = ThreeScenes;
})(THREE);