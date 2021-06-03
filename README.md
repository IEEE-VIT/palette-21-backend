# Palette 2021 Backend

![Banner](assets/title.png)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg?style=flat-square)
[![GitHub Issues](https://img.shields.io/github/issues/aryan9600/IEEE-CTF-Questions.svg)](https://github.com/IEEE-VIT/palette-21-backend/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg?style=flat-square)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-yellow.svg?style=flat-square)](#contributors-)

## About

Palette 2021 Backend, This project was to create a backend that ensures a smooth functioning for participants of Palette 21.

Participants can register and log in either via their Google or Figma accounts.
You can create a team or join an existing one. After registering, you can send invites to other participants who are looking for a teammate. The participant who received the invite can either accept or reject an invite.

Once the registration deadline passes, new users cannot register. Once the team formation deadline passes, you cannot change your team.

Each team can generate up to 3 new random problem statements. You and your teammate can either lock individual parts of the problem statement or the entire one at once. Once the three tries are over, your last generated problem statement is locked if you haven't locked one before it.

Each team has to submit their submission for the first round before the deadline passes. You can edit your submission as many times as you want. Once the deadline passes and the judges have released the qualified teams, the next round begins and only the qualified teams can make updates to their previous submissions accordingly for the next round.

## About the Backend

- Standard response structure was followed for a smoother integration
- Google and Figma Oauth were used for the authentication along with Passport JWT
- MVC architecture was implemented
- Robust error handling to send specific errors to the frontend for a better UX experience
- MongoDB deployed on Atlas was used as our database
- Staging branch was deployed on Heroku to test the features before they were deployed to production
- The master branch had the production code and was deployed on Microsoft Azure

## Tech Stack

- Node
- Typescript
- Express
- MongoDB
- Azure
- Heroku

## Getting Started

To get started:

- Clone the repo.
  `https://github.com/IEEE-VIT/palette-21-backend`
- Checkout to a new branch.
  `git checkout -b my-amazing-feature`
- Make some amazing changes.
- `git add .`
- `git commit -m "<verb> : <action>."`
- `git push origin my-amazing-feature`
- Open a pull request :)

To start contributing, check out [`CONTRIBUTING.md`](https://github.com/IEEE-VIT/palette-21-backend/blob/master/CONTRIBUTING.md) . New contributors are always welcome to support this project.

### Environment Variables

In order to run this project successfully, create a `.env` file filled with keys are shown below. Make sure to fill your credentials and values

```env
DB_URI=<MongoDB URI>
client_id=<Google Oauth Client Id>
client_secret=<Google Oauth Client secret>
figma_client_id=<Figma Oauth Client Id>
figma_client_secret=<Figma Oauth Client Secret>
redirect_uri=<URL for OAuth Redirect>
FRONTEND_URL=<Frontend URL of Palette'21>
JWT_SECRET=<JWT secret key>
pb_stmt_deadline=2021-05-27 23:00
team_reg_deadline=2021-05-27 22:30
user_reg_deadline=2021-05-27 19:00
round_1_deadline=2021-05-28 12:40
round_2_deadline=2021-05-28 13:00
round_3_deadline=2021-05-29 21:00
round_2_result=2021-05-28 18:00
RECAPTCHA_KEY=<Google Recaptcha Key>
```

You can refer the following references to fill in some of the keys mentioned above:

- [Figma Oauth](https://www.figma.com/developers/api#oauth2)
- [Google Oauth](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Recaptcha](https://developers.google.com/recaptcha/intro)
- [Palette Frontend](https://github.com/IEEE-VIT/Palette-Frontend-21) 

### Development Run

```shell
yarn install
yarn dev
```

### Production Run

```shell
yarn install
yarn start
```

### Postman API Documentation

[View here](https://www.getpostman.com/collections/ae244bba41f8af75dba2)

## Contributors ✨

<table>
	<tr>
    	<td align="center">
    		<a href="https://github.com/r-ush"><img src="https://avatars.githubusercontent.com/r-ush" width="100px;" alt="Rush"/><br /><sub><b>Aarush Bhat</b></sub></a>
    	</td>
			<td align="center">
    		<a href="https://github.com/DarthBenro008"><img src="https://avatars.githubusercontent.com/DarthBenro008" width="100px;" alt=""/><br /><sub><b>Hemanth Krishna</b></sub></a>
    	</td>
    	<td align="center">
    		<a href="https://github.com/ishan-001"><img src="https://avatars.githubusercontent.com/ishan-001" width="100px;" alt=""/><br /><sub><b>Ishan Khandelwal</b></sub></a>
    	</td>
		<td align="center">
			<a href="https://github.com/ShubhamPalriwala"><img src="https://avatars.githubusercontent.com/ShubhamPalriwala" width="100px;" alt="Noob"/><br /><sub><b>Shubham Palriwala</b></sub></a>
		</td>
    </tr>

</table>

<p align="center">Made with ❤ by IEEE-VIT</p>
