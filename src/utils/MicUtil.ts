const forge = require('node-forge');
export function getParameterByName(name:any, url:any) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line no-useless-escape
        const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
export function weapi(text: string) {
    const modulus =
      '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b72' +
      '5152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbd' +
      'a92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe48' +
      '75d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
    const nonce = '0CoJUm6Qyw8W8jud';
    const pubKey = '010001';
    text = JSON.stringify(text); // eslint-disable-line no-param-reassign
    const sec_key = create_secret_key(16);
    const enc_text = btoa(
      aes_encrypt(
        btoa(aes_encrypt(text, nonce, 'AES-CBC').data),
        sec_key,
        'AES-CBC'
      ).data
    );
    const enc_sec_key = rsa_encrypt(sec_key, pubKey, modulus);
    const data = {
      params: enc_text,
      encSecKey: enc_sec_key,
    };

    return data;
  }

export function create_secret_key(size: number) {
    const result = [];
    const choice = '012345679abcdef'.split('');
    for (let i = 0; i < size; i += 1) {
      const index = Math.floor(Math.random() * choice.length);
      result.push(choice[index]);
    }
    return result.join('');
}

export function rsa_encrypt(text: string, pubKey: string, modulus: string) {
    text = text.split('').reverse().join(''); // eslint-disable-line no-param-reassign
    const n = new forge.jsbn.BigInteger(modulus, 16);
    const e = new forge.jsbn.BigInteger(pubKey, 16);
    const b = new forge.jsbn.BigInteger(forge.util.bytesToHex(text), 16);
    const enc = b.modPow(e, n).toString(16).padStart(256, '0');
    return enc;
}

export function aes_encrypt(text: string, sec_key: string, algo: string) {
    const cipher = forge.cipher.createCipher(algo, sec_key);
    cipher.start({ iv: '0102030405060708' });
    cipher.update(forge.util.createBuffer(text));
    cipher.finish();

    return cipher.output;
}

export function split_array(myarray: string | any[], size: number) {
    const count = Math.ceil(myarray.length / size);
    const result = [];
    for (let i = 0; i < count; i += 1) {
      result.push(myarray.slice(i * size, (i + 1) * size));
    }
    return result;
}

export function eapi(url: any, object: any) {
    const eapiKey = 'e82ckenh8dichen8';

    const text = typeof object === 'object' ? JSON.stringify(object) : object;
    const message = `nobody${url}use${text}md5forencrypt`;
    const digest = forge.md5
      .create()
      .update(forge.util.encodeUtf8(message))
      .digest()
      .toHex();
    const data = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`;

    return {
      params: aes_encrypt(data, eapiKey, 'AES-ECB').toHex().toUpperCase(),
    };
}