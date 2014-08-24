<style type="text/css">
#lcpkg-rt-nginx-setmsg {
    margin: 0 10px 10px 0;
}
#lcpkg-rt-nginx-setform-cfg {
    /*height: 32px;*/
}
#lcpkg-rt-nginx-tplname {
    padding: 2px; 
    font-size: 12px;
    width: 98%;
    border: 2px solid #ccc;
}
#lcpkg-rt-nginx-conf {    
    border: 2px solid #ccc;
    display: none;
    width: 98%;
}
#lcpkg-rt-nginx-conf .CodeMirror {
    font-size: 11px;
    height: 100%;
}
</style>

<div id="lcpkg-rt-nginx-setform">
<table width="100%">
<tr>
  <td width="160px" valign="top">
    <img src="/lesscreator/~/lesscreator/img/rt/nginx_200.png" width="120" height="60" />
    <!-- <ul>
        <li>version >= 1.4.x</li>
    </ul> -->
  </td>
  <td>
    <div id="lcpkg-rt-nginx-setmsg" class="alert alert-info">
        Nginx is a Lightweight, High Concurrency, High Performance and Low Memory usage Web server, Load Balancer and Reverse Proxy<!-- LANG:rt-nginx-desc -->
    </div>

    <div id="lcpkg-rt-nginx-setform-cfg">
      <label class="checkbox">
        <input name="state" type="checkbox" value="1" onchange="lcPackage.RtNgxSetOnoffRefresh()" {[ if (it.state) { ]}checked{[ } ]} > Enable Nginx
      </label>

      <select id="lcpkg-rt-nginx-tplname" class="hide" onchange="lcPackage.RtNgxSetOnoffRefresh()">
      {[~it.cfgtpls :v]}
        <option value="{[=v.name]}" {[ if (it.cfgtpl == v.name) { ]} selected {[ } ]}>{[=v.summary]}</option>
      {[~]}
      </select>
    </div>

    <div id="lcpkg-rt-nginx-conf" class="less_scroll">{[=it.conf]}</div>
  </td>
</tr>
</table>

</div>
