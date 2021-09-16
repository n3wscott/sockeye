# Sockeye

![Sockeye Logo](./images/sockeye-logo.png)

Websocket based CloudEvents viewer.

## Usage

Visit the root of the sockeye service in a web browser. Then `POST` CloudEvents
to the sockeye service and they will be displayed to the root page via a ws
connection.

Example curl:

```shell
curl -X POST -H "Content-Type: application/json" \
  -H "ce-specversion: 1.0" \
  -H "ce-source: curl-command" \
  -H "ce-type: curl.demo" \
  -H "ce-id: 123-abc" \
  -d '{"name":"Earl"}' \
  http://localhost:8080/
```

See also, the CloudEvents [Spec](https://github.com/cloudevents/spec) or
[golang SDK](https://github.com/cloudevents/sdk-go) to get started sending
CloudEvents formatted events.

## Running Locally

```shell
KO_DATA_PATH=./cmd/sockeye/kodata go run cmd/sockeye/main.go
```
*note:* the CE injection portion will not populate the avalible services running locally. 

The UI source can be found in the
[sockeye-react](https://github.com/n3wscott/sockeye-react) repo. These might
merge together when the UI is ironed out.

## Running on Kubernetes

### From Release v0.7.0 (experimental react.js based ui)

To install into your default namespace

```shell
kubectl apply -f https://github.com/n3wscott/sockeye/releases/download/v0.7.0/release.yaml
```

### From Release v0.6.3

To install into your default namespace

```shell
kubectl apply -f https://github.com/n3wscott/sockeye/releases/download/v0.6.3/release.yaml
```

This artifact will work on the following linux architectures: amd64, arm, arm64,
ppc64le, s390x

### From Source

```shell
ko apply -f config/sockeye.yaml
```
