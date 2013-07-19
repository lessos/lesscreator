<?php

use LessPHP\Net\Http;

class h5creator_fs
{
    private static $client = null;

    public static function NetHttp($url)
    {
        if (self::$client === null) {
            self::$client = new Http();
        }

        self::$client->setUri($url);
        
        return self::$client;
    }

    public static function FsFileGet($file)
    {
        $req = array(
            'data' => array('path' => $file),
        );

        $cli = self::NetHttp("http://127.0.0.1:9531/h5creator/api/fs-file-get");

        $ret = $cli->Post(json_encode($req));
        if ($ret != 200) {
            return false;
        }

        $ret = json_decode($cli->getBody(), false);
        if (!isset($ret->status)) {
            return false;
        }

        return $ret;
    }

    public static function FsFilePut($path, $body)
    {
        $req = array(
            'data' => array(
                'path' => $path,
                'body' => $body,
                'sumcheck' => md5($body),
            ),
        );

        $cli = self::NetHttp("http://127.0.0.1:9531/h5creator/api/fs-file-put");

        $ret = $cli->Post(json_encode($req));
        if ($ret != 200) {
            return false;
        }

        $ret = json_decode($cli->getBody(), false);
        if (!isset($ret->status)) {
            return false;
        }

        return $ret;
    }
}
