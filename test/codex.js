const Codex = artifacts.require('./Codex.sol');
//const hashUtility = require('../utils/hash');

contract('Codex', accounts => {
    it('...should have no Chimalli deployed', async() => {
        const CodexInstance = await Codex.deployed();

        const codexLength = await CodexInstance.getCodexLength.call(accounts[0]);
        assert.equal(codexLength.toString(), 0, 'Codex was deployed with some Chimallis');
    })

    it('...should create three Chimalli', async() => {
        const CodexInstance = await Codex.deployed();

        const chimalli1 = await CodexInstance.createChimalli(accounts[1]);
        const chimalli2 = await CodexInstance.createChimalli(accounts[2]);
        const chimalli3 = await CodexInstance.createChimalli(accounts[3]);

        const codexLength = await CodexInstance.getCodexLength.call(accounts[0]);
        assert.equal(codexLength.toString(), 3, 'Codex didn‘t create 3 Chimallis');
    })
})