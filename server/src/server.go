package main

import (
    //"fmt"
    "os/user"
    "log"
    "time"
    "./api"
)

var apiserv api.Api

func main() {
    
    u, err := user.Current()
    if err != nil {
        log.Fatal(err)
    }
    if u.Uid == "0" {
        log.Fatal("Must be run as root")
    }

    go apiserv.Serve("9528")

    for {
        time.Sleep(3e9)
    }
}
