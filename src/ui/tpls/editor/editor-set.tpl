<div id="x17kwr" class="hide"></div>

<table class="lc-editor-set-form" width="100%">

  <tr class="l">
    <td width="260px" class="t"><span></span>Tab Stops<span></span></td>
    <td>
      <div class="input-prepend">
        <span class="add-on"><span></span>Tab width<span></span></span>
        <input class="span1" id="tabSize" type="text" value="4" onchange="_lc_editorset_save('<span></span>Tab width<span></span>')">
      </div>
      <label class="checkbox">
        <input type="checkbox" id="tabs2spaces" value="1" onchange="_lc_editorset_save('<span></span>Insert spaces instead of tabs<span></span>')" />
       <span></span>Insert spaces instead of tabs<span></span>
      </label>
    </td>
  </tr>
  
  <tr class="l">
    <td class="t"><span></span>Automatic Indentation<span></span></td>
    <td>
      <label class="checkbox">
        <input type="checkbox" id="smartIndent" value="1" onchange="_lc_editorset_save('<span></span>Enable automatic indentation<span></span>')" />
       <span></span>Enable automatic indentation<span></span>
      </label>
    </td>
  </tr>
  
  <tr class="l">
    <td class="t"><span></span>Text Wrapping<span></span></td>
    <td>
      <label class="checkbox">
        <input type="checkbox" id="lineWrapping" value="1" onchange="_lc_editorset_save('<span></span>Enable text wrapping<span></span>')" />
       <span></span>Enable text wrapping<span></span>
      </label>
    </td>
  </tr>

  <tr class="l">
    <td class="t"><span></span>Code Folding<span></span></td>
    <td>
      <label class="checkbox">
        <input type="checkbox" id="codeFolding" value="1" onchange="_lc_editorset_save('<span></span>Enable Code Folding<span></span>')" />
       <span></span>Enable Code Folding<span></span>
      </label>
    </td>
  </tr>

  <tr class="l">
    <td class="t"><span></span>Code Autocomplete<span></span></td>
    <td>
      <label><span></span>Press `shift + space` to activate autocompletion<span></span></label>
      <p class="alert alert-info"><span></span>editor-autocomplete-desc<span></span></p>
    </td>
  </tr>

  <tr class="l">
    <td class="t"><span></span>Font Size<span></span></td>
    <td>
      <div class="input-append">
        <input class="span1" id="fontSize" type="text" value="13">
        <span class="add-on">px</span>
      </div>
    </td>
  </tr>

  <tr class="">
    <td class="t"><span></span>Color Scheme<span></span></td>
    <td>
      <select id="editor_theme" onchange="_lc_editorset_theme(this)">
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
    setTimeout(lessModal.Close, 400);
}

function _lc_editorset_save(title)
{
    lcEditor.Config.tabSize = parseInt($("#tabSize").val());
    if (lcEditor.Config.tabSize > 12 || lcEditor.Config.tabSize < 1) {
        lcEditor.Config.tabSize = 4;
    }

    lcEditor.Config.fontSize = parseInt($("#fontSize").val());
    if (lcEditor.Config.fontSize > 50) {
        lcEditor.Config.fontSize = 50;
    }
    if (lcEditor.Config.fontSize < 8) {
        lcEditor.Config.fontSize = 8;
    }
    lessCookie.SetByDay('editor_fontSize', lcEditor.Config.fontSize, 365);
    $("#fontSize").val(lcEditor.Config.fontSize);
    $(".CodeMirror-lines").css({"font-size": lcEditor.Config.fontSize+"px"});

    lcEditor.Config.tabs2spaces = $("#tabs2spaces").prop('checked') ? true : false;
    lessCookie.SetByDay('editor_tabs2spaces', lcEditor.Config.tabs2spaces, 365);
    
    lcEditor.Config.smartIndent = $("#smartIndent").prop('checked') ? true : false;
    lessCookie.SetByDay('editor_smartIndent', lcEditor.Config.smartIndent, 365);
    
    lcEditor.Config.lineWrapping = $("#lineWrapping").prop('checked') ? true : false;
    lessCookie.SetByDay('editor_lineWrapping', lcEditor.Config.lineWrapping, 365);

    lcEditor.Config.codeFolding = $("#codeFolding").prop('checked') ? true : false;
    lessCookie.SetByDay('editor_codeFolding', lcEditor.Config.codeFolding, 365);
    
    if (title.length > 0) {
        title = '"'+title+'"';
    }
    lessAlert("#x17kwr", 'alert-success', '<span></span>Successfully Saved<span></span>'+ title);
}

function _lc_editorset_theme(node)
{
    var theme = node.options[node.selectedIndex].value;
    lcEditor.Theme(theme);
}

function _lc_editorset_init()
{
    $("#tabSize").val(lcEditor.Config.tabSize);
    $("#fontSize").val(lcEditor.Config.fontSize);

    if (lcEditor.Config.tabs2spaces) {

        $("#tabs2spaces").prop("checked", true);
    }
    
    if (lcEditor.Config.smartIndent) {
        $("#smartIndent").prop("checked", true);
    }

    if (lcEditor.Config.lineWrapping) {
        $("#lineWrapping").prop("checked", true);
    }

    if (lcEditor.Config.codeFolding) {
        $("#codeFolding").prop("checked", true);
    }

    var theme = lcEditor.Config.theme;
    $("#editor_theme option:contains('"+theme+"')").prop("selected", true);       
}

_lc_editorset_init();
</script>
