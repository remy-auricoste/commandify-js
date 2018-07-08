Summary
======

`rauricoste-commandiy` is a tool to transform a classic object into a 
command pattern object.

Installation
====

```npm install rauricoste-commandify```

Usage
===

```javascript
const Commandify = require("rauricoste-commandify")

const object = {
    value: 1,
    add: function(number) {
        this.value += number
    }
}
console.log(object) // { value: 1, add: [Function: add] }
const commandObject = Commandify(object) // commandObject has same methods as object
const command = commandObject.add(3)
console.log(command)
// returns :
// { object: { value: 1, add: [Function: add] },
//  method: 'add',
//  args: [ 3 ],
//  apply: [Function] }


command.apply()
//or
//Commandify.applyCommand(object, command)

console.log(object) // { value: 4, add: [Function: add] }
```