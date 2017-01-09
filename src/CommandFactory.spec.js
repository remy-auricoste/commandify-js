var CommandFactory = require("./CommandFactory");

describe("CommandFactory", function() {
    var Adder = function(value) {
        this.value = value || 0;
    }
    Adder.prototype.add = function() {
        return new Adder(this.value + 1);
    }

    it("should be able to return a command mirror of an object", function() {
        var object = new Adder(1)
        expect(object.value).to.equal(1);

        var commandBuilder = CommandFactory.commandify(object);
        var command = commandBuilder.add();
        expect(object.value).to.equal(1);

        var newObject = command.apply();
        expect(object.value).to.equal(1);
        expect(newObject.value).to.equal(2);
    });
    it("should be able to add behavior when command is called", function() {
        var object = new Adder(1)
        expect(object.value).to.equal(1);

        var added = false;
        var commandBuilder = CommandFactory.commandify(object, function(command) {
            added = true;
            return command;
        });

        expect(added).to.equal(false);
        var command = commandBuilder.add();
        expect(object.value).to.equal(1);
        expect(added).to.equal(true);

        var newObject = command.apply();
        expect(object.value).to.equal(1);
        expect(newObject.value).to.equal(2);
        expect(added).to.equal(true);
    })
})