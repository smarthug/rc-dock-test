import React, { useEffect, useRef } from "react";
import { addDragStateListener, removeDragStateListener } from "rc-dock";

import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

var scene, camera, renderer, mesh, material, geometry;
var meshArr = [];
renderer = new THREE.WebGLRenderer({ antialias: true });
scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(70, 100 / 100);

camera.position.z = 5;

camera.up = new THREE.Vector3(0, 0, 1);

geometry = new THREE.BoxGeometry(2, 2, 2);
material = new THREE.MeshNormalMaterial();

mesh = new THREE.Mesh(geometry, material);
//mesh.position.set(10, 0, 0)
scene.add(mesh);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
// threeRef.current.appendChild(renderer.domElement);
// threeRef.current.appendChild(stats.dom)

var GridHelper = new THREE.GridHelper(1000, 100);
//  y z axis exchange
GridHelper.rotation.set(Math.PI / 2, 0, 0);
scene.add(GridHelper);

var AxesHelper = new THREE.AxesHelper(50);
AxesHelper.position.set(0, 0, 0.1);
scene.add(AxesHelper);

animate();

function animate() {
  //console.log('animateddd')
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  //console
}

export default function ThreeWrapper() {
  const threeRef = useRef();

  useEffect(() => {
    threeRef.current.appendChild(renderer.domElement);

    camera.aspect =
      renderer.domElement.parentElement.clientWidth /
      renderer.domElement.parentElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
      renderer.domElement.parentElement.clientWidth,
      renderer.domElement.parentElement.clientHeight
    );
    const resizeFunc = () => {
      camera.aspect =
        renderer.domElement.parentElement.clientWidth /
        renderer.domElement.parentElement.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        renderer.domElement.parentElement.clientWidth,
        renderer.domElement.parentElement.clientHeight
      );
    };
    addDragStateListener(resizeFunc);

    return () => {
      removeDragStateListener(resizeFunc);
    };
  }, []);

  return <div style={{ height: "100%" }} ref={threeRef}></div>;
}

export function ThreeRenderAction(resultMesh) {
  //resultMesh.geometry.scale(1,1,1)
  //resultMesh.rotation.set(Math.PI/2, 0, 0)

  meshArr.push(resultMesh);

  AllRenderer();
}

export function AllRenderer() {
  var pivotGeo = new THREE.SphereGeometry(1, 15, 15);
  var pivotMat = new THREE.MeshBasicMaterial({
    color: 0x33aa00,
    wireframe: true
  });
  var pivotPointzzz = new THREE.Mesh(pivotGeo, pivotMat);
  //pivotPointzzz.rotation.set(-Math.PI / 2, 0, 0)

  meshArr.map((v, i) => {
    pivotPointzzz.add(v);
  });

  scene.add(pivotPointzzz);

  
}

function clearThree(scene) {
  console.log(scene);
  if (scene.children.length === 0) {
    return;
  }
  while (scene.children.length > 0) {
    // a way to get object name from its constructor ...
    //if (scene.children[0].constructor.name === "GridHelper")
    clearThree(scene.children[0]);
    scene.remove(scene.children[0]);
  }
  if (scene.geometry) scene.geometry.dispose();

  if (scene.material) {
    //in case of map, bumpMap, normalMap, envMap ...
    // Object.keys(scene.material).forEach(prop => {
    //   if(typeof scene.material[prop].dispose === 'function')
    //   scene.material[prop].dispose()
    // })
    scene.material.dispose();
  }
 
  scene.add(GridHelper);

  scene.add(AxesHelper);
  meshArr = [];
}

export function ClearWrapper() {
  clearThree(scene);
  // slabNodeArr = []
  // ramenNodeArr = []
}
