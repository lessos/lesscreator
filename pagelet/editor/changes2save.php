
<div id="xi1b3h" class="hide"></div>

If you don't save, changes will be permanently lost.

<script>
var urid = '<?php echo $this->req->urid?>';

lessModalButtonAdd("rovc3w", "Close without Saving", "_proj_editor_c2s_skip()", "");
lessModalButtonAdd("an4kzb", "Cancel", "lessModalClose()", "");
lessModalButtonAdd("i0bnyn", "Save", "_proj_editor_c2s_save()", "btn-inverse");

function _proj_editor_c2s_skip()
{
    lcTabClose(urid, 1);
    lessModalClose();
}

function _proj_editor_c2s_save()
{
    //console.log(lcEditor.MessageReply(0, "ok"));
    lcEditor.EntrySave(urid, "_proj_editor_c2s_save_reply");
}

function _proj_editor_c2s_save_reply(ret)
{
    if (ret.status == 200) {
        lcTabClose(ret.data.urid, 1);
        lessModalClose();
    } else {
        lessAlert("#xi1b3h", "alert-error", "Internal Server Error");
    }
}
</script>