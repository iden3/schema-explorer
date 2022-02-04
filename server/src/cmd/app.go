package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/iden3/go-schema-processor/src/handlers"
	"log"
)

func main() {
	app := fiber.New()

	app.Get("api/schema/search/:name", handlers.SearchByName)
	app.Post("api/schema/save", handlers.SaveSchema)

	err := app.Listen(":3000")
	if err != nil {
		log.Fatal(err)
	}
}
