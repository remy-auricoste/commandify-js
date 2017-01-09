var CommandFactory = function() {
}
CommandFactory.prototype.build = function(method, fctArgs) {
    return {
        method: method,
        args: fctArgs
    }
}
CommandFactory.prototype.apply = function(command, object) {
    if (command.method in object) {
        return object[command.method].apply(object, command.args);
    } else {
        throw new Error("cannot apply command "+command.method+" on object "+object);
    }
}
CommandFactory.prototype.commandify = function(object, wrapper) {
    if (!wrapper) {
        wrapper = function(command) {
            return command;
        }
    }
    var self = this;
    var result = {};
    for (var key in object) {
        result[key] = function(key2) {
            return function() {
                return wrapper(self.build(key2, arguments));
            }
        }(key)
    }
    return result;
}
module.exports = new CommandFactory();