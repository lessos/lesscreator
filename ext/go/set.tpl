<div>
    <label class="checkbox-inline">
      <input name="state" type="checkbox" value="1" onchange="lcExt.go.StateRefresh()" {[ if (it.state) { ]}checked{[ } ]} > Enable Go
    </label>
</div>

<table id="lcext-go-setinfo" width="100%" style="display:none">
  <tr>
    <td width="160px" valign="top">Environment variables</td>
    <td>
      <p>GOROOT=/usr/pandora/go</p>
      <p>GOPATH=/home/action/.go</p>
    </td>
  </tr>
</table>

<div style="padding:5px 0;">
    <button class="btn btn-inverse" onclick="lcExt.go.SetSave()">Save</button>
</div>
