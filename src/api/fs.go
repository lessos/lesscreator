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
    //"os/exec"
    "path/filepath"
    "regexp"
    "strings"
    "time"
)

type FsFile struct {
    Path     string    `json:"path"`
    Name     string    `json:"name"`
    Size     int64     `json:"size"`
    Mime     string    `json:"mime"`
    Body     string    `json:"body"`
    SumCheck string    `json:"sumcheck"`
    IsDir    bool      `json:"isdir"`
    ModTime  time.Time `json:"modtime"`
    //Mode     uint32    `json:"mode"`
    //Error    string    `json:"error"`
}

func FsSaveWS(ws *websocket.Conn) {

    var err error

    for {
        var msg string
        if err := websocket.Message.Receive(ws, &msg); err != nil {
            ws.Close()
            return
        }
        fmt.Println("FsSaveWS", msg)

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

            fp.Seek(0, 0)
            fp.Truncate(int64(len(req.Content)))

            if _, err = fp.WriteString(req.Content); err != nil {
                fmt.Println(err)
            }
        }
        fp.Close()

        ret := struct {
            Status   int    `json:"status"`
            Msg      string `json:"message"`
            SumCheck string `json:"sumcheck"`
        }{
            200,
            "",
            req.SumCheck,
        }
        if err = websocket.JSON.Send(ws, ret); err != nil {
            ws.Close()
            return
        }
    }
}

func FsList(w http.ResponseWriter, r *http.Request) {

    var rsp struct {
        ApiResponse
        Data []FsFile `json:"data"`
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
        Data        string `json:"data"`
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    reg, _ := regexp.Compile("/+")
    req.Data = "/" + strings.Trim(reg.ReplaceAllString(req.Data, "/"), "/")
    if !strings.Contains(req.Data, "*") {
        req.Data += "/*"
    }
    //fmt.Println(req.Data)

    // req.Data =

    rs, err := filepath.Glob(req.Data)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }
    for _, v := range rs {

        var file FsFile
        file.Path = v

        st, err := os.Stat(v)
        if os.IsNotExist(err) {
            continue
        }

        file.Name = st.Name()
        file.Size = st.Size()
        file.IsDir = st.IsDir()
        file.ModTime = st.ModTime()
        //file.Mode = uint32(st.Mode())
        //fmt.Println(fmt.Sprintf("%o", st.Mode()), st.Name())

        if !st.IsDir() {
            file.Mime = fsFileMime(v)
        }

        rsp.Data = append(rsp.Data, file)
    }

    //fmt.Println(rsp)
    //rsp.Data = file

    rsp.Status = 200
}

func fsFileMime(v string) string {

    // TODO
    //  ... add more extension types
    ctype := mime.TypeByExtension(filepath.Ext(v))

    if ctype == "" {
        fp, err := os.Open(v)
        if err == nil {

            defer fp.Close()

            if ctn, err := ioutil.ReadAll(fp); err == nil {
                ctype = http.DetectContentType(ctn)
            }
        }
    }

    ctypes := strings.Split(ctype, ";")
    if len(ctypes) > 0 {
        ctype = ctypes[0]
    }

    return ctype
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
        Data        struct {
            Type string `json:"type"`
            Path string `json:"path"`
        }   `json:"data"`
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    reg, _ := regexp.Compile("/+")
    path := strings.Trim(reg.ReplaceAllString(req.Data.Path, "/"), "/")

    var pd string
    if req.Data.Type == "file" {
        ps := strings.Split(path, "/")
        pd = "/" + strings.Join(ps[0:len(ps)-1], "/")
    } else if req.Data.Type == "dir" {
        pd = "/" + path
    } else {
        rsp.Status = 500
        rsp.Message = "Type is incorrect"
        return
    }

    if _, err := os.Stat(pd); os.IsNotExist(err) {

        if err = os.MkdirAll(pd, 0755); err != nil {
            rsp.Message = "Can Not Create Folder /" + pd
            rsp.Status = 500
            return
        }
    }

    if req.Data.Type == "dir" {
        rsp.Status = 200
        return
    }

    fp, err := os.OpenFile("/"+path, os.O_RDWR|os.O_CREATE, 0754)
    if err != nil {
        //rsp.Message = "Can Not Open /" + path
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }
    defer fp.Close()

    if _, err = fp.Write([]byte("\n\n")); err != nil {
        //rsp.Message = "File is not Writable"
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    rsp.Status = 200
}

func FsFileDel(w http.ResponseWriter, r *http.Request) {

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
        Data        string `json:"data"`
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    reg, _ := regexp.Compile("/+")
    path := strings.Trim(reg.ReplaceAllString(req.Data, "/"), "/")

    if err := os.Remove("/" + path); err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    rsp.Status = 200
    rsp.Message = "OK"
}

func FsFileMov(w http.ResponseWriter, r *http.Request) {

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
        Data        struct {
            PathNew string `json:"pathnew"`
            PathPre string `json:"pathpre"`
        }   `json:"data"`
    }
    err = utils.JsonDecode(string(body), &req)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    reg, _ := regexp.Compile("/+")
    pathpre := "/" + strings.Trim(reg.ReplaceAllString(req.Data.PathPre, "/"), "/")

    pathnew := "/" + strings.Trim(reg.ReplaceAllString(req.Data.PathNew, "/"), "/")

    if pathnew == pathpre {
        rsp.Status = 200
        rsp.Message = ""
        return
    }

    dir := filepath.Dir(pathnew)
    if _, err := os.Stat(dir); os.IsNotExist(err) {

        if err = os.MkdirAll(dir, 0750); err != nil {
            rsp.Status = 500
            rsp.Message = err.Error()
            return
        }
    }

    if err := os.Rename(pathpre, pathnew); err != nil {
        rsp.Status = 500
        rsp.Message = "102:" + err.Error()
        return
    }
    /*cp, err := exec.LookPath("cp")
      if err != nil {
          rsp.Status = 500
          rsp.Message = err.Error()
          return
      }

      fmt.Println(cp, "-rp", pathpre, pathnew)

      if _, err := exec.Command(cp, "-rp", pathpre, pathnew).Output(); err != nil {
          rsp.Status = 500
          rsp.Message = err.Error()
          return
      }

      if err := os.Remove(pathpre); err != nil {
          rsp.Status = 500
          rsp.Message = err.Error()
          return
      }
    */

    rsp.Status = 200
    rsp.Message = ""
    return
}

func FsFileUpl(w http.ResponseWriter, r *http.Request) {

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

    dataurl := strings.SplitAfter(req.Data.Body, ";base64,")
    if len(dataurl) != 2 {
        rsp.Status = 500
        rsp.Message = "Bad Request"
        return
    }

    data, err := base64.StdEncoding.DecodeString(dataurl[1])
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    reg, _ := regexp.Compile("/+")
    path := "/" + strings.Trim(reg.ReplaceAllString(req.Data.Path, "/"), "/")

    if _, err := os.Stat(path); os.IsExist(err) {
        rsp.Status = 500
        rsp.Message = "File is Exists"
        return
    }

    fp, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE, 0755)
    if err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }
    defer fp.Close()

    if _, err = fp.Write(data); err != nil {
        rsp.Status = 500
        rsp.Message = err.Error()
        return
    }

    rsp.Status = 200
}
