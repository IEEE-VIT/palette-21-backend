import * as Joi from "joi";

const schemas = {
  figmaAuth: Joi.object().keys({
    code: Joi.string().required(),
    redirectUri: Joi.string().uri().required(),
  }),
  editTeamName: Joi.object().keys({
    teamName: Joi.string().required(),
  }),
  sendInvite: Joi.object().keys({
    teamId: Joi.string().required(),
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
    receiversId: Joi.string().required(),
  }),
  createTeam: Joi.object().keys({
    teamName: Joi.string().required(),
    needTeam: Joi.bool().required(),
  }),
  userDetails: Joi.object().keys({
    discordHandle: Joi.string().required(),
    skills: Joi.array(),
    tools: Joi.array(),
    outreach: Joi.string().required(),
  }),
  searchWithPagination: Joi.object()
    .required()
    .keys({
      name: Joi.string(),
      pageNumber: Joi.number().min(1).required(),
      pageSize: Joi.number().min(1).max(10).required(),
    }),
};

export default schemas;
