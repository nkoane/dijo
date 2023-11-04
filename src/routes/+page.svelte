<script lang="ts">
    export let data;

    $: console.log(data);
</script>

<h2 class="text-2xl font-bold">ORDXR</h2>
<section class="flex justify-between gap-2">
    <div class="bg-red-600 w-2/3">left</div>
    <div class="bg-green-600">right</div>
</section>
