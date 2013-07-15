<?php

$path = $this->req->path;
?>

<form id="ok8lnk" action="#" method="post">
    <img src="/h5creator/static/img/page_white_get.png" align="absmiddle" />
    <span class="path"><?php echo $path?></span> /
    <input id="attachment" name="attachment" size="40" type="file" />
</form>

<script type="text/javascript">

lessModalButtonAdd("zrkyom", "Upload", "_fs_file_upl()", "btn-inverse pull-left");
lessModalButtonAdd("mqaayo", "Cancel", "lessModalClose()", "pull-left");


var path = '<?php echo $path?>';


$("#ok8lnk").submit(function(event) {

    event.preventDefault(); 

    _fs_file_upl();
});

function _fs_file_upl()
{
    var files = document.getElementById('attachment').files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }

    for (var i = 0, file; file = files[i]; ++i) {
        
        if (file.size > 2 * 1024 * 1024) {
            hdev_header_alert('error', 'The file is too large to upload');
            return;
        }
                
        var reader = new FileReader();
        reader.onload = (function(file) {  
            return function(e) {
                if (e.target.readyState != FileReader.DONE) {
                    return;
                }

                var req = {
                    proj : sessionStorage.ProjPath,
                    path : path,
                    size : file.size,
                    name : file.name,
                    data : e.target.result,
                }

                $.ajax({
                    type    : "POST",
                    url     : "/h5creator/api?func=fs-file-upl",
                    data    : JSON.stringify(req),
                    timeout : 3000,
                    success : function(rsp) {

                        var obj = JSON.parse(rsp);
                        if (obj.Status == 200) {
                            hdev_header_alert('success', "OK");
                        } else {
                            hdev_header_alert('error', obj.Msg);
                        }

                        _fs_file_new_callback(req.path);
                        
                        lessModalClose();
                    },
                    error   : function(xhr, textStatus, error) {
                        hdev_header_alert('error', textStatus+' '+xhr.responseText);
                    }
                });    

            };  
        })(file); 
        
        reader.readAsDataURL(file);
    }
}

</script>