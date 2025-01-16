interface ITask {
task:any,
}
interface ISubtask {
    parent:string,
    task:any,
}

interface ITaskPanelProps <K extends ITask | ISubtask>{
 task:K,
}

const ttask = {
    task:null,
}, tsubtask = {
    task:null,
    parent:'parent'
}
const test1:ITaskPanelProps = {
    task:ttask
}
const test2:ITaskPanelProps = {
    task:tsubtask
}