<table class="h5c_dialog_header" width="100%">
    <tr>
        <td width="20px"></td>
        <?php
        //print_r($this);
        if (strlen($this->req->dialogprev)) {        
        ?>
        <td width="100px">
            <button class="btn" onclick="h5cDialogPrev('<?php echo $this->req->dialogprev?>')">Back</button>
        </td>
        <?php } ?>
        <td style="font-size:14px;font-weight:bold;">
            Setup
        </td>
    </tr>
</table>


<table class="h5c_dialog_footer" width="100%">
    <tr>        
        <td align="right">
            <button class="btn pull-right" onclick="h5cDialogClose()">Cancel</button>
        </td>
        <td width="20px"></td>
    </tr>
</table>