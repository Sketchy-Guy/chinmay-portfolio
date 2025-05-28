
import * as THREE from 'three';

declare module '@react-three/fiber' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      sphereGeometry: any;
      icosahedronGeometry: any;
      meshStandardMaterial: any;
      meshDistortMaterial: any;
      pointsMaterial: any;
      bufferGeometry: any;
      bufferAttribute: any;
      points: any;
      group: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}

export { THREE };
