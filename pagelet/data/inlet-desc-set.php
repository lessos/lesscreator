<?php
$projbase = H5C_DIR;

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("Bad Request 1");
}

$h5 = new LessPHP_Service_H5keeper("127.0.0.1:9530");

$info = $h5->Get("/h5db/info/{$this->req->id}");
$info = json_decode($info, true);
if (!isset($info['id'])) {
    die("Bad Request 2");
}

$projInfo = array();
$fsp = $projpath."/hootoapp.yaml";
if (file_exists($fsp)) {
    $projInfo = file_get_contents($fsp);
    $projInfo = hwl\Yaml\Yaml::decode($projInfo);
    if ($projInfo['appid'] != $info['projid']) {
        die("Permission denied");
    }
}

$info['id'] = $this->req->id;


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($this->req->name)) {
        $info['name'] = $this->req->name;
    }

    // TODODB $h5->Set("/h5db/info/{$this->req->id}", json_encode($info));    

    if (!file_exists($fsp)) {
        die("OK");
    }

    $dataInfo = array();
    $fsd = $projpath."/data/{$this->req->id}.db.json";
    if (file_exists($fsd)) {
        $dataInfo = file_get_contents($fsd);
        $dataInfo = json_decode($dataInfo, true);
    }

    if (is_writable($projpath."/data")) {
    
        if (!isset($dataInfo['id'])) {
            $dataInfo = array(
                'id'        => $this->req->id,
                'created'   => time(),
                'struct'    => array(),
            );
        }

        $dataInfo['name']      = $info['name'];
        $dataInfo['updated']   = time();
        $dataInfo['projid']    = $info['projid'];
        file_put_contents($fsd, hwl_Json::prettyPrint($dataInfo));
    }

    die("OK");
}
?>

<form id="sgpq5k" action="/h5creator/data/inlet-desc-set">
  <table width="100%">
    <tr>
        <td width="120px"><strong>Instance ID</strong></td>
        <td><input type="text" name="id" value="<?php echo $info['id']?>" <?php if ($mt=='edit') echo 'readonly="readonly"'?>/> 字母、数字混合</td>
    </tr>
    <tr>
        <td><strong>Name</strong></td>
        <td><input type="text" name="name" value="<?php echo $info['name']?>" /></td>
    </tr>
    <tr>
        <td></td>
        <td><input type="submit" class="btn" value="Save" /></td>
    </tr>
  </table>
  
</form>

<script>
$("#sgpq5k").submit(function(event) {

    event.preventDefault();
    
    var time = new Date().format("yyyy-MM-dd HH:mm:ss");
    $.ajax({ 
        type    : "POST",
        url     : $(this).attr('action') +"?_="+ Math.random(),
        data    : $(this).serialize() +"&proj="+ projCurrent,
        success : function(rsp) {
            if (rsp == "OK") {
                hdev_header_alert("alert-success", time +" OK");
                if (typeof _proj_data_tabopen == 'function') {
                   _proj_data_tabopen('/h5creator/proj/data/list?proj='+projCurrent, 1);
                }
            } else {
                hdev_header_alert("alert-error", time +" "+ rsp);
            }
        }
    });
});

</script>
