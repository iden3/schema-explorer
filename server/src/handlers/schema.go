package handlers

import (
	"bytes"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/iden3/go-schema-processor/src/common"
	"github.com/iden3/go-schema-registry-wrapper/wrapper"
	"github.com/pkg/errors"
	"io"
	"mime/multipart"
	"os"
)

var errorNameRequired = errors.New("name parameter required")

var rpcURL = os.Getenv("RPC_URL")
var contractAddress = os.Getenv("CONTRACT_ADDRESS")
var pKeyHex = os.Getenv("PRIVATE_KEY_HEX")

func SearchByName(c *fiber.Ctx) error {
	name := c.Params("name")
	if name == "" {
		return errorNameRequired
	}
	payload, err := wrapper.EncodeSchemaBytesByName(name)
	if err != nil {
		return err
	}
	b, err := common.CallContract(c.Context(), rpcURL, contractAddress, payload)
	if err != nil {
		return err
	}
	d, err := wrapper.DecodeSchemaBytesByHash(b)
	if err != nil {
		return err
	}
	c.Accepts("application/json")
	c.Status(200)
	_, err = c.Write(d)
	if err != nil {
		return err
	}

	return nil
}

func SaveSchema(c *fiber.Ctx) error {
	form, err := c.FormFile("json")
	if err != nil {
		return errorNameRequired
	}

	file, err := form.Open()

	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			panic(err)
		}
	}(file)

	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		return err
	}

	name := common.FileNameWithoutExtension(form.Filename)
	payload, err := wrapper.EncodeSaveTransaction(name, buf.Bytes())

	tx, err := common.CallTransaction(c.Context(), pKeyHex, rpcURL, contractAddress, payload)

	if err != nil {
		return err
	}

	c.Accepts("application/json")
	c.Status(200)
	r := make(map[string]string)
	r["txHex"] = tx.Hash().Hex()
	b, err := json.Marshal(r)

	if err != nil {
		return err
	}
	_, err = c.Write(b)

	if err != nil {
		return err
	}

	return nil
}
