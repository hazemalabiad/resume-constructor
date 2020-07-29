import * as actions from "actions/experienceActions";
import { addExperience, fetchExperiences } from "api/apis";
import { DESIGN_SYSTEM } from "designSystem";
import { getRandomDate } from "helpers/strings";
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Divider, Grid, Icon, Placeholder } from "semantic-ui-react";
import BackgroundSectionHeader from "./BackgroundSectionHeader";

// #################    Globals   #################
const {
  experienceRoleStyle,
  experienceCompanyStyle,
  experienceDateStyle,
} = DESIGN_SYSTEM;

const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  experiences: state.experiences,
});

const mapDispatchToProps = (dispatch) => ({
  fetchExperiences: (experiences) =>
    dispatch(actions.fetchExperiences(experiences)),
  addExperience: (experience) => dispatch(actions.addExperience(experience)),
});

/**
 * #################   Main Component    #################
 * @typedef {object} Props
 * @property {Object} userInfo
 * @property {Object[]} experiences
 * @property {string} userInfo.token
 * @property {Function} fetchExperiences
 * @property {Function} addExperience
 * @extends {Component<Props>}
 */
class Experience extends Component {
  // ###############   Life-Cycle Methods    ###############
  componentDidMount() {
    // Load experiences by making an API call
    fetchExperiences(this.props.fetchExperiences);
  }

  handleAddExperience = (values, reduxDevtoolCbFn, formProps) => {
    const { role, company, description } = values;
    const { onSubmitClose } = formProps;
    addExperience(
      role,
      company,
      description,
      actions.addExperience,
      onSubmitClose
    );
  };

  renderExperiences = () => {
    // If experiences not loaded yet, return a Loader
    if (!this.props.experiences.length) {
      return (
        <Grid.Column>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </Grid.Column>
      );
    }

    return _.map(
      this.props.experiences,
      /**
       * @param {object} experience
       * @param {number} experience.id
       * @param {string} experience.role
       * @param {string} experience.company
       * @param {string} experience.description
       */
      (experience) => {
        return (
          <Grid key={experience.id}>
            <Grid.Column mobile="12" tablet="13" computer="14">
              {experienceRoleStyle(experience.role)}
              {experienceCompanyStyle(experience.company)}
              {experienceDateStyle(getRandomDate())}
              <p className="mt-3">{experience.description}</p>
            </Grid.Column>
            <Grid.Column mobile="4" tablet="3" computer="2">
              <Icon
                name={experience.company.toLowerCase()}
                floated="right"
                size="huge"
              />
            </Grid.Column>
          </Grid>
        );
      }
    );
  };

  render() {
    return (
      <>
        <BackgroundSectionHeader
          sectionIcon="file alternate"
          sectionName="Experience"
          sectionAddHeader="experience.add"
          onSubmit={this.handleAddExperience}
        />
        {this.renderExperiences()}
        <Divider className="my-5" />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Experience);
