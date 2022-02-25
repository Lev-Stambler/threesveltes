<script lang="ts">
  import {
    Canvas,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    //BasicShadowMap,
    //PCFShadowMap,
    PCFSoftShadowMap,
    //VSMShadowMap,
    AmbientLight,
    BoxBufferGeometry,
    PlaneBufferGeometry,
    Mesh,
    MeshStandardMaterial,
    WebGLRenderer,
    OrbitControls,
    DoubleSide,
    MathUtils,
    Vector3,
  } from "svelthree";

  export function* rationalYieldFn(
    numerator: number,
    denominator: number,
    b = 10
  ): GeneratorFunction<number> {
    let remainder = numerator;
    for (;;) {
      let digit = Math.floor((remainder * b) / denominator);
      remainder = (remainder * b) % denominator;
      yield digit;
    }
  }

  let detStr = "1, 7, 10, 3, 13, 10";

  let yRotateRad: number = 0;
  let zRotateRad: number = 0;

  // /**
  //  * @param angle1 - angle in radians around the z axis (first rotation)
  //  * @param angle2 - rotation around the axis perpendicular to the current vector's
  //  * projection to the XY plane
  //  */
  // const calcRotationVectors = (
  //   angleZAxis: number,
  //   angleAroundSelf: number
  // ): [{ v: Vector3; amount: number }, { v: Vector3; amount: number }] => {
  //   const r1 = { v: new Vector3(0, 0, 1), amount: angleZAxis };
  //   let y = Math.sin(angleZAxis);
  //   let x = Math.cos(angleZAxis);
  //   const axis2 = new Vector3(x, y, 0);
  //   return [r1, { v: axis2, amount: angleAroundSelf }];
  // };
  let cubeGeometry = new BoxBufferGeometry(1, 1, 1, 1, 1, 1);
  let cubeMaterial = new MeshStandardMaterial();

  let floorGeometry = new PlaneBufferGeometry(20, 20, 1);
  let floorMaterial = new MeshStandardMaterial();

  const start = async () => {
    const split = detStr.split(",").map((s) => parseInt(s.trim()));
    if (split.length !== 6) throw `Expected a comma seperated list of size 6`;
    let [yawN, yawD, yawB, pitchN, pitchD, pitchB] = split as [
      number,
      number,
      number,
      number,
      number,
      number
    ];

    const pitchIter = rationalYieldFn(pitchN, pitchD, pitchB);
    const yawIter = rationalYieldFn(yawN, yawD, yawB);

    await new Promise((res, rej) => setTimeout(res, 10000));
    while (true) {
      yRotateRad = MathUtils.degToRad((pitchIter.next() / pitchB) * 360);
      zRotateRad = MathUtils.degToRad((yawIter.next() / yawB) * 360);
      console.log("RUN");
      await new Promise((res, rej) => setTimeout(res, 10000));
    }
  };
  start();
</script>

<Canvas let:sti w={1920} h={1080}>
  <Scene {sti} let:scene id="scene1" props={{ background: 0xedf2f7 }}>
    <PerspectiveCamera {scene} id="cam1" pos={[0, 0, 30]} lookAt={[0, 0, 0]} />
    <AmbientLight {scene} intensity={1.25} />
    <DirectionalLight
      {scene}
      pos={[1, 2, 1]}
      intensity={0.8}
      shadowMapSize={512 * 8}
      castShadow
    />

    <Mesh
      {scene}
      geometry={cubeGeometry}
      material={cubeMaterial}
      mat={{ roughness: 0.5, metalness: 0.5, color: 0xff3e00 }}
      pos={[0, 0, 0]}
      rot={[0, MathUtils.degToRad(yRotateRad), MathUtils.degToRad(zRotateRad)]}
      castShadow
      receiveShadow
    />

    <Mesh
      {scene}
      geometry={floorGeometry}
      material={floorMaterial}
      mat={{
        roughness: 0.5,
        metalness: 0.5,
        side: DoubleSide,
        color: 0xf7fafc,
      }}
      pos={[0, -0.501, 0]}
      rot={[MathUtils.degToRad(-90), 0, 0]}
      scale={[1, 1, 1]}
      receiveShadow
    />

    <OrbitControls {scene} autoRotate enableDamping />
  </Scene>

  <WebGLRenderer
    {sti}
    sceneId="scene1"
    camId="cam1"
    config={{ antialias: true, alpha: true }}
    enableShadowMap
    shadowMapType={PCFSoftShadowMap}
  />
</Canvas>
