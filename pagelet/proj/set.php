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

$info = lesscreator_env::ProjInfoDef($proj);
$t = lesscreator_proj::info($this->req->proj);
if (is_array($t)) {
    $info = array_merge($info, $t);
}

$lcpj = "{$projPath}/lcproject.json";
$lcpj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $lcpj);

if ($this->req->apimethod == "runtime.enable") {
    
    foreach ($info['runtimes'] as $k => $rt) {
        
        if ($this->req->runtime == $rt['name']) {
            
            if ($rt['status'] != $this->req->status) {
                $info['runtimes'][$k]['status'] = $this->req->status;

                $str = Json::prettyPrint($info);
                $rs = lesscreator_fs::FsFilePut($lcpj, $str);
                if ($rs->status != 200) {
                    die("Error, ". $rs->message);
                }
            }

            die("OK");
        }
    }
    
    $info['runtimes'][] = array(
        'name' => $this->req->runtime,
        'status' => 1,
    );
    $str = Json::prettyPrint($info);
    $rs = lesscreator_fs::FsFilePut($lcpj, $str);
    if ($rs->status != 200) {
        die("Error, ". $rs->message);
    }

    die("OK");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST'
    || $_SERVER['REQUEST_METHOD'] == 'PUT') {

    foreach ($info as $k => $v) {
        if (isset($_POST[$k])) {
            $info[$k] = $_POST[$k];
        }
    }
    if (isset($info['props']) && is_array($info['props'])) {
        $info['props'] = implode(",", $info['props']);
    }
    if (isset($info['types']) && is_array($info['types'])) {
        $info['types'] = implode(",", $info['types']);
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
.rky7cv .item {
    position: relative;
    background-color: #eee; border: 2px solid #eee;
    height: 60px; width: 300px;
    float: left; margin: 5px 20px 5px 0;
}
.rky7cv .item img {
    position: absolute;
    width: 80px; height: 40px;
    top: 50%; left: 20px; margin-top: -20px;
}
.rky7cv .item .gray {
    -webkit-filter: grayscale(1);
}
.rky7cv .item:hover {
    border: 2px solid #bbb;
}
.rky7cv .item .title {
    position: absolute; margin-left: 120px;
    top: 10px; font-weight: bold;
}
.rky7cv .item .setting {
    position: absolute; margin-left: 120px;
    bottom: 5px;
}
</style>
<form id="k2948f" action="/lesscreator/proj/set/" method="post">
  <input name="proj" type="hidden" value="<?=$info['projid']?>" />
  <table class="table table-condensed" width="100%">

    <tr>
      <td width="180px"><strong>Project ID</strong></td>
      <td><?=$info['projid']?></td>
    </tr>
    <tr>
      <td><strong>Name</strong></td>
      <td>
        <input name="name" class="input-medium" type="text" value="<?=$info['name']?>" />
        <span class="help-inline">Example: Hello World</span>
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
      <td><strong>Types</strong></td>
      <td>
        <?php
        $preTypes = explode(",", $info['types']);
        $ts = lesscreator_env::TypeList();
        foreach ($ts as $k => $v) {
            $ck = '';
            if (in_array($k, $preTypes)) {
                $ck = "checked";
            }
            echo "<label class=\"checkbox\">
                <input type=\"checkbox\" name=\"types[]\" value=\"{$k}\" {$ck}/> {$v}
                </label>";       
        }
        ?>
      </td>
    </tr>
    <tr>
      <td><strong>Version</strong></td>
      <td>
        <input name="version" class="input-medium" type="text" value="<?=$info['version']?>" /> 
        <span class="help-inline">Example: 1.0.0</span>
      </td>
    </tr>
    <!-- <tr>
      <td><strong>Release</strong></td>
      <td><input name="release" class="input-medium" type="text" value="<?=$info['release']?>" /></td>
    </tr> -->
    <tr>
      <td valign="top"><strong>Description</strong></td>
      <td><textarea name="summary" rows="3" style="width:400px;"><?=$info['summary']?></textarea></td>
    </tr>
    <tr>
      <td><strong>Runtime Environment</strong></td>
      <td>

        <?php
        $rts = array(
            'nginx' => array(
                'title' => 'WebServer (nginx)',
            ),
            'php' => array(
                'title' => 'PHP',
            ),
            'go' => array(
                'title' => 'Go',
            )
        )
        ?>
        <div class="rky7cv">
        <?php
        foreach ($info['runtimes'] as $rt) {
            echo "
        <div class=\"item border_radius_5\">
            <img src=\"/lesscreator/static/img/rt/{$rt['name']}_200.png\" />
            <label class=\"title\">{$rts[$rt['name']]['title']}</label>
            <label class=\"checkbox setting\">
              <input type=\"checkbox\" name=\"runtimes[]\" value=\"{$rt['name']}\" checked=\"true\"/> Enable
            </label>
        </div>";
            unset($rts[$rt['name']]);
        }
        foreach ($rts as $name => $rt) {
            echo "
        <div class=\"item border_radius_5\">
            <img class=\"gray\" src=\"/lesscreator/static/img/rt/{$name}_200.png\" />
            <label class=\"title\">{$rt['title']}</label>
            <label class=\"checkbox setting\">
              <input type=\"checkbox\" name=\"runtimes[]\" value=\"{$name}\" /> Enable
            </label>
        </div>";
            unset($rts[$rt['name']]);
        }
        ?>
        </div>

        
      </td>
    </tr>
    <tr>
      <td></td>
      <td><input type="submit" name="submit" value="Save" class="btn btn-inverse" /></td>
    </tr>
  </table>
</form>

<script>

$(".rky7cv input").click(function(){
    
    var url = "/lesscreator/proj/set?";
    url += "proj=" + lessSession.Get("ProjPath");
    url += "&apimethod=runtime.enable";
    
    if ($(this).is (':checked')) {
        url += "&status=1";
        $(this).parent().parent().find("img").removeClass("gray");
    } else {
        url += "&status=0";
        $(this).parent().parent().find("img").addClass("gray");
    }

    url += "&runtime="+ $(this).val();

    $.ajax({ 
        type    : "GET",
        url     : url,
        success : function(data) {
            if (data == "OK") {
                hdev_header_alert('success', data);
            } else {
                hdev_header_alert('error', data);
            }
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });

    //console.log($(this));
});

$("#k2948f").submit(function(event) {

    event.preventDefault();

    $.ajax({ 
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function(data) {
            hdev_header_alert('success', data);
            window.scrollTo(0,0);
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
});
</script>
