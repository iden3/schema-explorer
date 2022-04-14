package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/iden3/go-schema-explorer/src/handlers"
	"log"
)

func main() {
	app := fiber.New()

	app.Post("api/schema/register", handlers.RegisterSchema)
	app.Get("api/schema/body", handlers.LoadSchemaBody)
	app.Post("api/schema/hash", handlers.CalculateSchemaHash)
	app.Get("api/schema/ids", handlers.GetIds)
	app.Get("api/schema/:id", handlers.GetSchemaById)
	app.Post("api/ipfs/upload", handlers.IPFSUpload)

	err := app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	}
}
