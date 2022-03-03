<script lang="ts">
  import { getContext } from "svelte";
  import OptionsPopup from "./OptionsPopup.svelte";

  const { open } = getContext("simple-modal");
  const showOptions = () => open(OptionsPopup, {});
</script>

<button on:click={showOptions}> Controls </button>
