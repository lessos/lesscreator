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

    public static function GroupByAppList()
    {
        return array(
            '50' => 'Business Applications',
            '51' => 'Collaboration Applications',
            '52' => 'Productivity Applications',
            '53' => 'Develop Library, Middleware'
        );
    }

    public static function GroupByDevList()
    {
        return array(
            '61' => 'Web Frontend Library, Framework',
            '62' => 'Web Backend Library, Framework',
            '70' => 'System Library',
            '71' => 'System Server, Service'
            //'63' => '',
        );

        /*
            'Develop Libs',

            'Business Tools',
            'Education',
            'Entertainment',
            'Games',
            'Lifestyle',
            'News & Weather',
            'Productivity',
            'Social & Communication',
            'Utilities',

            'Developer Tools',
        */
    }
    
    public static function ProjInfoDef($proj)
    {
        return array(
            'projid'    => "$proj",
            'name'      => "$proj",
            'summary'   => '',
            'version'   => '0.0.1',
            'depends'   => '',
            'release'   => '1',
            'arch'      => 'all',
            'runtimes'  => array(),
            'props_app' => array(),
            'props_dev' => array(),
        );
    }
    
    public static function NginxConfTypes()
    {
        return array(
            'std'    => 'Standard configuration',
            'static' => 'Pure static files',
            'phpmix' => 'php-fpm (PHP FastCGI Process Manager) and static files',
            'custom' => 'Custom Configuration',
        );
    }
}
