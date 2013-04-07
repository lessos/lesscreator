<div id="_data_create_idx">

</div>
<script>
function _data_create_open(url)
{
    $.ajax({
        url     : url,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {            
            $("#_data_create_idx").empty().html(rsp);                      
        },
        error: function(xhr, textStatus, error) {
            alert("ERROR:"+ xhr.responseText);
            hdev_header_alert('error', xhr.responseText);
        }
    });
}

_data_create_open("/h5creator/data/create-select-type?proj="+ projCurrent);
</script>
