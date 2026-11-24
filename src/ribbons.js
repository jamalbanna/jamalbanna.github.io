import { WebGLRenderer, Scene, OrthographicCamera, ShaderMaterial, BufferGeometry, BufferAttribute, Mesh, DoubleSide, Color } from 'three';
import { ROLES, GROUPS } from './data.js';
import { rolePoints } from './graph.js';

const VERT = /* glsl */ `
  attribute vec2 aNormal;
  attribute float aSide;
  attribute float aT;
  attribute float aU;
  attribute float aLane;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uPlayX;
  uniform float uPluck;
  uniform float uIdle;
  uniform float uY0;
  uniform float uPitch;
  uniform float uHalf;
  uniform float uExit;
  uniform float uEdgeX;
  uniform float uEdgePluck;

  varying vec3 vColor;
  varying float vT;
  varying float vU;
  varying float vD;
  varying float vHalf;
  varying float vX;
  varying float vLane;

  void main() {
    vec3 p = position;
    // how far this point sits from the trunk, 0 on the trunk, 1 in its lane
    float away = clamp(abs(p.y - uY0) / uPitch, 0.0, 1.0);
    float dx = p.x - uPlayX;
    float env = exp(-dx * dx / (2.0 * 120.0 * 120.0));

    // the playhead plucks the threads it crosses: a wave that travels outward and dies
    float wave = sin(dx * 0.05 - uTime * 16.0 + aLane * 1.9) * env * uPluck;
    // threads are never perfectly still
    wave += sin(p.x * 0.011 + uTime * 0.8 + aLane * 1.3) * uIdle;
    // a chapter wipe crossing the hero plucks the threads too
    float de = p.x - uEdgeX;
    wave += sin(de * 0.06 - uTime * 18.0 + aLane * 1.9) * exp(-de * de / (2.0 * 110.0 * 110.0)) * uEdgePluck;
    p.y += wave * away;

    // leaving the hero: the lanes fan away from the trunk
    p.y = uY0 + (p.y - uY0) * (1.0 + uExit * 0.9);

    float swell = 1.0 + 0.9 * exp(-dx * dx / (2.0 * 26.0 * 26.0)) * away;
    float halfW = uHalf * swell;
    p.xy += aNormal * aSide * (halfW + 1.0);

    vColor = aColor;
    vT = aT;
    vU = aU;
    vD = aSide * (halfW + 1.0);
    vHalf = halfW;
    vX = p.x;
    vLane = aLane;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uPlayT;
  uniform float uPlayX;
  uniform float uPitch;
  uniform float uFlow;
  uniform float uExit;
  uniform vec3 uBg;

  varying vec3 vColor;
  varying float vT;
  varying float vU;
  varying float vD;
  varying float vHalf;
  varying float vX;
  varying float vLane;

  void main() {
    // everything the playhead has passed is lit, everything ahead of it is a ghost
    float lit = 1.0 - smoothstep(uPlayT - 0.025, uPlayT + 0.025, vT);
    vec3 col = mix(mix(uBg, vColor, 0.2), vColor, lit);

    // work in progress: pulses run along every lit thread
    float d = fract(vU / 190.0 - uTime * 0.26 + vLane * 0.37);
    float pulse = smoothstep(0.0, 0.04, d) * (1.0 - smoothstep(0.04, 0.34, d));
    col = mix(col, vec3(1.0), pulse * 0.5 * lit * uFlow);

    // where the playhead touches a thread it runs hot
    float hx = (vX - uPlayX) / (uPitch * 0.9);
    col = mix(col, vec3(1.0), exp(-hx * hx) * 0.55);

    float a = clamp(vHalf + 0.5 - abs(vD), 0.0, 1.0);
    a *= 1.0 - uExit;
    gl_FragColor = vec4(col, a);
  }
`;

export class Ribbons {
  constructor(canvas, { lite = false } = {}) {
    this.lite = lite;
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2));
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new Scene();
    this.camera = new OrthographicCamera(0, 1, 0, 1, -10, 10);
    this.uniforms = {
      uTime: { value: 0 }, uPlayT: { value: 0 }, uPlayX: { value: 0 }, uPluck: { value: 0 },
      uIdle: { value: lite ? 0.6 : 1.1 }, uY0: { value: 0 }, uPitch: { value: 20 }, uHalf: { value: 2.5 },
      uExit: { value: 0 }, uEdgeX: { value: -9999 }, uEdgePluck: { value: 0 }, uFlow: { value: 1 }, uBg: { value: new Color('#0B0C0E') },
    };
    this.material = new ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: this.uniforms, transparent: true, depthTest: false, depthWrite: false, side: DoubleSide });
    this.mesh = new Mesh(new BufferGeometry(), this.material);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
    this.pluck = 0;
    this.lastX = null;
  }

  build(g) {
    const pos = [], nor = [], side = [], tt = [], uu = [], lane = [], col = [], idx = [];
    let base = 0;
    for (const r of ROLES.filter((x) => x.start)) {
      const pts = rolePoints(r, g);
      const c = new Color(GROUPS[r.group].color);
      let len = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        let tx = b[0] - a[0], ty = b[1] - a[1];
        const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
        if (i > 0) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        for (const s of [-1, 1]) {
          pos.push(pts[i][0], pts[i][1], 0);
          nor.push(-ty, tx);
          side.push(s);
          tt.push(g.xt(pts[i][0]));
          uu.push(len);
          lane.push(r.lane);
          col.push(c.r, c.g, c.b);
        }
        if (i < pts.length - 1) { const k = base + i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      }
      base += pts.length * 2;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    geo.setAttribute('aNormal', new BufferAttribute(new Float32Array(nor), 2));
    geo.setAttribute('aSide', new BufferAttribute(new Float32Array(side), 1));
    geo.setAttribute('aT', new BufferAttribute(new Float32Array(tt), 1));
    geo.setAttribute('aU', new BufferAttribute(new Float32Array(uu), 1));
    geo.setAttribute('aLane', new BufferAttribute(new Float32Array(lane), 1));
    geo.setAttribute('aColor', new BufferAttribute(new Float32Array(col), 3));
    geo.setIndex(idx);
    this.mesh.geometry.dispose();
    this.mesh.geometry = geo;

    this.camera.left = 0; this.camera.right = g.w; this.camera.top = 0; this.camera.bottom = g.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(g.w, g.h, false);
    this.uniforms.uY0.value = g.y0;
    this.uniforms.uPitch.value = g.pitch;
    this.uniforms.uHalf.value = g.stroke / 2;
    this.maxPluck = g.pitch * 0.42;
    this.g = g;
  }

  setPlayhead(t, x) {
    if (this.lastX !== null) this.pluck = Math.min(this.maxPluck || 8, this.pluck + Math.abs(x - this.lastX) * 0.16);
    this.lastX = x;
    this.uniforms.uPlayT.value = t;
    this.uniforms.uPlayX.value = x;
  }

  render(time) {
    this.pluck *= 0.93;
    this.uniforms.uPluck.value = this.lite ? this.pluck * 0.6 : this.pluck;
    this.uniforms.uTime.value = time;
    this.renderer.render(this.scene, this.camera);
  }
}
