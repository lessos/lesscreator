<?php

use LessPHP\Encoding\Json;
use LessPHP\LessKeeper\Keeper;
use LessPHP\LessFly\WebServer;
use LessPHP\User\Session;

$projPath = lesscreator_proj::path($this->req->proj);
$projInfo = lesscreator_proj::info($this->req->proj);

$kpr = new Keeper();

if (!isset($projInfo['projid'])) {
    die($this->T('Bad Request'));
}

$lc_plugins = array();
if (isset($projInfo['lc_plugins'])) {
    $lc_plugins = explode(",", $projInfo['lc_plugins']);
}

$msg = $this->T('Processing, please wait');
$script = "";

try {

    // Go/beego
    if (in_array("go.beego", $lc_plugins)) {

        $beePkgPath = LESSFLY_USERDIR ."/runtime/gopath/bin/bee";
        $rs = lesscreator_fs::FsFileExists($beePkgPath);

        $beegoPkgPath = LESSFLY_USERDIR ."/runtime/gopath/src/github.com/astaxie/beego/beego.go";
        $rs2 = lesscreator_fs::FsFileExists($beegoPkgPath);

        if (!$rs || !$rs2) {

            $msg = sprintf($this->T('The `%s` is not yet installed'), 'Beego');
            
            $msg .= "<br/>". $this->T('beego-install-desc');

            $msg .= ' <br/><button class="btn" onclick="_launth_beego()">'.$this->T('Install Now').'</button>';
            throw new \Exception($msg, 9001);
            //echo "NO";
        }

        //echo LESSFLY_USERDIR ."/app/{$projInfo['projid']}/conf/app.conf";
        $beegoConf = LESSFLY_USERDIR ."/app/{$projInfo['projid']}/conf/app.conf";
        $rs = lesscreator_fs::FsFileGet($beegoConf);

        $port = lesscreator_fs::EnvNetPort();
        $ini = parse_ini_string($rs->data->body);
        //$ini['usefcgi'] = true;
        $ini['httpport'] = $port;
        $ini['appname'] = $projInfo['projid'];
        //$ini['httpaddr'] = "/tmp/lf.go.".Session::Instance()->uname.".".$projInfo['projid'].".sock";

        $ini1 = "";
        foreach ($ini as $k => $v) {
            $ini1 .= "{$k} = {$v}\n";
        }
        //echo "<pre>";
        //print_r($ini);
        //echo $ini1;
        //echo "</pre>";
        if ($ini1 != $rs->data->body) {
            lesscreator_fs::FsFilePut($beegoConf, $ini1);
        }
        
        $script = "_launth_beego_run();\n";
        throw new \Exception(sprintf($this->T('`%s` starting up, please wait'), 'Beego'));
    }

} catch (\Exception $e) {
    
    $msg = $e->getMessage();

    //if ($e->getCode() == 9001) {
    //    echo '<div class="alert alert-error">'.$msg.'</div>';
    //    die();
    //}
}

?>

<div id="mc0zzp" class="alert alert-info">
<?php echo $msg?>
</div>

<script type="text/javascript">

var projid = '<?php echo $projInfo["projid"]?>';

//lessModalButtonAdd("pfz30w", "Confirm and Save", "_proj_pkg_save()", "btn-inverse");
lessModalButtonAdd("wra50b", "<?php echo $this->T('Close')?>", "lessModalClose()", "");

lcWebTerminal(1);

function _launth_beego()
{
    lcWebTerminal(1);
    
    setTimeout(function() {
        
        if (lc_terminal_conn.IsOk()) {
            var seq = String.fromCharCode(67 - 64); // Ctrl + C
            lc_terminal_conn.SendCmd(seq);
            lc_terminal_conn.SendCmd("icd ~\r");
            lc_terminal_conn.SendCmd("go get github.com/astaxie/bee\r");
            lc_terminal_conn.SendCmd("go get github.com/astaxie/beego\r");
        }
        lessModalClose();

    }, 1000);
}

function _launth_beego_run()
{
    lcWebTerminal(1);
    
    setTimeout(function() {
        
        if (lc_terminal_conn.IsOk()) {
            var seq = String.fromCharCode(67 - 64); // Ctrl + C
            lc_terminal_conn.SendCmd(seq);
            lc_terminal_conn.SendCmd(" cd ~/app/"+projid+"\r");
            lc_terminal_conn.SendCmd("bee run "+projid+"\r");
        }
        
        _launch_next_dataset();

    }, 1000);
}

function _launch_next_dataset()
{
    var uri = "/lesscreator/launch/dataset";
    uri += "?proj="+ lessSession.Get("ProjPath");

    lessModalNext(uri, "<?php echo $this->T('Run and Deply')?>", null);
}

function _proj_launch_start_try()
{
    var url = "/lesscreator/launch/dataset";
    url += "?apimethod=launch.web";
    url += "&proj="+ lessSession.Get("ProjPath");
    url += "&user="+ lessSession.Get("SessUser");

    $.ajax({
        url     : url,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {
            
            //console.log(rsp);

            try {
                var rsj = JSON.parse(rsp);
            } catch (e) {
                return lessAlert("#mc0zzp", "alert-error", "<?php echo $this->T('Service Unavailable')?>");
            }

            if (rsj.status == 200) {
                
                var rdi = rsj.web_scheme +"://"+ rsj.web_domain +":"+ rsj.web_port +"/"+ projid;

                var msg = "<?php echo $this->T('Web Server Configuration successful')?><br /><br />";

                msg += "<a href='"+rdi+"' target='_blank' class='btn'> <i class='icon-share-alt'></i> <strong><?php echo $this->T('Open')?></strong> "+rdi+"</a>";
                //msg += " -- or -- ";
                //msg += "<button class='btn' onclick='lessModalClose()'>Close</button>";

                lessAlert("#mc0zzp", "alert-success", msg);

            } else {
                lessAlert("#mc0zzp", "alert-error", "Error: "+ rsj.message);
            }
        },
        error: function(xhr, textStatus, error) {
            lessAlert("#mc0zzp", "alert-error", "Error: "+ xhr.responseText);
        }
    });
}

<?php echo $script?>
//_proj_launch_start_try();
</script>
