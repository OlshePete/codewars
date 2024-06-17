const onHoverUnseenTask = () => {
    return //TODO: раскомментировать, когда на беке появится новый статус у задачи
    if (!task || (task.task.state.status !== TasksStatus.Awaiting)) return;

    const newTask = {
      ...task,
      task: {
        ...task.task,
        state: {
          status: TasksStatus.Running,
        },
        editor: {
          ...task.task.editor,
          user: { ...task.task.editor.user, id: userId || task.task.editor.user.id },
        },
      },
    };
    window.skifWebFrontend.backend.automation.edit(newTask);

  }

//   function filteredNodes(initial: INodesData): INodesData {
//     const entriesObj = Object.entries(initial);
//     let usedChildrenNodes: string[] = [];
//     const result: INodesData = {};
//     entriesObj.forEach(([key, el], index) => {
//       const { children } = el;
//       if (children.every(kid => !usedChildrenNodes.includes(kid))) {
//         usedChildrenNodes = [...usedChildrenNodes, ...children];
//         result[key] = el;
//       }
//     });
//     return result;
//   }
//   console.log(`\x1b[36m @@@ Автоматизация схема \x1b[0m`, JSON.stringify(data));
//   console.log(`\x1b[36m @@@ FILTERED Автоматизация схема \x1b[0m`, filteredNodes(data));
 

// console.log(`\x1b[34m updated data \x1b[0m`, {
  //   prevProps:{
  //     dataForView:prevProps.dataForView,
  //     payload:prevProps.payload,
  //   },
  //   newProps:{
  //     dataForView:newProps.dataForView,
  //     payload:newProps.payload,
  //   }});
