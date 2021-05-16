import * as Joi from "joi";
import constants from "../constants";

const schemas = {
  figmaAuth: Joi.object().keys({
    code: Joi.string().required(),
    redirectUri: Joi.string().uri().required(),
  }),
  editTeamName: Joi.object().keys({
    teamName: Joi.string().required(),
  }),
  sendInvite: Joi.object().keys({
    receiversId: Joi.string().required(),
  }),
  acceptInvite: Joi.object().keys({
    sentBy: Joi.string().required(),
    teamId: Joi.string().required(),
  }),
  joinTeamByCode: Joi.object().keys({
    teamCode: Joi.string().required().length(6),
  }),
  cancelInvite: Joi.object().keys({
    receiversId: Joi.string().required(),
  }),
  rejectInvite: Joi.object().keys({
    teamId: Joi.string().required(),
  }),
  createTeam: Joi.object().keys({
    teamName: Joi.string().required(),
    needTeam: Joi.bool().required(),
  }),
  userDetails: Joi.object().keys({
    discordHandle: Joi.string()
      .required()
      .regex(/^\D+#\d{4}$/),
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
};

export default schemas;
