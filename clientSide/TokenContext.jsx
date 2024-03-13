import { createContext, useReducer } from 'react'

const tokenReducer = (state, action) => {
    console.log(state, action.payload)
  switch (action.type) {
    case "SET":
        return action.payload
    case "NULL":
        return null
    default:
        return state
  }
}

const TokenContext = createContext()

export const TokenContextProvider = (props) => {
    const [token, tokenDispatch] = useReducer(tokenReducer, 0)
  
    return (
      <TokenContext.Provider value={[token, tokenDispatch] }>
        {props.children}
      </TokenContext.Provider>
    )
  }
  

export default TokenContext