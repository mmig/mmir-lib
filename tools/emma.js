(function(mmir) {
    var _instance = {
        "xmlns": "http://www.w3.org/2003/04/emma",
        "version": "1.0",
    };

    function toEmma() {
        return {
            emma: buildEmma(arguments)
        };
    }

    function guid() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    function buildEmma() {
        var args = arguments[0];
        switch (args[0]) {
            case "touchInput":
                var emma = _instance;
                emma["interpretation"] = {};
                emma.interpretation.start = args[1].event.timeStamp;
                /* TODO emma.interpretation.end = args[1].event.timeStamp; */
                emma.interpretation.mode = "gui";
                emma.interpretation.medium = "tactile";
                emma.interpretation.confidence = 1.0;
                emma.interpretation.id = guid();
                emma.interpretation.gesture = {};
                emma.interpretation.gesture.type = args[1].event.type;
                emma.interpretation.gesture.reference = {};
                emma.interpretation.gesture.reference.type = args[1].event.target.localName;
                /* TODO add id to the button elements in the view */
                emma.interpretation.gesture.reference.id = args[1].event.target.id;
                emma.interpretation.action = {};
                emma.interpretation.action.name = args[1].event.target.name;
                emma.interpretation.action.data = args[1].data;
                // @chsc03 FIXME div element cannot be converted to JSON due to circular reference
                emma.interpretation.action.source = new XMLSerializer().serializeToString(args[1].source);
                //emma.interpretation.action.source = args[1].source;
                console.debug(JSON.stringify(emma));
                return emma;
            case "speechInput":
                // @chsc03 TODO
                break;
            default:
                console.log('not known input');
                break;
        }
        // $.fn.trigger.call($(document), "inputManager", emma);
    }
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = toEmma;
        }
        mmir.emma = toEmma;
    } else {
        mmir.emma = toEmma;
    }
})(this.mmir = this.mmir || {});