const history = [
    {
        "date": 1718261322,
        "editor": "Таланов А. С.",
        "description": "Изменены сроки исполнения",
        "typeHistory": "date"
    },
    {
        "date": 1718261322,
        "editor": "Таланов А. С.",
        "description": "Изменены теги",
        "typeHistory": "tags"
    },
    {
        "date": 1718261322,
        "editor": "Таланов А. С.",
        "description": "Добавлены участники",
        "typeHistory": "members"
    },
    {
        "date": 1718261298,
        "editor": "Таланов А. С.",
        "description": "Задача просмотрена",
        "typeHistory": "viewed"
    },
    {
        "date": 1699617745,
        "editor": "Таланов А. С.",
        "description": "Поставлена задача",
        "typeHistory": "status"
    },
    {
        "date": 1699617745,
        "editor": "Сервер Э. Д.",
        "description": "Добавлена Текстовая подзадача",
        "typeHistory": "subtasks",
        "options": {
            "currentTask": "2f7b0ffb-74b1-4b8c-84f4-bcfeb606a60e",
            "currentSubtask": "2f7b0ffb-74b1-4b8c-84f2-bcfeb606a613",
            "typesSubtask": "discus"
        }
    }
]
const groupByDateHistory = (history) => {
    const exceptions = ['subtasks', 'status', 'viewed']
    return history.reduce((acc, item, index)=>{
        const indexItemWithSameDate = acc.findIndex(el=>el.date === item.date)
        if (indexItemWithSameDate>=0 && !exceptions.includes(item.typeHistory)) {
            acc[indexItemWithSameDate].description+=`\n${item.description}` 
        } else {
            acc.push(item)
        }
        return acc
    },[])
}
console.log(groupByDateHistory(history))