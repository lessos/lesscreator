<style>

.j4soeo .title {
    margin: 0; padding: 2px 0; font-weight: bold; font-size: 16px; line-height: 100%; color: #333333;
}
.j4soeo .desc {
    margin: 0; padding: 0; color: #999999; line-height: 100%;
}
.j4soeo :hover {
    background-color: #d9edf7;
}
.j4soeo > table {
    width: 100%;
}
.j4soeo > table td {
    padding: 10px 0;
}
.j4soeo tr.line {
    border-top: 1px solid #ccc;
}
</style>


<a class="j4soeo" href="#proj/new">
<table>
    <tr>
        <td width="64px"><img src="/lesscreator/static/img/proj-example.png" /></td>
        <td >
            <div class="title">New Project</div>
            <div class="desc">Start a project in a new directory</div>
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
    </tr>
</table>
</a>

<a class="j4soeo" href="#proj/open-recent">
<table>
    <tr class="line">
        <td width="64px"><img src="/lesscreator/static/img/proj-example.png" /></td>
        <td >
            <div class="title">Existing Directory</div>
            <div class="desc">Associate a project with an existing working directory</div>
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
    </tr>
</table>
</a>

<a class="j4soeo" href="#proj/fs/vs/well">
<table>
    <tr class="line">
        <td width="64px"><img src="/lesscreator/static/img/proj-example.png" /></td>
        <td >
            <div class="title">Version Control</div>
            <div class="desc">Checkout a project from a version control repository</div> 
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
    </tr>
</table>
</a>

<script>

lessModalButtonAdd("ctw26z", "Close", "lessModalClose()", "");

$(".j4soeo").click(function(){
        
    var href = $(this).attr('href').substr(1);

    var url = '/lesscreator/';
    var title = "";
    switch (href) {
    case "proj/new":
        url += href;
        title = 'Create New Project';
        break;
    case "proj/open-recent":
        url += href;
        title = 'Open Project';
        break;
    case "proj/fs/vs/well":
        url += href;
        title = 'Create Project';
        break;
    default:
        return;
    }
    url += "?basedir="+ lessSession.Get("basedir");

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
