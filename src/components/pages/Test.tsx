import React, {useContext} from "react";
import {rootStore, StoreContext} from '../../context'

export const Test: React.FC = () => {
    return <StoreContext.Provider value={rootStore}>
        <Consume />
    </StoreContext.Provider>
}

const Consume: React.FC = () => {
    const store = useContext(StoreContext)
    return <div>{store.room.test}</div>
}
