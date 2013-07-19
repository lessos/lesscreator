package api

import (
    "../../deps/go.net/websocket"
    "../utils"
    "encoding/base64"
    "errors"
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

type FsFile struct {
    Path     string `json:"path"`
    Size     int64  `json:"size"`
    Mime     string `json:"mime"`
    Body     string `json:"body"`
    SumCheck string `json:"sumcheck"`
    Error    string `json:"error"`
}

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

    var rsp struct {
        ApiResponse
        Data FsFile `json:"data"`
    }

    defer func() {

        if rsp.Status == 0 {
            rsp.Status = 500
            rsp.Message = "Internal Server Error"
        }

        if rspj, err := utils.JsonEncode(rsp); err == nil {
            io.WriteString(w, rspj)
        }
        r.Body.Close()
    }()

    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    var req struct {
        AccessToken string `json:"access_token"`
        Data        FsFile `json:"data"`
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    file, err := fsFileGetRead(req.Data.Path)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    rsp.Data = file

    rsp.Status = 200
}

func fsFileGetRead(path string) (FsFile, error) {

    var file FsFile
    file.Path = path

    reg, _ := regexp.Compile("/+")
    path = "/" + strings.Trim(reg.ReplaceAllString(path, "/"), "/")

    st, err := os.Stat(path)
    if os.IsNotExist(err) {
        return file, errors.New("File Not Found")
    }
    file.Size = st.Size()

    if st.Size() > (2 * 1024 * 1024) {
        return file, errors.New("File size is too large")
    }

    fp, err := os.OpenFile(path, os.O_RDWR, 0754)
    if err != nil {
        return file, errors.New("File Can Not Open")
    }
    defer fp.Close()

    ctn, err := ioutil.ReadAll(fp)
    if err != nil {
        return file, errors.New("File Can Not Readable")
    }
    file.Body = string(ctn)

    // TODO
    ctype := mime.TypeByExtension(filepath.Ext(path))
    if ctype == "" {
        ctype = http.DetectContentType(ctn)
    }
    ctypes := strings.Split(ctype, ";")
    if len(ctypes) > 0 {
        ctype = ctypes[0]
    }
    file.Mime = ctype

    return file, nil
}

func FsFilePut(w http.ResponseWriter, r *http.Request) {

    var rsp struct {
        ApiResponse
    }

    defer func() {

        if rsp.Status == 0 {
            rsp.Status = 500
            rsp.Message = "Internal Server Error"
        }

        if rspj, err := utils.JsonEncode(rsp); err == nil {
            io.WriteString(w, rspj)
        }
        r.Body.Close()
    }()

    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    var req struct {
        AccessToken string `json:"access_token"`
        Data        FsFile `json:"data"`
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    if err := fsFilePutWrite(req.Data); err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    rsp.Status = 200
    rsp.Message = ""
}

func fsFilePutWrite(file FsFile) error {

    reg, _ := regexp.Compile("/+")
    path := "/" + strings.Trim(reg.ReplaceAllString(file.Path, "/"), "/")

    dir := filepath.Dir(path)
    if st, err := os.Stat(dir); os.IsNotExist(err) {

        if err = os.MkdirAll(dir, 0750); err != nil {
            return err
        }

    } else if !st.IsDir() {
        return errors.New("Can not create directory, File exists")
    }

    fp, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE, 0750)
    if err != nil {
        return err
    }
    defer fp.Close()

    if _, err = fp.Write([]byte(file.Body)); err != nil {
        return err
    }

    return nil
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
