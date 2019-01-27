# Common Attacks

Since there's no ether transfer between the contracts, there’s not much room from attack from a Force Sending perspective. There are ways where one can track each of the owners of a split secret based on the transactions, but since everything was previously encrypted end-to-end, there's not much use with that information, which is even public on an IPFS Hash.

The biggest consideration was considering the fixed size of values for hashes. Although `string` could had been used, we preferred to stick to `bytes32` to avoid any over-use of memory or any memory related attacks.