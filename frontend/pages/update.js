import PropTypes from 'prop-types';
import UpdateProduct from '../components/UpdateProduct';

UpdatePage.defaultProps = {
  query: '',
};

UpdatePage.propTypes = {
  query: PropTypes.object,
};

export default function UpdatePage({ query }) {
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}
