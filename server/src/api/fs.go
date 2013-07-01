package api

import (
    "../../deps/go.net/websocket"
    "../utils"
    "encoding/base64"
    "fmt"
    "io"
    "io/ioutil"
    "mime"
    "net/http"
    "os"
    "path/filepath"
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
            Status int
            //Content string
            Msg      string
            SumCheck string
        }{
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

func FsFileGet(w http.ResponseWriter, r *http.Request) {

    rsp := struct {
        Status  int    `json:"status"`
        Msg     string `json:"msg"`
        Content string `json:"content"`
        Mime    string `json:"mime"`
    }{
        500,
        "Bad Request",
        "",
        "",
    }

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
        Proj string
        Path string
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        return
    }

    reg, _ := regexp.Compile("/+")
    path := "/" + strings.Trim(reg.ReplaceAllString(req.Proj+"/"+req.Path, "/"), "/")

    if st, err := os.Stat(path); os.IsNotExist(err) {
        rsp.Msg = "File Not Found " + path
        return
    } else if st.Size() > (2 * 1024 * 1024) {
        rsp.Msg = "File size is too large"
        return
    }

    fp, err := os.OpenFile(path, os.O_RDWR, 0754)
    if err != nil {
        rsp.Msg = "File Can Not Open " + path
        return
    }
    defer fp.Close()

    ctn, err := ioutil.ReadAll(fp)
    if err != nil {
        rsp.Msg = "File Can Not Readable"
        return
    }
    rsp.Content = string(ctn)

    // TODO
    ctype := mime.TypeByExtension(filepath.Ext(path))
    if ctype == "" {
        ctype = http.DetectContentType(ctn)
    }
    ctypes := strings.Split(ctype, ";")
    if len(ctypes) > 0 {
        ctype = ctypes[0]
    }
    rsp.Mime = ctype

    rsp.Status = 200
    rsp.Msg = ""
}

func FsFileNew(w http.ResponseWriter, r *http.Request) {

    rsp := struct {
        Status int
        Msg    string
    }{
        500,
        "Bad Request",
    }

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
    path := strings.Trim(reg.ReplaceAllString(req.Proj+"/"+req.Path+"/"+req.Name, "/"), "/")

    var pd string
    if req.Type == "file" {
        ps := strings.Split(path, "/")
        pd = "/" + strings.Join(ps[0:len(ps)-1], "/")
    } else if req.Type == "dir" {
        pd = "/" + path
    } else {
        return
    }

    if _, err := os.Stat(pd); os.IsNotExist(err) {

        if err = os.MkdirAll(pd, 0755); err != nil {
            rsp.Msg = "Can Not Create Folder /" + pd
        } else {
            rsp.Msg = "Successfully created directory"
        }
        return
    }

    fp, err := os.OpenFile("/"+path, os.O_RDWR|os.O_CREATE, 0754)
    if err != nil {
        rsp.Msg = "Can Not Open /" + path
        return
    }
    defer fp.Close()

    if _, err = fp.Write([]byte("\n\n")); err != nil {
        rsp.Msg = "File is not Writable"
        return
    }

    rsp.Status = 200
    rsp.Msg = "Saved successfully"
}

func FsFileDel(w http.ResponseWriter, r *http.Request) {

    rsp := struct {
        Status int
        Msg    string
    }{
        500,
        "Bad Request",
    }

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
        Proj string
        Path string
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        return
    }

    reg, _ := regexp.Compile("/+")
    path := strings.Trim(reg.ReplaceAllString(req.Proj+"/"+req.Path, "/"), "/")

    if err := os.Remove("/" + path); err != nil {
        rsp.Msg = err.Error()
        return
    }

    rsp.Status = 200
    rsp.Msg = "OK"
}

func FsFileMov(w http.ResponseWriter, r *http.Request) {

    rsp := struct {
        Status int
        Msg    string
    }{
        500,
        "Bad Request",
    }

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
        Proj    string
        Name    string
        PathPre string
        PathOld string
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        return
    }

    reg, _ := regexp.Compile("/+")
    pathold := "/" + strings.Trim(reg.ReplaceAllString(req.Proj+"/"+req.PathOld, "/"), "/")

    pathnew := "/" + strings.Trim(reg.ReplaceAllString(req.Proj+"/"+req.PathPre+"/"+req.Name, "/"), "/")

    if err := os.Rename(pathold, pathnew); err != nil {
        rsp.Msg = err.Error()
        return
    }

    rsp.Status = 200
    rsp.Msg = "OK"
}

func FsFileUpl(w http.ResponseWriter, r *http.Request) {

    rsp := struct {
        Status int
        Msg    string
    }{
        500,
        "Bad Request",
    }

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
        Proj string
        Name string
        Path string
        Size int
        Data string
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        return
    }

    dataurl := strings.SplitAfter(req.Data, ";base64,")
    if len(dataurl) != 2 {
        return
    }

    data, err := base64.StdEncoding.DecodeString(dataurl[1])
    if err != nil {
        fmt.Println("error:", err)
        return
    }

    reg, _ := regexp.Compile("/+")
    path := "/" + strings.Trim(reg.ReplaceAllString(req.Proj+"/"+req.Path+"/"+req.Name, "/"), "/")

    if _, err := os.Stat(path); os.IsExist(err) {
        rsp.Msg = "File is Exists"
        fmt.Println("isok")
        return
    }

    fp, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE, 0755)
    if err != nil {
        rsp.Msg = "Can Not Open " + path
        fmt.Println(err)
        return
    }
    defer fp.Close()

    if _, err = fp.Write(data); err != nil {
        rsp.Msg = "File is not Writable"
        return
    }

    rsp.Status = 200
    rsp.Msg = "OK"
}
