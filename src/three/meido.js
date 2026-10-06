import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Meido: una pieza blanca del cubo con dos ojos mínimos.
// Modos: 'docked' (pegada a su hueco), 'flying' (viajando), 'free' (flotando junto al texto).
export function createMeido(scene, cube, size, { reduced = false } = {}) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(size, size, size, 3, 0.09),
    new THREE.MeshStandardMaterial({ color: '#f4f4f4', roughness: 0.5 }),
  );
  group.add(body);

  const eyes = new THREE.Group();
  eyes.position.z = size / 2 + 0.006;
  const eyeGeo = new RoundedBoxGeometry(0.2, 0.07, 0.02, 2, 0.03);
  const eyeMat = new THREE.MeshStandardMaterial({ color: '#0d0d0d', roughness: 0.4 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.17, 0.05, 0);
  eyeR.position.set(0.17, 0.05, 0);
  eyes.add(eyeL, eyeR);
  group.add(eyes);
  scene.add(group);

  let mode = 'docked';
  let awake = 0; // 0 = ojos cerrados (dormida en el cubo), 1 = despierta
  let awakeTarget = 0;
  const free = { pos: new THREE.Vector3(), scale: 1 }; // objetivo cuando flota
  const fly = { t: 0, dur: 1.1, from: new THREE.Vector3(), fromQ: new THREE.Quaternion(), fromS: 1, toSlot: false };
  const slot = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: new THREE.Vector3() };
  const vel = new THREE.Vector3();
  const lastPos = new THREE.Vector3();
  const pointer = { x: 0, y: 0 };
  let blinkAt = performance.now() + 3000;
  let blinkT = -1;
  let clickT = -1; // pequeño "clic" al encajar

  // orientación cuando flota: de frente, ligeramente girada
  const restQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.12, -0.28, 0));
  const lookQ = new THREE.Quaternion();
  const lookE = new THREE.Euler();
  const ctrl = new THREE.Vector3();
  const end = new THREE.Vector3();
  const endQ = new THREE.Quaternion();

  function startFlight(toSlot) {
    fly.t = 0;
    fly.from.copy(group.position);
    fly.fromQ.copy(group.quaternion);
    fly.fromS = group.scale.x;
    fly.toSlot = toSlot;
    fly.dur = toSlot ? 1.4 : 1.1;
    mode = reduced ? (toSlot ? 'docked' : 'free') : 'flying';
    if (reduced && toSlot) clickT = -1;
  }

  // API
  const api = {
    group,
    get mode() { return mode; },
    // flotar hacia un punto (mundo) con escala dada
    goTo(worldPos, scale) {
      free.pos.copy(worldPos);
      free.scale = scale;
      awakeTarget = 1;
      if (mode === 'docked' || (mode === 'flying' && fly.toSlot)) startFlight(false);
      else if (mode === 'free' && group.position.distanceTo(worldPos) > 0.6 && !reduced) startFlight(false);
    },
    // solo actualiza el objetivo sin iniciar un vuelo (resize, scroll en móvil)
    retarget(worldPos, scale) {
      free.pos.copy(worldPos);
      free.scale = scale;
    },
    dock() {
      if (mode === 'docked' || (mode === 'flying' && fly.toSlot)) return;
      startFlight(true);
    },
    setPointer(x, y) { pointer.x = x; pointer.y = y; },
    snapToSlot() {
      cube.getSlotTransform(slot.pos, slot.quat, slot.scale);
      group.position.copy(slot.pos);
      group.quaternion.copy(slot.quat);
      group.scale.copy(slot.scale);
      lastPos.copy(slot.pos);
    },
    update,
  };

  function update(dt, now) {
    const t = now / 1000;

    if (mode === 'docked') {
      cube.getSlotTransform(slot.pos, slot.quat, slot.scale);
      group.position.copy(slot.pos);
      group.quaternion.copy(slot.quat);
      let s = slot.scale.x;
      if (clickT >= 0) {
        const c = (now - clickT) / 160;
        if (c >= 1) clickT = -1;
        else s *= 1 + Math.sin(c * Math.PI) * 0.06;
      }
      group.scale.setScalar(s);
    } else if (mode === 'flying') {
      fly.t = Math.min(1, fly.t + dt / fly.dur);
      const e = easeInOut(fly.t);
      let endS;
      if (fly.toSlot) {
        cube.getSlotTransform(slot.pos, slot.quat, slot.scale);
        end.copy(slot.pos);
        endQ.copy(slot.quat);
        endS = slot.scale.x;
      } else {
        end.copy(free.pos);
        endQ.copy(restQ);
        endS = free.scale;
      }
      // curva cuadrática con un arco hacia arriba
      ctrl.copy(fly.from).lerp(end, 0.5);
      ctrl.y += Math.min(1.6, fly.from.distanceTo(end) * 0.35);
      const u = 1 - e;
      group.position.set(
        u * u * fly.from.x + 2 * u * e * ctrl.x + e * e * end.x,
        u * u * fly.from.y + 2 * u * e * ctrl.y + e * e * end.y,
        u * u * fly.from.z + 2 * u * e * ctrl.z + e * e * end.z,
      );
      group.quaternion.slerpQuaternions(fly.fromQ, endQ, e);
      group.scale.setScalar(fly.fromS + (endS - fly.fromS) * e);
      if (fly.t >= 1) {
        if (fly.toSlot) {
          mode = 'docked';
          clickT = now;
          awakeTarget = 0.35; // se acomoda y entrecierra los ojos
        } else mode = 'free';
      }
    } else {
      // flotando: sigue su objetivo con suavidad, balanceo y mirada al cursor
      const k = reduced ? 1 : 1 - Math.exp(-3 * dt);
      const bob = reduced ? 0 : Math.sin(t * 1.6) * 0.06;
      group.position.x += (free.pos.x - group.position.x) * k;
      group.position.y += (free.pos.y + bob - group.position.y) * k;
      group.position.z += (free.pos.z - group.position.z) * k;
      group.scale.setScalar(group.scale.x + (free.scale - group.scale.x) * k);
      // inclinación según velocidad
      vel.copy(group.position).sub(lastPos).divideScalar(Math.max(dt, 1e-3));
      lookQ.setFromEuler(lookE.set(
        0.12 - pointer.y * 0.25 + (reduced ? 0 : Math.sin(t * 1.1) * 0.04),
        -0.28 + pointer.x * 0.35,
        THREE.MathUtils.clamp(-vel.x * 0.04, -0.3, 0.3),
      ));
      group.quaternion.slerp(lookQ, k);
    }
    lastPos.copy(group.position);

    // ojos: despertar, parpadeo y mirada
    awake += (awakeTarget - awake) * (1 - Math.exp(-5 * dt));
    let open = 0.12 + awake * 0.88;
    if (!reduced && awake > 0.8) {
      if (blinkT < 0 && now > blinkAt) blinkT = now;
      if (blinkT >= 0) {
        const b = (now - blinkT) / 130;
        if (b >= 1) {
          blinkT = -1;
          blinkAt = now + 3800 + Math.random() * 3200;
        } else open *= 0.1 + Math.abs(b - 0.5) * 1.8;
      }
    }
    eyeL.scale.y = eyeR.scale.y = Math.max(open, 0.08);
    const look = mode === 'free' ? 1 : 0;
    eyes.position.x = pointer.x * 0.05 * look;
    eyes.position.y = pointer.y * 0.035 * look;
  }

  return api;
}
