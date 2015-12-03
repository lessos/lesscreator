<style>
.x7o1tn {
    width: 100%;
}
.x7o1tn .itemimg {
    width: 64px;
    height: 64px;
    margin-bottom: 10px;
}
</style>

<div id="en8dfy" class="alert alert-info">
    Select one of your favorite editor mode
</div>

<table class="x7o1tn">
<tr>
  {[~it.list :v]}
  <td>
    <img class="itemimg" src="/lesscreator/~/lesscreator/img/editor/mode-{[=v.id]}-128.png">
    <label class="radio">
      <input type="radio" name="cfg_editor_mode" value="{[=v.id]}" 
        onclick="lcEditor.ConfigEditModeSave('{[=v.id]}')" 
        {[ if (v.id == it.current) { ]} checked {[ } ]}> {[=v.name]}
    </label>
  </td>
  {[~]}
</tr>
</table>

