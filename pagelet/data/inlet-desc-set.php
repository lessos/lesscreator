<?php

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("400");
}

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1:9530");

$info = $h5->Get("/h5db/info/{$this->req->id}");
$info = json_decode($info, true);

if (!isset($info['title'])) {
    die("400");
}

$info['id'] = $this->req->id;


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($this->req->title)) {
        $info['title'] = $this->req->title;
    }

    $h5->Set("/h5db/info/{$this->req->id}", json_encode($info));   
    
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
        <td><input type="text" name="title" value="<?php echo $info['title']?>" /></td>
    </tr>
    <tr>
        <td></td>
        <td><input type="submit" class="btn" value="提交" /></td>
    </tr>
  </table>
  
</form>

<script>
$("#sgpq5k").submit(function(event) {

    event.preventDefault();
    
    var time = new Date().format("yyyy-MM-dd HH:mm:ss");
    $.ajax({ 
        type: "POST",
        url: $("#sgpq5k").attr('action') +"?_="+ Math.random(),
        data: $(this).serialize(),
        success: function(rsp) {
            if (rsp == "OK") {
                hdev_header_alert("alert-success", time +" 配置成功");
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
