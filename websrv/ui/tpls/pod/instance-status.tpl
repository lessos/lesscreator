
<div id="l9r-pod-status-alert" class="alert alert-info" style="display:none">
	Getting your Pod Instance Status ...
</div>

<div id="l9r-pod-status"></div>

<script id="l9r-pod-status-tpl" type="text/html">
<table class="l9r-modal-tableform">
<tr>
    <td width="200px">Instance ID</td>
    <td>
        {[=it.meta.id]}
    </td>
</tr>
<tr>
    <td>Spec Name</td>
    <td>
        <div>{[=it.spec.meta.name]}</div>
    </td>
</tr>
{[~it.spec.boxes :box]}
<tr>
    <td>Spec Box #{[=box.meta.name]}</td>
    <td>
        Driver: {[=box.image.driver]}, 
        Image: {[=box.image.meta.name]},
        Memory: {[=box.resource.mem_size]}
    </td>
</tr>
{[~]}
<tr>
    <td>Zone</td>
    <td>
        <div>{[=it.status.placement.zoneid]}</div>
    </td>
</tr>
<tr>
    <td>Status</td>
    <td>
        {[=it.status.phase]}
    </td>
</tr>
</table>
</script>
