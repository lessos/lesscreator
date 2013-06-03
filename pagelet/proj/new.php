<?php

$basedir = H5C_DIR;

if (!isset($this->req->projid)
    || strlen($this->req->projid) < 1) {
    $projid = hwl_string::rand(8, 2);
} else {
    $projid = $this->req->projid;
}

if (isset($this->req->basedir)
    && strlen($this->req->basedir)) {
    $basedir = $this->req->basedir;
}
$basedir = rtrim(preg_replace("/\/\/+/", "/", $basedir), '/');

$f = "{$basedir}/{$projid}/lcproject.json";
$f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);
if (file_exists($f)) {
    die('Cannot create Project: AppID exists');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST'
    || $_SERVER['REQUEST_METHOD'] == 'PUT') {
    
    if (!strlen($this->req->name)) {
        die("Name cannot be null");
    }

    if (!strlen($projid)) {
        die("Name cannot be null");
    }

    $set = array(
        'projid'   => $projid,
        'name'    => $this->req->name,
        'summary' => $this->req->summary,
        'version' => '0.0.1',
        'release' => '0',
        'depends' => '',
        'props'   => '',
    );
    if (isset($this->req->props)) {
        $set['props'] = implode(",", $this->req->props);
    }

    $str  = hwl\Yaml\Yaml::encode($set);
    if (hwl_Fs_Dir::mkfiledir($f, 0755)) {
        $fp = fopen($f, 'w');
        fwrite($fp, $str);
        fclose($fp);
        chmod($f, 0664);
        $msg = "OK";
    } else {
        $msg = "ERROR";
    }

    die($msg);
}
?>

<div class="h5c_alert displaynone" style="padding:10px;">
<div class="alert alert-success">
  <p>
    <strong>Success!</strong>
  </p>
  <p>
    Well done! You successfully create new project.
  </p>
  <br />
  <p>
    <button class="btn btn-success" onclick="_proj_new_goto()">Open this Project ...</button>
  </p>
</div>
</div>

<form id="_proj_new_form" action="/h5creator/proj/new/" method="post" style="padding:10px;">
  
  <input id="basedir" name="basedir" type="hidden" class="_proj_new_basedir" value="<?php echo $basedir?>" />
  
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
          <input id="projid" name="projid" type="text" class="span2" value="<?php echo $projid?>" />
        </div>
        <div id="_proj_new_dir" class="displaynone" style="margin:0 0 5px 0;"></div>
      </td>
    </tr>
    <tr>
      <td valign="top"><strong>Services</strong></td>
      <td>
        <?php
        $srvs = h5creator_service::listAll();
        foreach ($srvs as $k => $v) {
            echo "<label class=\"checkbox\">
                <input type=\"checkbox\" name=\"props[]\" value=\"{$k}\" /> {$v}
                </label>";       
        }
        ?>
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
            
            <button class="btn" onclick="h5cDialogClose()">Close</button>
        </td>
        <td width="20px"></td>
    </tr>
</table>

<script>
var _basedir = '<?php echo $basedir?>';
var _projid = "";

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
                $("#_proj_new_open_btn").hide();
                $("#_proj_new_form").hide();
                $(".h5c_alert").show();

                _basedir = $("#basedir").val();
                _projid   = $("#projid").val();
            } else {
                alert(data);
            }            
        }
    });

    return;
}

function _proj_new_goto()
{
    window.open("/h5creator/index?proj="+ _basedir +"/"+ _projid, "_blank");
}

</script>
