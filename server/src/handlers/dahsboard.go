package handlers

import (
	"context"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/iden3/go-schema-explorer/src/common"
	"github.com/pkg/errors"
	"os"
)

var errorNameRequired = errors.New("name parameter required")
var errorHotHex = errors.New("provide valid hex string in '0x..' format")

var RPC_URL = os.Getenv("RPC_URL")
var CONTRACT_ADDRESS = os.Getenv("CONTRACT_ADDRESS")
var PRIVATE_KEY_HEX = os.Getenv("PRIVATE_KEY_HEX")

type schemaReq struct {
	URL            string `json:"url"`
	CredentialType string `json:"credentialType"`
	Desc           string `json:"desc"`
}

const (
	resisterMethodName = "save"
	getAllMethod       = "getIds"
	getSchemaById      = "getSchemaById"
)

func RegisterSchema(c *fiber.Ctx) error {
	body := c.Body()
	var payload schemaReq
	err := json.Unmarshal(body, &payload)
	if err != nil {
		return err
	}

	schemaB, err := common.Load(c.Context(), payload.URL)
	if err != nil {
		return err
	}

	hash := common.CreateSchemaHash(schemaB, payload.CredentialType)
	txHex, err := registerSchemaToEth(c.Context(), hash, payload)
	if err != nil {
		return err
	}

	r := make(map[string]string)
	r["txHex"] = txHex
	b, err := json.Marshal(r)

	if err != nil {
		return err
	}

	c.Accepts("application/json")
	c.Status(200)

	_, err = c.Write(b)

	if err != nil {
		return err
	}

	return nil
}

func registerSchemaToEth(ctx context.Context, hash string, req schemaReq) (string, error) {

	bytesData, err := common.ABI.Pack(resisterMethodName, hash, req.CredentialType, req.URL, req.Desc)
	if err != nil {
		return "", errors.WithStack(err)
	}

	tx, err := common.CallTransaction(ctx, PRIVATE_KEY_HEX, RPC_URL, CONTRACT_ADDRESS, bytesData)

	if err != nil {
		return "", errors.WithStack(err)
	}
	return tx.Hash().Hex(), nil
}

func GetIds(c *fiber.Ctx) error {

	data, err := common.ABI.Pack(getAllMethod)
	if err != nil {
		return err
	}

	b, err := common.CallContract(c.Context(), RPC_URL, CONTRACT_ADDRESS, data)
	if err != nil {
		return err
	}

	outputs, err := common.ABI.Unpack(getAllMethod, b)

	if err != nil {
		return err
	}

	err = c.JSON(outputs)
	if err != nil {
		return err
	}
	return nil
}

func GetSchemaById(c *fiber.Ctx) error {

	id := c.Params("id")

	data, err := common.ABI.Pack(getSchemaById, id)
	if err != nil {
		return err
	}

	b, err := common.CallContract(c.Context(), RPC_URL, CONTRACT_ADDRESS, data)
	if err != nil {
		return err
	}

	outputs, err := common.ABI.Unpack(getSchemaById, b)

	if err != nil {
		return err
	}

	err = c.JSON(outputs)
	if err != nil {
		return err
	}
	return nil
}

func LoadSchemaBody(c *fiber.Ctx) error {
	url := c.Query("url")
	b, err := common.Load(c.Context(), url)
	if err != nil {
		return err
	}
	c.Write(b)
	c.Accepts("application/json")
	c.Status(200)
	return nil
}

func CalculateSchemaHash(c *fiber.Ctx) error {
	body := c.Body()
	var payload schemaReq
	err := json.Unmarshal(body, &payload)
	if err != nil {
		return err
	}

	schemaB, err := common.Load(c.Context(), payload.URL)
	if err != nil {
		return err
	}

	hash := common.CreateSchemaHash(schemaB, payload.CredentialType)
	r := make(map[string]string)
	r["id"] = hash
	err = c.JSON(r)
	if err != nil {
		return err
	}
	c.Status(200)
	return nil
}
