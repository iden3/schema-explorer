package common

import (
	"context"
	"fmt"
	"github.com/iden3/go-schema-processor/loaders"
	"github.com/iden3/go-schema-processor/processor"
	"github.com/pkg/errors"
	"net/url"
	"os"
)

func getLoader(_url string) (processor.SchemaLoader, error) {
	schemaURL, err := url.Parse(_url)
	if err != nil {
		return nil, err
	}
	switch schemaURL.Scheme {
	case "http", "https":
		return &loaders.HTTP{URL: _url}, nil
	case "ipfs":
		return loaders.IPFS{
			URL: os.Getenv("IPFS_URL"),
			CID: schemaURL.Host,
		}, nil
	default:
		return nil, fmt.Errorf("loader for %s is not supported", schemaURL.Scheme)
	}
}

// Load for loading schema content by Http or IPFS protocolsÎ
func Load(ctx context.Context, schemaURL string) (schema []byte, err error) {

	var loader processor.SchemaLoader
	loader, err = getLoader(schemaURL)
	if err != nil {
		return nil, errors.New("Can't create loader by url")
	}
	var schemaBytes []byte
	schemaBytes, _, err = loader.Load(ctx)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return schemaBytes, nil
}
