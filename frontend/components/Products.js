import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Product from './Product';

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY {
    allProducts {
      id
      name
      description
      price
      photo {
        image {
          id
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductsListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function Products() {
  // console.log(data, error, loading);
  // (1) initial:  console.log: undefined undefined true
  // (2) rerender: console.log: Object { allProducts: […] } undefined false
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY);
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data, error, loading);
  return (
    <div>
      <ProductsListStyles>
        {data.allProducts.map((p) => (
          <Product key={p.id} product={p} />
        ))}
      </ProductsListStyles>
    </div>
  );
}
