var CommandFactory = function() {
}
CommandFactory.prototype.build = function(object, method, fctArgs) {
    var self = this;
    var command = {
        object: object,
        method: method,
        args: fctArgs,
        apply: function() {
            return self.apply(command, object);
        }
    }
    return command;
}
CommandFactory.prototype.apply = function(command, object) {
    if (command.method in object) {
        return object[command.method].apply(object, command.args);
    } else {
        throw new Error("cannot apply command "+command.method+" on object "+object);
    }
}
CommandFactory.prototype.commandify = function(object, wrapper) {
    var self = this;
    var result = {};
    if (wrapper) {
        for (var key in object) {
            result[key] = function(key2) {
                return function() {
                    return wrapper(self.build(object, key2, arguments));
                }
            }(key)
        }
    } else {
        for (var key in object) {
            result[key] = function(key2) {
                return function() {
                    return self.build(object, key2, arguments);
                }
            }(key)
        }
    }
    return result;
}
module.exports = new CommandFactory();