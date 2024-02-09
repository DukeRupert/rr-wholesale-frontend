<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
    $: console.log(data)
</script>

<form method="POST" action="?/check">
    <button>test session</button>
</form>

<form method="POST" action="?/login">
    <button>login</button>
</form>