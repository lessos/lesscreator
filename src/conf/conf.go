package conf

import (
    "../../deps/lessgo/utils"
    "errors"
    "fmt"
    "io/ioutil"
    "os"
    "regexp"
    "strings"
)

type Config struct {
    Version     string
    Prefix      string
    ApiPort     string `json:"apiport"`
    KeeperAgent string `json:"keeperagent"`
    LessFlyDir  string `json:"lessfly_dir"`
}

func NewConfig(prefix string) (Config, error) {

    var cfg Config

    if prefix == "" {
        prefix = "/opt/less/fly/spot/sa/app/lesscreator"
    }
    reg, _ := regexp.Compile("/+")
    cfg.Prefix = "/" + strings.Trim(reg.ReplaceAllString(prefix, "/"), "/")

    file := cfg.Prefix + "/etc/creator.json"
    if _, err := os.Stat(file); err != nil && os.IsNotExist(err) {
        return cfg, errors.New("Error: config file is not exists")
    }

    fp, err := os.Open(file)
    if err != nil {
        return cfg, errors.New(fmt.Sprintf("Error: Can not open (%s)", file))
    }
    defer fp.Close()

    cfgstr, err := ioutil.ReadAll(fp)
    if err != nil {
        return cfg, errors.New(fmt.Sprintf("Error: Can not read (%s)", file))
    }

    if err = utils.JsonDecode(string(cfgstr), &cfg); err != nil {
        return cfg, errors.New(fmt.Sprintf("Error: "+
            "config file invalid. (%s)", err.Error()))
    }

    return cfg, nil
}
