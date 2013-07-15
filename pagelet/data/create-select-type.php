
<div class="alert alert-info">Select the type of DataSet</div>

<a class="j4soeo" href="#data/create-ts">
<table width="100%" class="h5c_dialog_listview">
    <tr class="line">
        <td width="10px"></td>
        <td width="60px"><img src="/h5creator/static/img/proj-example.png" /></td>
        <td >
            BigTable Service
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
        <td width="10px"></td>
    </tr>
</table>
</a>

<a class="j4soeo" href="#data/create-rds">
<table width="100%" class="h5c_dialog_listview">
    <tr class="line">
        <td width="10px"></td>
        <td width="60px"><img src="/h5creator/static/img/proj-example.png" /></td>
        <td >
            Relational Database Service
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
        <td width="10px"></td>
    </tr>
</table>
</a>

<a class="j4soeo" href="#data/create-kv">
<table width="100%" class="h5c_dialog_listview">
    <tr class="">
        <td width="10px"></td>
        <td width="60px"><img src="/h5creator/static/img/proj-example.png" /></td>
        <td >
            Key-Value Database Service (TODO)
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
        <td width="10px"></td>
    </tr>
</table>
</a>

<script>

lessModalButtonAdd("doo8l6", "Close", "lessModalClose()", "");


$(".j4soeo").click(function(){
        
    var href = $(this).attr('href').substr(1);

    var url = '/h5creator/';
    var title = "";
    switch (href) {
    case "data/create-ts":
        url += href;
        title = 'New DataSet - BigTable';
        break;
    case "data/create-rds":
        url += href;
        title = 'New DataSet - Relational Database';
        break;
    default:
        return;
    }
    url += '?proj='+ projCurrent;

    lessModalNext(url, title, null);
});

function _data_create_resize()
{
    bp = $("#_data_create_body").position();
    fp = $("#_data_create_foo").position();
    $("#_data_create_body").height(fp.top - bp.top);
}
//_data_create_resize();


</script>
