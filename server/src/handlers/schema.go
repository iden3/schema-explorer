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
	"strings"
)

var errorNameRequired = errors.New("name parameter required")
var errorHotHex = errors.New("provide valid hex string in '0x..' format")

var rpcURL = os.Getenv("RPC_URL")
var contractAddress = os.Getenv("CONTRACT_ADDRESS")
var pKeyHex = os.Getenv("PRIVATE_KEY_HEX")

func SearchByName(c *fiber.Ctx) error {
	value := c.Params("value")
	getHash := c.Query("hash")
	searchBy := c.Query("searchBy")
	if value == "" {
		return errorNameRequired
	}
	var payload []byte
	var err error

	if getHash == "true" {
		payload, err = wrapper.EncodeSchemaHashByName(value)
	} else if searchBy == "hash" {
		isHex := strings.HasPrefix(value, "0x")
		if !isHex {
			return errorHotHex
		}

		payload, err = wrapper.EncodeSchemaBytesByHash(value)
	} else {
		payload, err = wrapper.EncodeSchemaBytesByName(value)
	}
	if err != nil {
		return err
	}
	b, err := common.CallContract(c.Context(), rpcURL, contractAddress, payload)
	if err != nil {
		return err
	}

	if getHash == "true" {
		hash, err := wrapper.DecodeSchemaHashByName(b)

		if err != nil {
			return err
		}
		resp := make(map[string]interface{})
		resp["hash"] = hash.Hex()

		c.Accepts("application/json")
		c.Status(200)
		b, err := json.Marshal(resp)
		_, err = c.Write(b)
		if err != nil {
			return err
		}

		return nil

	}

	if searchBy == "hash" {
		b, err := wrapper.DecodeSchemaBytesByHash(b)

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

	d, err := wrapper.DecodeSchemaBytesByName(b)

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
