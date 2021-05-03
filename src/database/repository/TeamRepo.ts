import Team, { teamModel } from '../models/Team'
import { Types } from 'mongoose'
import User from '../models/User'

export default class TeamRepo {
    
    public static async createTeam(team: Team){
        team._id = Math.floor((Math.random()*1000000)+1);
        const createdTeam = await teamModel.create(team)
        return createdTeam.toObject()
    }

    public static updateTeam(team: Team){
        return teamModel.updateOne(
            { _id: team._id }, { $set: { ...team }})
    }

    public static joinTeam(team: Team, user: User){
        return teamModel.updateOne(
            { _id: team._id }, 
            { "$push": { "users": user._id} })
    }

    public static inviteToTeam(team: Team){
        return team._id
    } 
}