<?php
$projbase = H5C_DIR;

$proj  = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}

$obj = $projpath ."/dataflow";
$obj = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), $obj);
if (!is_writable($obj)) {
    die("'$obj' is not Writable");
}

list($grpid, $actorid) = explode("/", $this->req->uri);

$fsg = $obj."/{$grpid}.grp.json";
if (!file_exists($fsg)) {
    die("Bad Request");
}
$grp = file_get_contents($fsg);
$grp = json_decode($grp, true);
if (!isset($grp['id'])) {
    die("Internal Server Error");
}

$fsj = $obj."/{$grpid}/{$actorid}.actor.json";
if (!file_exists($fsj)) {
    die("Bad Request");
}
$actor = file_get_contents($fsj);
$actor = json_decode($actor, true);
if (!isset($actor['id'])) {
    die("Internal Server Error");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $name = trim($this->req->name);
    if (!strlen($name)) {
        die('`name` can not be null');
    }
    $actor['exec_mode'] = intval($this->req->exec_mode);
    $actor['name']      = $name;
    $actor['updated']   = time();
    file_put_contents($fsj, hwl_Json::prettyPrint($actor));

    die("OK");
}
?>

<form id="sy9p3x" action="/h5creator/proj/dataflow/actor-edit" style="padding:5px;">
  <input type="hidden" name="proj" value="<?php echo $this->req->proj?>" />
  <input type="hidden" name="uri" value="<?php echo $this->req->uri?>" />
  <table width="100%" cellpadding="20px" style="border-spacing:20px;">
    <tr>
      <td width="160px">Group</td>
      <td>
        <?php echo $grp['name']?>
      </td>
    </tr>
    <tr>
      <td>Name your Actor</td>
      <td><input type="text" name="name" value="<?php echo $actor['name']?>" /></td>
    </tr>
    <tr>
      <td>Execution Mode</td>
      <td>
        <select name="exec_mode" onchange="_exec_mode(this.value)">
        <?php
        $vs = h5creator_service::listExecMode();
        foreach ($vs as $k => $v) {
          $select = '';
          if ($k == $actor['exec_mode']) {
            $select = 'selected';
          }
          echo "<option value='{$k}' {$select}>{$v}</option>";
        }
        ?>
        </select>
      </td>
    </tr>
    <tr>
      <td></td>
      <td><input type="submit" class="btn btn-primary" value="Save" /></td>
    </tr>
  </table>
  
</form>


<script type="text/javascript">
$("#sy9p3x").submit(function(event) {

    event.preventDefault();
    
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        timeout: 3000,
        success: function(rsp) {
            
            if (rsp == "OK") {
                hdev_header_alert('success', rsp);
            } else {
                hdev_header_alert("error", rsp);
            }
        },
        error: function(xhr, textStatus, error) {
            hdev_header_alert('error:', textStatus +' '+ xhr.responseText);
        }
    });
});
</script>