import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// ---------- constantes ----------
const SP = 1.0; // separación entre piezas
const SIZE = 0.94; // tamaño de cada pieza
export const SLOT = new THREE.Vector3(1, 1, 1); // hueco de Meido (esquina superior derecha frontal)

// Grises de las caras: +X, −X, +Y, −Y, +Z, −Z
const FACE_COLORS = ['#b4b4b4', '#4d4d4d', '#d2d2d2', '#2b2b2b', '#8a8a8a', '#3a3a3a'];
const FACE_DIRS = [
  new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1),
];
const AXES = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

// Configuración visual de cada forma: rotación base del grupo, escala, giro automático y brillo
const GROUP = {
  assembled: { rot: [0.42, -0.62, 0], scale: 1, spin: 0.1, dim: 1 },
  solved: { rot: [0.42, -0.62, 0], scale: 1, spin: 0.06, dim: 1 },
  burst: { rot: [0.42, -0.62, 0], scale: 0.7, spin: 0.08, dim: 0.85 },
  stairs: { rot: [0.3, -0.55, 0], scale: 0.55, spin: 0, dim: 0.7 },
  explode: { rot: [0.35, -0.5, 0], scale: 0.62, spin: 0.05, dim: 0.85 },
  phone: { rot: [0.08, -0.42, 0], scale: 0.62, spin: 0, dim: 0.9 },
  sheet: { rot: [0.95, -0.4, 0.12], scale: 0.7, spin: 0, dim: 0.9 },
  leaves: { rot: [0.1, -0.3, 0], scale: 0.7, spin: 0, dim: 0.85 },
  rows: { rot: [0.42, -0.85, 0], scale: 0.62, spin: 0, dim: 0.85 },
  wall: { rot: [-0.18, -0.32, 0], scale: 0.56, spin: 0, dim: 0.45 },
};

// PRNG determinista para que el cubo sea igual en cada visita
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundedSquare(size, r) {
  const h = size / 2;
  const s = new THREE.Shape();
  s.moveTo(-h + r, -h);
  s.lineTo(h - r, -h);
  s.quadraticCurveTo(h, -h, h, -h + r);
  s.lineTo(h, h - r);
  s.quadraticCurveTo(h, h, h - r, h);
  s.lineTo(-h + r, h);
  s.quadraticCurveTo(-h, h, -h, h - r);
  s.lineTo(-h, -h + r);
  s.quadraticCurveTo(-h, -h, -h + r, -h);
  return new THREE.ShapeGeometry(s, 4);
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createCube(scene, { reduced = false } = {}) {
  const root = new THREE.Group(); // posición/escala en pantalla
  const tilt = new THREE.Group(); // rotación base + parallax + giro lento
  root.add(tilt);
  scene.add(root);

  const bodyGeo = new RoundedBoxGeometry(SIZE, SIZE, SIZE, 3, 0.09);
  const stickerGeo = roundedSquare(0.78, 0.1);
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.55, metalness: 0.05 });
  const stickerMats = FACE_COLORS.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.62 }));
  const baseColors = { body: bodyMat.color.clone(), stickers: stickerMats.map((m) => m.color.clone()) };

  const rand = rng(1144);
  const pieces = [];
  let slotPiece = null; // "pieza fantasma": el hueco de Meido, participa en los giros

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const home = new THREE.Vector3(x, y, z);
        const piece = {
          home,
          grid: home.clone(),
          q: new THREE.Quaternion(),
          mesh: null,
          // aleatorios deterministas para las formas
          rq: new THREE.Quaternion().setFromEuler(new THREE.Euler((rand() - 0.5) * 2.4, (rand() - 0.5) * 2.4, (rand() - 0.5) * 2.4)),
          rv: new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1),
          spinAxis: new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
          delay: 0,
          form: 'assembled',
          formAt: 0,
          settled: false,
          idx: 0,
        };
        if (home.equals(SLOT)) {
          slotPiece = piece;
          continue;
        }
        const mesh = new THREE.Mesh(bodyGeo, bodyMat);
        FACE_DIRS.forEach((d, f) => {
          if (home.dot(d) !== 1) return; // solo caras exteriores
          const st = new THREE.Mesh(stickerGeo, stickerMats[f]);
          st.position.copy(d).multiplyScalar(SIZE / 2 + 0.004);
          st.lookAt(st.position.clone().add(d));
          mesh.add(st);
        });
        piece.mesh = mesh;
        piece.idx = pieces.length;
        tilt.add(mesh);
        pieces.push(piece);
      }
    }
  }
  const all = [...pieces, slotPiece];

  // ---------- lógica de Rubik ----------
  const turnQ = new THREE.Quaternion();
  const tmpV = new THREE.Vector3();

  function inLayer(p, m) {
    return Math.round(p.grid[m.axis]) === m.layer;
  }
  function commit(m) {
    turnQ.setFromAxisAngle(AXES[m.axis], (Math.PI / 2) * m.dir);
    for (const p of all) {
      if (!inLayer(p, m)) continue;
      p.grid.applyQuaternion(turnQ).round();
      p.q.premultiply(turnQ).normalize();
    }
  }
  const inverse = (m) => ({ ...m, dir: -m.dir });

  // Solo se giran las capas −1: nunca tocan la esquina (1,1,1), así el hueco de Meido
  // siempre es la esquina frontal y Meido no queda "delante" de piezas que deberían taparlo.
  function randomMove(prev) {
    const axes = ['x', 'y', 'z'];
    let axis;
    do axis = axes[Math.floor(rand() * 3)];
    while (prev && prev.axis === axis);
    return { axis, layer: -1, dir: rand() < 0.5 ? 1 : -1 };
  }

  const history = []; // movimientos aplicados (para resolver deshaciéndolos)
  let queue = []; // { move, undo, dur }
  let turn = null; // giro en curso: { move, undo, t0, dur }
  let holdUntil = 0;

  // mezcla inicial (instantánea)
  for (let i = 0; i < 16; i++) {
    const m = randomMove(history[history.length - 1]);
    commit(m);
    history.push(m);
  }

  function finishTurn() {
    if (!turn) return;
    commit(turn.move);
    if (turn.undo) history.pop();
    else history.push(turn.move);
    turn = null;
  }

  function queueRandomTurns(n, dur = 0.5) {
    let prev = queue.length ? queue[queue.length - 1].move : history[history.length - 1];
    for (let i = 0; i < n; i++) {
      const m = randomMove(prev);
      queue.push({ move: m, undo: false, dur });
      prev = m;
    }
  }

  function queueSolve(delay) {
    queue = [];
    finishTurn();
    const n = history.length;
    const dur = Math.max(0.16, Math.min(0.3, 4 / Math.max(n, 1)));
    for (let i = n - 1; i >= 0; i--) queue.push({ move: inverse(history[i]), undo: true, dur });
    holdUntil = performance.now() + delay;
  }

  // posición/rotación "armadas" de una pieza, incluyendo el giro en curso
  function assembledTarget(p, now, outPos, outQuat) {
    outPos.copy(p.grid).multiplyScalar(SP);
    outQuat.copy(p.q);
    if (turn && inLayer(p, turn.move)) {
      const k = easeInOut(Math.min(1, (now - turn.t0) / (turn.dur * 1000)));
      turnQ.setFromAxisAngle(AXES[turn.move.axis], (Math.PI / 2) * turn.move.dir * k);
      outPos.applyQuaternion(turnQ);
      outQuat.premultiply(turnQ);
    }
  }

  // ---------- formas ----------
  const qTmp = new THREE.Quaternion();
  function formationTarget(name, p, now, t, pos, quat) {
    const i = p.idx;
    switch (name) {
      case 'assembled':
      case 'solved':
        assembledTarget(p, now, pos, quat);
        return;
      case 'burst':
        assembledTarget(p, now, pos, quat);
        pos.multiplyScalar(1.55);
        return;
      case 'explode':
        pos.copy(p.grid).multiplyScalar(SP * 2.3).addScaledVector(p.rv, 0.35);
        pos.y += Math.sin(t * 0.6 + i) * 0.08;
        quat.copy(p.q).multiply(qTmp.copy(p.rq));
        return;
      case 'stairs': {
        const c = Math.floor(i / 3);
        const j = i % 3;
        pos.set((c - 4) * 1.02, (c - 4) * 0.55, (j - 1) * 1.02);
        quat.identity();
        return;
      }
      case 'phone': {
        const col = i % 3;
        const row = Math.floor(i / 3);
        pos.set((col - 1) * 1.04, (4 - row) * 1.04, 0);
        quat.identity();
        return;
      }
      case 'sheet':
        if (i < 25) pos.set(((i % 5) - 2) * 1.04, 0, (Math.floor(i / 5) - 2) * 1.04);
        else pos.set(0, -1.05, 0); // la pieza sobrante queda oculta bajo la hoja
        quat.identity();
        return;
      case 'leaves':
        pos.set(p.rv.x * 4.6 + Math.sin(t * 0.7 + i) * 0.25, -2.4 + p.rv.y * 0.8, p.rv.z * 2.2);
        quat.copy(p.rq).multiply(qTmp.setFromAxisAngle(p.spinAxis, t * 0.35 + i));
        return;
      case 'rows': {
        const r = i % 3;
        const k = Math.floor(i / 3);
        pos.set((r - 1) * 1.8, 0, (4 - k) * 1.15);
        quat.identity();
        return;
      }
      case 'wall':
        pos.set(((i % 9) - 4) * 1.04, (1 - Math.floor(i / 9)) * 1.04, 0);
        quat.identity();
        return;
      default:
        assembledTarget(p, now, pos, quat);
    }
  }

  // ---------- estado por capítulo ----------
  let form = 'assembled';
  const group = { ...GROUP.assembled };
  const cur = { x: 0, y: 0, scale: 1, dim: 1, rot: new THREE.Euler(...GROUP.assembled.rot) };
  let spinAngle = 0;
  let idleTurns = false;
  let nextIdle = 0;

  function setFormation(name, { turns = 0, now = performance.now() } = {}) {
    const prev = form;
    form = name;
    Object.assign(group, GROUP[name] || GROUP.assembled);
    const stagger = name === 'leaves' ? 1000 : 260;
    for (const p of pieces) {
      p.delay = name === 'leaves' ? p.rv.x * 0.5 * stagger + stagger * 0.5 : p.idx * (stagger / pieces.length);
      if (reduced) p.delay = 0;
      p.formAt = now + p.delay;
      p.nextForm = name;
    }
    // giros: solo tienen sentido con el cubo armado
    if (name === 'solved') {
      queueSolve(prev === 'assembled' || prev === 'solved' ? 200 : 1300);
    } else {
      // al salir de "resuelto" cancelamos lo que falte por resolver
      if (prev === 'solved') {
        queue = [];
        finishTurn();
      }
      if (turns && !reduced) queueRandomTurns(turns);
    }
    idleTurns = (name === 'assembled') && !reduced;
    nextIdle = now + 2600;
  }

  // ---------- bucle ----------
  const pos = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  let lastDim = -1;
  const pointer = { x: 0, y: 0 };
  const par = { x: 0, y: 0 };

  function update(dt, now, layout) {
    const t = now / 1000;

    // cola de giros
    if (turn && now - turn.t0 >= turn.dur * 1000) finishTurn();
    if (!turn && queue.length && now >= holdUntil) {
      const next = queue.shift();
      if (reduced) {
        commit(next.move);
        if (next.undo) history.pop();
        else history.push(next.move);
      } else turn = { ...next, t0: now };
    }
    if (!turn && !queue.length && idleTurns && now > nextIdle) {
      queueRandomTurns(1, 0.55);
      nextIdle = now + 3200;
    }

    // grupo: posición en pantalla, escala y rotación
    const k = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    cur.x += (layout.x - cur.x) * k;
    cur.y += (layout.y - cur.y) * k;
    cur.scale += (layout.scale * group.scale - cur.scale) * k;
    cur.dim += (layout.dim * group.dim - cur.dim) * k;
    root.position.set(cur.x, cur.y, 0);
    root.scale.setScalar(cur.scale);

    if (!reduced) spinAngle += dt * group.spin;
    par.x += (pointer.x - par.x) * (1 - Math.exp(-2.5 * dt));
    par.y += (pointer.y - par.y) * (1 - Math.exp(-2.5 * dt));
    cur.rot.x += (group.rot[0] + par.y * 0.12 - cur.rot.x) * k;
    cur.rot.z += (group.rot[2] - cur.rot.z) * k;
    const targetY = group.rot[1] + par.x * 0.16;
    cur.rot.y += (targetY - cur.rot.y) * k;
    tilt.rotation.set(cur.rot.x, cur.rot.y + (reduced ? 0 : Math.sin(spinAngle) * 0.35), cur.rot.z);

    // brillo (solo si cambia)
    if (Math.abs(cur.dim - lastDim) > 0.002) {
      lastDim = cur.dim;
      stickerMats.forEach((m, i) => m.color.copy(baseColors.stickers[i]).multiplyScalar(cur.dim));
      bodyMat.color.copy(baseColors.body).multiplyScalar(Math.max(cur.dim, 0.6));
    }

    // piezas
    const kp = reduced ? 1 : 1 - Math.exp(-4.2 * dt);
    for (const p of pieces) {
      if (p.nextForm && now >= p.formAt) {
        p.form = p.nextForm;
        p.nextForm = null;
        p.settled = false;
      }
      formationTarget(p.form, p, now, t, pos, quat);
      const m = p.mesh;
      const assembled = p.form === 'assembled' || p.form === 'solved';
      if (assembled && p.settled) {
        // ya en su sitio: seguir exactamente (los giros no atraviesan el cubo)
        m.position.copy(pos);
        m.quaternion.copy(quat);
      } else {
        m.position.lerp(pos, kp);
        m.quaternion.slerp(quat, kp);
        if (assembled && m.position.distanceToSquared(pos) < 0.0004 && m.quaternion.angleTo(quat) < 0.02) p.settled = true;
      }
    }
  }

  // transformación de mundo del hueco de Meido
  const slotMatrix = new THREE.Matrix4();
  const slotLocal = new THREE.Matrix4();
  function getSlotTransform(outPos, outQuat, outScale) {
    assembledTarget(slotPiece, performance.now(), pos, quat);
    slotLocal.compose(pos, quat, new THREE.Vector3(1, 1, 1));
    tilt.updateWorldMatrix(true, false);
    slotMatrix.multiplyMatrices(tilt.matrixWorld, slotLocal);
    slotMatrix.decompose(outPos, outQuat, outScale);
  }

  const isSolved = () => history.length === 0 && !turn;
  const isAssembled = () => (form === 'assembled' || form === 'solved') && pieces.every((p) => p.settled);

  return {
    root,
    update,
    setFormation,
    getSlotTransform,
    isSolved,
    isAssembled,
    setPointer: (x, y) => { pointer.x = x; pointer.y = y; },
    // tamaño del cubo armado en unidades de mundo (para encajar en pantalla)
    extent: 3 * SP,
    pieceSize: SIZE,
  };
}
