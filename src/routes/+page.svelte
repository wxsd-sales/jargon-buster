<script>
  import { signIn } from '@auth/sveltekit/client';
  import { page } from '$app/stores';

  const callbackUrl = $page.url.searchParams.get('callbackUrl');
</script>

<section id="login" class="container p-4 is-align-items-center">
  <div class="columns is-multiline">
    <div class="column is-12 is-hidden">
      <input
        class="input is-rounded is-medium is-fullwidth"
        name="provider"
        value="webex"
        readonly
        disabled
      />
    </div>
    <div class="column is-12">
      <article class="message is-info is-medium">
        <div class="message-header is-hidden" />
        <div class="message-body content">
          <p>
            Enhance your knowledge on terms or words found in or relating to a specific subject,
            text, or dialect, with explanations within your organization.
          </p>
        </div>
      </article>
      <article class="message is-danger is-medium">
        <div class="message-header is-hidden" />
        <div class="message-body content">
          <p>
            Before continuing, please note that this application along with the terms and
            definitions are still in beta and may change over time.
          </p>
          <ul>
            <li>
              Your org's Webex Control Hub Administrator is the best resource to request changes.
            </li>
            <li>Only org administrators can add new terms and definitions.</li>
            <li>
              Other org users can request new terms and definitions to be added in; but need
              approval from an org administrator.
            </li>
          </ul>
        </div>
      </article>
    </div>
    <!--    <div v-if="!!Object.keys(errors).length" class="column is-12">-->
    <!--      <article class="message is-danger is-medium">-->
    <!--        <div class="message-header">-->
    <!--          <p>Error</p>-->
    <!--        </div>-->
    <!--        <div class="message-body content">-->
    <!--          <ul class="mt-0">-->
    <!--            <li v-for="(error, key) in errors" :key="key">-->
    <!--              {{ error }}-->
    <!--            </li>-->
    <!--          </ul>-->
    <!--        </div>-->
    <!--      </article>-->
    <!--    </div>-->
    <div class="column is-12">
      <button
        class="button is-rounded is-medium is-fullwidth is-primary has-text-weight-bold"
        type="button"
        on:click={() => signIn('webex', callbackUrl != null ? { callbackUrl } : undefined)}
      >
        <span class="icon">
          <i class="mdi mdi-login" />
        </span>
        <span>Login with Webex</span>
      </button>
    </div>
  </div>
</section>
