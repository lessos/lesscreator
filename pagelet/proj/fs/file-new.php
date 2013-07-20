<?php

$path = preg_replace("/\/+/", "/", '/'.$this->req->path.'/');
$type = $this->req->type;

?>


<form id="egj3zj" action="/h5creator/proj/fs/file-new" method="post">

  <div class="input-prepend" style="margin-left:2px">
    <span class="add-on">
        <img src="/h5creator/static/img/folder_add.png" class="h5c_icon" />
        <?php echo $path?>
    </span>
    <input type="text" name="name" value="" class="span2 hutjzx" />
    <input type="hidden" name="path" value="<?php echo $path?>" />
    <input type="hidden" name="type" value="<?php echo $type?>" />
  </div>

</form>

<script type="text/javascript">

lessModalButtonAdd("k8wf2g", "Create", "_fs_file_new()", "btn-inverse pull-left");
lessModalButtonAdd("nnjyyb", "Cancel", "lessModalClose()", "pull-left");

//$(".hutjzx").focus();

$("#egj3zj").submit(function(event) {

    event.preventDefault();

    _fs_file_new();
});

function _fs_file_new()
{    
    var path = lessSession.Get("ProjPath");
    path += "/"+ $("#egj3zj").find("input[name=path]").val();
    path += "/"+ $("#egj3zj").find("input[name=name]").val();

    var req = {
        "access_token" : lessCookie.Get("access_token"),
        "data" : {
            "type" : $("#egj3zj").find("input[name=type]").val(),
            "path" : path,
        }
    }

    $.ajax({
        type    : "POST",
        url     : "/h5creator/api?func=fs-file-new",
        //dataType: 'json',
        data    : JSON.stringify(req),
        timeout : 3000,
        success : function(rsp) {

            var obj = JSON.parse(rsp);
            if (obj.status == 200) {
                hdev_header_alert('success', "OK");
            } else {
                hdev_header_alert('error', obj.message);
            }

            _fs_file_new_callback($("#egj3zj").find("input[name=path]").val());
            lessModalClose();
        },
        error   : function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}

</script>

