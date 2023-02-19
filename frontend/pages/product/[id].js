import PropTypes from 'prop-types';
import SingleProduct from '../../components/SingleProduct';

SingleProductPage.defaultProps = {
  query: '',
};

SingleProductPage.propTypes = {
  query: PropTypes.object,
};

export default function SingleProductPage({ query }) {
  return <SingleProduct id={query.id} />;
}
