<?php

use LessPHP\Encoding\Json;
use LessPHP\LessKeeper\Keeper;


$info = lesscreator_proj::info($this->req->proj);
if (!isset($info['projid'])) {
    die("Bad Request");
}


if (in_array($_SERVER['REQUEST_METHOD'], array('POST', 'PUT'))) {

    $ret = array("status" => 200, "message" => null);

    try {

        $info['depends'] = implode(",", $this->req->depends);

        $projPath = lesscreator_proj::path($this->req->proj);
        $lcpj = "{$projPath}/lcproject.json";
    
        $str = Json::prettyPrint($info);
        $rs = lesscreator_fs::FsFilePut($lcpj, $str);
        if ($rs->status != 200) {
            throw new \Exception($rs->message, 400);
        }

    } catch (\Exception $e) {
        $ret['status']  = $e->getCode();
        $ret['message'] = $e->getMessage();
    }

    die(json_encode($ret));
}



$kpr = new Keeper();

$rs = $kpr->LocalNodeListAndGet("/lf/pkg/");

$dps = explode(",", $info['depends']);

?>
<div id="ekjujo" class="hide"></div>

<form id="d3tmtf" action="/lesscreator/proj/set-pkgs/" method="post">


<table class="table table-condensed">

<thead>
<tr>
<th></th>
<th width="200">Name</th>
<th width="100">Version</th>
<th>Description</th>
</tr>
</thead>
<?php

    foreach ($rs->elems as $v) {

        $v = json_decode($v->body);
        if (!isset($v->projid)) {
            continue;
        }

        $ck = '';
        if (in_array($v->projid, $dps)) {
            $ck = "checked";
        }

        echo "<tr>
            <td>
                <label class=\"checkbox\">
                <input type=\"checkbox\" name=\"depends[]\" value=\"{$v->projid}\" {$ck}/>
                </label>
            </td>
            <td>{$v->name}</td>
            <td>{$v->version}</td>
            <td>{$v->summary}</td>
        </tr>";
    }
?>
</table>
</form>

<script>

lessModalButtonAdd("z7tgxo", "Confirm and Save", "_proj_pkg_save()", "btn-inverse");
lessModalButtonAdd("vkbmpc", "Close", "lessModalClose()", "");


function _proj_pkg_save()
{
    $.ajax({
        type    : "POST",
        url     : $("#d3tmtf").attr('action'),
        data    : $("#d3tmtf").serialize() +"&proj="+ lessSession.Get("ProjPath"),
        success : function(rsp) {
            //console.log(rsp);
            try {
                var rsj = JSON.parse(rsp);
            } catch (e) {
                lessAlert("#ekjujo", "alert-error", "Error: Service Unavailable");
                return;
            }

            if (rsj.status == 200) {

                lessAlert("#ekjujo", "alert-success", "OK");
                _proj_pkgs_refresh();
                lessModalClose();

            } else {
                lessAlert("#ekjujo", "alert-error", "Error: "+ rsj.message);
            }
        },
        error: function(xhr, textStatus, error) {
            lessAlert("#ekjujo", "alert-error", "Error: "+ xhr.responseText);
        }
    });

    return;
}

</script>