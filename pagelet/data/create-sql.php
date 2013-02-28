<?php

if ($this->app->method == 'POST') {

    $h5 = new LessPHP_Service_H5keeper("h5keeper://127.0.0.1:9530");

    $set = array(
        'title' => $this->req->data_instance_title,
        'type' => '1',
    );
    $ret = $h5->Set("/h5db/info/{$this->req->data_instance_id}", json_encode($set));

    die("OK");
}

$instid = LessPHP_Util_String::rand(12, 1);
?>
<table class="h5c_dialog_header" width="100%">
    <tr>
        <td width="20px"></td>
        <?php
        //print_r($this);
        if (strlen($this->req->dialogprev)) {        
        ?>
        <td width="100px">
            <button class="btn" onclick="h5cDialogPrev('<?php echo $this->req->dialogprev?>')"><i class="icon-chevron-left"></i> Back</button>
        </td>
        <?php } ?>
        <td style="font-size:14px;font-weight:bold;">
            Setting
        </td>
    </tr>
</table>


<div style="padding:20px;">

<div id="h5c_dialog_alert"></div>

<form id="h5c-data-set-form" action="/h5creator/data/create-sql">
<table width="100%">
  <tr>
    <td width="180px"><strong>Instance ID</strong></td>
    <td>
      <input type="text" name="data_instance_id" value="<?php echo $instid?>" readonly="readonly" />
    </td>
  </tr>
  <tr>
    <td><strong>Name your Instance</strong></td>
    <td>
      <input type="text" name="data_instance_title" value="" />
    </td>
  </tr>
</table>
</form>
</div>

<table class="h5c_dialog_footer" width="100%">
    <tr>        
        <td align="right">            
            <button class="btn" onclick="h5cDialogClose()">Close</button>
            <button class="btn btn-primary h5c-data-set-form">Commit</button>
        </td>
        <td width="20px"></td>
    </tr>
</table>

<script>

$(".h5c-data-set-form").click(function(event) {

    event.preventDefault();
        
    $.ajax({ 
        type: "POST",
        url: $("#h5c-data-set-form").attr('action') + "?_=" + Math.random(),
        data: $("#h5c-data-set-form").serialize(),
        success: function(rsp) {
            if (rsp == "OK") {

                rsp = "<h4>Success</h4>";
                rsp += '<p>Your Data Instance has been created successfully</p>';
                rsp += '<p><a class="btn" href="#">Manage</a></p>';

                h5cGenAlert("#h5c_dialog_alert", "alert-success", rsp);
                
            } else {
                h5cGenAlert("#h5c_dialog_alert", "alert-error", rsp);
            }
        }
    });
});

</script>
