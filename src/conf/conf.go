package conf

import (
    "../../deps/lessgo/utils"
    "errors"
    "fmt"
    "io/ioutil"
    "os"
    "path"
    "path/filepath"
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

func NewConfig(prefix, cfgfile string) (Config, error) {

    var cfg Config

    if prefix == "" {
        if p, err := filepath.Abs(os.Args[0]); err == nil {
            p, _ = path.Split(p)
            prefix, _ = filepath.Abs(p + "/..")
        }
    }

    reg, _ := regexp.Compile("/+")
    cfg.Prefix = "/" + strings.Trim(reg.ReplaceAllString(prefix, "/"), "/")

    if cfgfile == "" {
        cfgfile = cfg.Prefix + "/etc/creator.json"
    }
    if _, err := os.Stat(cfgfile); err != nil && os.IsNotExist(err) {
        return cfg, errors.New("Error: config cfgfile is not exists")
    }

    fp, err := os.Open(cfgfile)
    if err != nil {
        return cfg, errors.New(fmt.Sprintf("Error: Can not open (%s)", cfgfile))
    }
    defer fp.Close()

    cfgstr, err := ioutil.ReadAll(fp)
    if err != nil {
        return cfg, errors.New(fmt.Sprintf("Error: Can not read (%s)", cfgfile))
    }

    if err = utils.JsonDecode(string(cfgstr), &cfg); err != nil {
        return cfg, errors.New(fmt.Sprintf("Error: "+
            "config file invalid. (%s)", err.Error()))
    }

    return cfg, nil
}
