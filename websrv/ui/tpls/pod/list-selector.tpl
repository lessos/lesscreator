<style>
.pod-item {
    border-bottom: 1px solid #ccc;
}
.pod-item img.licon {
    width: 30px;
    height: 30px;
}
.pod-item .title {
    margin: 5px 0 0 0;
    padding: 0;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
}
.pod-item .spec {
    margin: 10px 0 0 0;
    padding: 0;
    font-size: 10px;
    line-height: 10px;
    color: #999;
}
.pod-item :hover {
    background-color: #d9edf7;
}
.pod-item > table {
    width: 100%;
    border-bottom: 1px solid #ccc;
}
.pod-item > table td {
    padding: 5px;
}

</style>

<div id="l9r-podls-alert" class="alert alert-info">
	Getting your Pod Instances ...
</div>

<div id="l9r-podls"></div>

<script id="l9r-podls-tpl" type="text/html">
{[~it.items :v]}
<a class="pod-item" href="#pod/{[=v.meta.id]}" onclick="l9rPod.Open('{[=v.meta.id]}')">
<table>
  <tr>
    <td width="40px"><img class="licon" src="/lesscreator/~/creator/img/gen/box01.png" /></td>
    <td>
        <div class="title">{[=v.meta.name]}</div>
        <div class="spec" label="TODO">
            {[~v.spec.boxes :vb]}
            CPU: {[=vb.resource.cpu_num]}, Memory: {[=l9rPod.UtilResourceSizeFormat(vb.resource.mem_size)]}, Storage: {[=vb.resource.stor_size]} MB
            {[~]}
        </div>
    </td>
    <td width="30px" align="right">
      <i class="icon-chevron-right"></i>
    </td>
  </tr>
</table>
</a>
{[~]}
</script>
