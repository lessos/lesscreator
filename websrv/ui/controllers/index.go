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

type Index struct {
	*httpsrv.Controller
}

func (c Index) IndexAction() {

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
}

func (c Index) DeskAction() {

	c.Data["lc_version"] = config.Config.Version

	//
	session, err := idclient.SessionInstance(c.Session)
	if err != nil || !session.IsLogin() {
		return
	}

	c.Data["nav_user"] = map[string]string{
		"lessids_endpoint":         idclient.ServiceUrl,
		"lessids_endpoint_signout": idclient.ServiceUrl + "/service/sign-out?access_token=" + session.AccessToken,
		"access_token":             session.AccessToken,
		"name":                     session.Name,
		"ukey":                     session.UserID,
		"photo":                    idclient.ServiceUrl + "/v1/service/photo/" + session.UserID,
	}
}

func (c Index) WsAction() {

	for {

		fmt.Println("WsAction for")

		var msg string

		if err := c.Request.WebSocket.Receive(&msg); err != nil {
			return
		}

		// if err := websocket.Message.Receive(c.Request.Websocket, &msg); err != nil {
		// 	c.Request.Websocket.Close()
		// 	return
		// }
		//fmt.Println("FsSaveWS: ", msg)

		// var req struct {
		// 	MsgReply string `json:"msgreply"`
		// 	Data     struct {
		// 		Urid     string `json:"urid"`
		// 		Path     string `json:"path"`
		// 		Body     string `json:"body"`
		// 		SumCheck string `json:"sumcheck"`
		// 	} `json:"data"`
		// }
		// err = utils.JsonDecode(msg, &req)
		// if err != nil {
		// 	return
		// }

		// fp, err := os.OpenFile(req.Data.Path, os.O_RDWR|os.O_CREATE, 0754)
		// if err != nil {
		// 	return
		// } else {

		// 	fp.Seek(0, 0)
		// 	fp.Truncate(int64(len(req.Data.Body)))

		// 	if _, err = fp.WriteString(req.Data.Body); err != nil {
		// 		fmt.Println(err)
		// 	}
		// }
		// fp.Close()

		var ret struct {
			Status   int    `json:"status"`
			MsgReply string `json:"msgreply"`
		}
		ret.Status = 200
		ret.MsgReply = "OKKKKKKKKKKKK"

		fmt.Println("WsAction back")

		if err := c.Request.WebSocket.SendJson(ret); err != nil {
			return
		}

		// if err = websocket.JSON.Send(c.Request.Websocket, ret); err != nil {
		// 	c.Request.Websocket.Close()
		// 	return
		// }
	}
}
