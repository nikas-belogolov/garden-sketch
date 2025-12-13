import React from "react"
import * as Y from "yjs"

export function useShape(shape: Y.Map<any>) {
    const [shapeState, setShapeState] = React.useState(shape.toJSON())
    
    React.useEffect(() => {

        function handleChange() {
            setShapeState(shape.toJSON())
        }

        shape.observeDeep(handleChange)

        return () => {
            shape.unobserveDeep(handleChange)
        }

    })
}