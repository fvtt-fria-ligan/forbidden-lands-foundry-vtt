<script>
	import {slide} from 'svelte/transition';
  const promise = fetch("https://api.github.com/repos/fvtt-fria-ligan/forbidden-lands-foundry-vtt/releases").then(res => res.json());

  const converter = (() => {
    Object.entries({...CONST.SHOWDOWN_OPTIONS, headerLevelStart: 2}).forEach(([k, v]) => showdown.setOption(k, v));
    return new showdown.Converter();
  })();

</script>

<section class="fbl-core">
  <h1>Changelog</h1>
  <p>Here you can find the changelog for the Forbidden Lands system.</p>
	{#await promise then releases}
	{#each releases as release}
		<article class="fbl-core" transition:slide >
		<h2>{release.name}</h2>
		{@html converter.makeHtml(release.body)}
		</article>
	{/each}
	{:catch error}
	<p>{error.message}</p>
	{/await}
</section>

<style>
  section {
	padding: 1em;
  }
  article {
	padding: 1em;
  }
  h1 {
	text-align: center;
  }
  h2 {
	text-align: center;
  }
</style>
