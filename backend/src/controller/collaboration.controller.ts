import { AppError } from '../errors/AppError.js'
import { CatchAsync } from '../errors/CatchAsync.js'
import { MissingFieldRequired } from '../errors/validation.js'
import { Collaboration } from '../models/collaboration.model.js'
import { sendResponse } from '../utils/feature.js'

export const add_collaborator_api = CatchAsync(async (req, res, next) => {
  const { collaboratorID, collectionID } = req.body
  const missing_field = MissingFieldRequired(
    ['collaboratorID', 'collectionID'],
    req
  )
  if (missing_field?.length) {
    return next(
      new AppError(` These fields ${missing_field.join(',')} are required`, 400)
    )
  }

  const isCollaboratorExists = await Collaboration.findOne({ collaboratorID })
  if (isCollaboratorExists)
    return next(
      new AppError('Collaborator already exists in this collection', 400)
    )

  await Collaboration.create({
    collaboratorID,
    collectionID,
    invitedBy: req?.user?._id as string,
  })

  return sendResponse(res, 'Added in collaboration', 201)
})

export const get_all_collaborator_api = CatchAsync(async (req, res, next) => {
  const collectionId = req?.params?.id
  const page = Number(req?.query?.page) || 1
  const limit = 10
  const skip = (page - 1) * limit
  const all_collaborators = await Collaboration.find({
    collectionId,
    isAccepted: true,
  })
    .skip(skip)
    .limit(limit)
    .exec()
  return sendResponse(res, '', 201)
})
