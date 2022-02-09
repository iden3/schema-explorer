export const CONSTANTS = Object.freeze({
  SEARCH_BY_NAME: 'searchBy=name',
  SEARCH_BY_HASH: 'searchBy=hash',
  GET_HASH: 'hash=true',
  ABI_JSON: [
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "getBytesByHash",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "getBytesByName",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "getHashByName",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "schemaName",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "schemaBody",
				"type": "bytes"
			}
		],
		"name": "save",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
})
