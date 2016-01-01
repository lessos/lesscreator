<div id="x17kwr" class="hide"></div>

<table class="l9r-modal-tableform" width="100%">

  <tr>
    <td width="220px"><span></span>Tab Stops<span></span></td>
    <td>
      <div class="input-group">
        <span class="input-group-addon"><span></span>Tab width<span></span></span>
        <input class="form-control" id="tabSize" type="text" value="4" onchange="_lc_editorset_save('<span></span>Tab width<span></span>')">
      </div>
      <label class="checkbox-inline">
        <input type="checkbox" id="tabs2spaces" value="1" onchange="_lc_editorset_save('<span></span>Insert spaces instead of tabs<span></span>')" />
       <span></span>Insert spaces instead of tabs<span></span>
      </label>
    </td>
  </tr>
  
  <tr>
    <td><span></span>Automatic Indentation<span></span></td>
    <td>
      <label class="checkbox-inline">
        <input type="checkbox" id="smartIndent" value="1" onchange="_lc_editorset_save('<span></span>Enable automatic indentation<span></span>')" />
       <span></span>Enable automatic indentation<span></span>
      </label>
    </td>
  </tr>
  
  <tr>
    <td><span></span>Text Wrapping<span></span></td>
    <td>
      <label class="checkbox-inline">
        <input type="checkbox" id="lineWrapping" value="1" onchange="_lc_editorset_save('<span></span>Enable text wrapping<span></span>')" />
       <span></span>Enable text wrapping<span></span>
      </label>
    </td>
  </tr>

  <tr>
    <td><span></span>Code Folding<span></span></td>
    <td>
      <label class="checkbox-inline">
        <input type="checkbox" id="codeFolding" value="1" onchange="_lc_editorset_save('<span></span>Enable Code Folding<span></span>')" />
       <span></span>Enable Code Folding<span></span>
      </label>
    </td>
  </tr>

  <!-- <tr>
    <td><span></span>Code Autocomplete<span></span></td>
    <td>
      <label><span></span>Press `shift + space` to activate autocompletion<span></span></label>
      <p class="alert alert-info"><span></span>editor-autocomplete-desc<span></span></p>
    </td>
  </tr> -->

  <tr>
    <td><span></span>Font Size<span></span></td>
    <td>
      <div class="input-group">
        <input class="form-control" id="fontSize" type="text" value="13">
        <span class="input-group-addon">px</span>
      </div>
    </td>
  </tr>

  <tr>
    <td><span></span>Color Scheme<span></span></td>
    <td>
      <select id="editor_theme" onchange="_lc_editorset_theme(this)" class="form-control">
        <option value="default" selected="">classic</option>
        <option value="monokai">monokai</option>
        <option value="ambiance">ambiance</option>
        <option value="blackboard">blackboard</option>
        <option value="eclipse">eclipse</option>
        <option value="erlang-dark">erlang-dark</option>
        <option value="lesser-dark">lesser-dark</option>
        <option value="rubyblue">rubyblue</option>
        <option value="twilight">twilight</option>             
      </select> 
    </td>
  </tr>
  
</table>


<script>

function _lc_editorset_close()
{
    _lc_editorset_save("");
    setTimeout(l4iModal.Close, 400);
}

function _lc_editorset_save(title)
{
    l9rEditor.Config.tabSize = parseInt($("#tabSize").val());
    if (l9rEditor.Config.tabSize > 12 || l9rEditor.Config.tabSize < 1) {
        l9rEditor.Config.tabSize = 4;
    }

    l9rEditor.Config.fontSize = parseInt($("#fontSize").val());
    if (l9rEditor.Config.fontSize > 50) {
        l9rEditor.Config.fontSize = 50;
    }
    if (l9rEditor.Config.fontSize < 8) {
        l9rEditor.Config.fontSize = 8;
    }
    l4iCookie.SetByDay('editor_fontSize', l9rEditor.Config.fontSize, 365);
    $("#fontSize").val(l9rEditor.Config.fontSize);
    $(".CodeMirror-lines").css({"font-size": l9rEditor.Config.fontSize+"px"});

    l9rEditor.Config.tabs2spaces = $("#tabs2spaces").prop('checked') ? true : false;
    l4iCookie.SetByDay('editor_tabs2spaces', l9rEditor.Config.tabs2spaces, 365);
    
    l9rEditor.Config.smartIndent = $("#smartIndent").prop('checked') ? true : false;
    l4iCookie.SetByDay('editor_smartIndent', l9rEditor.Config.smartIndent, 365);
    
    l9rEditor.Config.lineWrapping = $("#lineWrapping").prop('checked') ? true : false;
    l4iCookie.SetByDay('editor_lineWrapping', l9rEditor.Config.lineWrapping, 365);

    l9rEditor.Config.codeFolding = $("#codeFolding").prop('checked') ? true : false;
    l4iCookie.SetByDay('editor_codeFolding', l9rEditor.Config.codeFolding, 365);
    
    if (title.length > 0) {
        title = '"'+title+'"';
    }
    l4i.InnerAlert("#x17kwr", 'alert-success', '<span></span>Successfully Saved<span></span>'+ title);
}

function _lc_editorset_theme(node)
{
    var theme = node.options[node.selectedIndex].value;
    l9rEditor.Theme(theme);
}

function _lc_editorset_init()
{
    $("#tabSize").val(l9rEditor.Config.tabSize);
    $("#fontSize").val(l9rEditor.Config.fontSize);

    if (l9rEditor.Config.tabs2spaces) {

        $("#tabs2spaces").prop("checked", true);
    }
    
    if (l9rEditor.Config.smartIndent) {
        $("#smartIndent").prop("checked", true);
    }

    if (l9rEditor.Config.lineWrapping) {
        $("#lineWrapping").prop("checked", true);
    }

    if (l9rEditor.Config.codeFolding) {
        $("#codeFolding").prop("checked", true);
    }

    var theme = l9rEditor.Config.theme;
    $("#editor_theme option:contains('"+theme+"')").prop("selected", true);       
}

_lc_editorset_init();
</script>
