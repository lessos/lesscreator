<?php

use LessPHP\Encoding\Json;

if (!isset($this->req->proj) || strlen($this->req->proj) < 1) {
    die('Page Not Found');
}

$projPath = lesscreator_proj::path($this->req->proj);

$status = 200;
$msg    = '';

$info = lesscreator_proj::info($this->req->proj);
if (!isset($info['projid'])) {
    die("Page Not Found");
}

$lcpj = "{$projPath}/lcproject.json";
$lcpj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $lcpj);

$enabled_check = "";
foreach ($info['runtimes'] as $name => $rt) {
    if ($name == "php" && $rt['status'] == 1) {
        $enabled_check = "checked";
        break;
    }
}
?>
<table>
<tr>
<td width="180px" valign="top">
    <img src="/lesscreator/static/img/rt/php_200.png" width="160" height="80" />
</td>
<td>  
    <h4>PHP runtime environment</h4>
    <br />
    <div id="k3bahm" class="alert alert-info">
        PHP is a popular general-purpose scripting language that is especially suited to web development.
        <br />
        Fast, flexible and pragmatic, PHP powers everything from your blog to the largest social networking site in the world.
    </div>
    <ul>
        <li>version >= 5.4.x</li>
        <li>web: nginx/php-fpm</li>
        <li>command: php-cli</li>
    </ul>
    <label class="checkbox">
      <input id="hldp2x" type="checkbox" value="1" <?php echo $enabled_check?> /> Enable PHP
    </label>
</td>
</tr>
</table>
<script>
if (lessModalPrevId() != null) {
    lessModalButtonAdd("guql6j", "Back", "lessModalPrev()", "pull-left h5c-marginl0");
}

lessModalButtonAdd("r6d4v9", "Close", "lessModalClose()", "");

lessModalButtonAdd("mhm701", "Save", "_proj_rt_php_save()", "btn-inverse");

function _proj_rt_php_save()
{
    var req = "proj=" + lessSession.Get("ProjPath");
    req += "&runtime=php";

    if ($("#hldp2x").is (':checked')) {
        req += "&status=1";
    } else {
        req += "&status=0";
    }

    $.ajax({ 
        type    : "POST",
        url     : "/lesscreator/rt/gen-set-do",
        data    : req,
        success : function(rsp) {

            try {
                var rsj = JSON.parse(rsp);
            } catch (e) {
                lessAlert("#k3bahm", "alert-error", "Error: Service Unavailable");
                return;
            }

            if (rsj.status != 200) {
                lessAlert("#k3bahm", "alert-error", rsj.message);
                return;
            }

            lessAlert("#k3bahm", "alert-success", rsj.message);
            _proj_rt_refresh();
        },
        error: function(xhr, textStatus, error) {
            lessAlert("#k3bahm", "alert-error", textStatus+' '+xhr.responseText);
        }
    });
}
</script>