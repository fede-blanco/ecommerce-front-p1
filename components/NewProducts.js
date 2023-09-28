import Center from "./Center.js"
import ProductsGrid from "./ProductsGrid.js"
import Title from "./Title.js"

export default function NewProducts({ products, wishedProducts }) {
  return (
    <Center>
      <Title>New Arrivals</Title>
      <ProductsGrid products={products} wishedProducts={wishedProducts} />
    </Center>
  )
}
