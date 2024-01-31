"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customRateLimiter = void 0;
const moment_1 = __importDefault(require("moment"));
const requests = {};
const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 10;
const WINDOW_LOG_INTERVAL_IN_SECONDS = 1;
const customRateLimiter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let apiKey = req.headers.authorization;
        if (!apiKey) {
            if (req.originalUrl.includes('user/new') || req.originalUrl.includes("admin/create")) {
                return next();
            }
            else {
                return res.status(400).send('Provide API key to access this resource');
            }
        }
        // fetch records of current user using IP address, returns null when no record is found
        const record = yield requests[apiKey];
        const currentRequestTime = (0, moment_1.default)();
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
            let windowStartTimestamp = (0, moment_1.default)().subtract(WINDOW_SIZE_IN_SECONDS, 'seconds').unix();
            let requestsWithinWindow = data.filter((entry) => {
                return entry.requestTimeStamp > windowStartTimestamp;
            });
            let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
                return accumulator + entry.requestCount;
            }, 0);
            // if number of requests made is greater than or equal to the desired maximum, return error
            if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
                res.status(429).json(`You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_SECONDS / 60} Minute limit!`);
            }
            else {
                // if number of requests made is less than allowed maximum, log new entry
                let lastRequestLog = data[data.length - 1];
                let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds').unix();
                //  if interval has not passed since last request log, increment counter
                if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                    lastRequestLog.requestCount++;
                    data[data.length - 1] = lastRequestLog;
                }
                else {
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
    }
    catch (error) {
        next(error);
    }
});
exports.customRateLimiter = customRateLimiter;
//# sourceMappingURL=rateLimiter.js.map