var CommandFactory = function(object, options) {
    this.options = options || {};
    this.options.apply = this.options.apply === undefined ? true : this.options.apply;
    this.options.wrapper = this.options.wrapper || null;

    var applyFctBuilder = this.options.apply ? function(command) {
        return function() {
            var object = command.object;
            if (command.method in object) {
                return object[command.method].apply(object, command.args);
            } else {
                throw new Error("cannot apply command "+command.method+" on object "+object);
            }
        }
    } : null;

    var buildFctSimple = function(object, methodName, fctArgs) {
        var command = {
            object: object,
            method: methodName,
            args: fctArgs
        }
        command.apply = applyFctBuilder(command);
        return command;
    }
    var buildFct = buildFctSimple;
    var wrapper = this.options.wrapper;
    if (wrapper) {
        buildFct = function(object, methodName, fctArgs) {
            return wrapper(buildFctSimple(object, methodName, fctArgs));
        }
    }
    var finalBuildFct = function(key) {
        return function() {
            return buildFct(object, key, arguments);
        }
    }

    var result = {};
    for (var key in object) {
        var value = object[key];
        if (typeof value === "function") {
            result[key] = finalBuildFct(key);
        }
    }
    return result;
}

module.exports = CommandFactory;