import { createContext, useEffect, useState } from "react"
export const CartContext = createContext({})
export function CartContextProvider({ children }) {

  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const defaultProducts = ls ? JSON.parse(ls.getItem('cart')) : [];

  const [cartProducts, setCartProducts] = useState(defaultProducts || [])

  useEffect(() => {
    if(cartProducts?.length >= 0){
      ls.setItem('cart', JSON.stringify(cartProducts))
    }

  },[cartProducts])

  function addProduct(productId){
        setCartProducts(prev => [...prev, productId])
  }
  function removeProduct(productId){
      setCartProducts(prev => {
        const pos = prev.indexOf(productId)
        if(pos !== -1){
          let newArray = prev.filter((value, index) => index !== pos)
            return newArray;
        }
        return prev;
      })
  }

  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, removeProduct}}>
      {children}
    </CartContext.Provider>
  )
}
