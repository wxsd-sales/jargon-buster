<!-- Scripts -->
<script lang="ts">
  import '../app.scss';
  import { signIn, signOut } from '@auth/sveltekit/client';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  const email = $page.data?.session?.user?.email;
  const callbackUrl = $page.url.searchParams.get('callbackUrl');
  const isNavVisible = $page.url.pathname.startsWith('/public') === false;

  onMount(() => {
    // if this functions returns it indicates javascript is enabled on the browser
    function isJavascriptEnabled() {
      return true;
    }

    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
    function hasCookiesEnabled() {
      // Quick test if browser has cookieEnabled host property
      if (navigator.cookieEnabled) return true;
      // Create cookie
      document.cookie = 'cookieTest=1';
      const isCookieSet = document.cookie.indexOf('cookieTest=') !== -1;
      // Delete cookie
      document.cookie = 'cookieTest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
      return isCookieSet;
    }

    function toggleMainMenu(event: Event) {
      const eventTarget = event.target as HTMLElement | null;
      const datasetName = eventTarget?.dataset.target;
      const menuElement = datasetName != null ? document.getElementById(datasetName) : null;
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      eventTarget?.classList.toggle('is-active');
      menuElement?.classList.toggle('is-active');
    }

    // Add event listener to any navbar burgers
    document.getElementById('main-burger')?.addEventListener('click', toggleMainMenu);

    // Show the app if javascript is enabled
    if (isJavascriptEnabled() === true) {
      document.getElementById('app')?.classList.remove('is-invisible');
    }

    // Log to console and hide the app if cookies are not enabled
    if (hasCookiesEnabled() === false) {
      console.error('Cookies are disabled.');
      document.getElementById('cookies-warning')?.classList.remove('is-hidden');
      document.getElementById('app')?.classList.add('is-invisible');
    }

    if (isNavVisible) {
      document.body.classList.add('has-navbar-fixed-top');
    }
  });
</script>

<svelte:head>
  <title>Jargon Buster (beta)</title>
  {#if $page.url.pathname.startsWith('/lookup') || $page.url.pathname.startsWith('/public')}
    <script crossorigin="anonymous" src="https://unpkg.com/webex@^2/umd/webex.min.js"></script>
    <script
      src="https://unpkg.com/@webex/embedded-app-sdk@2/dist/iife/bundle.min.js"
      defer
    ></script>
  {/if}
</svelte:head>

<noscript id="javascript-warning" class="hero is-danger is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        <span class="icon">
          <i class="mdi mdi-alert" />
        </span>
        <span>Javascript is disabled.</span>
      </h1>
      <h2 class="subtitle">
        This site requires Javascript for its core functionality. Please enable Javascript in
        browser settings and reload this page.
      </h2>
    </div>
  </div>
</noscript>

<section id="cookies-warning" class="hero is-danger is-bold is-hidden">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">
        <span class="icon">
          <i class="mdi mdi-alert" />
        </span>
        <span>Cookies are disabled.</span>
      </h1>
      <h2 class="subtitle">
        This site requires cookies for its core functionality. Please enable cookies in browser
        settings and reload this page.
      </h2>
    </div>
  </div>
</section>

{#if isNavVisible}
  {#if email?.endsWith('wbx.ai')}
    <section class="hero is-small is-warning">
      <div class="hero-body px-4">
        <div class="container">
          <h2 class="subtitle">
            You have logged in using your {email} Sandbox account.
          </h2>
        </div>
      </div>
    </section>
  {/if}
  <nav class="navbar is-fixed-top has-shadow" aria-label="main navigation">
    <div class="navbar-brand">
      <a data-sveltekit-reload class="navbar-item" href="/">
        <figure class="image is-32x32 mr-2">
          <img src="/images/favicons/favicon.svg" alt="WXSD Labs" />
        </figure>
        <strong>Jargon Buster <sup class="has-text-danger">(beta)</sup></strong>
      </a>

      <button
        id="main-burger"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        {#if email}
          <a class="navbar-item" class:is-active={$page.url.pathname === '/terms'} href="/terms">
            Terms
          </a>
        {/if}
      </div>

      <div class="navbar-end">
        {#if email == null}
          <div class="navbar-item">
            <div class="buttons">
              <button
                class="button is-fullwidth is-rounded is-primary is-light has-text-weight-bold"
                on:click={() => signIn('webex', callbackUrl != null ? { callbackUrl } : undefined)}
              >
                <span class="icon">
                  <i class="mdi mdi-login" />
                </span>
                <span>Log in</span>
              </button>
            </div>
          </div>
        {:else}
          <div class="navbar-item has-dropdown is-hoverable">
            <p class="navbar-link has-text-weight-bold">{email}</p>
            <div class="navbar-dropdown is-right">
              <div class="navbar-item">
                <button
                  class="button is-fullwidth is-rounded is-danger is-light has-text-weight-bold"
                  on:click={() => signOut({ callbackUrl: '/' })}
                >
                  <span class="icon">
                    <i class="mdi mdi-logout" />
                  </span>
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </nav>
{/if}

<main id="app" class="is-invisible" class:mt-6={isNavVisible} class:mb-6={isNavVisible}>
  <slot />
</main>

{#if isNavVisible}
  <footer class="footer has-background-grey-lighter">
    <div class="content has-text-centered">
      <p>
        <strong>Jargon Buster</strong> by
        <a href="https://github.com/wxsd-sales" target="_blank" referrerpolicy="no-referrer"
          >WXSD-Sales</a
        >.<br />
        &copy; {new Date().getUTCFullYear()} Webex by Cisco
      </p>
    </div>
  </footer>
{/if}

<!--<style lang="scss" global>-->
<!--  @use '../app.scss';-->
<!--</style>-->
