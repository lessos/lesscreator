<?php

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));

$projPath = h5creator_proj::path($this->req->proj);

$grpid = $this->req->grpid;

$fs = $projPath."/dataflow/{$grpid}.grp.json";
if (!file_exists($fs)) {
    die('Bad Request');
}
if (!is_writable($fs)) {
    die("'$fs' is not Writable");
}

$json = file_get_contents($fs);
$json = json_decode($json, true);
if (!isset($json['id'])) {
    die('Bad Request');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $name = $this->req->name;
    if (!strlen($name)) {
        die('Bad Request');
    }
    
    $json['name'] = $name;
    $json['updated'] = time();

    file_put_contents($fs, hwl_Json::prettyPrint($json));

    die("OK");
}
?>

<form id="pmvc8e" action="/h5creator/proj/dataflow/grp-edit" method="post">
    <input type="hidden" name="proj" value="<?=$proj?>" />
    <input type="hidden" name="grpid" value="<?=$grpid?>" />
    <div>
        <h5>Name</h5>
        <input type="text" name="name" class="inputfocus" value="<?php echo $json['name']?>" />
    </div>
    <div class="clearhr"></div>
    <div><input type="submit" value="Save" class="input_button" /></div>
</form>

<script type="text/javascript">
$("#pmvc8e").submit(function(event) {

    event.preventDefault();
    
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        timeout: 3000,
        success: function(rsp) {
            
            if (rsp == "OK") {
                hdev_header_alert('success', rsp);
                _proj_dataflow_tabopen('<?=$proj?>', '', 1);
                lessModalClose();
            } else {
                alert(rsp);
            }
        },
        error: function(xhr, textStatus, error) {
            alert('Error:'+ textStatus +' '+ xhr.responseText);
        }
    });
});
</script>