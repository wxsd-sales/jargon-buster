<script lang="ts">
  import TermFields from './components/TermFields.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<form id="assignment-create" class="container px-4 mb-6" method="POST" action="?/save">
  <TermFields {...data} />

  <hr />
  <div class="columns is-multiline">
    <!--{#if id != null}-->
    <div class="column is-12 is-hidden">
      <!--        <input class="input" name="id" value={id} readonly />-->
    </div>
    <!--{/if}-->
    {#if form?.errors}
      <div class="column is-12">
        <pre class="has-text-danger">{form.errors}</pre>
      </div>
    {/if}
    <div class="column is-12">
      <button class="button is-medium is-rounded is-success is-fullwidth" type="submit">
        <span>Save</span>
        <span class="icon">
          <i class="mdi mdi-content-save" />
        </span>
      </button>
    </div>
  </div>
</form>
