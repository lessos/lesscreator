<style>
.pod-item {
    border-bottom: 1px solid #ccc;
}
.pod-item .licon {
    font-size: 30px;
}
.pod-item .title {
    margin: 5px 0 0 0;
    padding: 0;
    font-weight: bold;
    font-size: 18px;
    line-height: 18px;
}
.pod-item .spec {
    margin: 0 0 5px 0;
    padding: 0;
    font-size: 14px;
    line-height: 140%;
    color: #555;
}
.pod-item :hover {
    background-color: #eee;
}
.pod-item > table {
    width: 100%;
    border-bottom: 1px solid #ccc;
}
.pod-item > table td {
    padding: 5px;
}

</style>

<div id="l9r-pod-cell-slr">
{[~it.items :v]}
<a class="pod-item" href="#cell{[=v.meta.id]}" onclick="l9rPod.PpNewCellSelectEntry('{[=v.meta.id]}')">
<table>
  <tr>
    <td width="40px"><span class="glyphicon glyphicon-globe licon" aria-hidden="true"></span></td>
    <td>
        <div class="title">{[=v.meta.name]}</div>
        <div class="spec">{[=v.desc]}</div>
    </td>
    <td width="30px" align="right">
      <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>
    </td>
  </tr>
</table>
</a>
{[~]}
</div>
