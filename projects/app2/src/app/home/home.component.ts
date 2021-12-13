import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  ElementRef,
  HostListener,
  OnInit,
  ComponentFactoryResolver,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AxesHelper } from 'three';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.mychange();
  }

  mychange() {
    /*let file = e.target.files[0];
 console.log(file);
 console.log(e.target)*/
    const canvas = <HTMLCanvasElement>document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.autoClear = false;

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //red,green,blue
    camera.position.set(0.5, 0.2, -0.5);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    const axisHelper = new AxesHelper(100);
    //scene.add(axisHelper);

    {
      const planeSize = 40;

      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        'https://threejsfundamentals.org/threejs/resources/images/white.png'
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        //side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -0.5;

      //scene.add(mesh);
    }

    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 0.5;
      const light = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 1);
      //scene.add(light);
    }

    {
      var hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1.8);
      hemiLight.color.setHSL(0.6, 0.75, 0.5);
      hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
      hemiLight.position.set(0, 500, 0);
      //scene.add( hemiLight );
    }

    {
      const light = new THREE.AmbientLight(0xb7c6e8);
      scene.add(light);
    }

    const light = new THREE.SpotLight(0xb7c6e8, 1.2);
    //red,green,blue
    light.position.set(50, 50, 50);
    light.castShadow = true;
    scene.add(light);

    {
      var dirLight = new THREE.DirectionalLight(0xf7efd2, 0.4);
      dirLight.position.set(10, 0, 0);
      dirLight.position.multiplyScalar(50);
      scene.add(dirLight);
    }

    {
      var dirLight = new THREE.DirectionalLight(0xf7efd2, 0.7);
      dirLight.position.set(-10, -10, 0);
      dirLight.position.multiplyScalar(50);
      dirLight.name = 'dirlight';
      dirLight.shadow.bias = -0.0001;
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024 * 4;
      dirLight.shadow.mapSize.height = 1024 * 4;
      const d = 300;

      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;

      scene.add(dirLight);

      dirLight.castShadow = true;
      //dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

      /*dirLight.shadowCameraTop = d;
    dirLight.shadowCameraBottom = -d;

    dirLight.shadowCameraFar = 3500;
    dirLight.shadowBias = -0.0001;
    dirLight.shadowDarkness = 0.35;*/
    }

    {
      const color = 0xf7efd2;
      const intensity = 0.7;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(5, 10, 2);
      scene.add(light);
      scene.add(light.target);
    }

    //luz_2
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 8, 4);
      const light2 = new THREE.DirectionalLight(0xffffff, 0.7);
      //red,green,blue
      light2.position.set(0.2, 0.1, -1);
      //light2.target.position.set(-1,-200,5);
      light2.castShadow = true;
      light2.shadow.camera.near = 1;
      light2.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light2.add(new THREE.Mesh(bulbGeometry, bulbMat));
      const helper = new THREE.DirectionalLightHelper(light2, 50);
      helper.position.set(-1, -200, 5);
      //scene.add( helper);
      //scene.add(light2);
      //scene.add(light2.target);
    }

    //luz_3
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const light3 = new THREE.DirectionalLight('white', 1);
      //red,green,blue
      light3.position.set(200, 100, -100);
      //light2.target.position.set(-1,-200,5);
      light3.castShadow = true;
      light3.shadow.camera.near = 1;
      light3.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light3.add(new THREE.Mesh(bulbGeometry, bulbMat));
      const helper = new THREE.DirectionalLightHelper(light3, 50);
      helper.position.set(-1, -200, 5);
      //scene.add( helper);
      //scene.add(light3);
      //scene.add(light3.target);
    }

    function frameArea(sizeToFitOnScreen: any, boxSize: any, boxCenter: any, camera: any) {
      const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
      const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
      const direction = new THREE.Vector3()
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

      //camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
      camera.near = boxSize / 100;
      camera.far = boxSize * 100;
      camera.updateProjectionMatrix();
      camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    }

    {
      //const reader = new FileReader();
      //reader.addEventListener( 'load', function ( event ) {

      //const contents = event.target.result;

      const loader = new GLTFLoader();
      loader.load(
        'assets/models/camara3UV.glb',
        function (gltf) {
          console.log('gltf', gltf);

          const root = gltf.scene;
          root.traverse((n) => {
            if (n instanceof THREE.Mesh) {
              n.castShadow = true;
              n.receiveShadow = true;
              if (n.material.map) n.material.map.anisotropy = 16;
            }
          });
          root.castShadow = true;
          root.receiveShadow = false;
          scene.add(root);
          const box = new THREE.Box3().setFromObject(root);
          const boxSize = box.getSize(new THREE.Vector3()).length();
          const boxCenter = box.getCenter(new THREE.Vector3());
          frameArea(boxSize * 0.5, boxSize, boxCenter, camera);
          controls.maxDistance = boxSize * 10;
          controls.target.copy(boxCenter);
          controls.update();
          console.log(root);
        }
      );

      //}, false );
      //reader.readAsArrayBuffer( file );
      //   const gltfLoader = new GLTFLoader();
      //  gltfLoader.parse( gltfText.target.result, '', function( gltf ){
      //     const root = gltf.scene;
      //     scene.add(root);
      //     const box = new THREE.Box3().setFromObject(root);
      //     const boxSize = box.getSize(new THREE.Vector3()).length();
      //     const boxCenter = box.getCenter(new THREE.Vector3());
      //     frameArea(boxSize * 0.5, boxSize, boxCenter, camera);
      //     controls.maxDistance = boxSize * 10;
      //     controls.target.copy(boxCenter);
      //     controls.update();
      //   });
    }

    function resizeRendererToDisplaySize(renderer: any) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render() {
      light.position.set(
        camera.position.x + 10,
        camera.position.y + 10,
        camera.position.z + 10
      );
      light.shadow.bias = -0.0001;
      light.shadow.mapSize.width = 1024 * 4;
      light.shadow.mapSize.height = 1024 * 4;

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.clear();
      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
}
