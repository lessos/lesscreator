package main

import (
	"github.com/lessos/lessgo/logger"
	"github.com/lessos/lessgo/pagelet"

	"./conf"
	"./store"
	"flag"
	"fmt"
	"os"
	"runtime"
	"strconv"
)

import (
	// c_api "./api"
	c_ui "./ui/controllers"
)

var flagPrefix = flag.String("prefix", "", "the prefix folder path")

func init() {
	// Environment variable initialization
	runtime.GOMAXPROCS(runtime.NumCPU())
}

func main() {
	//
	flag.Parse()
	if err := conf.Initialize(*flagPrefix); err != nil {
		fmt.Println("conf.Initialize error: %v", err)
		os.Exit(1)
	}

	//
	if err := store.Initialize(); err != nil {
		logger.Printf("fatal", "store.Initialize error: %v", err)
		os.Exit(1)
	}

	pagelet.Config.UrlBasePath = "lesscreator"
	pagelet.Config.HttpPort, _ = strconv.Atoi(conf.Config.ApiPort)
	pagelet.Config.LessIdsServiceUrl = conf.Config.LessIdsUrl

	//
	pagelet.Config.I18n(conf.Config.Prefix + "/src/i18n/en.json")
	pagelet.Config.I18n(conf.Config.Prefix + "/src/i18n/zh_CN.json")

	//
	// pagelet.Config.RouteAppend("v1", "/:controller/:action")
	// pagelet.RegisterController("v1", (*c_api.Index)(nil))
	// pagelet.RegisterController("v1", (*c_api.Ext)(nil))

	//
	pagelet.Config.RouteStaticAppend("default", "/~", conf.Config.Prefix+"/static")
	pagelet.Config.RouteStaticAppend("default", "/-", conf.Config.Prefix+"/src/ui/tpls")
	pagelet.Config.RouteStaticAppend("default", "/+", conf.Config.Prefix+"/ext")
	pagelet.Config.RouteAppend("default", "/:controller/:action")
	pagelet.Config.ViewPath("default", conf.Config.Prefix+"/src/ui/views")
	pagelet.RegisterController("default", (*c_ui.Index)(nil))
	pagelet.RegisterController("default", (*c_ui.Error)(nil))
	pagelet.RegisterController("default", (*c_ui.Project)(nil))

	//
	fmt.Println("Running")
	pagelet.Run()
}
