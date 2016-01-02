// prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

var l9rData = {
    db      : null,
    version : 12,
    schema  : [{
        name: "files",
        pri: "id",
        idx: ["projdir"]
    }, {
        name: "config",
        pri: "id",
        idx: ["type"]
    }],
};

l9rData.Init = function(dbname, cb)
{
    if (!window.indexedDB) {
        return cb("Your browser doesn't support a stable version of IndexedDB.");
    }

    var req = window.indexedDB.open(dbname, l9rData.version);

    req.onsuccess = function (event) {
        l9rData.db = event.target.result;
        cb(null);
    };

    // console.log(dbname);

    req.onerror = function (event) {
        // console.log(event);
        cb("IndexedDB error: " + event.target.errorCode);
    };

    req.onupgradeneeded = function (event) {
        
        l9rData.db = event.target.result;

        for (var i in l9rData.schema) {
            
            var tbl = l9rData.schema[i];
            
            if (l9rData.db.objectStoreNames.contains(tbl.name)) {
                l9rData.db.deleteObjectStore(tbl.name);
            }

            var objectStore = l9rData.db.createObjectStore(tbl.name, {keyPath: tbl.pri});

            for (var j in tbl.idx) {
                objectStore.createIndex(tbl.idx[j], tbl.idx[j], {unique: false});
            }
        }

        cb(null);
    };
}

l9rData.Put = function(tbl, entry, cb)
{    
    if (l9rData.db == null) {
        return;
    }

    //console.log("put: "+ entry.id);

    var req = l9rData.db.transaction([tbl], "readwrite").objectStore(tbl).put(entry);

    req.onsuccess = function(event) {
        if (cb != null && cb != undefined) {
            cb(true);
        }
    };

    req.onerror = function(event) {
        if (cb != null && cb != undefined) {
            cb(false);
        }
    }
}

l9rData.Get = function(tbl, key, cb)
{
    if (l9rData.db == null) {
        return;
    }

    var req = l9rData.db.transaction([tbl]).objectStore(tbl).get(key);

    req.onsuccess = function(event) {
        cb(req.result);
    };

    req.onerror = function(event) {
        cb(req.result);
    }
}

l9rData.Query = function(tbl, column, value, cb)
{
    if (l9rData.db == null) {
        //console.log("l9rData is NULL");
        return;
    }
    var req = l9rData.db.transaction([tbl]).objectStore(tbl).index(column).openCursor();

    req.onsuccess = function(event) {
        cb(event.target.result);
    };

    req.onerror = function(event) {
        //
    }
}

l9rData.Del = function(tbl, key, cb)
{
    if (l9rData.db == null) {
        return;
    }

    var req = l9rData.db.transaction([tbl], "readwrite").objectStore(tbl).delete(key);

    req.onsuccess = function(event) {
        cb(true);
    };

    req.onerror = function(event) {
        cb(false);
    }
}

l9rData.List = function(tbl, cb)
{
    if (l9rData.db == null) {
        return;
    }

    var req = l9rData.db.transaction([tbl], "readwrite").objectStore(tbl).openCursor();

    req.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            cb(cursor);
        }
    };

    req.onerror = function(event) {

    }
}

