<?php

$projPath = h5creator_proj::path($this->req->proj);
$projInfo = h5creator_proj::info($this->req->proj);
if (!isset($projInfo['appid'])) {
    die("Bad Request");
}

if (!isset($this->req->data) || strlen($this->req->data) == 0) {
    die("The instance does not exist");
}
list($datasetid, $tableid) = explode("/", $this->req->data);
$fsd = $projPath."/data/{$datasetid}.ds.json";
if (!file_exists($fsd)) {
    die("Bad Request");
}
$dataInfo = file_get_contents($fsd);
$dataInfo = json_decode($dataInfo, true);

$fsdt = $projPath."/data/{$datasetid}/{$tableid}.tbl.json";
if (!file_exists($fsdt)) {
    die("Bad Request");
}
$tableInfo = file_get_contents($fsd);
$tableInfo = json_decode($tableInfo, true);

?>

<div style="padding:0px;">

<div style="padding:10px; background-color:#f6f7f8;">
    <span>
        <strong>Table</strong>: <?php echo $tableInfo['tablename']?>
    </span>
</div>

<ul class="h5c_navtabs fc4exa" style="background-color:#f6f7f8;">
  <li class="active">
    <a href="#data/inlet-table-info" class="sk79ve">Overview</a>
  </li>
  <li><a href="#data/inlet-table-schema" class="sk79ve">Structure</a></li>
</ul>

<div id="vey476" style="padding:10px;"></div>

</div>

<script>
var data = '<?php echo $this->req->data?>';

$('.sk79ve').click(function() {    
    
    url = $(this).attr('href').substr(1);
    _data_inlet_open("/h5creator/"+url);

    $(".fc4exa li.active").removeClass("active");
    $(this).parent().addClass("active");
});

function _data_inlet_open(url)
{
    $.ajax({
        url     : url +"?proj="+ projCurrent +"&data="+ data,
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

function _data_inlet_schema_edit()
{
    _data_inlet_open("/h5creator/data/inlet-table-schema-set");
}

_data_inlet_open("/h5creator/data/inlet-table-info");
</script>
