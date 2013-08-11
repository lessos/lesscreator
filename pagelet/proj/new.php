<?php

use LessPHP\Encoding\Json;

if (!isset($this->req->projid)
    || strlen($this->req->projid) < 1) {
    $projid = LessPHP_Util_String::rand(8, 2);
} else {
    $projid = $this->req->projid;
}

if (isset($this->req->basedir)
    && strlen($this->req->basedir)) {
    $basedir = $this->req->basedir;
} else {
    $basedir = $_COOKIE['basedir'];
}
$basedir = rtrim(preg_replace("/\/\/+/", "/", $basedir), '/');



if ($_SERVER['REQUEST_METHOD'] == 'POST'
    || $_SERVER['REQUEST_METHOD'] == 'PUT') {

    $ret = array(
        'status'  => 200,
        'message' => '',
    );

    try {

        $f = "{$basedir}/app/{$projid}/lcproject.json";
        $f = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $f);

        $rs = lesscreator_fs::FsFileGet($f);
        if ($rs->status == 200) {
            throw new \Exception("Project exists");
        }
        
        if (!strlen($this->req->name)) {
            throw new \Exception("Name cannot be null", 400);
        }

        if (!strlen($projid)) {
            throw new \Exception("Project ID cannot be null", 400);
        }

        $set = array(
            'projid'  => $projid,
            'name'    => $this->req->name,
            'summary' => $this->req->summary,
            'version' => '0.0.1',
            'release' => '0',
            'depends' => '',
            'props'   => '',
            'types'   => '',
        );
        if (isset($this->req->props)) {
            $set['props'] = implode(",", $this->req->props);
        }
        if (isset($this->req->types)) {
            $set['types'] = implode(",", $this->req->types);
        }

        $rs = lesscreator_fs::FsFilePut($f, Json::PrettyPrint($set));
        if ($rs->status != 200) {
            throw new \Exception($rs->message);
        }

    } catch (\Exception $e) {
        $ret['status']  = $e->getCode();
        $ret['message'] = $e->getMessage();
    }

    die(json_encode($ret));
}
?>

<div id="m4ph6m" class="hide"></div>
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

<form id="_proj_new_form" action="/lesscreator/proj/new/" method="post" style="padding:10px;">
  
  <input id="basedir" name="basedir" type="hidden" class="_proj_new_basedir" value="<?php echo $basedir?>" />
  
  <table width="100%">
    <tr>
      <td width="100px"><strong>Name</strong></td>
      <td ><input name="name" type="text" value="" /></td>
    </tr>
    <tr>
      <td valign="top"><strong>Project ID</strong></td>
      <td>
        <div class="input-prepend">
          <button type="button" class="btn" onclick="_proj_new_dir('')">
            <i class="icon-folder-close"></i>
            <span class="_proj_new_basedir_dp"><?php echo $basedir?>/app/</span>
          </button>
          <input id="projid" name="projid" type="text" class="span2" value="<?php echo $projid?>" />
        </div>
        <div id="_proj_new_dir" class="displaynone" style="margin:0 0 5px 0;"></div>
      </td>
    </tr>
    <!-- TODO <tr>
      <td valign="top"><strong>Services</strong></td>
      <td>
        <?php
        $srvs = lesscreator_service::listAll();
        foreach ($srvs as $k => $v) {
            echo "<label class=\"checkbox\">
                <input type=\"checkbox\" name=\"props[]\" value=\"{$k}\" /> {$v}
                </label>";       
        }
        ?>
      </td>
    </tr> -->
    <tr>
      <td valign="top"><strong>Summary</strong></td>
      <td ><textarea name="summary" rows="3" style="width:400px;"></textarea></td>
    </tr>
  </table>
</form>


<script>
if (lessModalPrevId() != null) {
    lessModalButtonAdd("jwyztd", "Back", "lessModalPrev()", "pull-left h5c-marginl0");
}

lessModalButtonAdd("d4ngex", "Confirm and Create", "_proj_new_commit()", "btn-inverse");
lessModalButtonAdd("p5ke7m", "Close", "lessModalClose()", "");


var _basedir = '<?php echo $basedir?>';
var _projid = "";

function _proj_new_dir(path)
{
    return; // TODO

    if (path.length < 1) {
        path = _basedir;
    }

    $.get('/lesscreator/proj/new-fs?path='+ path, function(data) {
        
        $('#_proj_new_dir').empty();
        //bh = $("#_proj_new_form").height();

        $('#_proj_new_dir').html(data).show();

        //bp = $("#_proj_new_form").position();
        
        //$("#_proj_new_dir_body").height(fp.top - bp.top - bh - 70);        

        $("._proj_new_basedir").val(path);
        $("._proj_new_basedir_dp").text(path +'/');
    });
}

function _proj_new_commit()
{
    $.ajax({
        type    : "POST",
        url     : $("#_proj_new_form").attr('action'),
        data    : $("#_proj_new_form").serialize(),
        success : function(rsp) {
//console.log(rsp);
            try {
                var rsj = JSON.parse(rsp);
            } catch (e) {
                lessAlert("#m4ph6m", "alert-error", "Error: Service Unavailable");
                return;
            }

            if (rsj.status == 200) {

                //$("#_proj_new_open_btn").hide();
                //$("#_proj_new_form").hide();
                //$(".h5c_alert").show();

                _basedir = $("#basedir").val();
                _projid  = $("#projid").val();

                lessAlert("#m4ph6m", "alert-success", "<p><strong>Well done!</strong> \
                    You successfully create new project.</p> \
                    <button class=\"btn btn-success\" onclick=\"_proj_new_goto()\">Open this Project</button>");

            } else {
                lessAlert("#m4ph6m", "alert-error", "Error: "+ rsj.message);
            }
        },
        error: function(xhr, textStatus, error) {
            lessAlert("#m4ph6m", "alert-error", "Error: "+ xhr.responseText);
        }
    });

    return;
}

function _proj_new_goto()
{
    window.open("/lesscreator/index?proj="+ _basedir +"/app/"+ _projid, "_blank");
}

</script>
