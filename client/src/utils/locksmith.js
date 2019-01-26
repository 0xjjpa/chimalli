import generator from 'keybase-generator';

class Locksmith {

  constructor() {
    this.EMPTY_KEYS = { privateKey: null, publicKey: null }
    this.GENERATING_KEYS_MESSAGE = 'Generating... (takes about 1-2 minutes)'
    this.GENERATING_KEYS_IN_PROGRESS = 'Keys already generating, please wait...'
    this.DEFAULT_PASSWORD = 'password'
    this.DEFAULT_USERID = 'Jose Aguinaga <me@jjperezaguinaga.com>'
  }
  
  retrieveKeys() {
    const privateKey = localStorage.getItem('privateKey')
    const publicKey = localStorage.getItem('publicKey')
    return privateKey && publicKey ? { publicKey, privateKey } : this.EMPTY_KEYS;
  }

  async generateKeys() {
    const password = this.DEFAULT_PASSWORD;
    const userId = this.DEFAULT_USERID;

    const keypair = await generator(userId, password);
    localStorage.setItem('publicKey', keypair.publicKey);
    localStorage.setItem('privateKey', keypair.privateKey);
    return keypair;
  }

}

export default new Locksmith();
