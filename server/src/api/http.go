package api

import (
    "../../deps/go.net/websocket"
    //"../data"
    //"../flow"
    "fmt"
    "net/http"
    "time"
    //"strings"
    "../utils"
    "os"
)

type Api int

func (this *Api) Serve(port string) {

    fmt.Println("Api.Serve")
    //kpr = data.NewKprHttp()

    go func() {
        //http.Handle("/h5creator/api", websocket.Handler(QueueStatus))
        http.HandleFunc("/h5creator/api/user-login", UserLogin)
        http.Handle("/h5creator/api/editor-save", websocket.Handler(EditorSave))
        s := &http.Server {
            Addr:    ":" + port,
            Handler: nil,
            //ReadTimeout:    30 * time.Second,
            //WriteTimeout:   30 * time.Second,
            //MaxHeaderBytes: 1 << 20,
        }
        s.ListenAndServe()
    }()

    for {
        time.Sleep(1e9)
    }
}

func UserLogin(w http.ResponseWriter, r *http.Request) {

    defer func() {
        r.Body.Close()
    }()


    goto RSP

RSP:
    w.Header().Add("Connection", "close")

    return
}

func EditorSave(ws *websocket.Conn) {

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
            //os.Remove(req.Path)
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
