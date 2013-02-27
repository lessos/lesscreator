<?php

$basedir = H5C_DIR;

if (!isset($this->req->appid)
    || strlen($this->req->appid) < 1) {
    $appid = hwl_string::rand(8, 2);
} else {
    $appid = $this->req->appid;
}

if (isset($this->req->basedir)
    && strlen($this->req->basedir)) {
    $basedir = $this->req->basedir;
}
$basedir = rtrim(preg_replace("/\/\/+/", "/", $basedir), '/');

$f = "{$basedir}/{$appid}/hootoapp.yaml";
$f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);
if (file_exists($f)) {
    die('Cannot create Project: AppID exists');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST'
    || $_SERVER['REQUEST_METHOD'] == 'PUT') {
    
    if (!strlen($this->req->name)) {
        die("Name cannot be null");
    }

    if (!strlen($appid)) {
        die("Name cannot be null");
    }

    $set = array(
        'appid'   => $appid,
        'name'    => $this->req->name,
        'summary' => $this->req->summary,
        'version' => '0.0.1',
        'release' => '0',
        'depends' => '',
    );
    $str  = hwl\Yaml\Yaml::encode($set);
    if (hwl_Fs_Dir::mkfiledir($f, 0755)) {
        if (!is_writable($f)) {
            //die("Permission denied: failed to open $f");
        }
        $fp = fopen($f, 'w');
        fwrite($fp, $str);
        fclose($fp);
        $msg = "OK";
    } else {
        $msg = "ERROR";
    }

    die($msg);
}
?>

<form id="_proj_new_form" action="/h5creator/proj/new/" method="post" style="padding:10px;">
  
  <input name="basedir" type="hidden" class="_proj_new_basedir" value="<?php echo $basedir?>" />
  
  <table width="100%">
    <tr>
      <td width="100px"><strong>Name</strong></td>
      <td ><input name="name" type="text" value="" /></td>
    </tr>
    <tr>
      <td valign="top"><strong>AppID</strong></td>
      <td>
        <div class="input-prepend">
          <button type="button" class="btn" onclick="_proj_new_dir('')">
            <i class="icon-folder-close"></i>
            <span class="_proj_new_basedir_dp"><?php echo $basedir?>/</span>
          </button>
          <input id="appid" name="appid" type="text" class="span2" value="<?php echo $appid?>" />
        </div>
        <div id="_proj_new_dir" class="displaynone" style="margin:0 0 5px 0;"></div>
      </td>
    </tr>
    <tr>
      <td valign="top"><strong>Summary</strong></td>
      <td ><textarea name="summary" rows="3" style="width:400px;"></textarea></td>
    </tr>
  </table>
</form>

<table id="_proj_new_foo" class="h5c_dialog_footer" width="100%">
    <tr> 
        <td width="20px"></td>
        <td>
            <button id="_proj_new_open_btn" class="btn btn-inverse" onclick="_proj_new_commit()">Create Project</button>
        </td>
        <td align="right">
            
            <button class="btn " onclick="h5cDialogClose()">Close</button>
        </td>
        <td width="20px"></td>
    </tr>
</table>


<script>
var _basedir = '<?php echo $basedir?>';
function _proj_new_dir(path)
{
    if (path.length < 1) {
        path = _basedir;
    }

    $.get('/h5creator/proj/new-fs?path='+ path, function(data) {
        
        $('#_proj_new_dir').empty();
        bh = $("#_proj_new_form").height();

        $('#_proj_new_dir').html(data).show();
        fp = $("#_proj_new_foo").position();
        bp = $("#_proj_new_form").position();
        
        $("#_proj_new_dir_body").height(fp.top - bp.top - bh - 70);        

        $("._proj_new_basedir").val(path);
        $("._proj_new_basedir_dp").text(path +'/');
    });
}

function _proj_new_commit()
{            
    $.ajax({
        type: "POST",
        url: $("#_proj_new_form").attr('action'),
        data: $("#_proj_new_form").serialize(),
        success: function(data) {
            if (data == "OK") {
                // alert('Successfully created');
                window.open("http://www.w3schools.com");
                return;
            }
            
            alert(data);
            
                //
//                window.open("/h5creator/index?proj="+ _basedir +"/"+ $("#appid").val(), '_blank');
//                window.focus();

                
            
            //window.location = "/h5creator/index?proj="+ _basedir +"/"+ $("#appid").val();
        }
    });

    return;
}

</script>