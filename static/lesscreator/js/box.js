
var  BoxStateWait    = 0;
var  BoxStateActive  = 1;
var  BoxStateStopped = 2;


function lcBoxRefresh()
{
    if (lessSession.Get("boxid") == "") {
        alert("No Box Found");
        return;
    }

    // var url = lessfly_api + "/box/cmd?";
    // url += "access_token="+ lessCookie.Get("access_token");
    // url += "&boxid="+ lessSession.Get("boxid");
    // url += "&action=state";

    var url = lessfly_api + "/box/entry";
    url += "?access_token="+ lessCookie.Get("access_token");
    url += "&boxid="+ lessSession.Get("boxid");

    $.ajax({
        url     : url,
        type    : "GET",
        timeout : 10000,
        success : function(rsp) {

            var rsj = JSON.parse(rsp);

            if (rsj.status == 200) {
                
                if (rsj.data.hostaddr.length > 0) {
                    lessSession.Set("box_hostaddr", rsj.data.hostaddr);
                }

                if (rsj.data.state == BoxStateActive) {
                    $("#box-state-msg").text("Active");
                    // console.log(rsj.data);
                }

            } else {
                $("#box-state-msg").text(rsp.message)
            }
        },
        error   : function(xhr, textStatus, error) {
            $("#box-state-msg").text("Connect Failed")
        }
    });
}

