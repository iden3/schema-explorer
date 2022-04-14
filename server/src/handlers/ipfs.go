package handlers

import (
	"bytes"
	"github.com/gofiber/fiber/v2"
	"github.com/iden3/go-schema-explorer/src/common"
	"io"
	"mime/multipart"
	"os"
)

var IPFS_URL = os.Getenv("IPFS_URL")

func IPFSUpload(c *fiber.Ctx) error {
	var err error
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

	b, err := common.UploadToIpfs(IPFS_URL, buf.Bytes())

	c.Accepts("application/json")
	c.Status(200)

	_, err = c.Write(b)

	if err != nil {
		return err
	}

	return nil
}
