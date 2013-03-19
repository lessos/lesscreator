<?php
$projbase = H5C_DIR;

if ($this->req->proj == null) {
    die('ERROR');
}

$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
$projpath = preg_replace("/\/+/", "/", rtrim($projpath, '/'));
if (strlen($projpath) < 1) {
    die("ERROR");
}

$grps = array();
$glob = $projpath."/dataflow/*.grp.json";
foreach (glob($glob) as $v) {
    $json = file_get_contents($v);
    $json = json_decode($json, true);
    if (!isset($json['id'])) {
        continue;
    }

    $grps[$json['id']] = $json;
}

echo "<table width=\"100%\" class='table-hover'>";
foreach ($grps as $k => $v) {
    echo "<tr>
        <td width='5px'></td>
        <td width='20px'>
            <img src='/fam3/icons/package.png' class='h5c_icon' /> 
        </td>
        <td>
            {$v['name']}
        </td>
        <td align='right'><a href='#{$k}' class='_proj_dataflow_grpedit'>Edit</a></td>
        <td width='5px'></td>
    </tr>";
}
echo "</table>";
?>

<script>
var _path = <?php echo "'$path'";?>;

$('._proj_dataflow_grpedit').click(function() {

    var uri = $(this).attr('href').substr(1);

    h5cModalOpen("/h5creator/proj/dataflow/grp-edit?proj="+_proj+"&grpid="+uri, 
        'Edit Group', 400, 0);
});
</script>