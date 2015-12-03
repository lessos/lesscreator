
<ul class="nav nav-tabs" style="margin: 5px 0;">
  <li class="active">
    <a href="#">{%Recent Projects%}</a>
  </li>
  <li>
    <a href="javascript:l9rProj.StartFsList()">{%From Directory%}</a>
  </li>
</ul>

<div id="l9rproj-start-alert" class="alert alert-info">loading</div>

<div id="l9rproj-start"></div>

<script id="l9rproj-start-tpl" type="text/html">
<table width="100%" class="table table-condensed">
{[~it.items :v]}
<tr id="projidx-{[=v.pid]}">
  <td valign="middle" width="18">
    <img src="/lesscreator/~/lesscreator/img/app-t3-16.png" align="absmiddle" />
  </td>
  <td>
    <strong><a href="#start-open" class="proj-start-open" path="{[=v.path]}">{[=v.summary]}</a></strong>
  </td>
  <td>
    <font color="gray">{[=v.path]}</font>
  </td>
  <td align="right">
    <button type="button" class="close proj-item-del" title="Clean out" pid="{[=v.pid]}">&times;</button>
  </td>
</tr>
{[~]}
</table>
</script>

<script id="l9rproj-startfs-tpl" type="text/html">

<ul class="breadcrumb" style="margin:5px 0;">
<li><img src="/lesscreator/~/lesscreator/img/house.png" align="absmiddle" /> <a class="fs-item-dir" href="#fs-list" path="/home/action">Home</a> <span class="divider">/</span></li>
{[~it.navs :v]}
  <li><a class="fs-item-dir" href="#fs-list" path="{[=v.path]}">{[=v.name]}</a> <span class="divider">/</span></li>
{[~]}
</ul>

<table width="100%" class="table table-condensed">
{[~it.items :v]}
<tr>
  <td valign="middle" width="20">
    {[ if (v.name == "lcproject.json") { ]}
      <img src="/lesscreator/~/lesscreator/img/app-t3-16.png" align="absmiddle" />
    {[ } else if (v.isdir) { ]}
      <img src="/lesscreator/~/lesscreator/img/folder.png" align="absmiddle" />
    {[ } ]}
  </td>
  <td>
    {[ if (v.name == "lcproject.json") { ]}
      <strong><a href="#start-open" path="{[=it.path]}" class="proj-start-open">{[=v.name]}</a></strong>
    {[ } else if (v.isdir) { ]}
      <strong><a href="#start-fs" path="{[=v.path]}" class="fs-item-dir">{[=v.name]}</a></strong>
    {[ } else { ]}
      {[=v.name]}
    {[ } ]}
  </td>
</tr>
{[~]}
</table>
</script>

<script type="text/javascript">

$("#l9rproj-start").on("click", ".proj-item-del", function() {

    var pathid = $(this).attr("pid");

    l9rProj.NavIndexDel(pathid, function(err) {
        if (!err) {
            $("#projidx-"+ pathid).remove();
        }
    });
});

$("#l9rproj-start").on("click", ".proj-start-open", function() {
    l9rProj.Open($(this).attr("path"));
});

$("#l9rproj-start").on("click", ".fs-item-dir", function() {
    l9rProj.StartFsList($(this).attr("path"));
});

</script>
