const Codex = artifacts.require('./Codex.sol');
//const hashUtility = require('../utils/hash');

contract('Codex', accounts => {
    it('...should have three Chimalli deployed', async() => {
        const CodexInstance = await Codex.deployed();

        const codexLength = await CodexInstance.getCodexLength.call();
        assert.equal(codexLength.toString(), 3, 'Codex was deployed without 3 Chimallis');
    })
})