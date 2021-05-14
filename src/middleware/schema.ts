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
          "Branding",
          "Marketing",
          "VFX",
          "UI/UX",
          "Interactive Design",
          "Visual Design",
          "Graphic Design"
        )
      ),
    tools: Joi.array()
      .max(4)
      .items(
        Joi.string().valid(
          "Figma",
          "Sketch",
          "Framer",
          "Adobe XD",
          "Illustrator",
          "After Effects",
          "Webflow",
          "Protopie",
          "Invision",
          "Principle"
        )
      ),
    outreach: Joi.string()
      .required()
      .valid(
        "Twitter",
        "Instagram",
        "Facebook",
        "Linkedin",
        "Email",
        "Discord",
        "Slack",
        "Reddit",
        "Word of Mouth"
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
