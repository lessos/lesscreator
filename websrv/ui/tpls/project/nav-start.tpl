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
    padding: 10px 10px 10px 0;
}
.j4soeo tr.line {
    border-top: 1px solid #ccc;
}
.j4soeo .icon {
    width: 64px;
    height: 64px;
}
</style>

<a class="j4soeo" href="#project-new" onclick="l9rProj.New()">
<table>
    <tr>
        <td width="64px"><img src="/lesscreator/~/creator/img/proj/proj-new0.png" class="icon"></td>
        <td >
            <div class="title">{%New Project%}</div>
            <div class="desc">{%Start a project in a new directory%}</div>
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
    </tr>
</table>
</a>

<a class="j4soeo" href="#project-recent" onclick="l9rProj.NavOpen()">
<table>
    <tr class="line">
        <td width="64px"><img src="/lesscreator/~/creator/img/proj/proj-new1.png" class="icon"></td>
        <td >
            <div class="title">{%Existing Directory%}</div>
            <div class="desc">{%Open a project from an existing working directory%}</div>
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
    </tr>
</table>
</a>

<a class="j4soeo" href="#project-vc" onclick="l9rProj.NavVerCtrl()">
<table>
    <tr class="line">
        <td width="64px"><img src="/lesscreator/~/creator/img/vs/git-100.png" class="icon"></td>
        <td >
            <div class="title">{%Version Control%}</div>
            <div class="desc">{%Checkout a project from a version control repository%}</div> 
        </td>
        <td align="right">
            <i class="icon-chevron-right"></i>
        </td>
    </tr>
</table>
</a>
