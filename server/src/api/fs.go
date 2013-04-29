package api

import (
    "fmt"
    "net/http"
    "io/ioutil"
    //"time"
    "../utils"
    "os"
    "../../deps/go.net/websocket"
    "regexp"
    "strings"
)

func FsSaveWS(ws *websocket.Conn) {

    var err error

    for {
        var msg string
        if err := websocket.Message.Receive(ws, &msg); err != nil {
            ws.Close()
            return
        }
        fmt.Println(msg)

        var req struct {
            Path     string
            Content  string
            Mode     string
            SumCheck string
        }
        err = utils.JsonDecode(msg, &req)
        if err != nil {
            return
        }
        
        fp, err := os.OpenFile(req.Path, os.O_RDWR|os.O_CREATE, 0754)
        if err != nil {
            return
        } else {
            if _, err = fp.Write([]byte(req.Content)); err != nil {
                fmt.Println(err)
            }
        }
        fp.Close()

        ret := struct {
            Status   int
            //Content string
            Msg      string
            SumCheck string
        } {
            200,
            //msg,
            "",
            req.SumCheck,
        }
        if err = websocket.JSON.Send(ws, ret); err != nil {
            ws.Close()
            return
        }
    }
}

func FsFileNew(w http.ResponseWriter, r *http.Request) {
    
    defer func() {
        r.Body.Close()
    }()

    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        return
    }

    var req struct {
        Proj string
        Path string
        Name string
        Type string
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        return
    }

    reg, _ := regexp.Compile("/+")
    path := strings.Trim(reg.ReplaceAllString(req.Proj +"/"+ req.Name, "/"), "/")

    var pd string
    if req.Type == "file"  {
        ps := strings.Split(path, "/")
        pd = "/"+ strings.Join(ps[0:len(ps)-1], "/")
    } else if req.Type == "dir" {
        pd = "/"+ path
    } else {
        return
    }
        
    if _, err := os.Stat(pd); os.IsNotExist(err) {
            
        if err = os.MkdirAll(pd, 0755); err != nil {
            return
        }
    }

    fp, err := os.OpenFile("/"+ path, os.O_RDWR|os.O_CREATE, 0754)
    if err != nil {
        return
    }
    defer fp.Close()
    
    if _, err = fp.Write([]byte("\n\n")); err != nil {
        return
    }
}

