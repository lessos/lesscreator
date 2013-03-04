<?php


if (!isset($this->req->id) || strlen($this->req->id) == 0) {
    die("The instance does not exist");
}

$h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1");

$info = $h5->Get("/h5db/info/{$this->req->id}");
$info = json_decode($info, true);

?>

<div style="padding:10px;">

<div>
    <span><img src="/h5creator/static/img/database.png" /> <strong>Data Instance</strong>: #<?php echo $this->req->id?></span>
</div>

<ul class="nav nav-tabs _data_inlet_nav">
  <li class="active">
    <a href="#/h5creator/data/inlet-desc" class="_data_inlet_nav">Description</a>
  </li>
  <li><a href="#/h5creator/data/inlet-struct" class="_data_inlet_nav">Structure</a></li>
</ul>

<div id="_data_inlet_body"></div>

</div>

<script>
var id = '<?php echo $this->req->id?>';

$('._data_inlet_nav').click(function() {    
    
    url = $(this).attr('href').substr(1);
    _data_inlet_open(url);

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

_data_inlet_open("/h5creator/data/inlet-desc");
</script>
