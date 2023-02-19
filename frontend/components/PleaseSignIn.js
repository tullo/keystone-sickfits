import PropTypes from 'prop-types';
import useUser from './User';
import SignIn from './SignIn';

PleaseSignIn.defaultProps = {
  children: '',
};

PleaseSignIn.propTypes = {
  children: PropTypes.object,
};

export default function PleaseSignIn({ children }) {
  const me = useUser();
  if (!me) return <SignIn />;
  return children;
}
