<script>
  import { _ } from "svelte-i18n";
  import BlowForm from "../../../BlowForm.svelte";
  import Bubble from "../../../Bubble.svelte";

  export let data;

  let { bubble } = data;
</script>

<Bubble {bubble} />
<BlowForm anchor={bubble.id} redirectTo={`/b/${bubble.id}`} />
