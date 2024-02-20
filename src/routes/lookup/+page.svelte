<script lang="ts">
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { EAF_CONFIG, SDK_CONFIG } from '$lib/constants/webex';
  import Card from './components/Card.svelte';

  export let data: PageData;

  const { accessToken, glossary = [] } = data;

  let transcripts: any[] = [];

  function log(type: string, data: unknown) {
    const details = document.getElementById('console') as HTMLDetailsElement;
    const pre = document.createElement('pre');
    const kbd = document.createElement('kbd');
    const kbdText = document.createTextNode(type);
    const payload = document.createTextNode(`${JSON.stringify(data, null, 2)}`);
    kbd.append(kbdText);
    pre.append(payload);
    details.appendChild(kbd);
    details.appendChild(pre);
    details.appendChild(document.createElement('br'));
  }

  function getMeetingSipAddress(accessToken: string, id: string) {
    return fetch('https://webexapis.com/v1/meetings/' + id, {
      headers: { authorization: 'Bearer ' + accessToken }
    })
      .then((r) => r.json())
      .then((r) => r.sipAddress);
  }

  function bindMeetingEvents(meeting: any) {
    meeting.on('meeting:receiveTranscription:started', (payload: any) => {
      // log('payload', payload);

      if (payload?.type === 'transcript_final_result') {
        const name = meeting.members.membersCollection.members[payload.personID].name;
        const tokenized = payload.transcription.toLowerCase()?.replace(/[.,]/g, '')?.split(' ');
        const terms = glossary.filter((r) =>
          r?.aliases.map((r) => r?.letters.toLowerCase()).every((r) => tokenized.includes(r))
        );
        const newPayload = { terms, name, ...payload };
        transcripts.push(newPayload);
        transcripts = transcripts;
      }
    });

    return meeting;
  }

  onMount(async () => {
    let app =
      browser && window?.webex?.Application ? new window.webex.Application(EAF_CONFIG) : undefined;
    let webex =
      browser && accessToken
        ? Webex?.init({ config: SDK_CONFIG, credentials: { access_token: accessToken } })
        : undefined;

    webex.people.get('me').then((r: unknown) => console.log(r));

    const meetingId = await app
      .onReady()
      .then(() => app.context.getMeeting())
      .then((r: any) => r.id);

    if (accessToken != null && meetingId != null && webex != null && !webex?.meetings.registered) {
      const meetingSipAddress = await getMeetingSipAddress(accessToken, meetingId);

      await webex?.meetings
        .register()
        .then(() => webex.meetings.syncMeetings())
        .then(() => webex.meetings.create(meetingSipAddress))
        .then((r: any) => bindMeetingEvents(r))
        .then((r: any) => r.join({ receiveTranscription: true }));
    }

    return () => (app = webex = null);
  });
</script>

<section id="login" class="container p-4 is-align-items-center">
  <div class="columns is-multiline">
    <div class="column is-full">
      <h1 class="title">Jargon Buster</h1>
    </div>
    <div class="column is-full">
      <p>
        This page was shows realtime transcripts of your current Webex meeting with help on
        company-wide jargon.
      </p>
    </div>
    <div class="column is-full">
      <details id="console">
        <summary>Logs</summary>
        <br />
      </details>
    </div>
    {#each transcripts as transcript}
      <div class="column is-full" id="chat">
        <Card {...transcript} />
      </div>
    {/each}
  </div>
</section>
