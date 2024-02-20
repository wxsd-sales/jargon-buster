<script lang="ts">
  export let name: string = undefined;
  export let personID: string;
  export let transcription: string;
  export let timestamp: number;
  export let terms = [];
</script>

<div class="card">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img
            src="https://api.dicebear.com/7.x/identicon/svg?seed={personID}&size=48"
            alt="avatar"
          />
        </figure>
      </div>
      <div class="media-content">
        <p class="title is-6" title={personID}>{name ?? 'Speaker ID'}</p>
        <p class="subtitle is-7">
          <span class="is-7" datetime={timestamp.toString()}>
            {new Date(timestamp).toISOString()}
          </span>
        </p>
      </div>
    </div>
    <div class="content">
      {transcription}
      <!--      <pre>{JSON.stringify(terms)}</pre>-->
      {#if terms.length > 0}
        <hr />
        <dl>
          {#each terms as term}
            <dt><b>{term.letters}</b> {term?.aliases?.map((r) => r?.letters).join(', ')}</dt>
            {#if term.explanations.length > 0}
              {#each term.explanations as explanation}
                <dd><b>{explanation?.context}</b> - {explanation?.text ?? ''}</dd>
              {/each}
            {/if}
          {/each}
        </dl>
      {/if}
    </div>
  </div>
</div>
