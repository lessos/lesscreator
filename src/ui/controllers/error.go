package controllers

import (
	"github.com/lessos/lessgo/httpsrv"
)

type Error struct {
	*httpsrv.Controller
}

func (c Error) BrowserAction() {

}
