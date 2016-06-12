(function(THREE) {
    
    function ThreeScenes(obj) {
        var scene, 
            camera, 
            renderer,
            renderFunc,
            animFunc = false,
            composer = false,
            autoPlay = typeof obj.autoPlay !== 'undefined' ? obj.autoPlay : true;
            objects = [];
        
        var init = function() {
            var doc = document,
                win = window,
                elem = obj.elem ? obj.elem : doc.body,
                cx = obj.camera && obj.camera.x ? obj.camera.x : 0,
                cy = obj.camera && obj.camera.y ? obj.camera.y : 5,
                cz = obj.camera && obj.camera.z ? obj.camera.z : 5;
            
            if (obj.objects)
                objects = obj.objects;
            else if (obj.objArray)
                objects = obj.objArray; console.warn('ThreeScenes: objArray will be deprecated');
            
            scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(75, win.innerWidth/win.innerHeight, 0.1, 5000);

            if (window.WebGLRenderingContext)
			    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            else 
                renderer = new THREE.CanvasRenderer({ alpha: true });

			renderer.setSize(win.innerWidth, win.innerHeight);
            
			elem.appendChild(renderer.domElement);
            
            camera.position.set(cx,cy,cz);

            var i = objects.length;

            while (i--) {
                if (objects[i].elem != undefined) {
                    
                    scene.add(objects[i].elem);

                    if (objects[i].init != undefined)
                        objects[i].init();
                }
            }
            
            if (obj.postProcessing) {
                composer = new THREE.EffectComposer(renderer);
				composer.addPass(new THREE.RenderPass( scene, camera ));
                
                var i = obj.postProcessing.length;
                
                while (i--) {
                    if (obj.postProcessing[i] != undefined) 
                        composer.addPass(obj.postProcessing[i]());
                }
                
                renderFunc = function() {
                    composer.render();
                };
            } else {
                renderFunc = function() {
                    renderer.render(scene, camera);
                };
            }
            
            if (obj.animFunc)
                animFunc = obj.animFunc;
        };
        
        var anim = function() {
            requestAnimationFrame(anim);
            
            render();
        };

        var render = function() {
            camera.lookAt(scene.position);
            
            var i = objects.length;

            while (i--) {
                if (objects[i].anim != undefined)
                    objects[i].anim();
            }
            
            if (animFunc)
                animFunc(camera);
            
            renderFunc();
        };
        
        init();

        if (autoPlay)
            anim();

        return render;
    }
    
    var helper = {
        degToRad: function(deg) {
            return deg * (Math.PI / 180);
        }
    };
    
    window._3helper = helper;
    window._3s = ThreeScenes;
})(THREE);