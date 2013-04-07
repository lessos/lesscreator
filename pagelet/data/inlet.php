<?php

$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);
if (!isset($projInfo['appid'])) {
    die("Bad Request");
}

if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("The instance does not exist");
}
$dataid = $this->req->id;
$fsd = $projPath."/data/{$dataid}.db.json";
if (!file_exists($fsd)) {
    die("Bad Request");
}
$dataInfo = file_get_contents($fsd);
$dataInfo = json_decode($dataInfo, true);

?>

<div style="padding:0px;">

<div style="padding:10px; background-color:#f6f7f8;">
    <span>
        <img src="/h5creator/static/img/database.png" /> 
        <strong>Data Instance</strong>: #<?php echo $dataid?>
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
var id = '<?php echo $dataid?>';

$('.sk79ve').click(function() {    
    
    url = $(this).attr('href').substr(1);
    _data_inlet_open("/h5creator/"+url);

    $(".fc4exa li.active").removeClass("active");
    $(this).parent().addClass("active");
});

function _data_inlet_open(url)
{
    $.ajax({
        url     : url +"?proj="+ projCurrent +"&id="+ id,
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
