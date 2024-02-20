<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  const { glossary = [] } = data;
</script>

<div class="container px-4 mb-6">
  <div class="columns is-vcentered">
    <div class="column is-3">
      <a
        class="button is-light is-fullwidth is-rounded is-info is-justify-content-space-between"
        href="/terms/add"
      >
        <span class="icon">
          <i class="mdi mdi-plus-box" />
        </span>
        <span>Add Term</span>
      </a>
    </div>
    <div class="column is-3">
      <a
        class="button is-light is-fullwidth is-rounded is-info is-justify-content-space-between"
        href="/terms/upload"
      >
        <span class="icon">
          <i class="mdi mdi-upload-box" />
        </span>
        <span>Upload Terms CSV</span>
      </a>
    </div>
    <div class="column is-6 has-text-centered has-text-right-tablet">
      <p>Last refreshed at: {new Date().toLocaleString()}</p>
    </div>
  </div>
  {#if glossary.length === 0}
    <hr />
    <p>You currently have no terms.</p>
  {/if}
  {#each glossary as term (term.id)}
    <hr />
    <div class="columns is-vcentered is-mobile">
      <div class="column is-12">
        <p class="title is-size-5 has-text-weight-bold">{term.letters}</p>
      </div>
    </div>
    <div class="columns">
      <div class="column is-12">
        <div class="level is-mobile mb-0">
          <p class="level-left">id</p>
          <p class="level-right">{term.id}</p>
        </div>
        <div class="level is-mobile mb-0">
          <p class="level-left">created</p>
          <p class="level-right">
            by {term.createdBy.email} at {new Date(term.createdAt).toLocaleString()}
          </p>
        </div>
        <div class="level is-mobile mb-0">
          <p class="level-left">updated</p>
          <p class="level-right">
            by {term.updatedBy.email} at {new Date(term.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>

    <div class="columns is-vcentered is-multiline my-0">
      <div class="column is-9">
        <p class="title is-size-5 has-text-weight-bold">
          Aliases ({term?.aliases?.length})
        </p>
        {#if term?.aliases?.length === 0}
          <p class="subtitle is-size-6 has-text-weight-bold">No aliases for this term.</p>
        {/if}
      </div>
      <div class="column is-12">
        <div class="field is-grouped is-grouped-multiline">
          {#each term?.aliases as alias, i}
            <div class="control">
              <div class="tags has-addons">
                <a class="tag" href="#{i}">{alias.letters}</a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div class="columns is-vcentered is-multiline my-0">
      <div class="column is-9">
        <p class="title is-size-5 has-text-weight-bold">
          Explanations ({term?.explanations?.length})
        </p>
        {#if term?.explanations?.length === 0}
          <p class="subtitle is-size-6 has-text-weight-bold">No explanations for this term.</p>
        {/if}
      </div>
      <div class="column is-3">
        <a
          class="button is-light is-fullwidth is-rounded is-info is-justify-content-space-between"
          href="/term/{term.id}"
          data-sveltekit-reload
        >
          <span class="icon">
            <i class="mdi mdi-plus-box" />
          </span>
          <span>New Explanation</span>
        </a>
      </div>

      {#each term?.explanations as explanation, i}
        <div class="column is-4">
          <label class="label" for="explanation-context-${i + 1}">
            Context #{i + 1}
          </label>
          <div class="control has-icons-left">
            <input
              id="explanation-context-${i + 1}"
              name="contexts"
              class="input"
              type="text"
              disabled
              readonly
              value={explanation.context}
            />
            <span class="icon is-left">
              <i class="mdi mdi-at" />
            </span>
          </div>
        </div>
        <div class="column is-8">
          <label class="label" for="explanation-text-${i + 1}">
            Text #{i + 1}
          </label>
          <div class="field">
            <div class="control is-expanded has-icons-left">
              <input
                id="explanation-text-${i + 1}"
                name="texts"
                class="input"
                type="text"
                disabled
                readonly
                value={explanation.text}
              />
              <span class="icon is-left">
                <i class="mdi mdi-text-box" />
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>
