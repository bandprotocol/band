echo "Building $1 ..."
mkdir -p build/$1

env GOOS=darwin GOARCH=amd64 go build -o build/$1/$1_darwin_amd64 $1/main.go
env GOOS=linux GOARCH=amd64 go build -o build/$1/$1_linux_amd64 $1/main.go
env GOOS=linux GOARCH=arm go build -o build/$1/$1_linux_arm $1/main.go
