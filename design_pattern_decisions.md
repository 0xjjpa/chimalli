# Architecture

## Storage

At first, we decided having all logic for writing, spawning and destroying Chimallis within the same contract. However, this makes upgrading or blocking contracts a bit of an issue, since we would have no easy way to keep track of everything through each instance. Otherwise, we would have to keep storing information of new contracts in each new contract, which seemed a bit expensive.

Another alternative was to always have one Contract create a new one, and rely all storage operations to the new one. If needed previous information, we could had reviewed the previous contract. The problem with this solution, is that although we could had created a chain of relationships between each contract (i.e. Contract1 created Contract 2, Contract 2 created Contract 3, and so on and so forth), as soon as we generate `n` contracts, we would be faced with iterating `O(n)` operations against them, which can be pretty slow.

The final and most optimal solution was to have a Contract Manager, in this case, our Codex. Since multiple Codex can be created per Public Key, we can be the owner of many, but tie our secret to individual Chimallis deployed over the network. To optimize storage and management, we would only allow a Chimalli to hold **one** piece of a secret. We might want the same person to store another piece, which would be as easy as deploy another Chimalli. If we wanted to block that person, we could do so with our Codex.

## Upgradeability

Since the idea is to create a decentralised backup, the idea was that we could rely in isolated contracts that could be called when needed. However, what happens if we detect an issue in one of these contracts? How could we destroy or block it from the contract itself, without having access to it directly.

In thise case, we follow the same logic with the Codex, the Codex can perform admin operations against each of the Chimalli in case the Codex owner is afraid individuals storing the secrets had been compromised in any way. If we needed to upgrade a Chimalli, we would just need to restore a secret and redeploy a new Chimalli.