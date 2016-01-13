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

package config

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/lessos/lessgo/utils"
	"github.com/lessos/lessids/idclient"
)

const VERSION string = "0.2.0.dev"

var (
	Config ConfigCommon
)

type ConfigCommon struct {
	Version         string
	InstanceID      string `json:"intance_id"`
	Prefix          string
	RunUser         string
	HttpPort        uint16 `json:"http_port"`
	PandoraEndpoint string `json:"pandora_endpoint"`
	LessIdsUrl      string `json:"lessids_endpoint"`
}

func Initialize(prefix string) error {

	if prefix == "" {
		if p, err := filepath.Abs(os.Args[0]); err == nil {
			p, _ = path.Split(p)
			prefix, _ = filepath.Abs(p + "/..")
		}
	}

	reg, _ := regexp.Compile("/+")
	prefix = "/" + strings.Trim(reg.ReplaceAllString(prefix, "/"), "/")

	cfgfile := prefix + "/etc/config.json"
	if _, err := os.Stat(cfgfile); err != nil && os.IsNotExist(err) {
		return errors.New("Error: config cfgfile is not exists")
	}

	fp, err := os.Open(cfgfile)
	if err != nil {
		return errors.New(fmt.Sprintf("Error: Can not open (%s)", cfgfile))
	}
	defer fp.Close()

	cfgstr, err := ioutil.ReadAll(fp)
	if err != nil {
		return errors.New(fmt.Sprintf("Error: Can not read (%s)", cfgfile))
	}

	if err = utils.JsonDecode(cfgstr, &Config); err != nil {
		return errors.New(fmt.Sprintf("Error: "+
			"config file invalid. (%s)", err.Error()))
	}

	Config.Version = VERSION
	Config.Prefix = prefix

	idclient.ServiceUrl = Config.LessIdsUrl

	return nil
}
