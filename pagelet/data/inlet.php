<?php


if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("The instance does not exist");
}

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1");

$info = $h5->Get("/h5db/info/{$this->req->id}");
$info = json_decode($info, true);

?>

<div style="padding:0px;">

<div style="padding:10px; background-color:#f6f7f8;">
    <span>
        <img src="/h5creator/static/img/database.png" /> 
        <strong>Data Instance</strong>: #<?php echo $this->req->id?>
    </span>
</div>

<ul class="h5c_navtabs _data_inlet_nav" style="background-color:#f6f7f8;">
  <li class="active">
    <a href="#data/inlet-desc" class="_data_inlet_nav_href">Description</a>
  </li>
  <li><a href="#data/inlet-struct" class="_data_inlet_nav_href">Structure</a></li>
</ul>

<div id="_data_inlet_body" style="padding:5px;"></div>

</div>

<script>
var id = '<?php echo $this->req->id?>';

$('._data_inlet_nav_href').click(function() {    
    
    url = $(this).attr('href').substr(1);
    _data_inlet_open("/h5creator/"+url);

    $("._data_inlet_nav li.active").removeClass("active");
    $(this).parent().addClass("active");
});

function _data_inlet_open(url)
{
    $.ajax({
        url     : url +"?id="+ id,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {            
            $("#_data_inlet_body").empty().html(rsp);                      
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
