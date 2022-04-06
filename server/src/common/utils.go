package common

import (
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/pkg/errors"
	"math/big"
	"path/filepath"
	"strings"
)

var errorPublicKeyCasting error = errors.New("error casting public key to ECDSA")

func CallContract(ctx context.Context, rpcURL, cAddress string, payload []byte) ([]byte, error) {
	cl, err := ethclient.DialContext(ctx, rpcURL)
	if err != nil {
		return nil, err
	}

	addr := common.HexToAddress(cAddress)

	res, err := cl.CallContract(ctx, ethereum.CallMsg{
		To:   &addr,
		Data: payload,
	}, nil)

	if err != nil {
		return nil, err
	}

	return res, nil
}

//
//func CallTransaction(ctx context.Context, privateKeyHex, rpcURL, cAddress string, payload []byte) (*types.Transaction, error) {
//	cl, err := ethclient.DialContext(ctx, rpcURL)
//	if err != nil {
//		return nil, err
//	}
//
//	privateKey, err := crypto.HexToECDSA(privateKeyHex)
//
//	if err != nil {
//		return nil, err
//	}
//
//	publicKey := privateKey.Public()
//	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
//	if !ok {
//		return nil, errorPublicKeyCasting
//	}
//
//	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
//
//	nonce, err := cl.PendingNonceAt(ctx, fromAddress)
//	if err != nil {
//		return nil, err
//	}
//
//	gasPrice, err := cl.SuggestGasPrice(ctx)
//	address := common.HexToAddress(cAddress)
//
//	gasEstimate, err := cl.EstimateGas(ctx, ethereum.CallMsg{
//		From:     fromAddress, // the sender of the 'transaction'
//		To:       &address,
//		GasPrice: gasPrice,
//		Gas:      0,             // wei <-> gas exchange ratio
//		Value:    big.NewInt(0), // amount of wei sent along with the call
//		Data:     payload})
//
//	if err != nil {
//		return nil, err
//	}
//
//	baseTx := &types.LegacyTx{
//		To:       &address,
//		Nonce:    nonce,
//		GasPrice: gasPrice,
//		Gas:      gasEstimate,
//		Value:    big.NewInt(0),
//		Data:     payload,
//	}
//
//	tx := types.NewTx(baseTx)
//
//	signTx, err := types.SignTx(tx, types.HomesteadSigner{}, privateKey)
//
//	if err != nil {
//		return nil, err
//	}
//	err = cl.SendTransaction(ctx, signTx)
//	if err != nil {
//		return nil, err
//	}
//
//	return signTx, nil
//
//}

func CallTransaction(ctx context.Context, privateKeyHex, rpcURL, cAddress string, payload []byte) (*types.Transaction, error) {
	cl, err := ethclient.DialContext(ctx, rpcURL)
	if err != nil {
		return nil, err
	}

	privateKey, err := crypto.HexToECDSA(privateKeyHex)

	if err != nil {
		return nil, err
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return nil, errorPublicKeyCasting
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)

	nonce, err := cl.PendingNonceAt(ctx, fromAddress)
	if err != nil {
		return nil, err
	}

	gasPrice, err := cl.SuggestGasPrice(ctx)
	address := common.HexToAddress(cAddress)

	gasEstimate, err := cl.EstimateGas(ctx, ethereum.CallMsg{
		From:     fromAddress, // the sender of the 'transaction'
		To:       &address,
		GasPrice: gasPrice,
		Gas:      0,             // wei <-> gas exchange ratio
		Value:    big.NewInt(0), // amount of wei sent along with the call
		Data:     payload})

	if err != nil {
		return nil, err
	}

	baseTx := &types.LegacyTx{
		To:       &address,
		Nonce:    nonce,
		GasPrice: gasPrice,
		Gas:      gasEstimate,
		Value:    big.NewInt(0),
		Data:     payload,
	}

	tx := types.NewTx(baseTx)

	chainID, err := cl.NetworkID(ctx)
	if err != nil {
		return nil, err
	}

	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), privateKey)
	if err != nil {
		return nil, err
	}

	err = cl.SendTransaction(ctx, signedTx)

	if err != nil {
		return nil, err
	}

	return signedTx, nil

}

// FileNameWithoutExtension truncates extension
func FileNameWithoutExtension(fileName string) string {
	return strings.TrimSuffix(fileName, filepath.Ext(fileName))
}

// CreateSchemaHash returns hash of schema and credential type parameters
func CreateSchemaHash(schemaBytes []byte, credentialType string) string {
	var sHash [16]byte
	h := crypto.Keccak256(schemaBytes, []byte(credentialType))
	copy(sHash[:], h[len(h)-16:])
	return hex.EncodeToString(sHash[:])
}
