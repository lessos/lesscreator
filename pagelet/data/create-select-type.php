
<table class="h5c_dialog_header" width="100%">
    <tr>
        <td width="20px"></td>
        <td style="font-size:14px;font-weight:bold;">Select the type of Data Instance</td>
    </tr>
</table>

<div id="_data_create_body" class="h5c_gen_scroll">

<a class="h5c-data-create" href="#data/create-ts">
<table width="100%" class="h5c_dialog_listview">
    <tr class="line">
        <td width="20px"></td>
        <td width="60px"><img src="/h5creator/static/img/proj-example.png" /></td>
        <td >
            Open Table Service
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
        <td width="20px"></td>
    </tr>
</table>
</a>

<a class="h5c-data-create" href="#data/create-sql">
<table width="100%" class="h5c_dialog_listview">
    <tr class="line">
        <td width="20px"></td>
        <td width="60px"><img src="/h5creator/static/img/proj-example.png" /></td>
        <td >
            Relational Database Service (TODO)
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
        <td width="20px"></td>
    </tr>
</table>
</a>

<a class="h5c-data-create" href="#data/create-kv">
<table width="100%" class="h5c_dialog_listview">
    <tr class="line">
        <td width="20px"></td>
        <td width="60px"><img src="/h5creator/static/img/proj-example.png" /></td>
        <td >
            Key-Value Database Service (TODO)
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
        <td width="20px"></td>
    </tr>
</table>
</a>

</div>

<table id="_data_create_foo" class="h5c_dialog_footer" width="100%">
    <tr>        
        <td align="right">
            <button class="btn pull-right" onclick="h5cDialogClose()">Close</button>
        </td>
        <td width="20px"></td>
    </tr>
</table>

<script>
$(".h5c-data-create").click(function(){
        
    var href = $(this).attr('href');
    href = href.replace("#", "");

    var url = "";
    var title = "";
    switch (href) {
    case "data/create-ts":
        url = href;
        title = 'Instance Setting';
        break;
    default:
        return;
    }

    h5cDialogNext('/h5creator/'+ url +'?dialogprev=/h5creator/data/create', title);
});

function _data_create_resize()
{
    bp = $("#_data_create_body").position();
    fp = $("#_data_create_foo").position();
    $("#_data_create_body").height(fp.top - bp.top);
}
_data_create_resize();
</script>