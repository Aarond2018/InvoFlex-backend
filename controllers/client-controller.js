const mongoose = require("mongoose")

const Client = require("../models/ClientModel")
const User = require("../models/UserModel")
const AppError = require("../util/AppError")

exports.getClients = async (req, res, next) => {
  try{
    //get all clients for the logged in user
    const clients = await Client.find({ user: req.userId })

    res.status(200).json({
      status: "success",
      data: clients
    })

  } catch(error) {
    return next(new AppError("Error fetching clients!", 500))
  }
}

exports.createClient = async (req, res, next) => {
  try {
    const { name, email, address } = req.body

    //get the user trying to create the client
    const user = await User.findById(req.userId)

    if(!user) {
      return next(new AppError("Couldn't find the current user", 404))
    }

    const newClient = new Client({
      name,
      email,
      address,
      user: user._id
    })

    //save the new client and also update it on the user model
    const session = await mongoose.startSession();
    session.startTransaction();

    await newClient.save({ session: session });
    user.clients.push(newClient);
    await user.save({ session: session });

    await session.commitTransaction();

    res.status(201).json({
      status: "success",
      data: newClient
    })

  } catch (error) {
    return next(new AppError(error.message ? error.message : "Internal Server Error!", 500))
  }
}

exports.deleteClient = async (req, res, next) => {
  try {
    //get the client for the given id
    const client = await Client.findById(req.params.clientId)

    if(!client) {
      return next(new AppError("Can't find a client for the given id", 404))
    }

    //get the logged in user
    const user = await User.findById(req.userId)

    if(!user) {
      return next(new AppError("Couldn't find the current user", 404))
    }

    //return an error if the user trying to delete is not the owner of the client
    if(client.user.toString() !== user.id.toString()) {
      return next(new AppError("You are not allowed to delete this place", 401))
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    
    await Client.deleteOne({ _id: client._id }, { session: session })
    user.clients.pull(client._id)
    await user.save({ session: session })

    await session.commitTransaction()

    res.status(204).json({
      status: "success"
    })

  } catch (error) {
    return next(new AppError("Something went wrong!", 500))
  }
}

exports.updateClient= async (req, res, next) => {
  try {
    const { name, email, address } = req.body

    //get the client for the given id
    const client = await Client.findById(req.params.clientId)

    if(!client) {
      return next(new AppError("Can't find a client for the given id", 404))
    }

    //return an error if the user trying to update is not the owner of the client
    if(client.user.toString() !== req.userId) {
      return next(new AppError("You are not allowed to update this place", 401))
    }

    client.name = name
    client.email = email
    client.address = address

    await client.save()

    res.status(200).json({
      status: "success",
      data: client
    })

  } catch (error) {
    return next(new AppError("Error updating client!", 500))
  }
}