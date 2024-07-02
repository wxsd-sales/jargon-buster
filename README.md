# Jargon Buster

**Get meaning of jargons used within your organization during Webex meetings in real-time.**

This is a proof-of-concept application that shows the meaning of terms in real-time during Webex meetings. It helps ensure that all participants understand organization-specific jargon, enhancing communication and reducing misunderstandings.

<p align="center">
   <a href="https://app.vidcast.io/share/3cfe1a02-1036-4fd8-9d44-75a6476a6af3" target="_blank">
       <img src="https://github.com/wxsd-sales/jargon-buster/assets/6129517/04649342-db70-4d20-8a3a-56ddac7164f8" alt="jargon-buster-demo"/>
    </a>
</p>

<!-- ⛔️ MD-MAGIC-EXAMPLE:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>Table of Contents (click to expand)</summary>

- [Overview](#overview)
- [Setup](#setup)
- [Demo](#demo)
- [Disclaimer](#disclaimer)
- [License](#license)
- [Support](#support)

</details>
<!-- ⛔️ MD-MAGIC-EXAMPLE:END -->

## Overview

This application is designed to improve communication in your organization by providing real-time meaning(s) of specific terms during Webex meetings. It has two main components: an administrative portal and a Webex Embedded App.

The administrative portal allows organization admins to manage a dictionary of company-specific terms and their meanings. Admins can upload terms individually or via a CSV file, creating a comprehensive dictionary.

During a Webex meeting, the Jargon Buster Embedded App listens to the conversation through the Webex SDK's real-time transcription feature. It then applies Natural Language Processing (NLP) techniques to analyze the transcript and match terms against the stored dictionary. When a term is detected, its meaning(s) are displayed in real-time.

## Setup

These instructions assume that you have:

- Ensured the system is accessible via the internet through a designated domain name (e.g., https://www.example.com) and uses HTTPS. You may use a reverse-proxy such as [Ngrok](https://ngrok.com/) or Cloudflare Tunnel to achieve this.
- Administrator access to an Org's Webex Control Hub and have enabled [Webex Assistant on an Org level](https://help.webex.com/en-us/article/nwl9xii/Enable-Webex-Assistant-for-Webex-Meetings).
- [Docker installed](https://docs.docker.com/engine/install/) and running on a Windows (via WSL2), macOS, or Linux machine.

Open a new terminal window and follow the instructions below to setup the project locally for development/demo.

1. Clone this repository and change directory:

   ```
   git clone https://github.com/wxsd-sales/jargon-buster && cd jargon-buster
   ```

2. Copy `.env.example` file as `.env`:

   ```
   cp .env.example .env
   ```

3. Review and follow the [Registering your Integration on Webex](https://developer.webex.com/docs/integrations#registering-your-integration) guide.
  
   - Your registration must have the following [Webex REST API scopes](https://developer.webex.com/docs/integrations#scopes):
     | Scope | Description |
     |---------------------------|----------------------------------------------------------------------------------|
     | spark:all | Full access to Webex Teams services |
     | spark:kms | Permission to interact with encrypted content |
     | meeting:schedules_read | Read access to meeting schedules |
     | meeting:participants_read | Read access to meeting participants |
     | meeting:controls_read | Read access to meeting controls |
     | meeting:preferences_read | Read access to meeting preferences |
     | meeting:transcripts_read | Read access to meeting transcripts |
   - Use this Redirect URI `https://www.example.com/auth/webex/callback` (replace `www.example.com` with your publicly accessible domain).
   - Take note of your Client ID and Client Secret. Assign these values to the `WEBEX_AUTHORIZATION_CODE_CLIENT_ID` and `WEBEX_AUTHORIZATION_CODE_CLIENT_SECRET` environment variables within the `.env` file respectively.

4. Review and follow the [Creating an Embedded App in the Developer Portal on Webex](https://developer.webex.com/docs/embedded-apps-guide#creating-an-embedded-app-in-the-developer-portal) guide.

   - Under "Where does your app Work" section, select "Meeting" and optionally "Sidebar".
   - Under "Valid domains", make sure to add the domain where your app will be accessible from (e.g., www.example.com).
   - Under "Start page URL", use the 'lookup' endpoint (e.g., https://www.example.com/lookup).
   - Under "Sidebar behavior" Check the "Always-on support" checkbox if you chose "Sidebar" earlier.
   - Once done, request admin approval and approve it by navigating to the https://admin.webex.com/apps/embeddedApps page.

5. Set other environment variables as needed in the `.env` file.

6. Start the application using:
   ```
   docker-compose up
   ```

Navigate to http://www.example.com (i.e., the public domain for your app) in your browser to manage and add/upload jargons. Lastly, schedule a Webex meeting in the desktop client and open the embedded app that you just created and approved. Use some of the jargons that you added/uploaded earlier during the meeting.

## Demo

A video where I demo this PoC is available on Vidcast — [https://app.vidcast.io/share/3cfe1a02-1036-4fd8-9d44-75a6476a6af3](https://app.vidcast.io/share/3cfe1a02-1036-4fd8-9d44-75a6476a6af3).

## Disclaimer

Everything included in this repository is for demo and Proof of Concept (PoC) purposes only. Use of the PoC is solely at your own risk. This project may contain links to external content, which we do not warrant, endorse, or assume liability for. This project is for Cisco Webex use-case, but is not official Cisco Webex branded project.

## License

[MIT](./LICENSE)

## Support

Please reach out to the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?cc=ashessin@cisco.com&subject=Jargon%20Buster) or contact me on Webex (ashessin@cisco.com).
