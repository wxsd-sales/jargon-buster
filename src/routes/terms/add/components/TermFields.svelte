<script lang="ts">
  export let letters: string | undefined = undefined;
  export let aliases: (undefined | string)[] = [undefined];
  export let explanations: { context?: string; text?: string }[] = [
    {
      context: undefined,
      text: undefined
    }
  ];

  function addExplanationField() {
    explanations.push({ context: undefined, text: undefined });
    explanations = explanations;
  }

  function removeExplanationField(i: number) {
    explanations.splice(i, 1);
    explanations = explanations;
  }

  function addAliasField() {
    aliases.push(undefined);
    aliases = aliases;
  }

  function removeAliasField(i: number) {
    aliases.splice(i, 1);
    aliases = aliases;
  }
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="title">Add a New Term</h2>
    <h3 class="subtitle">
      A "Term" is a word, phrase, etc. used to describe a thing or to express a concept.
    </h3>
  </div>
  <div class="column is-full">
    <label class="label" for="letters">
      Term<sup class="has-text-danger" title="required">*</sup>
    </label>
    <div class="control has-icons-left">
      <input
        name="letters"
        id="letters"
        class="input"
        type="text"
        minlength="2"
        maxlength="64"
        placeholder="Artificial Intelligence"
        required
        bind:value={letters}
      />
      <span class="icon is-left">
        <i class="mdi mdi-form-textbox" />
      </span>
    </div>
    <div class="help">
      <p>The word, phrase, etc. that you would like to add</p>
    </div>
  </div>

  {#each aliases as alias, i}
    <div class="column is-12">
      <label class="label" for="alias-${i + 1}">
        Alias #{i + 1}
      </label>
      <div class="field is-grouped">
        <div class="control is-expanded has-icons-left">
          <input id="alias-${i + 1}" name="aliases" class="input" type="text" bind:value={alias} />
          <span class="icon is-left">
            <i class="mdi mdi-text-box" />
          </span>

          <p class="help">
            Provide alias for the term, this could be an abbreviation, acronym, initialism and so on
          </p>
        </div>
        <div class="control">
          <button
            class="button is-danger is-light is-rounded"
            type="button"
            disabled={aliases.length === 1}
            on:click={() => removeAliasField(i)}
          >
            <span class="icon">
              <i class="mdi mdi-delete" />
            </span>
          </button>
        </div>
      </div>
    </div>
  {/each}
  <div class="column is-5 is-offset-7">
    <button
      class="button is-fullwidth is-info is-light is-rounded is-justify-content-space-between"
      type="button"
      on:click={addAliasField}
    >
      <span class="icon">
        <i class="mdi mdi-plus" />
      </span>
      <span>Add Another Alias</span>
    </button>
  </div>

  {#each explanations as explanation, i}
    <div class="column is-12">
      <label class="label" for="explanation-context-${i + 1}">
        Context #{i + 1}
        <sup
          class="has-text-danger"
          title="required"
          class:is-invisible={!explanation.context?.length}
        >
          *
        </sup>
      </label>
      <div class="field is-grouped">
        <div class="control is-expanded has-icons-left">
          <input
            id="explanation-context-${i + 1}"
            name="contexts"
            class="input"
            type="text"
            required={!!explanation.text}
            bind:value={explanation.context}
          />
          <span class="icon is-left">
            <i class="mdi mdi-text-box" />
          </span>

          <p class="help">Provide context for the explanation</p>
        </div>
        <div class="control">
          <button
            class="button is-danger is-light is-rounded"
            type="button"
            disabled={explanations.length === 1}
            on:click={() => removeExplanationField(i)}
          >
            <span class="icon">
              <i class="mdi mdi-delete" />
            </span>
          </button>
        </div>
      </div>
    </div>
    <div class="column is-12 pt-0">
      <label class="label" for="explanation-text-${i + 1}">
        Text #{i + 1}
        <sup
          class="has-text-danger"
          title="required"
          class:is-invisible={!explanation.text?.length}
        >
          *
        </sup>
      </label>
      <div class="control">
        <textarea
          id="explanation-text-${i + 1}"
          name="texts"
          class="textarea"
          rows="9"
          maxlength="1024"
          required={!!explanation.context}
          bind:value={explanation.text}
        />
      </div>
      <p class="help">Provide text for the explanation in context</p>
    </div>
  {/each}
  <div class="column is-5 is-offset-7">
    <button
      class="button is-fullwidth is-info is-light is-rounded is-justify-content-space-between"
      type="button"
      on:click={addExplanationField}
    >
      <span class="icon">
        <i class="mdi mdi-plus" />
      </span>
      <span>Add Another Explanation</span>
    </button>
  </div>
</div>
