
<div class="lcx-fsnav">

    <span class="lfn-title">Project Files</span>

    <ul class="lfn-menus">
        <li class="lfnm-item">
            
            <i class="icon-plus-sign icon-white lfnm-item-ico"></i>
            
            <ul class="lfnm-item-submenu">
                <li>
                    <a href="#proj/fs/file-new" onclick="lcProjectFs.FileNew('file', null, '')">
                        <img src="/lesscreator/~/lesscreator/img/page_white_add.png" class="h5c_icon" />
                        {{T . "New File"}}
                    </a>
                </li>
                <li>
                    <a href="#proj/fs/file-new-dir" onclick="lcProjectFs.FileNew('dir', null, '')">
                        <img src="/lesscreator/~/lesscreator/img/folder_add.png" class="h5c_icon" />
                        {{T . "New Folder"}}
                    </a>
                </li>
                <li>
                    <a href="#proj/fs/file-upl" onclick="lcProjectFs.FileUpload()">
                        <img src="/lesscreator/~/lesscreator/img/page_white_get.png" class="h5c_icon" />
                        {{T . "Upload"}}
                    </a>
                </li>
            </ul>
        </li>

        <li class="lfnm-item">
            <a href="#fs/file-upl" 
                onclick="_fs_tree_dir('', 1)" 
                class="icon-refresh icon-white lfnm-item-ico" title="Refresh">
            </a>
        </li>
    </ul>
</div>


<!--ProjectFilesManager-->
<div id="lcbind-fsnav-fstree" class="less_scroll">
    <div id="ptroot" class_="hdev-proj-files" class="lcx-fstree">loading</div>
</div>

<div id="lcx-filenav-tree-tpl" class="hide">
{[~it :v]}
<div id="ptp{[=v.fsid]}" class="hdev-proj-tree2 lcx-fsitem" lc-fspath="{[=v.path]}" lc-fsdir="{[=v.isdir]}">
    <img src="/lesscreator/~/lesscreator/img/{[=v.ico]}.png" align="absmiddle">
    <a href="#" class="anoline">{[=v.name]}</a>
</div>
{[~]}
</div>

<div id="lcbind-fsnav-rcm" class="hide">
  
  <div class="lcbind-fsrcm-item fsrcm-isdir" lc-fsnav="new-file">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/page_white_add.png" align="absmiddle" />
    </div>
    <a href="#{$p}" class="rcctn">{{T . "New File"}}</a>
  </div>
  <div class="lcbind-fsrcm-item fsrcm-isdir" lc-fsnav="new-dir">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/folder_add.png" align="absmiddle">
    </div>
    <a href="#{$p}" class="rcctn">{{T . "New Folder"}}</a>
  </div>
  <div class="lcbind-fsrcm-item fsrcm-isdir" lc-fsnav="upload">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/page_white_get.png" align="absmiddle">
    </div>
    <a href="#{$p}" class="rcctn">{{T . "Upload"}}</a>
  </div>

  <div class="rcm-sepline fsrcm-isdir"></div>

  <div class="lcbind-fsrcm-item" lc-fsnav="rename">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/page_white_copy.png" align="absmiddle">
    </div>
    <a href="#{$p}" class="rcctn">{{T . "Rename"}}</a>
  </div>
  <div class="lcbind-fsrcm-item" lc-fsnav="file-del">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/delete.png" align="absmiddle">
    </div>
    <a href="#{$p}" class="rcctn">{{T . "Delete"}}</a>
  </div>
</div>


<!-- TPL : File New -->
<div id="lcbind-fstpl-filenew" class="hide"> 
<form id="{[=it.formid]}" action="#" onsubmit="lcProjectFs.FileNewSave('{[=it.formid]}');return false;">
  <div class="input-prepend" style="margin-left:2px">
    <span class="add-on">
        <img src="/lesscreator/~/lesscreator/img/folder_add.png" class="h5c_icon">
        {[=it.path]}/
    </span>
    <input type="text" name="name" value="{[=it.file]}" class="span2">
    <input type="hidden" name="path" value="{[=it.path]}">
    <input type="hidden" name="type" value="{[=it.type]}">
  </div>
</form>
</div>


<!-- TPL : File Rename -->
<div id="lcbind-fstpl-filerename" class="hide"> 
<form id="{[=it.formid]}" action="#" onsubmit="lcProjectFs.FileRenameSave('{[=it.formid]}');return false;">
  <div class="input-prepend" style="margin-left:2px">
    <span class="add-on">
        <img src="/lesscreator/~/lesscreator/img/folder_edit.png" class="h5c_icon">
    </span>
    <input type="text" name="pathset" value="{[=it.path]}" style="width:500px;">
    <input type="hidden" name="path" value="{[=it.path]}">
  </div>
</form>
</div>


<!-- TPL : File Delete -->
<div id="lcbind-fstpl-filedel" class="hide"> 
<form id="{[=it.formid]}" action="#" onsubmit="lcProjectFs.FileDelSave('{[=it.formid]}');return false;">
  <input type="hidden" name="path" value="{[=it.path]}">
  <div class="alert alert-danger" role="alert">
    <p>Are you sure to delete this file or folder?</p>
    <p><strong>{[=it.path]}</strong><p>
  </div>
</form>
</div>


<script type="text/javascript">

</script>