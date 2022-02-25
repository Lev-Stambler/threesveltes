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
    BufferGeometry,
    LineSegments,
    LineBasicMaterial,
    Line,
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

  let detStr = "0, 11, 11, 3, 13, 11";
  let lines: { g: BufferGeometry; pos: [number, number, number] }[] = [];

  type PosType = [number, number, number];
  let yRotateRad: number = 0;
  let zRotateRad: number = 0;
  let pos: PosType = [0, 0, 0];
  const moveUnits = 3;
  

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
  // TODO: angles at 45degrees and apart so that zRot and yRot contribute to all 3 axises
  const calcMoveVec = (curr: PosType, yRot: number, zRot: number): PosType => {
    const deltaX = Math.sin(zRot) * moveUnits;
    const deltaY = Math.cos(zRot) * moveUnits;
    const deltaZ = Math.sin(yRot) * moveUnits;
    console.log(deltaX, deltaY, deltaZ)
    return [deltaX, deltaY, deltaZ];
  };

  let cubeGeometry = new BoxBufferGeometry(1, 1, 1, 1, 1, 1);
  let cubeMaterial = new MeshStandardMaterial();
  let lineMaterial = new LineBasicMaterial({ color: 0x0000ff });

  let floorGeometry = new PlaneBufferGeometry(20, 20, 1);
  let floorMaterial = new MeshStandardMaterial();
  let scenecomp: Scene

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

    await new Promise((res, rej) => setTimeout(res, 1000));
    while (true) {
      console.log(pitchIter.next());
      const [deltaX, deltaY, deltaZ] = calcMoveVec(pos, yRotateRad, zRotateRad);
      const newPos = [
        pos[0] + deltaX,
        pos[1] + deltaY,
        pos[2] + deltaZ,
      ] as PosType;
      console.log(yRotateRad, zRotateRad);
      const points = [
        new Vector3(...pos),
        new Vector3(...newPos),
      ];
      const lineGeomertry = new BufferGeometry().setFromPoints(points);
      scenecomp.getScene().add(new Line(lineGeomertry,lineMaterial))

      yRotateRad = MathUtils.degToRad((pitchIter.next().value / pitchB) * 360);
      zRotateRad = MathUtils.degToRad((yawIter.next().value / yawB) * 360);
      pos = newPos;
      await new Promise((res, rej) => setTimeout(res, 10));
    }
  };
  start();
</script>

<Canvas let:sti w={1920} h={1080}>
  <Scene {sti} bind:this={scenecomp}  let:scene id="scene1" props={{ background: 0xedf2f7 }}>
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
      {pos}
      rot={[0, yRotateRad, zRotateRad]}
      castShadow
      receiveShadow
    />
    {#each lines as line}
      <Mesh
        {scene}
        geometry={line.g}
        pos={line.pos}
        rot={[0, yRotateRad, zRotateRad]}
        castShadow
        receiveShadow
      />
    {/each}

    <!-- <Mesh
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
    /> -->

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
