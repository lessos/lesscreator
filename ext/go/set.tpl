<div>
    <label class="checkbox">
      <input name="state" type="checkbox" value="1" onchange="lcExt.go.StateRefresh()" {[ if (it.state) { ]}checked{[ } ]} > Enable Go
    </label>
</div>

<table id="lcext-go-setinfo" width="100%" class="hide">
  <tr>
    <td width="160px" valign="top">Environment variables</td>
    <td>
      <p>GOROOT=/usr/lessfly/go</p>
      <p>GOPATH=/home/action/.go</p>
    </td>
  </tr>
</table>

<div style="padding:5px 0;">
    <button class="btn btn-inverse" onclick="lcExt.go.SetSave()">Save</button>
</div>
