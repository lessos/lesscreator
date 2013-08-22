<?php


class lesscreator_env
{  
    public static function TypeList()
    {
        return array(
            'webphp'    => 'Web - PHP',
            'webstatic' => 'Web - Static',
            'libphp'    => 'Library - PHP',
        );
    }
    
    public static function ProjInfoDef($proj)
    {
        return array(
            'projid'  => "$proj",
            'name'    => "$proj",
            'summary' => '',
            'version' => '1.0.0',
            'release' => '1',
            'depends' => '',
            'props'   => '',
            'arch'    => 'all',
            'types'   => '',
            'runtimes'=> array(),
        );
    }
}
