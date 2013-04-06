<?php

$projbase = H5C_DIR;

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
$projpath = preg_replace("/\/+/", "/", rtrim($projpath, '/'));

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("Bad Request");
}
$dbid = $this->req->id;

$h5 = new LessPHP_Service_H5keeper("127.0.0.1:9530");


$info = $h5->Get("/h5db/info/{$this->req->id}");
$info = json_decode($info, true);
if (!isset($info['name'])) {
    die("Bad Request");
}


$fsp = $projpath."/hootoapp.yaml";
if (file_exists($fsp)) {
    $projInfo = file_get_contents($fsp);
    $projInfo = hwl\Yaml\Yaml::decode($projInfo);
    if ($projInfo['appid'] != $info['projid']) {
        die("Permission denied");
    }
}


$set = array();
$struct = array();

if (!isset($this->req->fsname)) {

    $rs = $h5->Get("/h5db/struct/{$dbid}");

    if (strlen($rs) > 0) {
        $rs = json_decode($rs, true);
        if (is_array($rs)) {
            foreach ($rs as $v) {
                $struct[$v['Name']] = array(
                    'Name' => $v['Name'],
                    'Type' => $v['Type'],
                    'Len' => $v['Len'],
                    'Idx' => $v['Idx'],
                );
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    //print_r($this->req);
    foreach ($this->req->fsname as $k => $v) {

        $v = str_replace(':', '_', $v);
        
        if (strlen($v) == 0) {
            continue;
        }

        if ($v == "id") {
            $this->req->fstype[$k] = 'ft_varchar';
        }
        
        if (in_array($this->req->fstype[$k], array('ft_int', 'ft_varchar'))
            && $this->req->fslen[$k] == 0) {
            die("`$v` Can not be null");
        }
        
        if (!isset($this->req->fsidx[$k])) {
            $this->req->fsidx[$k] = 0;
        }
        
        $struct[$v] = array(
            'Name' => "{$v}",
            'Type' => "{$this->req->fstype[$k]}",
            'Len' => "{$this->req->fslen[$k]}",
            'Idx' => "{$this->req->fsidx[$k]}",
        );
    }
    //print_r($this->req);
    //print_r($struct);
    // TODODB $h5->Set("/h5db/struct/{$dbid}", json_encode($struct));

    ////$h5->Set("/h5db/actor/setup/{$dbid}", time());


    $dataInfo = array();
    $fsd = $projpath."/data/{$dbid}.db.json";
    if (file_exists($fsd)) {
        $dataInfo = file_get_contents($fsd);
        $dataInfo = json_decode($dataInfo, true);
    }
    if (is_writable($projpath."/data")) {
    
        if (!isset($dataInfo['id'])) {
            $dataInfo = array(
                'id'        => $dbid,
                'created'   => time(),
                'name'      => null,
            );
        }
        $dataInfo['struct']    = $struct;
        $dataInfo['updated']   = time();
        $dataInfo['projid']    = $info['projid'];
        file_put_contents($fsd, hwl_Json::prettyPrint($dataInfo));
    }

    // TODO ACTION
    die("OK");
}
?>

<form id="bhw2j1" action="/h5creator/data/inlet-struct-set">
    
<input type="hidden" name="id" value="<?php echo $dbid?>" />

<table class="table" width="100%">
<thead>
    <tr>
        <th>名称</th>
        <th>类型</th>
        <th>长度(字符串、整数)</th>
        <th>是否索引?</th>
        <th>操作</th>
    </tr>
</thead>
<tbody id="field_list">
    <tr>
        <td><input type="text" name="fsname[0]" value="id"  readonly="readonly" class="input-medium"/></td>
        <td><input type="text" name="fstype[0]" value="字符串 (varchar)" readonly="readonly" class="input-medium"/></td>
        <td><input type="text" name="fslen[0]" value="40" readonly="readonly" class="input-mini"/></td>
        <td><input type="checkbox" name="fsidx[0]" value="1" readonly="readonly" checked /> </td>
        <td></td>
    </tr>
    <?php
    foreach ($struct as $k => $v) {
        if ($v['Name'] == 'id') {
            continue;
        }
        $checked = '';
        if ($v['Idx'] == 1) {
            $checked = 'checked';
        }
        ?>
        <tr>
            <td><input name="fsname[<?php echo $k?>]" type="text" value="<?= $v['Name'] ?>" class="input-medium"/></td>
            <td>
                <select name="fstype[<?php echo $k?>]" class="input-medium">
<option value="ft_varchar" <?php echo $v['Type'] == 'ft_varchar' ? 'selected' : ''; ?>>字符串 (varchar)</option>
<option value="ft_string" <?php echo $v['Type'] == 'ft_string' ? 'selected' : ''; ?>>文本 (text)</option>
<option value="ft_int" <?php echo $v['Type'] == 'ft_int' ? 'selected' : ''; ?>>整数 (int)</option>
<option value="ft_timestamp" <?php echo $v['Type'] == 'ft_timestamp' ? 'selected' : ''; ?>>Unix 时间 (int)</option>
<option value="ft_blob" <?php echo $v['Type'] == 'ft_blob' ? 'selected' : ''; ?>>二进制</option>
                </select>
            </td>
            <td><input name="fslen[<?php echo $k?>]" type="text" value="<?= $v['Len'] ?>" class="input-mini"/></td>
            <td><input name="fsidx[<?php echo $k?>]" type="checkbox" value="1" <?php echo $checked?> /> </td>
            <td><a href="javascript:void(0)" onclick="_field_del(this)">删除</a></td>
        </tr>
        <?php
    }
    ?>            
</tbody>
</table>

<input type="submit" class="btn" value="提交" />
<a href="javascript:_row_append()">添加字段</a>
 
</form>

<script>
function _field_del(field) {
    $(field).parent().parent().remove();
}

function _row_append() {

    sid = Math.random() * 1000000000;
    
    entry = '<tr> \
      <td><input name="fsname['+sid+']" type="text" value="" class="input-medium"/></td> \
      <td> \
        <select name="fstype['+sid+']" class="input-medium"> \
            <option value="ft_varchar">字符串 (varchar)</option> \
            <option value="ft_string">文本 (text)</option> \
            <option value="ft_int">整数 (int)</option> \
            <option value="ft_timestamp">Unix 时间 (int)</option> \
            <option value="ft_blob">二进制</option> \
        </select> \
      </td> \
      <td><input name="fslen['+sid+']" type="text" value="" class="input-mini"/></td>\
      <td><input name="fsidx['+sid+']" type="checkbox" value="1" /> </td>\
      <td><a href="javascript:void(0)" onclick="_field_del(this)">删除</a></td> \
    </tr>';
    $("#field_list").append(entry);
}

$("#bhw2j1").submit(function(event) {

    //console.log($(this).serialize());

    event.preventDefault();
    
    var fs = $('input[name^="fsname"]');
    fs.each(function (i,f) {
        var fn = $(f).val();
        var reg = /^[a-zA-Z][a-zA-Z0-9_:]+$/; 
        if(!reg.test(fn)){
            hdev_header_alert("alert-error", fn+"格式不对！");
            return;
        }
    });

    var time = new Date().format("yyyy-MM-dd HH:mm:ss");   
    $.ajax({ 
        type    : "POST",
        url     : $(this).attr('action') +"?_="+ Math.random(),
        data    : $(this).serialize() +'&proj='+ projCurrent,
        success : function(rsp) {
            if (rsp == "OK") {
                hdev_header_alert("alert-success", time +" OK");
            } else {
                alert(rsp);
                hdev_header_alert("alert-error", time +" "+ rsp);
            }
        }
    });
});

</script>
