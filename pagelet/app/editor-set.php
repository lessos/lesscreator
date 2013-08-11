<div id="x17kwr" class="hide"></div>

<table class="tab-config" width="100%" border="0" cellpadding="0" cellspacing="0" style="padding:8px;">

  <tr class="l">
    <td width="260px" class="t">Tab Stops</td>
    <td>
        <div>Tab width <input id="tabSize" size="5" type="text" value="2" onchange="_lc_editorset_save('Tab width')" /></div>
        <div><input type="checkbox" id="tabs2spaces" value="1" onchange="_lc_editorset_save('Insert spaces instead of tabs')" /> Insert spaces instead of tabs</div>
    </td>
  </tr>
  
  <tr class="l">
    <td class="t">Automatic Indentation</td>
    <td>
        <div><input type="checkbox" id="smartIndent" value="1" onchange="_lc_editorset_save('Enable automatic indentation')" /> Enable automatic indentation</div>
    </td>
  </tr>
  
  <tr class="l">
    <td class="t">Text Wrapping</td>
    <td>
        <div><input type="checkbox" id="lineWrapping" value="1" onchange="_lc_editorset_save('Enable text wrapping')" /> Enable text wrapping</div>
    </td>
  </tr>
  
  <tr class="l">
    <td class="t">Color Scheme</td>
    <td>
      <select id="editor_theme" onchange="_lc_editorset_theme(this)">
        <option selected="">default</option>
        <option>monokai</option>
        <option>ambiance</option>
        <option>blackboard</option>
        <option>night</option>
        <option>neat</option>
        <option>elegant</option>
        <option>cobalt</option>
        <option>eclipse</option>
        <option>rubyblue</option>        
      </select>  
    </td>
  </tr>
  
</table>


<script>
lessModalButtonAdd("ytibxk", "Close", "lessModalClose()", "btn-inverse");

function _lc_editorset_save(title)
{
    lcEditor.Config.tabSize = parseInt($("#tabSize").val());
    if (lcEditor.Config.tabSize > 12 || lcEditor.Config.tabSize < 1) {
        lcEditor.Config.tabSize = 4;
    }

    lcEditor.Config.tabs2spaces = $("#tabs2spaces").prop('checked') ? true : false;
    lessCookie.SetByDay('editor_tabs2spaces', lcEditor.Config.tabs2spaces, 365);
    
    lcEditor.Config.smartIndent = $("#smartIndent").prop('checked') ? true : false;
    lessCookie.SetByDay('editor_smartIndent', lcEditor.Config.smartIndent, 365);
    
    lcEditor.Config.lineWrapping = $("#lineWrapping").prop('checked') ? true : false;
    lessCookie.SetByDay('editor_lineWrapping', lcEditor.Config.lineWrapping, 365);
    
    lessAlert('#x17kwr', 'alert-success', 'Saved successfully "'+title+'"');
}

function _lc_editorset_theme(node)
{
    var theme = node.options[node.selectedIndex].innerHTML;
    lcEditor.Theme(theme);
}

function _lc_editorset_init()
{
    $("#tabSize").val(lcEditor.Config.tabSize);
    
    if (lcEditor.Config.tabs2spaces) {

        $("#tabs2spaces").prop("checked", true);
    }
    
    if (lcEditor.Config.smartIndent) {
        $("#smartIndent").prop("checked", true);
    }

    if (lcEditor.Config.lineWrapping) {
        $("#lineWrapping").prop("checked", true);
    }

    var theme = lessCookie.Get('editor_theme');
    $("#editor_theme option:contains('"+theme+"')").prop("selected", true);       
}

_lc_editorset_init();
</script>
