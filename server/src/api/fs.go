package api

import (
    "fmt"
    //"net/http"
    //"time"
    //"strings"
    "../utils"
    "os"
    "../../deps/go.net/websocket"
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
