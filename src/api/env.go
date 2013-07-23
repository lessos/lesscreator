package api

import (
    "../utils"
    "fmt"
    "io"
    "io/ioutil"
    "net/http"
    "os"
    "os/exec"
    "os/user"
    "strconv"
    //"os"
    //"strings"
    //"../../deps/lessgo/passport"
)

type ApiEnvResponse struct {
    ApiResponse
    Data struct {
        BaseDir string `json:"basedir"`
    }   `json:"data"`
}

func (this *Api) EnvInit(w http.ResponseWriter, r *http.Request) {

    var rsp ApiEnvResponse
    rsp.Status = 400
    rsp.Message = "Bad Request"

    defer func() {
        if rspj, err := utils.JsonEncode(rsp); err == nil {
            io.WriteString(w, rspj)
        }
        r.Body.Close()
    }()

    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        return
    }

    var req struct {
        AccessToken string `json:"access_token"`
    }

    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        return
    }

    sess := this.Session.Instance(req.AccessToken)

    if sess.Uid == "0" || sess.Uid == "" {
        rsp.Status = 401
        rsp.Message = "Unauthorized"
        return
    }

    userpath := this.Cfg.AppEnginePrefix + "/spot/" + sess.Uname

    // User ID
    osuser := "lc" + sess.Uname
    u, e := user.Lookup(osuser)
    if e != nil {
        nologin, err := exec.LookPath("nologin")
        if err != nil {
            return
        }
        if _, err := exec.Command("/usr/sbin/useradd", "-d", userpath,
            "-s", nologin, osuser).Output(); err != nil {
            return
        }
        u, e = user.Lookup(osuser)
    }
    uuid, _ := strconv.Atoi(u.Uid)
    ugid, _ := strconv.Atoi(u.Gid)
    //fmt.Println(userpath)
    // Instance Folder
    makedir(userpath, uuid, ugid, 0755)
    makedir(userpath+"/webpub", uuid, ugid, 0755)
    makedir(userpath+"/conf", uuid, ugid, 0777)
    makedir(userpath+"/data", uuid, ugid, 0777)
    e = makedir(userpath+"/app", uuid, ugid, 0777)
    if e != nil {
        fmt.Println("EE", e)
    }

    //
    if _, err := exec.Command("/bin/cp", "-rp",
        this.Cfg.AppEnginePrefix+"/misc/php/user.index.php",
        userpath+"/webpub/index.php").Output(); err != nil {

        return
    }

    //fmt.Println(sess.Uid)

    rsp.Data.BaseDir = userpath
    rsp.Status = 200
    rsp.Message = "OK"
}

func makedir(path string, uuid, ugid int, mode os.FileMode) error {

    if stat, err := os.Stat(path); os.IsNotExist(err) {
        if err = os.MkdirAll(path, mode); err != nil {
            return err
        }
    } else {

        if stat.Mode() == 0777 {
            fmt.Println("mode yes")
        } else {
            fmt.Println("mode no")
        }

        fmt.Println(stat.Name(), stat.Mode(), mode, stat.IsDir())
    }

    if err := os.Chmod(path, mode); err != nil {
        return err
    }

    if err := os.Chown(path, uuid, ugid); err != nil {
        return err
    }

    return nil
}
