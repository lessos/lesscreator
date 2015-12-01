<div>
    <label class="checkbox-inline">
      <input name="state" type="checkbox" value="1" onchange="lcExt.php.StateRefresh()" {[ if (it.state) { ]}checked{[ } ]} > Enable PHP
    </label>
</div>

<table id="lcext-php-setmod" width="100%" style="display:none">
  <tr>
    <td width="160px" valign="top">Modules</td>
    <td>
    {[~it._lsmodules :v]}
    <label class="lcext-php-grpitem checkbox-inline">
      <input type="checkbox" name="mod" value="{[=v.name]}" {[ if (it.mods.indexOf(v.name) > -1) { ]} checked {[ } ]}> {[=v.summary]}
    </label>
    {[~]}
    </td>
  </tr>
</table>

<div style="padding:5px 0;">
    <button class="btn btn-inverse" onclick="lcExt.php.SetSave()">Save</button>
</div>
