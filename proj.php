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
        $path = self::path($proj) ."/hootoapp.yaml";
        
        if (!file_exists($path)) {
            return false;
        }
        $info = hwl\Yaml\Yaml::decode(file_get_contents($path)); 
        
        if (!isset($info['appid'])) {
            return false;
        }

        return $info;
    }
}
