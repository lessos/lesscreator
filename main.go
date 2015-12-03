// Copyright 2015 lessOS.com, All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"flag"
	"fmt"
	"os"
	"runtime"

	"github.com/lessos/lessgo/httpsrv"
	// "github.com/lessos/lessgo/logger"

	"./config"
)

import (
	c_ui "./websrv/ui/controllers"
)

var (
	flagPrefix = flag.String("prefix", "", "the prefix folder path")
)

func init() {
	// Environment variable initialization
	runtime.GOMAXPROCS(runtime.NumCPU())

	// render functions
	httpsrv.GlobalService.Config.TemplateFuncRegister("HttpSrvBasePath", config.HttpSrvBasePath)
}

func main() {
	//
	flag.Parse()
	if err := config.Initialize(*flagPrefix); err != nil {
		fmt.Println("config.Initialize error: %v", err)
		os.Exit(1)
	}

	//
	// if err := store.Initialize(); err != nil {
	// 	logger.Printf("fatal", "store.Initialize error: %v", err)
	// 	os.Exit(1)
	// }

	// idclient.ServiceUrl = config.Config.LessIdsUrl

	httpsrv.GlobalService.Config.UrlBasePath = "lesscreator"
	httpsrv.GlobalService.Config.HttpPort = config.Config.HttpPort

	//
	// httpsrv.Config.I18n(config.Config.Prefix + "/src/i18n/en.json")
	// httpsrv.Config.I18n(config.Config.Prefix + "/src/i18n/zh_CN.json")

	//

	//
	httpsrv.GlobalService.ModuleRegister("/", c_ui.NewModule())

	//
	fmt.Println("Running")
	httpsrv.GlobalService.Start()
}
