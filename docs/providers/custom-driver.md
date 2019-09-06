# Use Custom Drivers

While the default implementation of provider node comes with pre-built drivers that connect to various data sources, you can implement your own driver to suit your need. In this subsection, we will go over two possible ways you can do that.

## `PriceHttp` Driver

A simpler approach to connect to an external price service is to implement your service as a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) endpoint and connect that to provider node using `PriceHttp` driver. To utilize `PriceHttp` driver, adding the following config to your configuration file.

```yaml
name: PriceHttp
endpoint: YOUR_HTTP_ENDPOINT
method: GET_OR_POST
```

With this configuration file, whenever a provider node issues a query to `PriceHttp` driver, the driver will fire a request to your endpoint depending on `method`.

- `GET`: It will send a GET request to `{endpoint}?symbol={...}&type={SPOTPX}`.
- `POST`: It will send a POST request with data `{ "symbol": "...", "type": "SPOTPX" }`.

Your HTTP service must reply with the following JSON format upon a successful query. `PriceHttp` driver convert the floating point result to the proper 32-byte value on your behalf.

```json
{
  "price": 10000.0
}
```

Alternatively, if the query is not successful, the endpoint must returns a JSON object with `error`.

```json
{
  "error": "Failed due to ..."
}
```

More variants of "HTTP" drivers are in their development phase. Expect more to come soon!

## Bring Your Own Driver

If you are a Go-hacker, you can fork Band's provider node that start implementing your own driver. We provide thorough steps below. Note that after your edit the codebase, you will need to rebuild the binary. Also, be sure to rebase with master frequently to ensure you always receive latest updates!

### 1. Write an Driver

An driver specifies the way to obtain obtain real-world data. You can add a new driver implementation to [driver package](https://github.com/bandprotocol/band/tree/master/go/driver). To be classified as an driver, must implements `Driver` interface which consists of two functions.

- `Configure(*viper.Viper)`: This function is called exactly once during the initialization. It receives the driver's configuration as specified in YAML file as a [viper](https://github.com/spf13/viper) object.
- `Query([]byte) (common.Hash, error)`: This function is called whenever there is a data query. It takes an arbitrary-length bytearray, as specified in [dataset specifications](../datasets/overview.md), and returns a result as a 32-byte value, or error if an error occurs.

### 2. Edit `driver/types.go`

Next, to make the node aware of the newly added driver, modify [`driver/types.go`](https://github.com/bandprotocol/band/blob/master/go/driver/types.go) by adding a new case linking to your driver.

### 3. Update Your YAML Configuration

Lastly, add your driver to the configuration file. It will look like this:

```yaml
name: ADAPTER_NAME_AS_SPECIFIED_IN_types.go
key1: KEY1_CONFIG
key2: KEY2_CONFIG
```
