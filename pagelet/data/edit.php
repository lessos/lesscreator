<?php

$req = $this->req;

$mt = 'edit';

$set = array();

if (!isset($req->id) || strlen($req->id) == 0) {
    $set['id'] = LessPHP_Util_String::rand(12, 1);
    $mt = 'create';
} else {
    $set['id'] = $req->id;
}

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1:9530");

$info = $h5->Get("/h5db/info/{$set['id']}");
$info = json_decode($info, true);

if (!isset($set['title']) && isset($info['title'])) {
    $set['title'] = $info['title'];
} else if (!isset($set['title'])) {
    $set['title'] = '';
}
if (!isset($set['shard_min']) && isset($info['shard_min'])) {
    $set['shard_min'] = $info['shard_min'];
} else if (!isset($set['shard_min'])) {
    $set['shard_min'] = '2';
}
if (!isset($set['shard_max']) && isset($info['shard_max'])) {
    $set['shard_max'] = $info['shard_max'];
} else if (!isset($set['shard_max'])) {
    $set['shard_max'] = '2';
}


if (!isset($set['data']) || !is_array($set['data'])) {
    $set['data'] = array();
}

if (!isset($set['fsname']) || count($set['fsname']) == 0) {

    $data = $h5->Get("/h5db/struct/{$set['id']}");

    if (strlen($data) > 0) {
        $data = json_decode($data, true);
        if (is_array($data)) {
            foreach ($data as $v) {
                $set['data'][$v['n']] = array(
                    'n' => $v['n'],
                    't' => $v['t'],
                    'l' => $v['l'],
                    'i' => $v['i'],
                );
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
       
    foreach ($set['fsname'] as $k => $v) {

        $v = str_replace(':', '_', $v);
        
        if (strlen($v) == 0 || $v == "id") {
            continue;
        }
        
        if (in_array($set['fstype'][$k], array('ft_int', 'ft_varchar'))
            && $set['fslen'][$k] == 0) {
            die("字段 ($v) 长度不能为空");
        }
        
        if (!isset($set['fsidx'][$k])) {
            $set['fsidx'][$k] = 0;
        }
        
        $set['data'][$v] = array(
            'n' => $v,
            't' => $set['fstype'][$k],
            'l' => $set['fslen'][$k],
            'i' => $set['fsidx'][$k],
        );
    }
    unset($set['fsname'], $set['fstype'], $set['fslen'], $set['fsidx']);
    
    // TODO ACTION
    return;
}
?>

<form id="h5db-inst-edit-form" action="/h5dbueue/adm/instance-edit" class="form-horizontal">
  <table width="100%" cellpadding="3">
    <tr>
        <td width="120px"><strong>实例 ID</strong></td>
        <td><input type="text" name="id" placeholder="" value="<?php echo $set['id']?>" <?php if ($mt=='edit') echo 'readonly="readonly"'?>/> 字母、数字混合</td>
    </tr>
    <tr>
        <td><strong>名称</strong></td>
        <td><input type="text" name="title" placeholder="" value="<?php echo $set['title']?>" /></td>
    </tr>
    <tr>
        <td><strong>分片数(Min)</strong></td>
        <td><input type="text" name="shard_min" placeholder="" value="<?php echo $set['shard_min']?>" /></td>
    </tr>
    <tr>
        <td><strong>分片数(Max)</strong></td>
        <td><input type="text" name="shard_max" placeholder="" value="<?php echo $set['shard_max']?>" /></td>
    </tr>
    <tr>
        <td valign="top">
            <br /><strong>数据结构</strong>
        </td>
        <td>
        <table class="table table-striped" width="100%">
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
                <td><input type="text" value="id"  readonly="readonly" class="input-medium"/></td>
                <td><input type="text" value="字符串 (varchar)" readonly="readonly" class="input-medium"/></td>
                <td><input type="text" value="40" readonly="readonly" class="input-mini"/></td>
                <td><input type="checkbox" value="1" readonly="readonly" checked /> </td>
                <td></td>
            </tr>
            <?php
            foreach ($set['data'] as $k => $v) {
                if ($v['n'] == 'id') {
                    continue;
                }
                $checked = '';
                if ($v['i'] == 1) {
                    $checked = 'checked';
                }
                ?>
                <tr>
                    <td><input name="fsname[<?php echo $k?>]" type="text" value="<?= $v['n'] ?>" class="input-medium"/></td>
                    <td>
                        <select name="fstype[<?php echo $k?>]" class="input-medium">
<option value="ft_varchar" <?php echo $v['t'] == 'ft_varchar' ? 'selected' : ''; ?>>字符串 (varchar)</option>
<option value="ft_string" <?php echo $v['t'] == 'ft_string' ? 'selected' : ''; ?>>文本 (text)</option>
<option value="ft_int" <?php echo $v['t'] == 'ft_int' ? 'selected' : ''; ?>>整数 (int)</option>
<option value="ft_timestamp" <?php echo $v['t'] == 'ft_timestamp' ? 'selected' : ''; ?>>Unix 时间 (int)</option>
<option value="ft_blob" <?php echo $v['t'] == 'ft_blob' ? 'selected' : ''; ?>>二进制</option>
                        </select>
                    </td>
                    <td><input name="fslen[<?php echo $k?>]" type="text" value="<?= $v['l'] ?>" class="input-mini"/></td>
                    <td><input name="fsidx[<?php echo $k?>]" type="checkbox" value="1" <?php echo $checked?> /> </td>
                    <td><a href="javascript:void(0)" onclick="_field_del(this)">删除</a></td>
                </tr>
                <?php
            }
            ?>            
        </tbody>
        </table><a href="javascript:_row_append()">添加字段</a><br /><br />
        </td>
    </tr>
    <tr>
        <td></td>
        <td><input type="submit" class="btn btn-primary" value="提交" /></td>
    </tr>
  </table>
  
</form>

<script>

$(".alert").hide();

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

$("#h5db-inst-edit-form").submit(function(event) {

    event.preventDefault();
    
    var fs = $('input[name^="fsname"]');
    fs.each(function (i,f) {
        var fn = $(f).val();
        var reg = /^[a-zA-Z][a-zA-Z0-9_:]+$/; 
        if(!reg.test(fn)){
            tm_alert("h5db-alert", "alert-error", fn+"格式不对！");
            return;
        }
    });

    //$(".alert").hide();
    var time = new Date().format("yyyy-MM-dd HH:mm:ss"); 
    
    $.ajax({ 
        type: "POST",
        cache: false,
        url: $("#h5db-inst-edit-form").attr('action') + "?_=" + Math.random(),
        data: $(this).serialize(),
        success: function(data) {
            if (data == "OK") {
                tm_alert("h5db-alert", "alert-success", time +" 配置成功");
                //alert("配置成功");
            } else {
                tm_alert("h5db-alert", "alert-error", time +" "+ data);
                //alert(data);
            }
        }
    });
});

</script>
