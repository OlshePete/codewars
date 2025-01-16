console.log('class test start')
class First {
    constructor(public type = 'first'){
        console.log('constructor');
        
        this.showType()
    }
    showType(){
        console.log(this.type)
    }
}
class Second extends First {
    type = 'second'
}
new Second('foo')

new Second().showType()