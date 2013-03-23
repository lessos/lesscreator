<?php


class h5creator_service
{
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
}
