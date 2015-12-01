<div>
    <label class="checkbox-inline">
      <input name="state" type="checkbox" value="1" onchange="lcExt.nodejs.StateRefresh()" {[ if (it.state) { ]}checked{[ } ]} > Enable Node.js
    </label>
</div>

<table id="lcext-nodejs-setinfo" width="100%" style="display:none">
  <tr>
    <td width="160px" valign="top">Environment variables</td>
    <td>
      <p>NODE PATH = /home/action/.nodejs</p>
    </td>
  </tr>
</table>

<div style="padding:5px 0;">
    <button class="btn btn-inverse" onclick="lcExt.nodejs.SetSave()">Save</button>
</div>
