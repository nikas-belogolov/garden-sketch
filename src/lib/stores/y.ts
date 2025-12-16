import * as Y from "yjs"


export const doc = new Y.Doc()



export const yName = doc.getText("name")
export const yObjects = doc.getMap("objects")


export const undoManager = new Y.UndoManager([
    yName,
    yObjects
])

