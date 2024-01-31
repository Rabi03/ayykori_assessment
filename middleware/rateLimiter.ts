import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

const requests = {};

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 10;
const WINDOW_LOG_INTERVAL_IN_SECONDS = 1;

export const customRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {

    let apiKey = req.headers.authorization;
    
    
    if(!apiKey){
        if(req.originalUrl.includes('user/new')||req.originalUrl.includes("admin/create")){
          return next()
        }
        else{
          return res.status(400).send('Provide API key to access this resource')
        }
    }

    // fetch records of current user using IP address, returns null when no record is found
    const record = await requests[apiKey];
    const currentRequestTime = moment();
    
    //  if no record is found , create a new record for user and store to redis
    if (record === null || record === undefined) {
      let newRecord = [];
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1,
      };
      newRecord.push(requestLog);
      requests[apiKey] = JSON.stringify(newRecord);
      
      next();
    }
    else {
      // if record is found, parse it's value and calculate number of requests users has made within the last window
      let data = JSON.parse(record);
      let windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_SECONDS, 'seconds').unix();
      let requestsWithinWindow = data.filter((entry) => {
        return entry.requestTimeStamp > windowStartTimestamp;
      });
      
      let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
        return accumulator + entry.requestCount;
      }, 0);
      // if number of requests made is greater than or equal to the desired maximum, return error
      if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
        res.status(429).json(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_SECONDS / 60} Minute limit!`);
      } else {
        // if number of requests made is less than allowed maximum, log new entry
        let lastRequestLog = data[data.length - 1];
        let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds').unix();
        //  if interval has not passed since last request log, increment counter
        if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
          lastRequestLog.requestCount++;
          data[data.length - 1] = lastRequestLog;
        } else {
          //  if interval has passed, log new entry for current user and timestamp
          data.push({
            requestTimeStamp: currentRequestTime.unix(),
            requestCount: 1,
          });
        }
        requests[apiKey] = JSON.stringify(data);
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};