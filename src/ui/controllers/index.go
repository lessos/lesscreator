package controllers

import (
	"../../../deps/lessgo/pagelet"
	"../../../deps/lessgo/service/lessids"
	"../../conf"
	"net/http"
	// "fmt"
)

type Index struct {
	*pagelet.Controller
}

func (c Index) IndexAction() {

	c.ViewData["version"] = conf.Config.Version

	//
	session, err := c.Session.SessionFetch()
	if err != nil || session.Uid == 0 {
		c.RenderRedirect(lessids.LoginUrl(c.Request.RawAbsUrl()))
		return
	}

	ck := &http.Cookie{
		Name:    "access_userkey",
		Value:   session.Uuid,
		Path:    "/",
		Expires: session.Expired.UTC(),
	}
	http.SetCookie(c.Response.Out, ck)

	//
	if c.Params.Get("access_token") != "" {

		ck := &http.Cookie{
			Name:  "access_token",
			Value: session.AccessToken,
			Path:  "/",
			//HttpOnly: true,
			Expires: session.Expired.UTC(),
		}
		http.SetCookie(c.Response.Out, ck)

		c.RenderRedirect("/lesscreator")
		return
	}

	//
	c.ViewData["lessfly_api"] = conf.Config.LessFlyApi
}

func (c Index) BoxListAction() {

}

func (c Index) DeskAction() {

	c.ViewData["lc_version"] = conf.Config.Version

	//
	session, err := c.Session.SessionFetch()
	if err != nil || session.Uid == 0 {
		return
	}

	c.ViewData["nav_user"] = map[string]string{
		"lessids_url":         lessids.ServiceUrl,
		"lessids_url_signout": lessids.ServiceUrl + "/service/sign-out?access_token=" + session.AccessToken,
		"access_token":        session.AccessToken,
		"name":                session.Name,
		"ukey":                session.Uuid,
		"photo":               lessids.ServiceUrl + "/service/photo/" + session.Uuid,
	}
}
