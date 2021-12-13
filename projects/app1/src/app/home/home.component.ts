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
    const renderer = new THREE.WebGL1Renderer({ canvas });
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 45;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //red,green,blue
    camera.position.set(-1, 2, -5);

    const controls = new OrbitControls(camera, canvas);
    //red,green,blue
    controls.target.set(0, 2, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    const axesHelper = new THREE.AxesHelper(500);
    //scene.add( axesHelper );

    {
      const planeSize = 40;

      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        'https://threejsfundamentals.org/threejs/resources/images/black.png'
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -0.5;
      //scene.add(mesh);
    }

    //lightSPot
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000,
      });
      bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
      //red,green,blue
      bulbLight.position.set(-1, 2, -5);
      bulbLight.castShadow = true;
      bulbLight.power = 500;
      bulbLight.shadow.bias = 0.0001;
      /*bulbLight.shadow.camera.top = 2;
         bulbLight.shadow.camera.bottom = - 2;
         bulbLight.shadow.camera.left = - 2;
         bulbLight.shadow.camera.right = 2;*/
      bulbLight.shadow.camera.near = 0.1;
      bulbLight.shadow.camera.far = 10;
      bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0);

      const sphereSize = 1;
      const pointLightHelper = new THREE.PointLightHelper(
        bulbLight,
        sphereSize
      );
      //scene.add( pointLightHelper );
      //scene.add( bulbLight );
    }

    //directional test
    {
      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(-1, 2, -5);
      light.castShadow = true;
      light.shadow.camera.top = 2;
      light.shadow.camera.bottom = -2;
      light.shadow.camera.left = -2;
      light.shadow.camera.right = 2;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 10;
      //scene.add( light );
    }

    //luz_1
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const light1 = new THREE.DirectionalLight(0xffffff, 10);
      light1.position.set(-1, 2, -5);
      light1.castShadow = true;
      light1.shadow.camera.top = 2;
      light1.shadow.camera.bottom = -2;
      light1.shadow.camera.left = -2;
      light1.shadow.camera.right = 2;
      light1.shadow.camera.near = 0.1;
      light1.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light1.add(new THREE.Mesh(bulbGeometry, bulbMat));
      //red,green,blue
      //light1.target.position.set(-1,2,-10);

      const light = new THREE.DirectionalLight(0xffffff);
      const helper = new THREE.DirectionalLightHelper(light1, 50);
      //scene.add( helper );
      //scene.add(light1);
      //helper.update();
    }

    //luz_2
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const light2 = new THREE.SpotLight(0xffffff, 100, 20, 0.1, 2, 1);
      //red,green,blue
      light2.position.set(-1.3, 3, -6.3);
      light2.target.position.set(-1, -200, 5);
      light2.castShadow = true;
      light2.shadow.camera.near = 1;
      light2.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light2.add(new THREE.Mesh(bulbGeometry, bulbMat));
      const helper = new THREE.SpotLightHelper(light2, 50);
      helper.position.set(-1, -200, 5);
      //scene.add( helper);
      //scene.add(light2);
      //scene.add(light2.target);
    }

    //luz_3
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const light3 = new THREE.SpotLight(0xffffff, 100, 20, 0.1, 2, 1);
      //red,green,blue
      light3.position.set(0.7, 3, -6.3);
      light3.target.position.set(-1, -200, 5);
      light3.castShadow = true;
      light3.shadow.camera.near = 1;
      light3.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light3.add(new THREE.Mesh(bulbGeometry, bulbMat));
      const helper = new THREE.SpotLightHelper(light3, 50);
      helper.position.set(-1, -200, 5);
      //scene.add( helper);
      //scene.add(light3);
      //scene.add(light3.target);
    }

    //luz_4
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const light4 = new THREE.SpotLight(0xffffff, 100, 20, 0.1, 2, 1);
      //red,green,blue
      light4.position.set(2.7, 3, -6.3);
      light4.target.position.set(-1, -200, 5);
      light4.castShadow = true;
      light4.shadow.camera.near = 1;
      light4.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light4.add(new THREE.Mesh(bulbGeometry, bulbMat));
      const helper = new THREE.SpotLightHelper(light4, 50);
      helper.position.set(-1, -200, 5);
      //scene.add( helper);
      //scene.add(light4);
      //scene.add(light4.target);
    }

    //luz_5
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const light5 = new THREE.SpotLight(0xffffff, 100, 20, 0.1, 2, 1);
      //red,green,blue
      light5.position.set(2.7, 3, -4.2);
      light5.target.position.set(-1, -200, 5);
      light5.castShadow = true;
      light5.shadow.camera.near = 1;
      light5.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light5.add(new THREE.Mesh(bulbGeometry, bulbMat));
      const helper = new THREE.SpotLightHelper(light5, 50);
      helper.position.set(-1, -200, 5);
      //scene.add( helper);
      //scene.add(light5);
      //scene.add(light5.target);
    }

    //luz_6
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const light6 = new THREE.SpotLight(0xffffff, 100, 20, 0.1, 2, 1);
      //red,green,blue
      light6.position.set(0.7, 3, -4.2);
      light6.target.position.set(-1, -200, 5);
      light6.castShadow = true;
      light6.shadow.camera.near = 1;
      light6.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light6.add(new THREE.Mesh(bulbGeometry, bulbMat));
      const helper = new THREE.SpotLightHelper(light6, 50);
      helper.position.set(-1, -200, 5);
      //scene.add( helper);
      //scene.add(light6);
      //scene.add(light6.target);
    }

    //luz_7
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const light7 = new THREE.SpotLight(0xffffff, 100, 20, 0.1, 2, 1);
      //red,green,blue
      light7.position.set(-1.3, 4, -4.2);
      light7.target.position.set(-1, -200, 5);
      light7.castShadow = true;
      light7.shadow.camera.near = 1;
      light7.shadow.camera.far = 10;
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });
      light7.add(new THREE.Mesh(bulbGeometry, bulbMat));
      const helper = new THREE.SpotLightHelper(light7, 50);
      helper.position.set(-1, -200, 5);
      //scene.add( helper);
      //scene.add(light7);
      //scene.add(light7.target);
    }

    //rectarea light
    {
      const width = 7;
      const height = 7;
      const intensity = 1;
      const rectLight = new THREE.RectAreaLight(
        0xcbb495,
        intensity,
        width,
        height
      );
      //red,green,blue
      rectLight.position.set(1, 2, -5);
      rectLight.lookAt(-2, -200, 4);
      //scene.add( rectLight )
    }

    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 1.2;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }
    //outside light
    {
      const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
      const bulbMat = new THREE.MeshPhongMaterial({
        emissive: 0xffffff,
        emissiveIntensity: 10,
        color: 0x000000,
      });

      const color = 0xff9503;
      const intensity = 0.7;
      const light = new THREE.DirectionalLight(color, intensity);
      light.add(new THREE.Mesh(bulbGeometry, bulbMat));
      light.position.set(5, 10, 2);
      scene.add(light);
      scene.add(light.target);
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
        'assets/models/MP_LivingRoomsZoo.glb',
        function (gltf) {
          const root = gltf.scene;
          root.position.set(0, 0, 0);
          root.castShadow = true;
          root.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
              node.castShadow = true;
            }
          });
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
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
}
