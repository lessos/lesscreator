<?php


class h5creator_service
{
    public static function debugPrint($d)
    {
        echo "<pre>";
        print_r($d);
        echo "</pre>";
    }
    
    public static function listAll()
    {
        return array(
            //'pagelet'       => 'Pagelet',
            'data'          => 'Database',
            'dataflow'      => 'Dataflow',
        );
    }

    public static function listExecMode()
    {
        return array(
            '1' => 'Execute by manual',
            '2' => 'Execute on a regular time',
            '3' => 'Execute by loop, after a certain time interval',
            '4' => 'Execute forever, never expires',
        );
    }

    public static function listParaMode()
    {
        return array(
            '1' => 'Develop or Debug, starts a single process',
            '2' => 'Bound to server. Each physical server starts a process',
            '3' => 'Bound to database. Each database starts a process',
            '4' => 'Bound to database. Each physical server starts a process',
            '5' => 'Bound to database. Each shard node starts a process',
        );
    }
}
