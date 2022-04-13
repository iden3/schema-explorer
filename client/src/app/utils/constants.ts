export const CONSTANTS = Object.freeze({
  // CONTRACT_ADDRESS: '0x107877D50B03e7131F92236C7187c375b8919ff7',
  CONTRACT_ADDRESS: '0xb2C1BEf0Dac835A43fBeC605d7CE04A4BA6CD499',
  ABI_JSON: [
    {
      inputs: [
        {
          internalType: 'string',
          name: 'id',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'credentialType',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'url',
          type: 'string',
        },
        {
          internalType: 'string',
          name: 'desc',
          type: 'string',
        },
      ],
      name: 'save',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getIds',
      outputs: [
        {
          internalType: 'string[]',
          name: '',
          type: 'string[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'id',
          type: 'string',
        },
      ],
      name: 'getSchemaById',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
  USE_METAMASK: 'USE_METAMASK',
});
