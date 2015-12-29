
<div id="lcproj-setform">

  <input name="projpath" type="hidden" value="{[=it._projpath]}" />
  <input name="proj_name" type="hidden" value="{[=it.name]}" />

  <table class="table table-condensed" style="min-width:600px" width="100%">

    <tr class="lcproj-bordernil">
      <td width="200px"><strong>Location</strong></td>
      <td>{[=it._projpath]}</td>
    </tr>

    <tr>
      <td><strong>Project Name</strong></td>
      <td>{[=it.metadata.name]}</td>
    </tr>

    <tr>
      <td><strong>Version</strong></td>
      <td>
        <input name="version" class="input-large" type="text" value="{[=it.version]}" /> 
        <label class="label label-important">Required</label>
        <span class="help-inline">Example: <strong>1.0.0</strong></span>
      </td>
    </tr>  

    <tr>
      <td><strong>Summary</strong></td>
      <td>
        <input name="summary" class="input-large" type="text" value="{[=it.summary]}" />
        <label class="label label-important">Required</label>
        <span class="help-inline">Example: <strong>Hello World</strong></span>
      </td>
    </tr>

    <tr>
      <td valign="top"><strong>Description</strong></td>
      <td><textarea name="description" rows="2" style="width:400px;">{[=it.description]}</textarea></td>
    </tr>

    <tr>
      <td><strong>Group by Application</strong></td>
      <td>
        {[~it._grpappd :v]}
        <label class="lcproj-grpitem checkbox-inline">
            <input type="checkbox" name="grp_app" value="{[=v.id]}" {[ if (it._grpapp.indexOf(v.id) > -1) { ]} checked {[ } ]}> {[=v.name]}
        </label>
        {[~]}
      </td>
    </tr>

    <tr>
      <td><strong>Group by Develop</strong></td>
      <td>
        {[~it._grpdevd :v]}
        <label class="lcproj-grpitem checkbox-inline">
            <input type="checkbox" name="grp_dev" value="{[=v.id]}" {[ if (it._grpdev.indexOf(v.id) > -1) { ]} checked {[ } ]}> {[=v.name]}
        </label>
        {[~]}
      </td>
    </tr>

    <!-- <tr>
      <td><strong>Runtime Environment</strong></td>
      <td><div class="rky7cv">Loading</div></td>
    </tr>

    <tr>
      <td><strong>Dependent Packages</strong></td>
      <td><div class="lgjn8r">Loading</div></td>
    </tr> -->

    <tr>
      <td></td>
      <td>
        <button class="btn btn-primary" onclick="l9rProj.SetPut()">Save</button>
      </td>
    </tr>
  </table>
</div>
