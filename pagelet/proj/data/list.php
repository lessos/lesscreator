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

$fsp = $projpath."/hootoapp.yaml";
if (!file_exists($fsp)) {
    die("Bad Request");
}
$projInfo = file_get_contents($fsp);
$projInfo = hwl\Yaml\Yaml::decode($projInfo);

$dataList  = array('local' => array(), 'exter' => array());
$glob = $projpath."/data/*.json";
foreach (glob($glob) as $v) {
    $json = file_get_contents($v);
    $json = json_decode($json, true);
    if (!isset($json['id'])) {
        continue;
    }

    if ($projInfo['appid'] == $json['projid']) {
        $dataList['local'][$json['id']] = $json;
    } else {
        $dataList['exter'][$json['id']] = $json;
    }
}

echo "<table width=\"100%\" class='table-hover'>";
foreach ($dataList as $k => $v) {
    
    if ($k == 'local') {
        $tit = 'Local Databases';
    } else {
        $tit = 'External Databases';
    }

    echo "<tr>
        <td width='5px'></td>
        <td width='20px'>
            <img src='/fam3/icons/folder_database.png' class='h5c_icon' /> 
        </td>
        <td>
            {$tit}
        </td>
        <td></td>
        <td width='5px'></td>
    </tr>";

    foreach ($v as $k2 => $v2) {
        echo "<tr>
        <td></td>
        <td></td>
        <td>
            <img src='/fam3/icons/database.png' class='h5c_icon' /> 
            {$v2['name']}
        </td>
        <td align='right'><a href='#{$k2}' class='p9532p' title='{$v2['name']}'>Open</a></td>
        <td></td>
        </tr>";
    }
}
echo "</table>";
?>

<script type="text/javascript">

$('.p9532p').click(function() {
    var uri = $(this).attr('href').substr(1);
    var tit = $(this).attr('title');
    var url = "/h5creator/data/inlet?proj="+projCurrent+"&id="+uri;
    h5cTabOpen(url, 'w0', 'html', {'title': tit, 'close':'1', 'img': '/fam3/icons/database.png'});
});

</script>