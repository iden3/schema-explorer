package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/iden3/go-schema-explorer/src/common"
	"github.com/iden3/go-schema-registry-wrapper/wrapper"
	shell "github.com/ipfs/go-ipfs-api"
	"github.com/pkg/errors"
	"io"
	"mime/multipart"
	"os"
	"strings"
)

var errorNameRequired = errors.New("name parameter required")
var errorHotHex = errors.New("provide valid hex string in '0x..' format")

var RPC_URL = os.Getenv("RPC_URL")
var IPFS_URL = os.Getenv("IPFS_URL")
var CONTRACT_ADDRESS = os.Getenv("CONTRACT_ADDRESS")
var PRIVATE_KEY_HEX = os.Getenv("PRIVATE_KEY_HEX")

func Search(c *fiber.Ctx) error {

	value := c.Params("value")
	qType := c.Query("type")

	if value == "" {
		return errorNameRequired
	}
	var payload []byte
	var err error

	if qType == "ETH" {
		getHash := c.Query("hash")
		searchBy := c.Query("searchBy")

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
		b, err := common.CallContract(c.Context(), RPC_URL, CONTRACT_ADDRESS, payload)
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
	}

	if qType == "IPFS" {

		sh := shell.NewShell(IPFS_URL)

		data, err := sh.Cat(value)

		if err != nil {
			return err
		}

		buf := new(bytes.Buffer)
		_, err = buf.ReadFrom(data)
		if err != nil {
			return err
		}
		c.Accepts("application/json")
		c.Status(200)
		_, err = c.Write(buf.Bytes())
		if err != nil {
			return err
		}
	}

	return nil
}

func SaveSchema(c *fiber.Ctx) error {
	var err error
	form, err := c.FormFile("json")
	qType := c.Query("type")

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

	var b []byte
	if qType == "IPFS" {
		b, err = uploadToIpfs(IPFS_URL, buf.Bytes())
	} else {
		name := common.FileNameWithoutExtension(form.Filename)
		b, err = uploadToEth(c.Context(), name, buf.Bytes())
	}

	c.Accepts("application/json")
	c.Status(200)

	_, err = c.Write(b)

	if err != nil {
		return err
	}

	return nil
}

func uploadToIpfs(url string, jsonB []byte) ([]byte, error) {
	sh := shell.NewShell(url)

	cid, err := sh.Add(bytes.NewReader(jsonB))
	if err != nil {
		return nil, err
	}
	r := make(map[string]string)
	r["CID"] = cid
	b, err := json.Marshal(r)

	if err != nil {
		return nil, err
	}

	return b, nil
}

func uploadToEth(ctx context.Context, name string, body []byte) ([]byte, error) {
	payload, err := wrapper.EncodeSaveTransaction(name, body)

	tx, err := common.CallTransaction(ctx, PRIVATE_KEY_HEX, RPC_URL, CONTRACT_ADDRESS, payload)

	if err != nil {
		return nil, err
	}
	r := make(map[string]string)
	r["txHex"] = tx.Hash().Hex()
	b, err := json.Marshal(r)

	if err != nil {
		return nil, err
	}

	return b, nil
}
