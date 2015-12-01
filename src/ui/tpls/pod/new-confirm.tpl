
<div id="l9r-pod-new-alert"></div>
<table id="l9r-pod-new" class="l9r-modal-tableform">
<tr>
  <td width="180px">Zone</td>
  <td>
    <input type="hidden" name="status_placement_zoneid" value="{[=it.status_placement_zoneid]}">
    {[=it._zone_name]}
  </td>
</tr>
<tr>
  <td>Cell</td>
  <td>
    <input type="hidden" name="status_placement_cellid" value="{[=it.status_placement_cellid]}">
    {[=it._cell_name]}
  </td>
</tr>
<tr>
  <td>Spec</td>
  <td>
    <input type="hidden" name="spec_meta_id" value="{[=it.spec_meta_id]}">
    {[=it._spec_meta_name]}
  </td>
</tr>
<tr>
  <td>Name</td>
  <td>
    <input type="text" class="form-control" name="meta_name" value="{[=it.meta.name]}">
  </td>
</tr>
</table>
