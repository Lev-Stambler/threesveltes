<script lang="ts">
  import Modal from "svelte-simple-modal";
  import OptionsPopup from "./OptionsPopup.svelte";
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
    Object3D,
  } from "svelthree";
  import { lines, parameters, scene } from "./store";
  import { getContext, onMount } from "svelte";
  import Controls from "./Controls.svelte";
  import { init } from "svelte/internal";

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

  // let detStr =
  //   (window.location.hash ?? "").split("#")[1]?.split(",").length === 9
  //     ? window.location.hash.split("#")[1]
  //     : "423, 999, 10, 6, 17, 10, 8, 9, 10";
  // console.log(detStr, window.location.hash);

  type PosType = [number, number, number];
  let yRotateRad: number = 0;
  let zRotateRad: number = 0;
  let pos: PosType = [0, 0, 0];
  let running = true;
  const moveUnits = 3;

  const calcMoveVec = (
    curr: PosType,
    yRot: number,
    zRot: number,
    _moveUnits = moveUnits
  ): PosType => {
    const deltaX = Math.sin(zRot) * _moveUnits * Math.cos(yRot);
    const deltaY = Math.cos(zRot) * _moveUnits * Math.cos(yRot);
    const deltaZ = Math.sin(yRot) * _moveUnits;
    return [deltaX, deltaY, deltaZ];
  };

  let cubeGeometry = new BoxBufferGeometry(1, 1, 1, 1, 1, 1);
  let cubeMaterial = new MeshStandardMaterial();
  let lineMaterial = new LineBasicMaterial({ color: 0x0000ff });

  let floorGeometry = new PlaneBufferGeometry(20, 20, 1);
  let floorMaterial = new MeshStandardMaterial();
  let scenecomp: Scene;

  const start = async (initSleep = true) => {
    let [yawN, yawD, yawB, pitchN, pitchD, pitchB, mn, md, mbase] = [
      $parameters.yaw.n,
      $parameters.yaw.d,
      $parameters.yaw.b,
      $parameters.pitch.n,
      $parameters.pitch.d,
      $parameters.pitch.b,
      $parameters.distance.n,
      $parameters.distance.d,
      $parameters.distance.b,
    ];

    const pitchIter = rationalYieldFn(pitchN, pitchD, pitchB);
    const yawIter = rationalYieldFn(yawN, yawD, yawB);
    const moveAmount = rationalYieldFn(mn, md, mbase);

    if (initSleep) await new Promise((res, rej) => setTimeout(res, 1000));
    while (running) {
      yRotateRad += MathUtils.degToRad((pitchIter.next().value / pitchB) * 360);
      zRotateRad += MathUtils.degToRad((yawIter.next().value / yawB) * 360);
      const move = moveAmount.next().value;

      const [deltaX, deltaY, deltaZ] = calcMoveVec(
        pos,
        yRotateRad,
        zRotateRad,
        move
      );
      const newPos = [
        pos[0] + deltaX,
        pos[1] + deltaY,
        pos[2] + deltaZ,
      ] as PosType;
      const points = [new Vector3(...pos), new Vector3(...newPos)];
      const lineGeomertry = new BufferGeometry().setFromPoints(points);
      const l = new Line(lineGeomertry, lineMaterial);
      $scene.add(l);
      $lines = [...$lines, l];

      pos = newPos;
      await new Promise((res, rej) => setTimeout(res, 10));
    }
    console.log("DONE")
  };
  parameters.subscribe((newParams) => {
    running = false;
    if ($scene) $scene.remove(...$lines);
    pos = [0, 0, 0];
    $lines = [];
    yRotateRad = 0;
    zRotateRad = 0;
    setTimeout(() => {
      running = true;
      start();
    }, 400);
  });

  onMount(() => {
    scene.set(scenecomp.getScene() as Scene);
  });
</script>

<Modal>
  <div class="options">
    <Controls />
  </div>
  <Canvas let:sti w={1920} h={1080}>
    <Scene
      {sti}
      bind:this={scenecomp}
      let:scene
      id="scene1"
      props={{ background: 0xedf2f7 }}
    >
      <PerspectiveCamera
        {scene}
        id="cam1"
        pos={[0, 0, 30]}
        lookAt={[0, 0, 0]}
      />
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

      <OrbitControls {scene} enableDamping />
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

  <style>
    .options {
      position: absolute;
      z-index: 100;
      top: 15px;
      left: 15px;
      padding: 1rem;
    }
  </style>
</Modal>
