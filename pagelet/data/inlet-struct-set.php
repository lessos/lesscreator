<?php



if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("400");
}

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1:9530");

$set = array();
$struct = array();


$rs = $h5->Get("/h5db/struct/{$this->req->id}");
if (!isset($this->req->fsname)) {
    if (strlen($rs) > 0) {
        $rs = json_decode($rs, true);
        if (is_array($rs)) {
            foreach ($rs as $v) {
                $struct[$v['n']] = array(
                    'n' => $v['n'],
                    't' => $v['t'],
                    'l' => $v['l'],
                    'i' => $v['i'],
                );
            }
        }
    }
}
print_r($this->req);
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    print_r($this->req);
    foreach ($this->req->fsname as $k => $v) {

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
        
        $struct[$v] = array(
            'n' => $v,
            't' => $set['fstype'][$k],
            'l' => $set['fslen'][$k],
            'i' => $set['fsidx'][$k],
        );
    }
    $h5->Set("/h5db/struct/{$this->req->id}", json_encode($struct));
    
    // TODO ACTION
    die("OK");
}
?>

<form id="h5c_inlet_struct_set_form" action="/h5creator/data/inlet-struct-set">
    
    <input type="hidden" name="id" value="<?php echo $this->req->id?>" />

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
                <td><input type="text" value="id"  readonly="readonly" class="input-medium"/></td>
                <td><input type="text" value="字符串 (varchar)" readonly="readonly" class="input-medium"/></td>
                <td><input type="text" value="40" readonly="readonly" class="input-mini"/></td>
                <td><input type="checkbox" value="1" readonly="readonly" checked /> </td>
                <td></td>
            </tr>
            <?php
            foreach ($struct as $k => $v) {
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
        </table>
        
        <input type="submit" class="btn" value="提交" />

        <a href="javascript:_row_append()">添加字段</a><br /><br />
        
  
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

$("#h5c_inlet_struct_set_form").submit(function(event) {


    console.log($(this).serialize());

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
        url: $("#h5c_inlet_struct_set_form").attr('action') + "?_=" + Math.random(),
        data: $(this).serialize(),
        success: function(rsp) {
            if (rsp == "OK") {
                hdev_header_alert("alert-success", time +" 配置成功");
            } else {
                alert(rsp);
                hdev_header_alert("alert-error", time +" "+ rsp);
            }
        }
    });
});

</script>
