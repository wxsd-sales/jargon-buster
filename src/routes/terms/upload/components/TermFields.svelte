<script lang="ts">
  import * as Papa from 'papaparse';

  let files: FileList;
  let parsed: [];

  function parseFile(file?: File) {
    file &&
      Papa.parse(file, {
        header: true,
        complete: (result) => (parsed = result.data.filter((r) => r['TERM']?.trim().length > 0))
      });
  }
</script>

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="subtitle">Step #1</h2>
    <h2 class="title">Download CSV Template</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      Download the template by clicking <a href="#download-button">"Download"</a> button below. Each
      term is uniquely identified by the <code>TERM</code> column. Each term row can have one
      <code>ALIAS</code>, and a pair of <code>EXPLANATION_CONTEXT</code>,
      <code>EXPLANATION_TEXT</code>.
    </p>
    <p>It is strongly advised that you view this file in a program like Excel.</p>
  </div>
  <div class="column is-two-fifth is-offset-three-fifths">
    <a
      id="download-button"
      class="button is-fullwidth is-rounded is-primary is-light is-justify-content-space-between"
      href="/csv_template.csv"
    >
      <span class="icon">
        <i class="mdi mdi-download"></i>
      </span>
      <span>Download (csv_template.csv)</span>
    </a>
  </div>
</div>

<hr />

<div class="columns is-multiline">
  <div class="column is-full">
    <h2 class="subtitle">Step #2</h2>
    <h2 class="title">Upload CSV File</h2>
  </div>
  <div class="column is-full content mb-0">
    <p>
      Edit the downloaded CSV template to add new terms an then upload it here. The maximum number
      of terms that you can add at at time is 100.
    </p>
    <p>To add more than 100 terms via. uplaod, just repeat the process.</p>
  </div>
  <div class="column is-full">
    <div class="file has-name is-right is-fullwidth">
      <label class="file-label">
        <input
          class="file-input"
          type="file"
          name="resume"
          accept="text/csv"
          required
          bind:files
          on:change={() => parseFile(files?.[0])}
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="mdi mdi-file-delimited"></i>
          </span>
          <span class="file-label">Choose file…</span>
        </span>
        <span class="file-name">{files?.[0].name ?? ''}</span>
      </label>
    </div>
  </div>
  <div class="column is-full">
    <label class="label" for="explanation">Preview (Parsed JSON)</label>
    <textarea
      name="parsed"
      id="parsed"
      class="textarea is-family-monospace"
      maxlength="256"
      rows="25"
      readonly>{parsed != null ? JSON.stringify(parsed, null, 2) : ''}</textarea
    >
    <div class="help">
      <p>The parsed CSV file</p>
    </div>
  </div>
</div>
