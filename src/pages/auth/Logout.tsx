import React from "react";
import { Loader2 } from "lucide-react";
import { authAccessTokenSelector, authActions } from "./_store/auth";
import { AppDispatch, RootState } from "@/store/store";
import { ConnectedProps, connect } from "react-redux";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const mapStateToProps = (state: RootState) => ({
  accessToken: authAccessTokenSelector(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  handleLogout() {
    dispatch(authActions.logout());
  },
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const Icons = {
  spinner: Loader2,
};

const Logout: React.FC<PropsFromRedux> = ({ accessToken, handleLogout }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Logout from the context
    logout();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    handleLogout();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [accessToken]);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Icons.spinner className="h-4 w-4 animate-spin" />
    </div>
  );
};

export default connector(Logout);
