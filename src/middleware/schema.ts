import * as Joi from "joi";
import constants from "../constants";

const schemas = {
  figmaAuth: Joi.object().keys({
    code: Joi.string().required(),
    redirectUri: Joi.string().uri().required(),
  }),
  editTeamName: Joi.object().keys({
    teamName: Joi.string().max(15).required(),
  }),
  sendInvite: Joi.object().keys({
    receiversId: Joi.string().required(),
    token: Joi.string().required(),
  }),
  acceptInvite: Joi.object().keys({
    sentBy: Joi.string().required(),
    teamId: Joi.string().required(),
  }),
  joinTeamByCode: Joi.object().keys({
    teamCode: Joi.string().required().length(6),
    token: Joi.string().required(),
  }),
  cancelInvite: Joi.object().keys({
    receiversId: Joi.string().required(),
    token: Joi.string().required(),
  }),
  rejectInvite: Joi.object().keys({
    teamId: Joi.string().required(),
  }),
  createTeam: Joi.object().keys({
    teamName: Joi.string().max(15).required(),
    needTeam: Joi.bool().required(),
  }),
  userDetails: Joi.object().keys({
    discordHandle: Joi.string()
      .required()
      .regex(/^.{2,32}#[0-9]{4}$/),
    skills: Joi.array()
      .max(4)
      .items(
        Joi.string().valid(
          constants.branding,
          constants.marketing,
          constants.vfx,
          constants.uiux,
          constants.interactiveDesign,
          constants.visualDesign,
          constants.grpahicsDesign
        )
      ),
    tools: Joi.array()
      .max(4)
      .items(
        Joi.string().valid(
          constants.figma,
          constants.sketch,
          constants.framer,
          constants.adobeXd,
          constants.illustrator,
          constants.afterEffects,
          constants.webflow,
          constants.protopie,
          constants.invision,
          constants.principle
        )
      ),
    outreach: Joi.string()
      .required()
      .valid(
        constants.twitter,
        constants.instagram,
        constants.facebook,
        constants.linkedin,
        constants.email,
        constants.discord,
        constants.slack,
        constants.reddit,
        constants.wordOfMouth
      ),
  }),
  searchWithPagination: Joi.object()
    .required()
    .keys({
      name: Joi.string().allow(""),
      pageNumber: Joi.number().min(1).required(),
      pageSize: Joi.number().min(1).max(10).required(),
    }),
  lockProblemStatement: Joi.object().keys({
    part1: Joi.bool().required(),
    part2: Joi.bool().required(),
    part3: Joi.bool().required(),
  }),
  createOrEditSubmission: Joi.object().keys({
    title: Joi.string().max(25).required(),
    description: Joi.string().max(1000),
    tracks: Joi.array().items(
      Joi.string().valid(
        constants.graphicDesignTrack,
        constants.bestPitchTrack,
        constants.bestFreshersTrack,
        constants.bestCommunityVotedSolutionTrack
      )
    ),
    submissionLink: Joi.array().items(Joi.string().uri()).required(),
  }),
};

export default schemas;
