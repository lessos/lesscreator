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
	"fmt"

	"github.com/lessos/lessgo/httpsrv"
	"github.com/lessos/lessids/idclient"

	"../../../config"
)

type Pod struct {
	*httpsrv.Controller
}

func (c Pod) IndexAction() {

	c.Data["version"] = config.Config.Version

	//
	if !idclient.SessionIsLogin(c.Session) {
		c.Redirect(idclient.AuthServiceUrl(
			config.Config.InstanceID,
			fmt.Sprintf("//%s%s/auth/cb", c.Request.Host, config.HttpSrvBasePath("")),
			c.Request.RawAbsUrl()))
		return
	}

	//
	c.Data["pandora_endpoint"] = config.Config.PandoraEndpoint
	c.Data["l9r_pod_active"] = c.Params.Get("pod_id")

	c.Render("index/index.tpl")
}
