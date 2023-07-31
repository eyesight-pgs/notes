import { CRORE, DATETIME_FORMAT_STR, DATE_FORMAT_STR, LAKH, LUXON_DATETIME_FORMAT_STR, ROUNDING_METHOD, TWO_DIGITS, UNDEFINED_STR, WEEKENDS_LIST } from "./constants"
import moment, { Moment } from "moment"
import { DataTypeStr, AnyObject } from "./types"
import DetailedError from "./DetailedError"
import Week from "./Week"
import Month from "./Month"
import { memoryUsage } from "process"
import Timerange from "./Timerange"
import { Readable } from 'stream'
import Storage from "./Storage"
import { pipeline } from 'stream'
import { promisify } from 'util'
import { v4 as uuidV4 } from 'uuid'
import { DateTime } from "luxon"


const lib = {
	round: (
		value: number,
		fractionalPartDigits:number = TWO_DIGITS,
		{
			roundingMethod = ROUNDING_METHOD
		}: {
			roundingMethod?: 'AWAY_FROM_ZERO' /* | 'TOWARDS_ZERO' */ | 'TOWARDS_POSITIVE_INFINITY' /* | 'TOWARDS_NEGATIVE_INFINITY' */
		} = {}
	): number => {
		
		if(typeof value !== 'number') { throw new Error('value must be a number') }
		
		let negligibleValue: number
		switch(roundingMethod) {
			case 'AWAY_FROM_ZERO'				: negligibleValue = Number.EPSILON * value;			break
			// case 'TOWARDS_ZERO'					: negligibleValue = Number.EPSILON * value * -1;	break
			case 'TOWARDS_POSITIVE_INFINITY'	: negligibleValue = Number.EPSILON;					break
			// case 'TOWARDS_NEGATIVE_INFINITY'	: negligibleValue = Number.EPSILON * -1;			break
			default: throw new DetailedError('Invalid roundingMethod', { roundingMethod: valOrUndefStr(roundingMethod) })
		}
		let multiplier = 10 ** fractionalPartDigits // 10^fractionalPartDigits
		return Math.round((value + negligibleValue) * multiplier) / multiplier
	},
	
	div: (
		dividend: number,
		divisor: number,
		{
			valueWhenDivByZero,
			fractionalPartDigits = TWO_DIGITS,
		}: {
			valueWhenDivByZero?: number
			fractionalPartDigits?: number
		} = {}
	): number => {
		
		if(! divisor && valueWhenDivByZero !== undefined) { return lib.round(valueWhenDivByZero, fractionalPartDigits) }
		
		return lib.round(dividend / divisor, fractionalPartDigits)
	},
	
	percent: (
		value: number,
		wrt: number,
		{
			fractionalPartDigits = TWO_DIGITS,
			valueWhenDivByZero,
			limitMaxToHundred = false,
		} : {
			fractionalPartDigits?: number
			valueWhenDivByZero?: number
			limitMaxToHundred?: boolean
		} = {}
	): number => {
		
		let result: number
		
		// value
		if(! wrt && valueWhenDivByZero !== undefined) {
			result = lib.round(valueWhenDivByZero, fractionalPartDigits)
		} else {
			result = lib.div(value * 100, wrt, { fractionalPartDigits })
		}
		
		// limit max to 100 / -100
		if(limitMaxToHundred && Math.abs(result) > 100)
			result = Math.sign(result) * 100
		
		return result
	},
	
	diffPercent: (
		value: number,
		wrt: number,
		{
			withSign = true,
			fractionalPartDigits = TWO_DIGITS,
			valueWhenDivByZero,
			limitMaxToHundred = false,
		} : {
			withSign?: boolean
			fractionalPartDigits?: number
			valueWhenDivByZero?: number
			limitMaxToHundred?: boolean
		} = {}
	): number => {
		
		let result: number
		
		if(value === wrt) return 0
		
		let diff = value - wrt
		if(!withSign) {
			diff = Math.abs(diff)
		}
		
		result = lib.percent(diff, wrt, {fractionalPartDigits, valueWhenDivByZero, limitMaxToHundred})
		return result
	},
	
	errorPercent: (value: number, wrt: number, {
		valueWhenDivByZero,
		maxValue,
	}: {
		valueWhenDivByZero?: number
		maxValue?: number
	} = {}): number => {
		let errorPercent: number = lib.diffPercent(value, wrt, {valueWhenDivByZero, withSign: false})
		
		if(maxValue !== undefined) {
			errorPercent = (errorPercent <= maxValue) ? errorPercent : maxValue
		}
		
		return errorPercent
	},
	
	inCroresOrLakhs: (amount: number): string => {
		
		// negative numbers
		if(Math.sign(amount) === -1) {
			const result = lib.inCroresOrLakhs(Math.abs(amount))
			return `-${result}`
		}
		
		// round to 2 decimal places
		amount = lib.round(amount)
		if(amount < LAKH) {
			return `${amount}`
		}
		
		// lakhs
		const lakhs = lib.round(amount / LAKH)
		if(lakhs < 100) {
			return `${lakhs}L`
		}
		
		// crores
		const crores = lib.round(amount / CRORE)
		return `${crores}Cr`
	},
	
	amountFormatLakhs: (amount: number, fractionalPartDigits: number = TWO_DIGITS): number => {
		let result: number = lib.round(amount / 1_00_000, fractionalPartDigits)
		return result
	},
	
	/**
	 * Get readable value
	 * 
	 * Convert numbers like NaN, Infinity to value like 'NA'
	 */
	getReadableValue: (
		value: number,
		{
			ifNaN = 'NA',
			ifInf = 'NA',
		}: {
			ifNaN?: number | string
			ifInf?: number | string
		} = {}
	): number | string => {
		
		/**
		 * Convert NaN
		 * 
		 * NaN value is usually get from 0/0
		 */
		if(isNaN(value)) {
			return ifNaN
		}
		
		/**
		 * Convert Infinity
		 * 
		 * Infinity value is usually get from division by 0
		 */
		if(Math.abs(value) === Infinity) {
			return ifInf
		}
		
		return value
	},
	
	toBoolean: (value: boolean | string | number): boolean => {
		
		if(typeof value === 'boolean') {
			return value
		} else if (typeof value === 'string') {
			return lib.stringToBoolean(value)
		} else if(typeof value === 'number') {
			return lib.numberToBoolean(value)
		} else {
			throw new Error('Invalid argument provided (value is not boolean or string or number)')
		}
		
	},
	
	stringToBoolean: (value: string): boolean => {
		if(typeof value !== 'string') {
			throw new DetailedError(
				`value is not string`,
				{
					value: valOrUndefStr(value)
				}
			)
		}
		
		switch(value.toLowerCase()) {
			case 'true':
			case '1':
				return true
			
			case 'false':
			case '0':
				return false
			
			default:
				throw new DetailedError(`value (${value}) cannot be converted to boolean`)
		}
		
	},
	
	numberToBoolean: (value: number): boolean => {
		
		if(typeof value !== 'number') {
			throw new DetailedError(
				`value must be a number`,
				{
					value: valOrUndefStr(value),
					type: typeof value,
				}
			)
		}
		
		if(value === 1) { return true }
		if(value === 0) { return false }
		
		throw new DetailedError(
			`Provided value cannot be converted to boolean`,
			{
				value: valOrUndefStr(value)
			}
		)
		
	},
	
	getRandomInt: (min: number, max: number): number => {
		
		// check type
		if(typeof min !== 'number' || typeof max !== 'number') {
			throw new DetailedError(
				`min & max values must be numbers`,
				{
					min: valOrUndefStr(min),
					max: valOrUndefStr(max),
					typeOfMin: typeof min,
					typeOfMax: typeof max,
				}
			)
		}
		
		// check if finite numbers
		if(!Number.isFinite(min) || !Number.isFinite(max)) {
			throw new DetailedError(
				`min & max values must be finite values`,
				{
					min: valOrUndefStr(min),
					max: valOrUndefStr(max),
				}
			)
		}
		
		if(min > max) {
			throw new DetailedError(`min value must be <= max value`, { min, max })
		}
		
		min = Math.ceil(min);
		max = Math.floor(max);
		return min + Math.floor(Math.random() * (max - min + 1));
	},
	
	/**
	 * Cast type and get value
	 * 
	 * note: undefined & null values are not casted
	 */
	castType: (value, type: DataTypeStr) => {
		
		if(value === undefined || value === null) {
			return value
		}
		
		switch(type) {
			case 'any':
				return value
				
			case 'boolean':
				return lib.toBoolean(value)
				
			case 'string':
				return String(value)
				
			case 'number':
				if(!lib.isNumeric(value)) {
					throw new DetailedError(
						`Can not convert provided value to number`,
						{
							value: valOrUndefStr(value)
						}
					)
				}
				return Number(value)
				
			case 'Moment':
				return moment(value, 'YYYY-MM-DD HH:mm:ss')
				
			case 'DateTime':
				return DateTime.fromFormat(value, LUXON_DATETIME_FORMAT_STR)
			
			case 'TypeSortOrder':
				if(['asc', 'ASC'].includes(value)) {
					return 'asc'
				} else if(['desc', 'DESC'].includes(value)) {
					return 'desc'
				} else {
					throw new DetailedError(`lib.castType: cannot cast given value to TypeSortOrder`, {value,})
				}
			
			case 'number[]':
				const retValue: number[] = value.map(item => {
					if(!lib.isNumeric(item)) {
						throw new DetailedError(
							`Can not convert provided value to number array, Invalid number found`,
							{
								invalidNumber: valOrUndefStr(item)
							}
						)
					}
					return Number(item)
				})
				return retValue
			
			default:
				throw new Error(`Cast and get: casting to type ${type} is not implemented`)
		}
	},
	
	sortArray: <T>(
		arr: T[],
		basedOn?: string,
		sortOrder?: 'asc' | 'desc',
		cb?: (element1: T, element2: T) => number,
		{
			onNaN = 'ERROR',
		}: {
			onNaN?: 'MINIMUM' | 'MAXIMUM' | 'ERROR'
		} = {}): void => { // basedOn like 'level1Key.level2Key.level3Key'
		const sign: number = (sortOrder === 'desc') ? -1 : 1
		
		arr.sort((element1, element2) => {
			
			if(basedOn !== undefined) {
				// VALUE 1
				const value1 = basedOn.split('.').reduce((tempObj, tempKey) => {
					return tempObj[tempKey]
				}, element1)
				// VALUE 2
				const value2 = basedOn.split('.').reduce((tempObj, tempKey) => {
					return tempObj[tempKey]
				}, element2)
				
				if(value1 === undefined) throw new DetailedError(`element1[${basedOn}] is undefined`)
				if(value2 === undefined) throw new DetailedError(`element2[${basedOn}] is undefined`)
				
				if(typeof value1 !== 'number') throw new DetailedError(`type of element1[${basedOn}] is not 'number'`)
				if(typeof value2 !== 'number') throw new DetailedError(`type of element2[${basedOn}] is not 'number'`)
				
				let diff: number
				
				const isValue1NaN = isNaN(value1)
				const isValue2NaN = isNaN(value2)
				if(isValue1NaN || isValue2NaN) {
					if(onNaN === 'ERROR') throw new DetailedError('NaN found! cannot sort.', {isValue1NaN, isValue2NaN, elementsToCompare: {element1, element2}, arr})
					
					if(isValue1NaN && isValue2NaN) { // both NaN
						diff = 0
					} else if(isValue1NaN) { // element1 is NaN
						if(onNaN === 'MINIMUM') {
							diff = -1 // treat NaN as smaller
						} else if(onNaN === 'MAXIMUM') {
							diff = 1 // treat NaN as bigger
						} else {
							throw new DetailedError('Invalid onNaN value', {onNaN})
						}
					} else if(isValue2NaN) { // element2 is NaN
						if(onNaN === 'MINIMUM') {
							diff = 1; // treat NaN as smaller
						} else if(onNaN === 'MAXIMUM') {
							diff = -1; // treat NaN as bigger
						} else {
							throw new DetailedError('Invalid onNaN value.', {onNaN})
						}
					} else {
						throw new Error('---')
					}
				} else {
					diff = (value1 - value2)
				}
				
				return sign * diff
			} else if(cb !== undefined) {
				return cb(element1, element2)
			} else {
				throw new DetailedError('Either basedOn or cb must be provided')
			}
		})
	},
	
	assignRank: (arr: any[], on: string, rankKey: string): void => {
		let currValue = Infinity
		let rank: number = 0
		
		for(const row of arr) {
			const tempValue = on.split('.').reduce((tempObj, tempKey) => {
				return tempObj[tempKey]
			}, row)
			if(tempValue < currValue) {
				rank++
			}
			currValue = tempValue
			row[rankKey] = rank
		}
	},
	
	toSingleQuote: (str: string): string => str.replace(/\"/g, '\''),
	
	toForwardSlash: (str: string): string => {
		// Replace '\\' with '/'
		str = str.replace(/\\\\/,'/')
		
		// Replace '\' with '/'
		str = str.replace(/\\/g, '/')
		
		return str
	},
	
	arrayDiff: <T>(array1: T[], array2: T[]): T[] => {
		return array1.filter(element => !array2.includes(element))
	},
	
	arrayUnion: <T>(array1: T[], array2: T[]): T[] => [...new Set([...array1, ...array2])],
	
	arrayRemoveDuplicateItems: <T>(array: T[]): T[] => [...new Set(array)],
	
	keyBy: <T>(arr: T[], key: keyof T): {
		[key: string]: T
	} => {
		let withKey: {
			[key: string]: T
		} = {}
		for(const ele of arr) {
			withKey[ele[String(key)]] = ele
		}
		return withKey
	},
	
	getMomentDateList: (fromDate: Moment, toDate: Moment) => {
		let dateList: Moment[] = []
		
		fromDate = fromDate.clone().startOf('day')
		toDate = toDate.clone().startOf('day')
		
		if(fromDate.isAfter(toDate)) {
			throw new DetailedError('fromDate is greater than toDate', {
				fromDate: fromDate.format(DATE_FORMAT_STR),
				toDate: toDate.format(DATE_FORMAT_STR),
			})
		}
		
		let currDate: Moment = fromDate
		while(currDate.isBefore(toDate) || currDate.isSame(toDate)) {
			dateList.push(currDate)
			currDate = currDate.clone().add(1, 'day')
		}
		
		return dateList
	},
	
	getLuxonDateList: (fromDate: DateTime, toDate: DateTime) => {
		let dateList: DateTime[] = []
		
		fromDate = fromDate.startOf('day')
		toDate = toDate.startOf('day')
		
		if(toDate < fromDate) {
			throw new DetailedError('fromDate is greater than toDate', {
				fromDate: fromDate.toFormat(LUXON_DATETIME_FORMAT_STR),
				toDate: toDate.toFormat(LUXON_DATETIME_FORMAT_STR),
			})
		}
		
		let currDate: DateTime = fromDate
		while(currDate <= toDate) {
			dateList.push(currDate)
			currDate = currDate.plus({days: 1})
		}
		
		return dateList
	},
	
	getCumulativeDaterangeList: ({
		fromDate,
		toDate,
	}: {
		fromDate: Moment
		toDate: Moment
	}) => {
		const dateList = lib.getMomentDateList(fromDate, toDate)
		
		
		const daterangeStart = fromDate
		const daterangeList: Timerange[] = []
		for (let daterangeEnd of dateList) {
			daterangeList.push(new Timerange(daterangeStart.startOf('day'), daterangeEnd.endOf('day')))
		}
		
		return daterangeList
	},
	
	getWeekList: (fromWeek: Week, toWeek: Week) => {
		let weekList: Week[] = []
		
		if(fromWeek.start.isAfter(toWeek.start)) {
			throw new DetailedError('fromWeek is greater than toWeek', {
				fromWeek: fromWeek.label,
				toWeek: toWeek.label,
			})
		}
		
		let currWeek: Week = fromWeek
		while(currWeek.start.isBefore(toWeek.start) || currWeek.start.isSame(toWeek.start)) {
			weekList.push(currWeek)
			currWeek = currWeek.getNextWeek()
		}
		
		return weekList
	},
	
	getMonthList: (fromMonth: Month, toMonth: Month) => {
		let monthList: Month[] = []
		
		if(fromMonth.start.isAfter(toMonth.start)) {
			throw new DetailedError('fromMonth is greater than toMonth', {
				fromMonth: fromMonth.label,
				toMonth: toMonth.label,
			})
		}
		
		let currMonth: Month = fromMonth
		while(currMonth.start.isBefore(toMonth.start) || currMonth.start.isSame(toMonth.start)) {
			monthList.push(currMonth)
			currMonth = currMonth.getNextMonth()
		}
		
		return monthList
	},
	
	sleep: (ms: number) => {
		return new Promise(resolve => setTimeout(resolve, ms))
	},
	
	isValidEmail: (email: string): boolean => {
		if(typeof email !== 'string') {
			return false
		}
		
		const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		const isValidEmail: boolean = emailRegex.test(email)
		
		return isValidEmail
	},
	
	isValidMobileNumber: (mobileNumber: string) => {
		if(typeof mobileNumber !== 'string') {
			return false
		}
		
		const mobileNumberRegex = /^\d{10}$/
		const isValid: boolean = mobileNumberRegex.test(mobileNumber)
		
		return isValid
	},
	
	/**
	 * Is numeric value?
	 * returns true for number or for string with valid number in it
	 */
	isNumeric: (value) => {
		if(typeof value === 'number') {
			return true
		}
		
		if(typeof value === 'string') {
			if(!isNaN(Number(value)) && !isNaN(parseFloat(value))) {
				/**
				 * Number('      ') => 0 // but not valid number
				 * parseFloat('      ') => NaN
				 * 
				 * parseFloat('123abc') => 123 // but not valid number
				 * Number('123abc') => NaN
				 */
				
				return true
			}
		}
		
		return false
	},
	
	toTitleCase: (str: string) => {
		return str.replace(/\w\S*/g, (matchedStr) => `${matchedStr.charAt(0).toUpperCase()}${matchedStr.substr(1).toLowerCase()}`)
	},
	
	sample: <T>(values: T[]): T => {
		if(values.length === 0) {
			throw new DetailedError('not items present in values array', { values: valOrUndefStr(values) })
		}
		return values[Math.floor(Math.random() * values.length)]
	},
	
	isWeekend(date: Moment) {
		return WEEKENDS_LIST.includes(date.format('dddd'))
	},
	
	getPrettyJson(obj) {
		return JSON.stringify(obj, undefined, 4)
	},
	
	/**
	 * receive plain array of object and return object with multiple levels of keys.
	 */
	multipleLevelKeyBy: <T>({
		arr,
		keys,
		keyTransformFunction,
	}: {
		arr: T[]
		keys: Array<keyof T>
		keyTransformFunction?: any[]
	}) => {
		const result: any = {}
		const levels = keys.length
		
		for (const row of arr) {
			let temp: any = result
			for(let i = 0; i <= (levels - 1); i++) {
				
				// fetch key & change format using keyTransformFunction (without transform date looks like 'Fri Nov 20 2020 00:00:00 GMT+0530')
				
				const tempKey: string =  (keyTransformFunction?.[i] !== undefined)
					? keyTransformFunction[i](row[keys[i]])
					: String(row[keys[i]])
				
				if(i < (levels - 1)) {
					if(temp[tempKey] === undefined) {
						temp[tempKey] = {}
					}
					temp = temp[tempKey]
				} else {
					temp[tempKey] = row
				}
			}
		}
		
		return result
	},
	/**
	 * Usage:
	 * 
	 * ex:
			const arr = [
				{
					country: 'Country1',
					state: 'State11',
					date: moment('2020-01-01'),
					value: 1000,
				},
				{
					country: 'Country1',
					state: 'State11',
					date: moment('2020-01-02'),
					value: 1050,
				},
				{
					country: 'Country1',
					state: 'State12',
					date: moment('2020-01-01'),
					value: 900,
				},
				{
					country: 'Country2',
					state: 'State21',
					date: moment('2020-01-01'),
					value: 2000,
				},
			]
			
			const objectWithMultiLevelKey: {
				[country: string]: [
					[date: string]: [
						state: {
							country: string
							state: string
							date: Moment
							value: number
						}
					]
				]
			} = multipleLevelKeyBy({
				arr: arr,
				keys: [ // GIVE KEYS BASED ON REQUIREMENT
					'country',
					'date',
					'state',
				],
				keyTransformFunction: [
					undefined,
					(date: Moment) => date.format('YYYY-MM-DD'),
					undefined
				]
			})
			
			console.log(objectWithMultiLevelKey)
		output:
			{
				"Country1": {
					"2020-01-01": {
						"State11": {
							"country": "Country1",
							"state": "State11",
							"date": "2019-12-31T18:30:00.000Z", // Moment object
							"value": 1000
						},
						"State12": {
							"country": "Country1",
							"state": "State12",
							"date": "2019-12-31T18:30:00.000Z",
							"value": 900
						}
					},
					"2020-01-02": {
						"State11": {
							"country": "Country1",
							"state": "State11",
							"date": "2020-01-01T18:30:00.000Z",
							"value": 1050
						}
					}
				},
				"Country2": {
					"2020-01-01": {
						"State21": {
							"country": "Country2",
							"state": "State21",
							"date": "2019-12-31T18:30:00.000Z",
							"value": 2000
						}
					}
				}
			}
	 */
	
	
	/**
	 * Split into groups
	 * 
	 * This function splits array of items into groups with given group size (if possible, else one set with 'group size' & another set with 'group size + 1')
	 * ex:
	 * 	items: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ]
	 * 	group size: 3
	 * 	output: [ [ 1, 2, 3 ], [ 4, 5, 6 ],  [ 7, 8, 9 ],  [ 10, 11, 12 ],  [ 13, 14, 15, 16 ],  [ 17, 18, 19, 20 ] ]
			// 20 % 3 => 2 does not divided completely
			// so consider, 4(3) + 2(3+1) = 20 // no remainder // here '3+1' is 'group size + 1'
			// that is '4 groups with size 3' and '2 groups with size 4'
	 * 
	 * 
	 */
	splitIntoGroups: ({
		items,
		groupSize,
	}: {
		items: any[]
		groupSize: number
	}) => {
		
		/**
		 * n: number of items
		 * x: group size
		 * a: number of groups with size x
		 * b: number of groups with size 'x+1'
		 * remainder: remainder = n - (ax + b(x+1)) // in the end 'remainder' must be 0
		 */
		const n = items.length
		const x = groupSize
		let a, b, remainder
		
		a = Math.floor(n / x) // number of groups with 'x'
		remainder = n % x
		
		// fulfill remainders from group with one extra item
		a = a - remainder
		b = remainder // number of groups with 'x+1'
		
		if(a < 0) {
			throw new Error('Number of groups is negative')
		}
		
		const result: Array<any[]> = []
		let itemsIndex = 0
		
		// groups with size 'x'
		for(let i = 0; i < a; i++) {
			let subGroup: any[] = []
			for(let j = 0; j < x; j++) {
				subGroup.push(items[itemsIndex++])
			}
			result.push(subGroup)
		}
		
		// groups with size 'x+1'
		for(let i = 0; i < b; i++) {
			let subGroup: any[] = []
			for(let j = 0; j < (x + 1); j++) {
				subGroup.push(items[itemsIndex++])
			}
			result.push(subGroup)
		}
		
		return result
	},
	
	execCommand: async(cmd: string) => {
		const { exec } = await import('child_process')
		return new Promise((resolve, reject) => {
			exec(cmd, (err, stdout, stderr) => {
				if(err) {
					reject(err)
				}
				
				resolve(stdout ? stdout : stderr)
			})
		})
	},
	
	clearConsole: () => {
		process.stdout.write('\u001b[2J\u001b[0;0H')
	},
	
	getTimerangeState: ({
		startTime,
		endTime,
		currentTime = DateTime.now(),
	}: {
		startTime: Moment | DateTime
		endTime: Moment | DateTime
		currentTime?: Moment | DateTime
	}) => {
		
		try {
			
			// ----- convert moment to luxon -----
			if(moment.isMoment(startTime)) {
				if(!startTime.isValid()) { throw new DetailedError('start time is not valid', {startTime}) }
				startTime = DateTime.fromFormat(startTime.format(DATETIME_FORMAT_STR), LUXON_DATETIME_FORMAT_STR)
			}
			if(moment.isMoment(endTime)) {
				if(!endTime.isValid()) throw new DetailedError('end time is not valid', {endTime})
				endTime = DateTime.fromFormat(endTime.format(DATETIME_FORMAT_STR), LUXON_DATETIME_FORMAT_STR)
			}
			if(moment.isMoment(currentTime)) {
				if(!currentTime.isValid()) throw new DetailedError('current time is not valid', {currentTime})
				currentTime = DateTime.fromFormat(currentTime.format(DATETIME_FORMAT_STR), LUXON_DATETIME_FORMAT_STR)
			}
			// ----- convert moment to luxon -----
			
			if(!startTime.isValid) { throw new DetailedError('start time is not valid', {startTime}) }
			if(!endTime.isValid) { throw new DetailedError('end time is not valid', {endTime}) }
			if(!currentTime.isValid) { throw new DetailedError('current time is not valid', {currentTime}) }
			
			if(startTime > endTime) { throw new DetailedError('start time must be less than end time') }
			
			if(currentTime < startTime) {
				return 'UPCOMING'
			} else if(startTime <= currentTime && currentTime <= endTime) {
				return 'ONGOING'
			} else if(endTime < currentTime) {
				return 'FINISHED'
			} else {
				throw new Error('Not reachable') // will never reach here
			}
			
		} catch (err) {
			
			throw new DetailedError(
				`Failed to find state`,
				{
					startTime: valOrUndefStr(startTime),
					endTime: valOrUndefStr(endTime),
					currentTime: valOrUndefStr(currentTime),
				},
				err,
				err.errorMessageForUser
			)
			
		}
	},
	
	
	
}

export const objValues = <T>(obj: {[key: string]: T}): T[] => Object.values(obj)

export const objKeys = <T>(obj: {[key: string]: T}): string[] => Object.keys(obj)

export const objKeysAsNumbers = <T>(obj: {[key: string]: T}): number[] => Object.keys(obj).map(Number)

export const objEntries = <T>(obj: {[key: string]: T}): [string, T][] => Object.entries(obj)

export const objEntriesKeysAsNumbers = <T>(obj: {[key: string]: T}): [number, T][] => Object.entries(obj).map(item => [Number(item[0]), item[1]])

export const objFilterByKeys = <T>(obj: T, keys: Array<keyof T>) => Object.fromEntries(keys.map(key => [ key, obj[key] ]) )

export const objFilter = <T>(obj: { [k: string]: T }, cb: (item: T) => boolean) => Object.fromEntries(Object.entries(obj).filter(([, item]) => cb(item)))

export const objFromArr = <T>(arr: T[], key: keyof T): { [k: string]: T } => Object.fromEntries(arr.map(row => [ row[key], row ]))

export const  getPromisedPipeline = () => promisify(pipeline)

export const getStringFromStream = async ({
	dataStream,
	encoding = 'utf-8'
}: {
	dataStream: Readable
	encoding?: BufferEncoding
}) => {
	const chunks: Array<Buffer> = [];
	
	for await (let chunk of dataStream) {
		chunks.push(chunk)
	}
	
	const buffer  = Buffer.concat(chunks);
	const str = buffer.toString(encoding)
	
	return str
}

export const saveStreamToFile = async({
	dataStream,
	pathFromStorage,
}: {
	dataStream: Readable
	pathFromStorage: string
}) => {
	const storage = Storage.getStorage()
	const destination = storage.getWriteStream(pathFromStorage)
	const promisedPipeline = getPromisedPipeline()
	
	await promisedPipeline(dataStream, destination)
}

export const getUuid = () => uuidV4()

export const valOrUndefStr = (value: any) => (value !== undefined) ? value : UNDEFINED_STR

export const getTypeName = (value: any) => value.constructor.name

export const range = ({
	size,
	startAt = 0,
}: {
	size: number
	startAt?: number
}) => [...Array(size).keys()].map(i => i + startAt)
	
export const fractionalPart = (n: number) => Number(`0.${String(n).split('.')[1] ?? 0}`)

// Remove trailing slash(\\ or /)) if exists
export const removeTrailingSlash = (str: string) => str.replace(/[\\/]+$/, '')


export const cleanFilePath = (filePath: string): string => {
	// convert all slashes to forward slash
	filePath = lib.toForwardSlash(filePath)
	
	// remove trailing slashes
	filePath = removeTrailingSlash(filePath)
	
	return filePath
}

export const inKB = ({
	bits,
	fractionalPartDigits = 3,
}: {
	bits: number
	fractionalPartDigits?: number
}): number => {
	return lib.round(bits / 8 / 1024, fractionalPartDigits)
}

export const inMB = ({
	bits,
	fractionalPartDigits = 3,
}: {
	bits: number
	fractionalPartDigits?: number
}) => {
	return lib.round(bits / 8 / 1024 / 1024, fractionalPartDigits)
}

export const getMemoryUsage = ({
	units = 'KB',
	fractionalPartDigits = 0,
}: {
	units?: 'KB' | 'MB'
	fractionalPartDigits?: number
} = {}) => {
	const memory = memoryUsage()
	let unitsFn: (args) => void
	switch(units) {
		case 'KB': unitsFn = inKB; break
		case 'MB': unitsFn = inMB; break
		default: throw new Error('Invalid units')
	}
	
	return {
		rss: unitsFn({ bits: memory.rss, fractionalPartDigits }),
		heapTotal: unitsFn({ bits: memory.heapTotal, fractionalPartDigits }),
		heapUsed: unitsFn({ bits: memory.heapUsed, fractionalPartDigits }),
		external: unitsFn({ bits: memory.external, fractionalPartDigits }),
		arrayBuffers: unitsFn({ bits: memory.arrayBuffers, fractionalPartDigits }),
		options: {
			units,
			fractionalPartDigits,
		}
	}
}

// read user input from terminal / console / cli / command line
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
export const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

export default lib

