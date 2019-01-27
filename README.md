# 🛡 Chimalli
An experiment for showcasing how decentralised backups can be made using PGP encryption and Shamir's Secret Sharing algorithm on top of the Ethereum network.

## Goal

The goal of the application is to be able to store and restore small pieces of secrets in distributed instances of small contracts called "Chimallis". Each Chimalli can store up to 1 secret per individual, and has a "Keeper", a person that can send the secret back. The idea is
that you can rely in other people to store your split secret so when you need it back, you can ask them through a Chimalli.

In order to keep registry of all Chimallis, there's a registry called "Codex", which contains the information on how to encrypt the secrets for each Chimalli. Since all information is public in the Ethereum network, we need to rely in End-to-end encryption through PGP keys that
can encrypt and decrypt the content of the secrets before sending those forward or back.

## Architecture

Chimalli is made by a few individual pieces of technology and separate components in order to work.

### Shamir Secret Sharing Algorithm

Chimalli uses <a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing" target="_blank">Shamir's Secret Sharing (SSS)</a> algorithm to safely split a known secret into <b>unreveleaing pieces</b>, that when put together return the content of the original secret. SSS works by providing a <b>threshold</b> of required pieces and the total of pieces that the secret will be split of.

## Public Key Encryption

Since we want to store our pieces safely, Chimalli uses <a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Public-key_cryptography" target="_blank">public-key</a> cryptography to first encrypt each of these pieces. We'll then store these encrypted pieces our Chimallis and manage them through the master contract registry, Codex.

## Codex Smart Contract

Our Codex is a Smart Contract on top of the Ethereum Network that helps us manage small Chimalli instances. Each Chimalli
can store an encrypted secret from our side in the form of an IPFS Hash. Each Chimalli is tied to a specific "Keeper", a
known friend we can request the encrypted secret from. To create a chimalli, you need to provide an address that will be
the "Keeper" of that secret. The "Keeper" will require to authorize requests from you to give your encrypted secret piece back.

Furthermore, our Codex Smart Contract allows us to perform administrative actions against each Chimalli in order to upgrade them
or stop them from retrieving secrets if we feel one of our Keepers had been compromised.

## Requirements

This project relies in [Node 8.x](https://nodejs.org/en/) > and [Npm 6.x](https://www.npmjs.com/) in the backend, and [Metamask] to interact with the actual application. Make sure to have those within your system or install an environment through [Vagrant](https://www.vagrantup.com/) or [Docker](https://www.docker.com/) that contains this software. Alternatively, you can use [nvm](https://github.com/creationix/nvm) to install node.js in your environment.

## Local setup

1. Install all dependencies with npm. `setup` will download all dependencies for both the Ethereum backend and frontend. The process might take a few minutes, depending on your computer and internet connection.

`npm run setup`

1. After everything is installed, you need to run a `ganache` local instance to deploy our smart contracts into your environment. The following command will need to be done in a separate terminal to keep it running. If you have already a ganache instance running, you can ignore this step.

`npm run blockchain`

1. In a separate tab, compile and deploy our sample contracts. This process can be done individually through `truffle compile && truffle migrate`, or you can just run the following command to do both.

`npm run build:backend`

If you have any issues, you can always do `npm run build:backend-reset`, which will trigger a `truffle migrate --reset` instead of a normal `truffle migrate`.

1. You should had seen a bunch of commands in your `ganache` console. In another terminal, we’ll run our frontend to start interacting with our application.

`npm run start:app`

This command will open your browser at `http://localhost:3000`, but the application is not ready to work with yet. To do so, follow the next step.

1. To interact with the application, you need to have Metamask installed and connected to your now running local instance. To do so, install [Metamask](https://metamask.io/), logout from your current account and import the following one, used to kickstart the
local instance. Select `Import using account seed phrase` and use the following one.

`own install ladder notice repair mother wing shine allow mimic lazy bike`

Afterwards, change the setting to connect to `Custom RPC` and in `Settings`, under `New Network`, pick `http://127.0.0.1:7545`. You’ll see it working by seeing the balance of your first account be 100 ETH.

1. With your account imported properly, navigate to `http://localhost:3000` and see the landing screen of Chimalli. You’ll know it is working by scrolling down to the section "Distributed Codex" and seeing your account as "Keeper". You can now create your first Chimalli and start storing secrets.

## Tests

Our tests cover the following scenarios:

1. As a user, I can create chimallis and perform read and write operations against them.
1. As a user, I can create codex, and manage chimallis through it in order to perform operations against them.
1. As a user, I can store encrypted secrets into a chimalli.
1. As a user, I can request from the owner of the chimalli my encrypted secret.
1. As the codex owner, I can destroy or stop a chimalli from working if something goes wrong.

In short, we want to cover the most common scenarios locally, ensuring that we can make the application work both locally from a test perspective, as well as through Metamask, using mocked responses and previously generated keys.

1. To run the tests, make sure to first have ran `npm run blockchain` in a separate tab. Afterwards, you can run our tests with the following command.

`npm run test`.

## Inspiration

Chimalli comes from the Aztec's language Nahuatl which means "Shield". The Chimalli was the traditional defensive armament of the indigenous states of Mesoamerica. These shields varied in design and purpose. The Chimali was also used while wearing special headgear. You can learn more about Chimallis in its [wikipedia entry page](https://en.wikipedia.org/wiki/Ch%C4%ABmalli)