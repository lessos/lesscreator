<?php
$projbase = H5C_DIR;

if ($this->req->proj == null) {
    die('ERROR');
}

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
$projpath = preg_replace("/\/+/", "/", rtrim($projpath, '/'));
if (strlen($projpath) < 1) {
    die("ERROR");
}
$projInfo = hwl\Yaml\Yaml::decode(file_get_contents($projpath."/hootoapp.yaml"));

$grps = array();
$glob = $projpath."/dataflow/*.grp.json";
foreach (glob($glob) as $v) {
    $json = file_get_contents($v);
    $json = json_decode($json, true);
    if (!isset($json['id'])) {
        continue;
    }
    $grps[$json['id']] = $json;
}

echo "<table width=\"100%\" class='table-hover'>";
foreach ($grps as $k => $v) {
    echo "<tr>
        <td width='5px'></td>
        <td width='20px'>
            <img src='/fam3/icons/package.png' class='h5c_icon' /> 
        </td>
        <td>
            <a href='#{$k}' class='k810ll'>{$v['name']}</a>
        </td>
        <td></td>
        <td align='right'></td>
        <td align='right'></td>
        <td width='5px'></td>
    </tr>";

    $glob = $projpath."/dataflow/{$k}/*.actor.json";
    foreach (glob($glob) as $v2) {
        
        $json = file_get_contents($v2);
        $json = json_decode($json, true);
        
        if (!isset($json['id'])) {
            continue;
        }

        echo "<tr>
        <td></td>
        <td></td>
        <td>
            <img src='/fam3/icons/brick.png' class='h5c_icon' />
            <a href='#{$k}/{$json['id']}' class='to8kit'>{$json['name']}</a>
        </td>
        <td id='qstatus{$json['id']}'></td>
        <td align='right'>
            <a href='#{$k}/{$json['id']}' class='j4sa3r'>Run</a>
        </td>
        <td align='right'>
            <a href='#{$k}/{$json['id']}.actor' class='ejiqlh'>Script</a>
        </td>
        <td></td>
        </tr>";
    }
}
echo "</table>";
echo "<div id='vtknd6' class='hide'>{$projInfo['appid']}</div>";
?>

<script type="text/javascript">
var sock = null;
var wsuri = "ws://127.0.0.1:9600/h5data/api/qstatus";

function _qstatus_open()
{
    if (!("WebSocket" in window)) {
        return
    }
    if (sock != null) {
        return
    }

    try{
        sock = new WebSocket(wsuri);

        sock.onopen = function() {
            //console.log("connected to " + wsuri);
            _qstatus_send();
        }

        sock.onclose = function(e) {
            //console.log("connection closed (" + e.code + ")");
        }

        sock.onmessage = function(e) {
            //console.log("message received: " + e.data);
        
            var obj = JSON.parse(e.data);
        
            for (var i in obj) {
                status = "Running";
                switch (obj[i].Status) {
                case 1:
                    status = "Pending";
                    break;
                case 3:
                    status = "Done";
                    break;
                case 4:
                    status = "Error";
                    break;
                case 9:
                    status = "Timeout";
                    break
                }

                $("#qstatus"+ obj[i].WorkerId).text(status);
            }

            _qstatus_send();
            if ($("#vtknd6").length == 0) {
                sock.close();
            }
        }
        
    } catch(e) {
        //message('<p>Error'+ e);
    }
}

function _qstatus_send()
{
    var msg = $("#vtknd6").text(); 
    sock.send(msg);
}

$('.k810ll').click(function() {
    var uri = $(this).attr('href').substr(1);
    var url = "/h5creator/proj/dataflow/grp-edit?proj="+projCurrent+"&grpid="+uri;
    h5cModalOpen(url, 0, 400, 0, 'Edit Group', null);
});

$('.to8kit').click(function() {
    var uri = $(this).attr('href').substr(1);
    var tit = $(this).attr('title');
    var url = "/h5creator/proj/dataflow/actor-edit?proj="+projCurrent+"&uri="+uri;
    h5cTabOpen(url, 'w0', 'html', 
        {'title': tit, 'close':'1', 'img': '/fam3/icons/brick.png'});
});

$('.ejiqlh').click(function() {
    var uri = $(this).attr('href').substr(1);
    var tit = $(this).attr('title');
    var url = "dataflow/"+ uri;
    h5cTabOpen(url, 'w0', 'editor', 
        {'title': tit, 'close':'1', 'img': '/fam3/icons/package.png'});
});

$('.j4sa3r').click(function() {
    
    var uri = $(this).attr('href').substr(1);
    var url = "/h5creator/instance/launch?proj="+ projCurrent;
    url += "&flowgrpid="+ uri.split('/')[0];
    url += "&flowactorid="+ uri.split('/')[1];
    h5cModalOpen(url, 1, 700, 450, "Launch Instance", null);

    /**
    $.ajax({
        url     : '/h5creator/proj/dataflow/actor-ctrl?proj='+projCurrent+'&uri='+uri,
        type    : "POST",
        timeout : 30000,
        success : function(rsp) {
            alert(rsp);
            _qstatus_open();
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', xhr.responseText);
        }
    });
    */
});
</script>