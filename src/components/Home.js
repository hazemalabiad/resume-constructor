import { navigate } from "@reach/router";
import { ROUTE_NAMES } from "constants/routeNames";
import { DESIGN_SYSTEM } from "designSystem";
import { isAuthenticated } from "helpers/localStorageHelpers";
import { getRandomInt } from "helpers/numbers";
import { capitalizeFirstLetter } from "helpers/strings";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Grid,
  Icon,
  Image,
  Placeholder,
  Segment,
  Statistic
} from "semantic-ui-react";
import Background from "./Background";
import Header from "./Header";
import Login from "./Login";
import NotAuthorized from "./NotAuthorized";
import WithTrans from "./WithTrans";

// #####################   Globals    ######################

// ################   Helper ComponentS    ###################
const MessageBtn = () => {
  let size = "mini";
  let color = "blue";
  return (
    <div className="mt-5 floated">
      <Button size={size} color={color} attached="left">
        {<WithTrans keyword="Send a message" />}
      </Button>
      <Button attached="right" className="pr-1" size={size} color={color}>
        <Icon name="caret down" />
      </Button>
    </div>
  );
};

const ConnectionsCounter = () => {
  return (
    <Statistic color="blue" size="tiny" className="flex">
      <Statistic.Value>{getRandomInt()}</Statistic.Value>
      <Statistic.Label className="gray">
        {<WithTrans keyword="Connections" />}
      </Statistic.Label>
    </Statistic>
  );
};

const Name = ({ userInfo }) => {
  const { t } = useTranslation();
  let firstName =
    (userInfo.firstName && capitalizeFirstLetter(userInfo.firstName)) ||
    t("Name");
  let lastName =
    (userInfo.lastName && capitalizeFirstLetter(userInfo.lastName)) ||
    t("Surname");
  return <h1>{firstName + " " + lastName}</h1>;
};

const EmptyLines = () => (
  <Placeholder>
    <Placeholder.Line />
    <Placeholder.Line />
    <Placeholder.Line />
    <Placeholder.Line />
  </Placeholder>
);

const ButtonAndConnections = () => (
  <div className="d-flex align-items-end">
    <div>
      <MessageBtn />
    </div>
    <div className="ml-auto">
      <ConnectionsCounter />
    </div>
  </div>
);
/**
 * ##################   Main Component    ##################
 * @param {object} props
 * @param {Function} props.logout
 * @param {object} props.userInfo
 * @param {number} props.userInfo.id
 * @param {string} props.userInfo.username
 * @param {string} props.userInfo.firstName
 * @param {string} props.userInfo.lastName
 */
const Home = ({ logout, userInfo }) => {
  const { t } = useTranslation();

  if (!isAuthenticated()) {
    // If not authenticated
    setTimeout(() => {
      navigate(ROUTE_NAMES.login, { replace: true });
      return <Login />;
    }, 1000);
  }

  // If not authorized yet, display a temporary message until
  // the user gets redirected
  if (!isAuthenticated()) {
    return <NotAuthorized />;
  }

  // Remove any mis-typed URL
  if (window.location.pathname !== ROUTE_NAMES.home) {
    navigate(ROUTE_NAMES.home);
  }

  return (
    <section style={DESIGN_SYSTEM.setAzureBgColor(window.location.pathname)}>
      <Header logout={logout} />
      <Grid container centered>
        <Grid.Column mobile="16" tablet="14" computer="12">
          <Segment>
            <Grid container centered padded="vertically" verticalAlign="middle">
              <Grid.Column mobile="14" tablet="6" computer="5">
                <Image
                  src="https://semantic-ui.com/images/avatar2/large/matthew.png"
                  circular
                  size="medium"
                  centered
                />
              </Grid.Column>
              <Grid.Column mobile="15" tablet="10" computer="11">
                <Name userInfo={userInfo} />
                <EmptyLines />
                <ButtonAndConnections />
              </Grid.Column>
            </Grid>
          </Segment>
          <Background />
        </Grid.Column>
      </Grid>
    </section>
  );
};

export default Home;

Home.propTypes = {
  logout: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }),
};
