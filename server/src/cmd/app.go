package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/iden3/go-schema-explorer/src/handlers"
	"log"
)

func main() {
	app := fiber.New()

	app.Get("api/schema/search/:value", handlers.Search)
	app.Post("api/schema/save", handlers.SaveSchema)
	app.Post("api/schema/register", handlers.RegisterSchema)
	app.Get("api/schema/body", handlers.LoadSchemaBody)
	app.Get("api/schema/ids", handlers.GetIds)
	app.Get("api/schema/:id", handlers.GetSchemaById)

	err := app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	}
}
