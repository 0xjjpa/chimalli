# 🛡 Chimalli
An experiment for showcasing how decentralised backups can be made using PGP encryption and Shamir's Secret Sharing algorithm on top of the Ethereum network.

# Requirements

This project relies in [Node 8.x](https://nodejs.org/en/) > and [Npm 6.x](https://www.npmjs.com/) in the backend, and [Metamask] to interact with the actual application. Make sure to have those within your system or install an environment through [Vagrant](https://www.vagrantup.com/) or [Docker](https://www.docker.com/) that contains this software. Alternatively, you can use [nvm](https://github.com/creationix/nvm) to install node.js in your environment.

# Local setup

1. Install all dependencies with npm. `setup` will download all dependencies for both the Ethereum backend and frontend. The process might take a few minutes, depending on your computer and internet connection.

`npm run setup`

1. After everything is installed, you need to run a `ganache` local instance to deploy our smart contracts into your environment. The following command will need to be done in a separate terminal to keep it running. If you have already a ganache instance running, you can ignore this step.

`npm run blockchain`

1. In a separate tab, compile and deploy our sample contracts. This process can be done individually through `truffle`, or you can just run the following command to do both.

`npm run build:backend`

1. You should had seen a bunch of commands in your `ganache` console. In another terminal, we’ll run our frontend to start interacting with our application.

`npm run start:app`

This command will open your browser at `http://localhost:3000`, but the application is not ready to work with yet. To do so, follow the next step.

1. To interact with the application, you need to have Metamask installed and connected to your now running local instance. To do so, install [Metamask](https://metamask.io/), logout from your current account and import the following one, used to kickstart the
local instance. Select `Import using account seed phrase` and use the following one.

`own install ladder notice repair mother wing shine allow mimic lazy bike`

Afterwards, change the setting to connect to `Custom RPC` and in `Settings`, under `New Network`, pick `http://127.0.0.1:7545`. You’ll see it working by seeing the balance of your first account be 100 ETH.

1. With your account imported properly, navigate to `http://localhost:3000` and see the landing screen of Chimalli. You’ll know it is working by scrolling down to the section "Distributed Codex" and seeing your account as "Keeper". You can now create your first Chimalli and start storing secrets.

## Tests

1. To run the tests, make sure to first have ran `npm run blockchain` in a separate tab and `npm run build:backend`. Afterwards, you can run our tests with the following command.

`npm run test`.

## Inspiration

Chimalli comes from the Aztec's language Nahuatl which means "Shield". The Chimalli was the traditional defensive armament of the indigenous states of Mesoamerica. These shields varied in design and purpose. The Chimali was also used while wearing special headgear. You can learn more about Chimallis in its [wikipedia entry page](https://en.wikipedia.org/wiki/Ch%C4%ABmalli)