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
	"net/http"
	"time"

	"github.com/lessos/lessgo/httpsrv"
	"github.com/lessos/lessgo/types"
	"github.com/lessos/lessids/idclient"

	"../../../config"
)

type Auth struct {
	*httpsrv.Controller
}

func (c Auth) CbAction() {

	session, err := idclient.Instance(c.Params.Get("access_token"))
	if err != nil {
		c.Redirect(idclient.AuthServiceUrl(
			config.Config.InstanceID,
			fmt.Sprintf("//%s%s/auth/cb", c.Request.Host, config.HttpSrvBasePath("")), c.Params.Get("state")))
		return
	}

	http.SetCookie(c.Response.Out, &http.Cookie{
		Name:     "access_userid",
		Value:    session.UserID,
		Path:     "/",
		HttpOnly: false,
		Expires:  time.Now().Add(time.Second * time.Duration(c.Params.Int64("expires_in"))),
	})

	http.SetCookie(c.Response.Out, &http.Cookie{
		Name:     idclient.AccessTokenKey,
		Value:    c.Params.Get("access_token"),
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Now().Add(time.Second * time.Duration(c.Params.Int64("expires_in"))),
	})

	if c.Params.Get("state") != "" {
		c.Redirect(c.Params.Get("state"))
	} else {
		c.Redirect(config.HttpSrvBasePath(""))
	}
}

func (c Auth) LoginAction() {

	c.AutoRender = false

	referer := config.HttpSrvBasePath("")
	if len(c.Request.Referer()) > 10 {
		referer = c.Request.Referer()
	}

	c.Redirect(idclient.AuthServiceUrl(
		config.Config.InstanceID,
		fmt.Sprintf("//%s%s/auth/cb", c.Request.Host, config.HttpSrvBasePath("")), referer))
}

type AuthSession struct {
	types.TypeMeta `json:",inline"`
	UserID         string `json:"userid"`
	UserName       string `json:"username"`
	Name           string `json:"name"`
	IDsUrl         string `json:"ids_url"`
	PhotoUrl       string `json:"photo_url"`
}

func (c Auth) SessionAction() {

	// fmt.Println("session", c.Session.IsLogin())

	set := AuthSession{
		IDsUrl:   idclient.ServiceUrl,
		PhotoUrl: idclient.ServiceUrl + "/v1/service/photo/guest",
	}

	if session, err := idclient.SessionInstance(c.Session); err == nil {

		set.UserID = session.UserID
		set.UserName = session.UserName
		set.Name = session.Name
		set.PhotoUrl = idclient.ServiceUrl + "/v1/service/photo/" + session.UserID
		set.Kind = "AuthSession"

	} else {
		set.Error = &types.ErrorMeta{"401", err.Error()}
	}

	c.RenderJson(set)
}

func (c Auth) SignOutAction() {

	http.SetCookie(c.Response.Out, &http.Cookie{
		Name:    idclient.AccessTokenKey,
		Value:   "",
		Path:    "/",
		Expires: time.Now().Add(-86400),
	})

	c.AutoRender = false

	referer := config.HttpSrvBasePath("")
	if len(c.Request.Referer()) > 10 {
		referer = c.Request.Referer()
	}

	c.Redirect(referer)
}
