<script lang="ts">
  import Textfield from "@smui/textfield";
import { getContext } from "svelte";
  import { lines, parameters, scene } from "./store";

  let yawn = $parameters.yaw.n;
  let yawd = $parameters.yaw.d;
  let yawb = $parameters.yaw.b;

  let pitchn = $parameters.pitch.n;
  let pitchd = $parameters.pitch.d;
  let pitchb = $parameters.pitch.b;

  let distancen = $parameters.distance.n;
  let distanced = $parameters.distance.d;
  let distanceb = $parameters.distance.b;
  const { open, close } = getContext('simple-modal');

  const setValues = () => {
    close()
    setTimeout(
      () =>
        parameters.set({
          yaw: {
            n: yawn,
            d: yawd,
            b: yawb,
          },
          pitch: {
            n: pitchn,
            d: pitchd,
            b: pitchb,
          },
          distance: {
            n: distancen,
            d: distanced,
            b: distanceb,
          },
        }),
      500
    );
  };
</script>

<div class="field-group">
  <h3>Yaw</h3>
  <Textfield bind:value={yawn} label="Numerator" />
  <Textfield bind:value={yawd} label="Denominator" />
  <Textfield bind:value={yawb} label="Base" />
</div>
<div class="field-group">
  <h3>Pitch</h3>
  <Textfield bind:value={pitchn} label="Numerator" />
  <Textfield bind:value={pitchd} label="Denominator" />
  <Textfield bind:value={pitchb} label="Base" />
</div>
<div class="field-group">
  <h3>distance</h3>
  <Textfield bind:value={distancen} label="Numerator" />
  <Textfield bind:value={distanced} label="Denominator" />
  <Textfield bind:value={distanceb} label="Base" />
</div>

<input type="button" value="Refresh Animation" on:click={setValues} />
