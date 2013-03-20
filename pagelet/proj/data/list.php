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

$dbis = array();
$glob = $projpath."/data/*.json";
foreach (glob($glob) as $v) {
    $json = file_get_contents($v);
    $json = json_decode($json, true);
    if (!isset($json['id'])) {
        continue;
    }

    $dbis[$json['id']] = $json;
}

echo "<table width=\"100%\" class='table-hover'>";
foreach ($dbis as $k => $v) {
    echo "<tr>
        <td width='5px'></td>
        <td width='20px'>
            <img src='/fam3/icons/database.png' class='h5c_icon' /> 
        </td>
        <td>
            {$v['name']}
        </td>
        <td align='right'><a href='#{$k}' class='p9532p' title='{$v['name']}'>Open</a></td>
        <td width='5px'></td>
    </tr>";
}
echo "</table>";
?>

<script>

$('.p9532p').click(function() {
    var uri = $(this).attr('href').substr(1);
    var tit = $(this).attr('title');
    var url = "/h5creator/data/inlet?proj="+projCurrent+"&id="+uri;
    h5cTabOpen(url, 'w0', 'html', {'title': tit, 'close':'1', 'img': '/fam3/icons/database.png'});

    //h5cTabOpen("/h5creator/data/inlet?proj="+projCurrent+"&id="+ id, "w0", 'html', opt);
});

</script>