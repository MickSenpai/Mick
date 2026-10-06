import * as THREE from 'three';

// Dos renderers con la misma cámara: el cubo va al fondo (#bg) y Meido por encima del contenido (#fg).
export function createStage(bgCanvas, fgCanvas) {
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  const mkRenderer = (canvas) => {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setClearColor(0x000000, 0);
    r.outputColorSpace = THREE.SRGBColorSpace;
    return r;
  };
  const bg = mkRenderer(bgCanvas);
  const fg = mkRenderer(fgCanvas);

  const mkScene = () => {
    const s = new THREE.Scene();
    s.add(new THREE.HemisphereLight(0xffffff, 0x1a1a1a, 1.25));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(-5, 7, 9);
    s.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(6, -2, -4);
    s.add(rim);
    return s;
  };
  const bgScene = mkScene();
  const fgScene = mkScene();

  const view = { w: 1, h: 1, halfH: 1, halfW: 1, upp: 1 }; // upp: unidades de mundo por px (en z=0)

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mobile = w < 760;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    for (const r of [bg, fg]) {
      r.setPixelRatio(dpr);
      r.setSize(w, h, false);
    }
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    view.w = w;
    view.h = h;
    view.halfH = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    view.halfW = view.halfH * camera.aspect;
    view.upp = (view.halfH * 2) / h;
  }

  // px de pantalla → punto del mundo en el plano z = 0
  const screenToWorld = (x, y, out = new THREE.Vector3()) =>
    out.set((x / view.w - 0.5) * 2 * view.halfW, -(y / view.h - 0.5) * 2 * view.halfH, 0);

  const tmp = new THREE.Vector3();
  const worldToScreen = (v) => {
    tmp.copy(v).project(camera);
    return { x: (tmp.x * 0.5 + 0.5) * view.w, y: (-tmp.y * 0.5 + 0.5) * view.h };
  };

  function render() {
    bg.render(bgScene, camera);
    fg.render(fgScene, camera);
  }

  resize();
  return { camera, bgScene, fgScene, view, resize, render, screenToWorld, worldToScreen };
}
