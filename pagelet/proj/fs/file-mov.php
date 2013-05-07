<?php

$path = preg_replace("/\/+/", "/", rtrim("/".$this->req->path, '/'));

$curname = substr($path, strrpos($path, "/") + 1);
$pathpre = substr($path, 0, strrpos($path, "/"));

?>


<form id="c1qtiv" action="/h5creator/proj/fs/file-mov" method="post">

  <div class="input-prepend" style="margin-left:2px">
    <span class="add-on">
        <img src="/h5creator/static/img/folder_edit.png" class="h5c_icon" />
        <?php echo $pathpre?>/
    </span>
    <input type="text" name="name" value="<?php echo $curname?>" class="span2 k2tcrh" />
    <input type="hidden" name="pathold" value="<?php echo $path?>" />
    <input type="hidden" name="pathpre" value="<?php echo $pathpre?>" />
  </div>

</form>

<script type="text/javascript">

h5cModalButtonAdd("fjbcw8", "Create", "_fs_file_mov()", "btn-inverse pull-left");
h5cModalButtonAdd("y9e9be", "Cancel", "h5cModalClose()", "pull-left");

$(".k2tcrh").focus();

$("#c1qtiv").submit(function(event) {

    event.preventDefault();

    _fs_file_mov();
});

function _fs_file_mov()
{
    var req = {
        proj : sessionStorage.ProjPath,
        name : $("#c1qtiv").find("input[name=name]").val(),
        pathold : $("#c1qtiv").find("input[name=pathold]").val(),
        pathpre : $("#c1qtiv").find("input[name=pathpre]").val(),
    }

    $.ajax({
        type    : "POST",
        url     : "/h5creator/api?func=fs-file-mov",
        //dataType: 'json',
        data    : JSON.stringify(req),
        timeout : 3000,
        success : function(rsp) {

            var obj = JSON.parse(rsp);
            if (obj.Status == 200) {
                hdev_header_alert('success', "OK");
            } else {
                hdev_header_alert('error', obj.Msg);
            }

            _fs_file_new_callback(req.pathpre);
            h5cModalClose();
        },
        error   : function(xhr, textStatus, error) {
            hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}

</script>

