package api

import (
    "../../deps/go.net/websocket"
    //"../data"
    //"../flow"
    "fmt"
    "net/http"
    "time"
    //"strings"
    //"../utils"
    //"os"
)

type Api int

func (this *Api) Serve(port string) {

    fmt.Println("Api.Serve")
    //kpr = data.NewKprHttp()

    go func() {
        //http.Handle("/h5creator/api", websocket.Handler(QueueStatus))
        http.HandleFunc("/h5creator/api/user-login", UserLogin)
        http.Handle("/h5creator/api/fs-save-ws", websocket.Handler(FsSaveWS))
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

