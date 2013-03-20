<?php
$projbase = H5C_DIR;

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("The instance does not exist");
}

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1");

$info = $h5->Get("/h5db/info/{$this->req->id}");
$info = json_decode($info, true);


$proj  = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
$dataj = array();
$fsd = $projpath."/data/{$this->req->id}.json";
if (file_exists($fsd)) {
    $dataj = file_get_contents($fsd);
    $dataj = json_decode($dataj, true);
}
if (is_writable($projpath."/data")) {
    
    if (!isset($dataj['id'])) {
        $dataj = array(
            'id'        => $this->req->id,
            'created'   => time(),
            'name'      => null,
        );
    }
    if ($dataj['name'] != $info['title']) {
        $dataj['name']      = $info['title'];
        $dataj['updated']   = time();
        file_put_contents($fsd, hwl_Json::prettyPrint($dataj));
    }
}
?>

<div style="padding:0px;">

<div style="padding:10px; background-color:#f6f7f8;">
    <span>
        <img src="/h5creator/static/img/database.png" /> 
        <strong>Data Instance</strong>: #<?php echo $this->req->id?>
    </span>
</div>

<ul class="h5c_navtabs fc4exa" style="background-color:#f6f7f8;">
  <li class="active">
    <a href="#data/inlet-desc" class="sk79ve">Overview</a>
  </li>
  <li><a href="#data/inlet-struct" class="sk79ve">Structure</a></li>
</ul>

<div id="vey476" style="padding:5px;"></div>

</div>

<script>
var id = '<?php echo $this->req->id?>';

$('.sk79ve').click(function() {    
    
    url = $(this).attr('href').substr(1);
    _data_inlet_open("/h5creator/"+url);

    $(".fc4exa li.active").removeClass("active");
    $(this).parent().addClass("active");
});

function _data_inlet_open(url)
{
    $.ajax({
        url     : url +"?id="+ id,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {            
            $("#vey476").empty().html(rsp);
            if (typeof _proj_data_tabopen == 'function') {
                _proj_data_tabopen('/h5creator/proj/data/list?proj='+projCurrent, 1);
            }
        },
        error: function(xhr, textStatus, error) {
            alert("ERROR:"+ xhr.responseText);
            hdev_header_alert('error', xhr.responseText);
        }
    });
}

function _data_inlet_desc_edit()
{
    _data_inlet_open("/h5creator/data/inlet-desc-set");
}
function _data_inlet_struct_edit()
{
    _data_inlet_open("/h5creator/data/inlet-struct-set");
}


_data_inlet_open("/h5creator/data/inlet-desc");
</script>