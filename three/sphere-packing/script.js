import { Color, DirectionalLight, HemisphereLight, InstancedMesh, MeshLambertMaterial, Object3D, OrthographicCamera, PCFSoftShadowMap, PerspectiveCamera, Quaternion, Scene, SphereGeometry, Vector3, WebGLRenderer } from "https://esm.sh/three@0.169.0"


const N = 4000
const MIN_R = 0.005
const MAX_R = 0.5

const min = Math.min
const abs = Math.abs


//////// SETUP

const scene = new Scene()
scene.background = new Color(0.01, 0.01, 0.01)

let asp = innerWidth / innerHeight
const camera = new OrthographicCamera(-asp, asp, 1, -1, -1, 1)

const renderer = new WebGLRenderer({ canvas })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(min(2, devicePixelRatio))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap


//////// LIGHT

const ambient = new HemisphereLight(
  new Color(1, 0.6, 0.2),
  new Color(0.2, 0.6, 1),
  2,
)
scene.add(ambient)

const light = new DirectionalLight(
  new Color(1, 0.9, 0.8),
  2,
)
light.position.set(-1, 1, 1)
scene.add(light)

light.castShadow = true
light.shadow.mapSize.width  = 1024
light.shadow.mapSize.height = 1024
light.shadow.camera.near   =  0
light.shadow.camera.far    =  4
light.shadow.camera.left   = -1
light.shadow.camera.right  =  1
light.shadow.camera.top    = -1
light.shadow.camera.bottom =  1
light.shadow.bias = -0.001


//////// INTSTANCED SPHERES

const mat = new MeshLambertMaterial()

// const new_spheres = (ws: number, hs: number) => {
//   const geom = new SphereGeometry(1, ws, hs)
//   const spheres = new InstancedMesh(geom, mat, N)
//   spheres.castShadow = true
//   spheres.receiveShadow = true
//   return spheres
// }
const new_spheres = (ws, hs) => {
  const geom = new SphereGeometry(1, ws, hs)
  const spheres = new InstancedMesh(geom, mat, N)
  spheres.castShadow = true
  spheres.receiveShadow = true
  return spheres
}

const spheres = [
  // small size spheres
  { num: 0, mesh: new_spheres(9, 6) },
  // medium size spheres
  { num: 0, mesh: new_spheres(21, 14) },
  // large size spheres
  { num: 0, mesh: new_spheres(72, 48) },
]

// const set_instance = (
//   inst: typeof spheres[number],
//   matrix: Matrix4,
// ) => {
//   inst.mesh.setMatrixAt(inst.num, matrix)
//   inst.mesh.setColorAt(inst.num, rnd_color())
//   inst.num++
// }
const set_instance = (inst, matrix) => {
  inst.mesh.setMatrixAt(inst.num, matrix);
  inst.mesh.setColorAt(inst.num, rnd_color());
  inst.num++;
}


//////// PACKING

const dummy = new Object3D()

const packed = new Float32Array(N * 4)

const start = performance.now()
const MAX_TRIES = 1e3
let checks_num = 0

for (let i = 0; i < N; i++) {
  let x = 0, y = 0, z = 0, r = 0, k = 0

  while (r === 0 && k < MAX_TRIES) {
    x = random(-1, 1)
    y = random(-1, 1)
    z = random(-1, 1)
    r = get_radius(x, y, z, i)
    k++
  }

  if (k === MAX_TRIES && r === 0) {
    continue
  }

  dummy.position.set(x, y, z)
  dummy.scale.set(r, r, r)
  dummy.updateMatrix()

  if (r < 0.03) {
    set_instance(spheres[0], dummy.matrix)
  }
  else if (r < 0.1) {
    set_instance(spheres[1], dummy.matrix)
  }
  else {
    set_instance(spheres[2], dummy.matrix)
  }

  const j = i * 4
  packed[j + 0] = x
  packed[j + 1] = y
  packed[j + 2] = z
  packed[j + 3] = r
}

let sum = 0
for (const { mesh, num } of spheres) {
  mesh.count = num
  sum += num
}

const time = performance.now() - start | 0

log.textContent = `${str(checks_num)} checks in ${str(time)}ms\n${str(spheres[0].num)}S + ${str(spheres[1].num)}M + ${str(spheres[2].num)}L = ${str(sum)}`

const mesh = spheres[0].mesh
mesh.scale.multiplyScalar(0.5)
mesh.add(spheres[1].mesh)
mesh.add(spheres[2].mesh)
scene.add(mesh)

const qt = mesh.quaternion


//////// ANIMATION LOOP

const HPI   = Math.PI / 2
const DUR   = 4000
const DELAY = 1000


const get_next_qt = (() => {
  // const new_qt = (
  //   v: Vector3,
  //   a: number,
  // ) => (
  //   new Quaternion().setFromAxisAngle(v, a)
  // )
  const new_qt = (
    v,
    a,
  ) => (
    new Quaternion().setFromAxisAngle(v, a)
  )

  const vx = new Vector3(1, 0, 0)
  const qtxs = [
    new_qt(vx, -HPI),
    new_qt(vx, 0),
    new_qt(vx, HPI),
  ]

  const vy = new Vector3(0, 1, 0)
  const qtys = [
    new_qt(vy, -HPI),
    new_qt(vy, 0),
    new_qt(vy, HPI),
  ]

  // 0b0101 gives zero rotation, qtxs[1] * qtys[1]
  let prev_qt_id = 5

  const get_rnd_qt = () => {
    const id = (random(0, 3) << 2) + (random(0, 3) & 3)
    // don't return zero or same rotation
    if (id === prev_qt_id || id === 5) {
      return get_rnd_qt()
    }
    prev_qt_id = id
    return [ qtxs[id >> 2], qtys[id & 3] ]
  }

  // return (prev_qt: Quaternion) => {
  return (prev_qt) => {
    const [ xqt, yqt ] = get_rnd_qt()
    return prev_qt.clone()
      .premultiply(xqt)
      .premultiply(yqt)
  }
})()


// 3rd order smoothstep
// const ease = (t: number) => (
const ease = (t) => (
    35 * t ** 4
  - 84 * t ** 5
  + 70 * t ** 6
  - 20 * t ** 7
)


const rnd_rot = () => {
  const prev_qt = qt.clone()
  const next_qt = get_next_qt(prev_qt)

  const start = performance.now()

  const tick = () => {
    const now = performance.now()
    const t = ease(min(1, (now - start) / DUR))
    qt.slerpQuaternions(prev_qt, next_qt, t)
    if (t < 1) requestAnimationFrame(tick)
    else setTimeout(rnd_rot, DELAY)
  }

  requestAnimationFrame(tick)
}

setTimeout(rnd_rot, DELAY)


//////// RENDER

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
})


//////// UTILS

// function str(num: number) {
function str(num) {
  return num.toLocaleString()
}

function random(from = 0, to = 1) {
  return from + Math.random() * (to - from)
}

function rnd_color() {
  return new Color(
    random(0.2, 1),
    random(0.2, 1),
    random(0.2, 1),
  )
}


// function dist(
//   x0: number,
//   y0: number,
//   x1: number,
//   y1: number,
// ) {
function dist(
  x0,
  y0,
  x1,
  y1,
) {
  return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
}

// function get_radius(
//   x: number,
//   y: number,
//   z: number,
//   n: number,
// ) {
function get_radius(
  x,
  y,
  z,
  n,
) {
  let r = min(
    1 - abs(x),
    1 - abs(y),
    1 - abs(z),
    MAX_R,
  )

  if (r < MIN_R) {
    return 0
  }

  if (n === 0) {
    return r
  }

  for (let i = 0; i < n * 4; i += 4) {
    checks_num++

    const xo = packed[i + 0]
    const yo = packed[i + 1]
    const zo = packed[i + 2]
    const ro = packed[i + 3]

    const ryz = dist(y, z, yo, zo) - ro
    const rxz = dist(x, z, xo, zo) - ro
    const rxy = dist(x, y, xo, yo) - ro

    if (
      ryz < MIN_R ||
      rxz < MIN_R ||
      rxy < MIN_R
    ) {
      r = 0
      break
    }

    r = min(ryz, rxz, rxy, r)
  }

  return r
}


onresize = () => {
  asp = innerWidth / innerHeight
  camera.left  = -asp
  camera.right =  asp
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)
}
