import {RequestHandler} from "express";

export const errorHandler = (handler: Function): RequestHandler => async (req, res, next) => {
  try {
    const { status = 200, response } = await handler(req, res, next);
    res.status(status).send(response);
    console.info('SUCCESS', req.method, `(${status})`, `on "${req.baseUrl}${req.url}"`)
  } catch (error) {
    const { status = 500, message } = error;
    console.error('ERROR', req.method, `(${status})`, `on "${req.baseUrl}${req.url}":`, message);
    res
      .status(status)
      .send({ error: message });
  }
};