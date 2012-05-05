

<table class="tab-config" width="100%" border="0" cellpadding="0" cellspacing="0" style="padding:8px;">

  <tr class="l">
    <td width="260px" class="t">Tab Stops</td>
    <td>
        <div>Tab width <input id="tabSize" size="5" type="text" value="2" onchange="_save('Tab width')" /></div>
        <div><input type="checkbox" id="tabs2spaces" value="1" onchange="_save('Insert spaces instead of tabs')" /> Insert spaces instead of tabs</div>
    </td>
  </tr>
  
  <tr class="l">
    <td class="t">Automatic Indentation</td>
    <td>
        <div><input type="checkbox" id="smartIndent" value="1" onchange="_save('Enable automatic indentation')" /> Enable automatic indentation</div>
    </td>
  </tr>
  
  <tr class="l">
    <td class="t">Text Wrapping</td>
    <td>
        <div><input type="checkbox" id="lineWrapping" value="1" onchange="_save('Enable text wrapping')" /> Enable text wrapping</div>
    </td>
  </tr>
  
  <tr class="l">
    <td class="t">Color Scheme</td>
    <td>
      <select id="editor_theme" onchange="hdev_editor_theme(this)">
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
function _save(title)
{
    hceditor.tabSize = parseInt($("#tabSize").val());
    if (hceditor.tabSize > 12 || hceditor.tabSize < 1)
        hceditor.tabSize = 4;

    hceditor.tabs2spaces = $("#tabs2spaces").attr('checked') ? true : false;
    setCookie('editor_tabs2spaces', hceditor.tabs2spaces, 365);
    
    hceditor.smartIndent = $("#smartIndent").attr('checked') ? true : false;
    setCookie('editor_smartIndent', hceditor.smartIndent, 365);
    
    hceditor.lineWrapping = $("#lineWrapping").attr('checked') ? true : false;
    setCookie('editor_lineWrapping', hceditor.lineWrapping, 365);
    
    hdev_header_alert('success', 'Saved successfully "'+title+'"');
}

function _init()
{
    $("#tabSize").val(hceditor.tabSize);
    
    if (hceditor.tabs2spaces)
        $("#tabs2spaces").prop("checked", true);

    if (hceditor.smartIndent)
        $("#smartIndent").prop("checked", true);
    
    if (hceditor.lineWrapping)
        $("#lineWrapping").prop("checked", true);

    var theme = getCookie('editor_theme');
    $("#editor_theme option:contains('"+theme+"')").prop("selected", true);
}
_init();
</script>
