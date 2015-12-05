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

package controllers

import (
	"github.com/lessos/lessgo/httpsrv"

	"../../../config"
)

func NewModule() httpsrv.Module {

	module := httpsrv.NewModule("default")

	module.RouteSet(httpsrv.Route{
		Type:       httpsrv.RouteTypeStatic,
		Path:       "~",
		StaticPath: config.Config.Prefix + "/webui/",
	})

	module.RouteSet(httpsrv.Route{
		Type:       httpsrv.RouteTypeStatic,
		Path:       "-",
		StaticPath: config.Config.Prefix + "/websrv/ui/tpls",
	})

	module.RouteSet(httpsrv.Route{
		Type:       httpsrv.RouteTypeStatic,
		Path:       "+",
		StaticPath: config.Config.Prefix + "/ext",
	})

	module.RouteSet(httpsrv.Route{
		Type: httpsrv.RouteTypeBasic,
		Path: "pod/:pod_id",
		Params: map[string]string{
			"controller": "pod",
			"action":     "index",
		},
	})

	module.TemplatePathSet(config.Config.Prefix + "/websrv/ui/views")

	module.ControllerRegister(new(Auth))
	module.ControllerRegister(new(Pod))
	module.ControllerRegister(new(Index))
	module.ControllerRegister(new(Error))

	return module
}
