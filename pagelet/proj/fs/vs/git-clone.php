
<div class="alert alert-info">Clone Git Repository</div>


<table width="100%">
<tr>
  <td valign="top" width="120px">
  	<img src="/lesscreator/static/img/vs/git-100.png" />
  </td>

  <td>
	<form id="bvszs0" action="#">
    	<label>Repository URL</label>
    	<input type="text" name="git_url" class="swqv89 input input-xxlarge" value=""/>
    	
    	<label>Project directory name</label>
    	<input type="text" name="git_target" class="input input-xxlarge" value=""/>

    	<label>Create project as subdirectory of</label>
    	<input type="text" name="git_base" class="input input-xxlarge" readonly="readonly" value=""/>
	</form>
  </td>
</tr>
</table>

<script type="text/javascript">


lessModalButtonAdd("c8chlb", "Back", "lessModalPrev()", "pull-left h5c-marginl0");

lessModalButtonAdd("fvxmpf", "Create Project", "_proj_fs_vs_create()", "");

lessModalButtonAdd("r3aenq", "Close", "lessModalClose()", "");


$("input[name=git_base]").val(lessSession.Get("basedir") +"/app/");

$("input[name=git_url]").bind("change", function(e) {
	//e.preventDefault();
    var url = $(this).val();

    var urls = url.split("\/").pop().split(".");
    urls.pop();

    $("input[name=git_target]").val(urls[0]);
    //console.log("AA"+ urls[0]);
});


function _proj_fs_vs_create()
{

}


</script>