<style>
.ciyhh9 {
    border-bottom: 1px solid #ccc;
}
.ciyhh9 img.licon {
    width: 30px;
    height: 30px;
}
.ciyhh9 .title {
    margin: 5px 0 0 0;
    padding: 0;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
}
.ciyhh9 .spec {
    margin: 10px 0 0 0;
    padding: 0;
    font-size: 10px;
    line-height: 10px;
    color: #999;
}
.ciyhh9 :hover {
    background-color: #d9edf7;
}
.ciyhh9 > table {
    width: 100%;
    border-bottom: 1px solid #ccc;
}
.ciyhh9 > table td {
    padding: 5px;
}

</style>

<div id="ztk4yq56" class="alert alert-info">
	Getting your Pod Instances ...
</div>

<div id="i7egk4aw"></div>

<div id="i7egk4aw-tpl" class="hide">

{[~it.items :v]}
<a class="ciyhh9" href="#pod/{[=v.metadata.id]}" onclick="_pod_open('{[=v.metadata.id]}')">
<table>
  <tr>
    <td width="40px"><img class="licon" src="/lesscreator/~/lesscreator/img/gen/box01.png" /></td>
    <td>
        <div class="title">{[=v.metadata.id]}</div>
        <div class="spec">
            {[~v.desiredState.manifest.boxes :vb]}
                CPU: {[=vb.quota.cpu]}, Memory: {[=_quota_size_format(vb.quota.memory)]}, Storage: 100 MB
            {[~]}
        </div>
    </td>
    <td width="30px" align="right">
      <i class="icon-chevron-right"></i>
    </td>
  </tr>
</table>
</a>
{[~]}

</div>

<script type="text/javascript">

// lessModalButtonAdd("doo8l6", "{{T . "Close"}}", "lessModalClose()", "");

function _quota_size_format(size)
{
    if (size > 1073741824) {
        return (size / 1073741824).toFixed(0) + " <span>GB</span>";
    } else if (size > 1048576) {
        return (size / 1048576).toFixed(0) + " <span>MB</span>";
    } else if (size > 1024) {
        return (size / 1024).toFixed(0) + " <span>KB</span>";
    }

    return size + " <span>Bytes</span>";
}

function _load_podlist()
{
    var url = lessfly_api + "/pods/?";
    url += "access_token="+ lessCookie.Get("access_token");
    url += "&project=lesscreator";
    // console.log(url);
    $.ajax({
        url     : url,
        type    : "GET",
        timeout : 30000,
        success : function(rsp) {

            var rsj = JSON.parse(rsp);

            // console.log(rsp);

            if (rsj.kind == "PodList") {
                
                //$(".load-progress-msg").append("OK");

                if (rsj.items.length == 0) {
                    // TODO
                } else if (rsj.items.length == 1) {
                    // Launch Immediately
                } else if (rsj.items.length > 1) {
                    // Select one to Launch ...
                    lessTemplate.RenderFromId("i7egk4aw", "i7egk4aw-tpl", rsj);
                }

            } else {
                // $(".load-progress").removeClass("progress-success").addClass("progress-danger");
                // lessAlert("#ztk4yq56", "alert-error", rsj.message);
            }
        },
        error   : function(xhr, textStatus, error) {
            // $(".load-progress").removeClass("progress-success").addClass("progress-danger");
            // lessAlert("#ztk4yq56", "alert-error", "Failed on Initializing System Environment");
        }
    });
}

_load_podlist();

function _pod_open(podid)
{
    lessModalClose();
    lessSession.Set("podid", podid);
    lcBodyLoader("index/desk");
    // lessModalNext("/lesscreator/index/pod-open?podid="+ podid, "Log In My Box", null);
}

</script>
