import { ShapeProps } from "@/app/app/garden/[gardenId]/common"
import { nanoid } from "nanoid"
import * as Y from "yjs"
import { TypedMap } from "yjs-types"

export const doc = new Y.Doc()

export const yName = doc.getText("name")
export const yObjects = doc.getMap("objects")

export const undoManager = new Y.UndoManager([
    yName,
    yObjects
])

