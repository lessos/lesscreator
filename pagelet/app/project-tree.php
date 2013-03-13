<?php

$projbase = H5C_DIR;

if ($this->req->proj == null) {
    die('ERROR');
}
$proj  = preg_replace("/\/+/", "/", rtrim($this->req->proj,'/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}

if (strlen($proj) < 1) {
    die();
}

$path  = preg_replace("/\/+/", "/", $this->req->path);
if (!file_exists($projpath.'/'.$path)) {
    die('ERROR');
}
?>

<div>
<?php

$file   = '';

$glob = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), "{$projpath}/{$path}/*");

$prt = $prt0 = '';

foreach (glob($glob) as $f) {

    $fn = substr(strrchr($f, "/"), 1);
    $fm = mime_content_type($f);
    if (is_file($f)) {
        $fs = filesize($f);
        if ($fm == 'application/octet-stream' && $fs < 1048576) { // < 1MB
            $_s = file_get_contents($f);
            if (is_string($_s))
                $fm = 'text/plain';
        }
    }
    
    $fmi = 'page_white';
    $href = null;
    
    $p = trim("{$path}/$fn", '/');
    $p = preg_replace("/\/+/", "/", $p);
    $pdiv = md5($p);
    
    //$p = urlencode($p);
    if ($fm == 'directory') {
        
        if ($fn == 'pagelet') {
            $fmi = 'layers';
            $fn = 'Pagelet Engine';
        } else if ($fn == 'dataflow') {
            $fmi = 'database_refresh';
            $fn = 'Data Flow Engine';
        } else {
            $fmi = 'folder';
        }
        
        $href   = "javascript:_hdev_dir('{$proj}', '{$p}', 0)";
        
    } else if (substr($fm,0,4) == 'text' || $fm == "application/x-empty") {
        
        if (strlen($path) == 0 && $fn == 'hootoapp.yaml') {
            $fmi = 'app-t3-16';
        } else if ($fm == 'text/x-php' || substr($f,-4) == '.php') {
            $fmi = 'page_white_php';
        } else if (substr($f,-2) == '.h' || substr($f,-4) == '.hpp') {
            $fmi = 'page_white_h';
        } else if (substr($f,-2) == '.c') {
            $fmi = 'page_white_c';
        } else if (substr($f,-4) == '.cpp' || substr($f,-3) == '.cc') {
            $fmi = 'page_white_cplusplus';
        } else if (substr($f,-3) == '.js' || substr($f,-4) == '.css') {
            $fmi = 'page_white_code';
        } else if (substr($f,-5) == '.html' || substr($f,-4) == '.htm' || substr($f,-6) == '.xhtml') {
            $fmi = 'page_white_world';
        } else if (substr($f,-3) == '.sh') {
            $fmi = 'application_osx_terminal';
        } else if (substr($f,-3) == '.rb') {
            $fmi = 'page_white_ruby';
        } else if (substr($f,-3) == '.go') {
            $fmi = 'ht-page_white_golang';
        } else if (substr($f,-3) == '.py' 
            || substr($f,-4) == '.yml'
            || substr($f,-5) == '.yaml'
            ) {
            $fmi = 'page_white_code';
        }
        
        //$href = "javascript:hdev_page_open('{$p}','editor','','{$fmi}')";
        $href = "javascript:h5cTabOpen('{$p}','w0','editor',{'img':'{$fmi}', 'close':'1'})";
        
    } else if (substr($fm, 0, 5) == 'image') {
        $fmi = 'page_white_picture';
    }
    
    $li  = "<div id=\"ptp{$pdiv}\" class=\"hdev-proj-tree fileitem\">";
    $li .= "<img src='/h5creator/static/img/{$fmi}.png' align='absmiddle' title='{$fm}' /> ";
    $li .= ($href === null) ? $fn : "<a href=\"{$href}\" class=\"anoline\">{$fn}</a>";
    
    $lip = "";
    
    if ($fm == 'directory') {
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/h5creator/static/img/page_white_add.png' align='absmiddle' /></div>
            <a href='#{$p}' class='rcctn hdev_rcobj_file'>New File</a></div>";
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/h5creator/static/img/folder_add.png' align='absmiddle' /></div>
            <a href='#{$p}' class='rcctn hdev_rcobj_dir'>New Folder</a></div>";
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/h5creator/static/img/page_white_get.png' align='absmiddle' /></div>
            <a href='#{$p}' class='rcctn hdev_rcobj_upload'>Upload</a></div>";
    }
    
    if (strlen($path) != 0 || $fn != 'hootoapp.yaml') {
        
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/h5creator/static/img/page_white_copy.png' align='absmiddle' /></div>
            <a href='#{$p}' class='rcctn hdev_rcobj_rename'>Rename</a></div>";
        
        if (strlen($lip)) {
            $lip .= "<div class=\"rcsepli\"></div>";
        }
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/h5creator/static/img/delete.png' align='absmiddle' /></div>
            <a href=\"javascript:_page_del('{$proj}','{$p}');\" onclick=\"return confirm('Are you sure you want to delete?')\" class='rcctn'>Delete</a></div>";
    }
    
    if (strlen($lip)) {
        $li .= "<div class=\"hdev-rcmenu displaynone\">".$lip."</div>";
    }
    
    $li .= "</div>";
    $li .= "<div id=\"pt{$pdiv}\" style=\"padding-left:20px;\"></div>";
    
    if ($fn == 'hootoapp.yaml') {
        continue;
        $prt0 = $li; // TODO
    } else {
        $prt .= $li;
    }
}
echo $prt0 . $prt;
?>
</div>
<script>
_refresh_tree();
</script>


