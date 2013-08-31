<?php

use LessPHP\Encoding\Json;

if (!isset($this->req->proj)
    || strlen($this->req->proj) < 1) {
    header("HTTP/1.1 404 Not Found"); die('Page Not Found');
}

$projPath = lesscreator_proj::path($this->req->proj);

$title  = 'Edit Project';
$status = 200;
$msg    = '';

$info = lesscreator_env::ProjInfoDef("");
$t = lesscreator_proj::info($this->req->proj);
if (is_array($t)) {
    $info = array_merge($info, $t);
}

$lcpj = "{$projPath}/lcproject.json";
$lcpj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $lcpj);

if ($this->req->apimethod == "self.rt.list") {

    $rts = array(
        'nginx' => array(
            'title' => 'WebServer (nginx)',
        ),
        'php' => array(
            'title' => 'PHP',
        ),
        'go' => array(
            'title' => 'Go',
        ),
        'python' => array(
            'title' => 'Python',
        ),
        'java' => array(
            'title' => 'Java',
        ),
    );

    foreach ($info['runtimes'] as $name => $rt) {

        if ($rt['status'] != 1) {
            continue;
        }

        echo "
        <a class=\"item border_radius_5\" href=\"#rt/{$name}-set\" onclick=\"_proj_rt_set(this)\" title=\"Click to configuration\">
            <img class=\"rt-ico\" src=\"/lesscreator/static/img/rt/{$name}_200.png\" />
            <label class=\"title\">{$rts[$name]['title']}</label>
        </a>";

        unset($rts[$name]);
    }

    if (count($rts) > 0) {

        echo '
        <a class="item border_radius_5 gray" href="#rt/select" onclick="_proj_rt_set(this)">
            <img class="newrt-ico" src="/lesscreator/static/img/for-test/setting2-128.png" />
            <span class="newrt-tit">Add Runtime Environment</span>
            <span class="newrt-desc">PHP, Python, Java, Go ...</span>
        </a>';
    }
    
    die();
}


if ($_SERVER['REQUEST_METHOD'] == 'POST'
    || $_SERVER['REQUEST_METHOD'] == 'PUT') {

    //print_r($info);

    foreach ($info as $k => $v) {
        if (isset($_POST[$k]) && $k != "runtimes") {
            $info[$k] = $_POST[$k];
        }
    }
    if (isset($info['props']) && is_array($info['props'])) {
        $info['props'] = implode(",", $info['props']);
    }
    if (isset($info['props_app']) && is_array($info['props_app'])) {
        $info['props_app'] = implode(",", $info['props_app']);
    }
    if (isset($info['props_dev']) && is_array($info['props_dev'])) {
        $info['props_dev'] = implode(",", $info['props_dev']);
    }
    
    $str = Json::prettyPrint($info);
    $rs = lesscreator_fs::FsFilePut($lcpj, $str);
    if ($rs->status == 200) {
        die("OK");
    } else {
        die("Error, ". $rs->message);
    }
}

echo $msg;
?>
<style>
#k2948f {
    padding: 5px;
}
#k2948f input,textarea {
    margin-bottom: 0px;
}
.rky7cv a {
    text-decoration: none;
}
.rky7cv .item {
    position: relative;
    background-color: #dff0d8;
    border: 2px solid #dff0d8;
    height: 50px; width: 300px;
    float: left; margin: 3px 20px 3px 0;
}
.rky7cv .item .newrt-ico {
    width: 30px; height: 30px;
    position: absolute; top: 10px; left: 10px;
}
.rky7cv .item .newrt-tit {
    position: absolute; font-size: 14px; font-weight: bold;
    color: #333; top: 7px; left: 60px;
}
.rky7cv .item .newrt-desc {
    position: absolute; font-size: 8px;
    color: #777; left: 60px;
    bottom: 3px;
}
.rky7cv .item .rt-ico {
    position: absolute;
    width: 60px; height: 30px;
    top: 50%; left: 10px; margin-top: -15px;
}
.rky7cv .item.gray {
    background-color: #fff;
}
.rky7cv .item:hover {
    border: 2px solid #7acfa8;
    background-color: #dff0d8;
}
.rky7cv .item .title {
    position: absolute; color: #333;
    margin-left: 100px; margin-top: -10px; top: 50%;
    font-weight: bold; font-size: 14px; 
}
.r0330s .item {
    position: relative;
    width: 280px;
    float: left; margin: 3px 10px 3px 0;
}
.r0330s .item input {
    margin-bottom: 0;
}
</style>
<form id="k2948f" action="/lesscreator/proj/set/" method="post">
  <input name="proj" type="hidden" value="<?=$projPath?>" />
  <table class="table table-condensed" width="100%">

    <tr>
      <td width="220px"><strong>Project ID</strong></td>
      <td><?=$info['projid']?></td>
    </tr>
    <tr>
      <td><strong>Display Name</strong></td>
      <td>
        <input name="name" class="input-medium" type="text" value="<?=$info['name']?>" />
        <span class="help-inline">Example: <strong>Hello World</strong></span>
      </td>
    </tr>
    <!-- <tr>
      <td><strong>Services</strong></td>
      <td>
        <?php
        $preSrvs = explode(",", $info['props']);
        $srvs = lesscreator_service::listAll();
        foreach ($srvs as $k => $v) {
            $ck = '';
            if (in_array($k, $preSrvs)) {
                $ck = "checked";
            }
            echo "<label class=\"checkbox\">
                <input type=\"checkbox\" name=\"props[]\" value=\"{$k}\" {$ck}/> {$v}
                </label>";
        }
        ?>
      </td>
    </tr> -->
    
    <tr>
      <td><strong>Version</strong></td>
      <td>
        <input name="version" class="input-medium" type="text" value="<?=$info['version']?>" /> 
        <span class="help-inline">Example: <strong>1.0.0</strong></span>
      </td>
    </tr>
    
    <tr>
      <td><strong>Runtime Environment</strong></td>
      <td><div class="rky7cv">Loading</div></td>
    </tr>

    <tr>
      <td><strong>Group by Application</strong></td>
      <td class="r0330s">
        <?php
        $preProps = explode(",", $info['props_app']);
        $ls = lesscreator_env::GroupByAppList();
        foreach ($ls as $k => $v) {
            $ck = '';
            if (in_array($k, $preProps)) {
                $ck = "checked";
            }
            echo "<label class=\"item checkbox\">
                <input type=\"checkbox\" name=\"props_app[]\" value=\"{$k}\" {$ck}/> {$v}
                </label>";
        }
        ?>
      </td>
    </tr>

    <tr>
      <td><strong>Group by Develop</strong></td>
      <td class="r0330s">
        <?php
        $preProps = explode(",", $info['props_dev']);
        $ls = lesscreator_env::GroupByDevList();
        foreach ($ls as $k => $v) {
            $ck = '';
            if (in_array($k, $preProps)) {
                $ck = "checked";
            }
            echo "<label class=\"item checkbox\">
                <input type=\"checkbox\" name=\"props_dev[]\" value=\"{$k}\" {$ck}/> {$v}
                </label>";       
        }
        ?>
      </td>
    </tr>

    <tr>
      <td valign="top"><strong>Description</strong></td>
      <td><textarea name="summary" rows="3" style="width:400px;"><?=$info['summary']?></textarea></td>
    </tr>

    <tr>
      <td></td>
      <td><input type="submit" name="submit" value="Save" class="btn btn-inverse" /></td>
    </tr>
  </table>
</form>

<script>

$("#k2948f").submit(function(event) {

    event.preventDefault();

    $.ajax({ 
        type    : "POST",
        url     : $(this).attr('action'),
        data    : $(this).serialize(),
        success : function(rsp) {
            hdev_header_alert('success', rsp);
            window.scrollTo(0,0);
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
});

function _proj_rt_refresh()
{
    var url = "/lesscreator/proj/set?apimethod=self.rt.list";
    url += "&proj=" + lessSession.Get("ProjPath");

    $.ajax({ 
        type    : "GET",
        url     : url,
        success : function(rsp) {
            $(".rky7cv").empty().html(rsp);
        },
        error: function(xhr, textStatus, error) {
            // 
        }
    });
}

function _proj_rt_set(node)
{
    var uri = $(node).attr("href").substr(1);
    
    var title = "";
    switch (uri) {
    case "rt/select":
        title = "Add Runtime Environment";
        break;
    case "rt/nginx-set":
        title = "Setting Nginx"
        break;
    case "rt/php-set":
        title = "Add Runtime Environment";
        break;
    default:
        return;
    }
    
    uri += "?proj=" + lessSession.Get("ProjPath");
    lessModalOpen("/lesscreator/"+ uri, 1, 800, 500, title, null);
}


_proj_rt_refresh();

</script>
