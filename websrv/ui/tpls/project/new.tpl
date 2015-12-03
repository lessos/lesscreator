
<style>
#l9rproj-newform {
    padding: 0px;
}

#l9rproj-newform input,textarea,.input-prepend,button {
    margin-bottom: 0px;
}

#l9rproj-newform .bordernil td {
    border-top:0px;
}

#l9rproj-newform .r0330s .item {
    position: relative;
    width: 150px;
    float: left; margin: 3px 10px 3px 0;
}

#l9rproj-newform .r0330s .item input {
    margin-bottom: 0;
}

#l9rproj-newform .help-ctn {
    margin-top: 5px;
    font-size: 12px !important;
    color: #777 !important;
}

#l9rproj-newform-alert {
    margin-bottom: 10px;
}
</style>

<div id="l9rproj-newform-alert" class="hide"></div>

<form id="l9rproj-newform" action="#">
   
  <table width="100%" class="table table-condensed">
    
    <tr class="bordernil">
      <td width="180px"><strong>{%Unique Project Name%}</strong> <span style="color:red">*</span></td>
      <td>
        <div class="input-group">
          <div class="input-group-addon">{[=it._projpath]}</div>
          <input name="name" type="text" class="form-control" value="{[=it.metadata.name]}" />
        </div>
        <label class="help-block">{%Ex%}: <strong>my-cms</strong></label>
        <div class="help-ctn">
          <div class="">{%Must between 3 and 30 characters long%}</div>
          <div class="">{%Must consist of letters, numbers, `_` or `-`, and begin with a letter%}</div>
        </div>
      </td>
    </tr>

    <tr>
      <td><strong>{%Summary%}</strong> <span style="color:red">*</span></td>
      <td >
        <input name="summary" type="text" class="form-control" value="{[=it.summary]}" />
        <label class="help-block">{%Ex%}: <strong>My Project</strong></label>
      </td>
    </tr>

    <tr>
      <td><strong>{%Group by Application%}</strong> <span style="color:red">*</span></td>
      <td class="r0330s">
        {[~it._grpappd :v]}
        <label class="item checkbox-inline">
            <input class="_proj_new_grpapp" type="checkbox" name="grp_app" value="{[=v.id]}"> {[=v.name]}
        </label>
        {[~]}
      </td>
    </tr>

    <tr>
      <td><strong>{%Group by Develop%}</strong></td>
      <td class="r0330s">
        {[~it._grpdevd :v]}
        <label class="item checkbox-inline">
            <input class="_proj_new_grpdev" type="checkbox" name="grp_dev" value="{[=v.id]}"> {[=v.name]}
        </label>
        {[~]}
      </td>
    </tr>

  </table>
</form>
