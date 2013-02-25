
<table class="h5c_dialog_header" width="100%">
    <tr>
        <td width="20px"></td>
        <td style="font-size:14px;font-weight:bold;">Select the type of Data Instance</td>
    </tr>
</table>

<a class="h5c-data-create" href="#data/create-sql">
<table width="100%" class="h5c_dialog_listview">
    <tr class="line">
        <td width="20px"></td>
        <td width="60px"><img src="/h5creator/static/img/proj-example.png" /></td>
        <td >
            Relational Database Service
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

<table class="h5c_dialog_footer" width="100%">
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
    case "data/create-sql":
        url = href;
        title = 'Instance Setting';
        break;
    default:
        return;
    }

    h5cDialogNext('/h5creator/'+ url +'?dialogprev=/h5creator/data/create', title);
});

</script>
