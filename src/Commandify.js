var Commandify = function(object, options) {
    options = options || {};
    options.apply = options.apply === undefined ? true : options.apply;
    options.wrapper = options.wrapper || null;

    var applyFctBuilder = options.apply ? function(command) {
        return function() {
            return Commandify.applyCommand(command.object, command);
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
    var wrapper = options.wrapper;
    if (wrapper) {
        buildFct = function(object, methodName, fctArgs) {
            return wrapper(buildFctSimple(object, methodName, fctArgs));
        }
    }
    var finalBuildFct = function(key) {
        return function() {
            return buildFct(object, key, argsToArray(arguments));
        }
    }

    var result = {};
    var inheritFrom = function(object) {
        Object.getOwnPropertyNames(object).forEach(function(key) {
            var value = object[key];
            if (typeof value === "function") {
                result[key] = finalBuildFct(key);
            }
        });
    }
    inheritFrom(Object.getPrototypeOf(object));
    inheritFrom(object);
    return result;
}
const argsToArray = (args) => {
  const arr = []
  for (let i=0;i<args.length;i++) {
    arr.push(args[i])
  }
  return arr
}
Commandify.applyCommand = function(object, command) {
    if (command.method in object) {
        return object[command.method].apply(object, command.args);
    } else {
        throw new Error("cannot apply command "+command.method+" on object "+object);
    }
}

module.exports = Commandify;
