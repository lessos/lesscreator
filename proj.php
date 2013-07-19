<?php


class h5creator_proj
{
    public static function path($proj)
    {
        if (substr($proj, 0, 1) == '/') {
            $path = $proj;
        } else {
            $path = H5C_DIR ."/". $proj;
        }
        
        return preg_replace("/\/+/", "/", rtrim($path, '/'));
    }
    
    public static function info($proj)
    {
        $path = self::path($proj) ."/lcproject.json";
        
        $rs = h5creator_fs::FsFileGet($path);
        
        if ($rs->status != 200) {
            return false;
        }
        $info = json_decode($rs->data->body, true); 
        
        if (!isset($info['projid'])) {
            return false;
        }

        return $info;
    }
}
