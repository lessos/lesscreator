package main

import (
    "../deps/lessgo/keeper"
    "../deps/lessgo/passport"
    "./api"
    "./conf"
    "flag"
    "fmt"
    "log"
    "os"
    "os/user"
    "time"
)

const VERSION string = "1.0.0"

var cfg conf.Config
var apiserv api.Api
var kpr keeper.Keeper
var ses passport.Session

var flagPrefix = flag.String("prefix", "", "the prefix folder path")
var flagConfig = flag.String("config", "", "the config file path")

func main() {

    var err error

    if u, err := user.Current(); err != nil || u.Uid != "0" {
        log.Fatal("Permission Denied : must be run as root")
    }

    //
    flag.Parse()
    if cfg, err = conf.NewConfig(*flagPrefix, *flagConfig); err != nil {
        fmt.Println(err)
        os.Exit(1)
    }
    cfg.Version = VERSION

    kpr, _ = keeper.NewKeeper(cfg.KeeperAgent)

    ses, _ = passport.NewSession(kpr)

    apiserv.Kpr = kpr
    apiserv.Session = ses
    apiserv.Cfg = cfg

    go apiserv.Serve(cfg.ApiPort)

    for {
        time.Sleep(3e9)
    }
}
