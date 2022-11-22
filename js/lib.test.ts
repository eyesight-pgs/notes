import { DATETIME_FORMAT_STR, DATE_FORMAT_STR, LUXON_DATETIME_FORMAT_STR, LUXON_DATE_FORMAT_STR, UNDEFINED_STR } from './constants'
import lib, { cleanFilePath, fractionalPart, getStringFromStream, objEntries, objEntriesKeysAsNumbers, objFilterByKeys, objFromArr, objKeys, objKeysAsNumbers, objValues, range, removeTrailingSlash, valOrUndefStr } from './lib'
import Month from './Month'
import { DataTypeStr } from './types'
import Week from './Week'
import test from 'japa'
import { DateTime } from 'luxon'
import moment, { Moment } from 'moment'
import { Readable } from 'stream'


test.group('lib', () => {
	
	test('round', (assert) => {
		let roundingMethod: 'TOWARDS_POSITIVE_INFINITY' | 'AWAY_FROM_ZERO'
		
		// basic rounding
		assert.deepEqual(lib.round(1.33), 1.33)
		assert.deepEqual(lib.round(1.33333), 1.33)
		assert.deepEqual(lib.round(1.337), 1.34)
		
		// round towards positive infinity
		roundingMethod = 'TOWARDS_POSITIVE_INFINITY'
		assert.deepEqual(lib.round(1.33, 2, { roundingMethod }), 1.33)
		assert.deepEqual(lib.round(2.33, undefined, { roundingMethod }), 2.33)
		assert.deepEqual(lib.round(3.337, undefined, { roundingMethod }), 3.34)
		assert.deepEqual(lib.round(4.335, undefined, { roundingMethod }), 4.34)
		assert.deepEqual(lib.round(5.3335, 3, { roundingMethod }), 5.334)
		
		assert.deepEqual(lib.round(-1.33, 2, { roundingMethod }), -1.33)
		assert.deepEqual(lib.round(-2.33, undefined, { roundingMethod }), -2.33)
		assert.deepEqual(lib.round(-3.337, undefined, { roundingMethod }), -3.34)
		assert.deepEqual(lib.round(-4.335, undefined, { roundingMethod }), -4.33)
		assert.deepEqual(lib.round(-5.3335, 3, { roundingMethod }), -5.333)
		
		// round away from 0
		roundingMethod = 'AWAY_FROM_ZERO'
		assert.deepEqual(lib.round(1.33, 2, { roundingMethod }), 1.33)
		assert.deepEqual(lib.round(2.33, undefined, { roundingMethod }), 2.33)
		assert.deepEqual(lib.round(3.337, undefined, { roundingMethod }), 3.34)
		assert.deepEqual(lib.round(4.335, undefined, { roundingMethod }), 4.34)
		assert.deepEqual(lib.round(5.3335, 3, { roundingMethod }), 5.334)
		
		assert.deepEqual(lib.round(-1.33, 2, { roundingMethod }), -1.33)
		assert.deepEqual(lib.round(-2.33, undefined, { roundingMethod }), -2.33)
		assert.deepEqual(lib.round(-3.337, undefined, { roundingMethod }), -3.34)
		assert.deepEqual(lib.round(-4.335, undefined, { roundingMethod }), -4.34)
		assert.deepEqual(lib.round(-5.3335, 3, { roundingMethod }), -5.334)
		
		assert.deepEqual(lib.round(1.0005, 3, { roundingMethod }), 1.001)
		assert.deepEqual(lib.round(-1.0005, 3, { roundingMethod }), -1.001)
		assert.deepEqual(lib.round(0.0005, 3, { roundingMethod }), 0.001)
		assert.deepEqual(lib.round(-0.0005, 3, { roundingMethod }), -0.001)
		assert.deepEqual(lib.round(0.005, undefined, { roundingMethod }), 0.01)
		assert.deepEqual(lib.round(-0.005, undefined, { roundingMethod }), -0.01)
	})
	
	test('div', (assert) => {
		assert.deepEqual(lib.div(4, 2), 2)
		assert.deepEqual(lib.div(-100, 4), -25)
		assert.deepEqual(lib.div(0.25, 0.05), 5)
		assert.deepEqual(lib.div(-0.999, -0.003), 333)
		
		/**
		 * js floating points problem
		 * 0.6/0.2 = 2.9999999999999996
		 * default division result is not correct
		 */
		assert.deepEqual(lib.div(0.6, 0.2), 3) // lib.div must return correct value
		
		// value when div by 0
		assert.deepEqual(lib.div(30, 0), Infinity)
		assert.deepEqual(lib.div(-30, 0), -Infinity)
		assert.deepEqual(lib.div(30, 0, { valueWhenDivByZero: 0 }), 0)
		assert.deepEqual(lib.div(-30, 0, { valueWhenDivByZero: 0 }), 0)
		assert.deepEqual(lib.div(30, 0, { valueWhenDivByZero: -4444.5555, fractionalPartDigits: 2 }), -4444.56)
		assert.deepEqual(lib.div(30, 10, { valueWhenDivByZero: 0 }), 3)
	})
	
	test('percent', assert => {
		assert.deepEqual(lib.percent(1, 100), 1)
		assert.deepEqual(lib.percent(566, 1220), 46.39)
		
		// factional part digits
		// (566 / 1220) * 100 = 46.39344262295
		assert.deepEqual(lib.percent(566, 1220, { fractionalPartDigits: 3 }), 46.393)
		assert.deepEqual(lib.percent(566, 1220, { fractionalPartDigits: 4 }), 46.3934)
		assert.deepEqual(lib.percent(566, 1220, { fractionalPartDigits: 7 }), 46.3934426)
		
		// limit max to 100
		assert.deepEqual(lib.percent(30, 10), 300)
		assert.deepEqual(lib.percent(30, 10, { limitMaxToHundred: false }), 300)
		assert.deepEqual(lib.percent(30, 10, { limitMaxToHundred: true }), 100)
		
		// value when div by 0
		assert.deepEqual(lib.percent(30, 0), Infinity)
		assert.deepEqual(lib.percent(-30, 0), -Infinity)
		assert.deepEqual(lib.percent(30, 0, { valueWhenDivByZero: 0 }), 0)
		assert.deepEqual(lib.percent(-30, 0, { valueWhenDivByZero: 0 }), 0)
		assert.deepEqual(lib.percent(30, 0, { valueWhenDivByZero: -4444.5555 }), -4444.56) // by default round away from 0
		assert.deepEqual(lib.percent(30, 0, { valueWhenDivByZero: -4444.5555, fractionalPartDigits: 3 }), -4444.556)
		assert.deepEqual(lib.percent(30, 10, { valueWhenDivByZero: 0 }), 300)
	})
	
	test('diffPercent', assert => {
		assert.deepEqual(lib.diffPercent(100, 100), 0)
		assert.deepEqual(lib.diffPercent(150, 100), 50)
		assert.deepEqual(lib.diffPercent(50, 100), -50)
		
		// with/without sign
		assert.deepEqual(lib.diffPercent(50, 100, { withSign: true }), -50)
		assert.deepEqual(lib.diffPercent(50, 100, { withSign: false }), 50)
		
		// fractional part digits
		assert.deepEqual(lib.diffPercent(89.9999, 100, { fractionalPartDigits: 2 }), -10)
		assert.deepEqual(lib.diffPercent(89.9999, 100, { fractionalPartDigits: 3 }), -10)
		assert.deepEqual(lib.diffPercent(89.9999, 100, { fractionalPartDigits: 4 }), -10.0001)
		
		// limit max to 100/-100
		// +ve
		assert.deepEqual(lib.diffPercent(250, 100, { limitMaxToHundred: false }), 150)
		assert.deepEqual(lib.diffPercent(250, 100, { limitMaxToHundred: true }), 100)
		// -ve
		assert.deepEqual(lib.diffPercent(-50, 100, { limitMaxToHundred: false }), -150)
		assert.deepEqual(lib.diffPercent(-50, 100, { limitMaxToHundred: true }), -100)
		
		// value when divided by 0
		assert.deepEqual(lib.diffPercent(250, 0, { valueWhenDivByZero: undefined }), Infinity)
		assert.deepEqual(lib.diffPercent(250, 0, { valueWhenDivByZero: 0 }), 0)
	})
	
	test('errorPercent', assert => {
		assert.deepEqual(lib.errorPercent(100, 100), 0)
		assert.deepEqual(lib.errorPercent(150, 100), 50)
		assert.deepEqual(lib.errorPercent(50, 100), 50)
		
		// value when divided by 0
		assert.deepEqual(lib.diffPercent(250, 0, { valueWhenDivByZero: undefined }), Infinity)
		assert.deepEqual(lib.diffPercent(250, 0, { valueWhenDivByZero: 0 }), 0)
		
		// max value
		assert.deepEqual(lib.errorPercent(250, 100, { maxValue: undefined }), 150)
		assert.deepEqual(lib.errorPercent(250, 100, { maxValue: 100 }), 100)
		assert.deepEqual(lib.errorPercent(250, 100, { maxValue: 200 }), 150)
	})
	
	test('inCroresOrLakhs', assert => {
		assert.deepEqual(lib.inCroresOrLakhs(100), '100')
		assert.deepEqual(lib.inCroresOrLakhs(99999), '99999')
		assert.deepEqual(lib.inCroresOrLakhs(99999.99), '99999.99')
		assert.deepEqual(lib.inCroresOrLakhs(99999.999), '1L')
		assert.deepEqual(lib.inCroresOrLakhs(100000), '1L')
		assert.deepEqual(lib.inCroresOrLakhs(125000), '1.25L')
		assert.deepEqual(lib.inCroresOrLakhs(125900), '1.26L')
		assert.deepEqual(lib.inCroresOrLakhs(9999999), '1Cr')
		assert.deepEqual(lib.inCroresOrLakhs(15025000), '1.5Cr')
		assert.deepEqual(lib.inCroresOrLakhs(15093000), '1.51Cr')
		assert.deepEqual(lib.inCroresOrLakhs(123456_20_10_000), '123456.2Cr')
		
		// negative
		assert.deepEqual(lib.inCroresOrLakhs(-100), '-100')
		assert.deepEqual(lib.inCroresOrLakhs(-99999), '-99999')
		assert.deepEqual(lib.inCroresOrLakhs(-99999.99), '-99999.99')
		assert.deepEqual(lib.inCroresOrLakhs(-99999.999), '-1L')
		assert.deepEqual(lib.inCroresOrLakhs(-100000), '-1L')
		assert.deepEqual(lib.inCroresOrLakhs(-125000), '-1.25L')
		assert.deepEqual(lib.inCroresOrLakhs(-125900), '-1.26L')
		assert.deepEqual(lib.inCroresOrLakhs(-9999999), '-1Cr')
		assert.deepEqual(lib.inCroresOrLakhs(-15025000), '-1.5Cr')
		assert.deepEqual(lib.inCroresOrLakhs(-15093000), '-1.51Cr')
		assert.deepEqual(lib.inCroresOrLakhs(-123456_20_10_000), '-123456.2Cr')
	})
	
	test('amountFormatLakhs', assert => {
		assert.deepEqual(lib.amountFormatLakhs(100), 0)
		assert.deepEqual(lib.amountFormatLakhs(1000), 0.01)
		assert.deepEqual(lib.amountFormatLakhs(10000), 0.1)
		assert.deepEqual(lib.amountFormatLakhs(99000), 0.99)
		assert.deepEqual(lib.amountFormatLakhs(99499.99999), 0.99)
		assert.deepEqual(lib.amountFormatLakhs(99500), 1)
		assert.deepEqual(lib.amountFormatLakhs(99999.99), 1)
		assert.deepEqual(lib.amountFormatLakhs(100000), 1)
		assert.deepEqual(lib.amountFormatLakhs(1_23_45_000), 123.45)
		
		// negative
		assert.deepEqual(lib.amountFormatLakhs(-100), -0)
		assert.deepEqual(lib.amountFormatLakhs(-1000), -0.01)
		assert.deepEqual(lib.amountFormatLakhs(-10000), -0.1)
		assert.deepEqual(lib.amountFormatLakhs(-99000), -0.99)
		assert.deepEqual(lib.amountFormatLakhs(-99499.99999), -0.99)
		assert.deepEqual(lib.amountFormatLakhs(-99500), -1)
		assert.deepEqual(lib.amountFormatLakhs(-99999.99), -1)
		assert.deepEqual(lib.amountFormatLakhs(-100000), -1)
		assert.deepEqual(lib.amountFormatLakhs(-1_23_45_000), -123.45)
		
	})
	
	test('getReadableValue', assert => {
		assert.deepEqual(lib.getReadableValue(0), 0)
		assert.deepEqual(lib.getReadableValue(100), 100)
		assert.deepEqual(lib.getReadableValue(NaN), 'NA')
		assert.deepEqual(lib.getReadableValue(NaN, { ifNaN: 'invalid number' }), 'invalid number')
		assert.deepEqual(lib.getReadableValue(Infinity), 'NA')
		assert.deepEqual(lib.getReadableValue(Infinity, { ifInf: 'large number' }), 'large number')
		
		// negative
		assert.deepEqual(lib.getReadableValue(-0), -0)
		assert.deepEqual(lib.getReadableValue(-100), -100)
		assert.deepEqual(lib.getReadableValue(-NaN), 'NA')
		assert.deepEqual(lib.getReadableValue(-NaN, { ifNaN: 'invalid number' }), 'invalid number')
		assert.deepEqual(lib.getReadableValue(-Infinity), 'NA')
		assert.deepEqual(lib.getReadableValue(-Infinity, { ifInf: 'large number' }), 'large number')
	})
	
	test('toBoolean', assert => {
		assert.deepEqual(lib.toBoolean(false), false)
		assert.deepEqual(lib.toBoolean(true), true)
		assert.deepEqual(lib.toBoolean(0), false)
		assert.deepEqual(lib.toBoolean(1), true)
		assert.deepEqual(lib.toBoolean('0'), false)
		assert.deepEqual(lib.toBoolean('1'), true)
		
		assert.throw(() => { lib.toBoolean(2) })
		assert.throw(() => { lib.toBoolean(-1) })
		assert.throw(() => { lib.toBoolean('') })
		assert.throw(() => { lib.toBoolean('   ') })
		assert.throw(() => { lib.toBoolean(' 0 ') })
		// @ts-ignore
		assert.throw(() => { lib.toBoolean(undefined) })
		// @ts-ignore
		assert.throw(() => { lib.toBoolean(null) })
	})
	
	test('stringToBoolean', assert => {
		let testValues: [string, boolean][] = [
			['0', false],
			['1', true],
			['true', true],
			['false', false],
			['TRUE', true],
			['FALSE', false],
		]
		for (const [value, result] of testValues) {
			assert.deepEqual(lib.stringToBoolean(value), result)
		}
		
		// @ts-ignore
		assert.throw(() => { lib.stringToBoolean(0) })
		// @ts-ignore
		assert.throw(() => { lib.stringToBoolean(1) })
		// @ts-ignore
		assert.throw(() => { lib.stringToBoolean(true) })
		// @ts-ignore
		assert.throw(() => { lib.stringToBoolean(false) })
		assert.throw(() => { lib.stringToBoolean('some random string') })
		assert.throw(() => { lib.stringToBoolean(' 0 ') })
		assert.throw(() => { lib.stringToBoolean(' 1 ') })
	})
	
	test('numberToBoolean', assert => {
		assert.deepEqual(lib.numberToBoolean(0), false)
		assert.deepEqual(lib.numberToBoolean(1), true)
		
		// @ts-ignore
		assert.throw(() => { lib.numberToBoolean(false) })
		// @ts-ignore
		assert.throw(() => { lib.numberToBoolean(true) })
		// @ts-ignore
		assert.throw(() => { lib.numberToBoolean('0') })
		// @ts-ignore
		assert.throw(() => { lib.numberToBoolean('1') })
		assert.throw(() => { lib.numberToBoolean(123) })
		assert.throw(() => { lib.numberToBoolean(Infinity) })
		assert.throw(() => { lib.numberToBoolean(-Infinity) })
		assert.throw(() => { lib.numberToBoolean(NaN) })
		// @ts-ignore
		assert.throw(() => { lib.numberToBoolean(undefined) })
		// @ts-ignore
		assert.throw(() => { lib.numberToBoolean(null) })
	})
	
	test('getRandomInt', assert => {
		const testValues = [
			[20, 30],
			[-30, -20],
			[-30, 30],
		]
		for (const [min, max] of testValues) {
			const randomInt = lib.getRandomInt(min, max)
			assert.deepEqual(typeof randomInt, 'number')
			assert.deepEqual(randomInt !== NaN, true)
			assert.deepEqual(min <= randomInt, true)
			assert.deepEqual(randomInt <= max, true)
		}
		
		const failingTestValues = [
			[30, 20],
			[Infinity, 30],
			[20, Infinity],
			[-Infinity, 30],
			[20, -Infinity],
			[-Infinity, Infinity],
			[NaN, 30],
			[20, NaN],
		]
		for (const [min, max] of failingTestValues) {
			assert.throw(() => { lib.getRandomInt(min, max) })
		}
	})
	
	test('castType', assert => {
		const testValues: Array<[any, DataTypeStr, any]> = [
			// [value, toType, result],
			[undefined, 'number', undefined],
			[null, 'number', null],
			[false, 'boolean', false],
			[true, 'boolean', true],
			[0, 'boolean', false],
			[1, 'boolean', true],
			['0', 'boolean', false],
			['1', 'boolean', true],
			['true', 'boolean', true],
			['false', 'boolean', false],
			['TRUE', 'boolean', true],
			['FALSE', 'boolean', false],
			['some string', 'string', 'some string'],
			[123, 'string', '123'],
			[true, 'string', 'true'],
			[false, 'string', 'false'],
			[111, 'number', 111],
			['222', 'number', 222],
			[' 333 ', 'number', 333],
			[[111, '222'], 'number[]', [111, 222]],
		]
		for (const [value, toType, result] of testValues) {
			assert.deepEqual(lib.castType(value, toType), result)
		}
		
		const failingTestValues: [any, DataTypeStr][] = [
			// [value, toType],
			['some random string', 'boolean'],
			[' 0 ', 'boolean'],
			[' 1 ', 'boolean'],
			['some random string', 'number'],
			[false, 'number'],
			[true, 'number'],
			[['some random string', 111, 222], 'number[]'],
		]
		for (const [value, toType] of failingTestValues) {
			assert.throw(() => { lib.castType(value, toType) })
		}
	})
	
	test('sortArray', assert => {
		const testValues = [
			{
				arr: [
					{id: 1, value: 50},
					{id: 2, value: 60},
					{id: 3, value: 40},
				],
				basedOn: 'value',
				sortOrder: undefined,
				cb: undefined,
				expected: [
					{id: 3, value: 40},
					{id: 1, value: 50},
					{id: 2, value: 60},
				]
			},
			{
				arr: [
					{id: 1, value: 50},
					{id: 2, value: 60},
					{id: 3, value: 40},
				],
				basedOn: 'value',
				sortOrder: 'desc',
				cb: undefined,
				expected: [
					{id: 2, value: 60},
					{id: 1, value: 50},
					{id: 3, value: 40},
				]
			},
			{
				arr: [
					{id: 1, value: 50},
					{id: 2, value: 60},
					{id: 3, value: 40},
				],
				basedOn: undefined,
				sortOrder: undefined,
				cb: (element1, element2) => {
					return element1.value - element2.value
				},
				expected: [
					{id: 3, value: 40},
					{id: 1, value: 50},
					{id: 2, value: 60},
				]
			},
		]
		for (const {arr, basedOn, sortOrder, cb, expected} of testValues) {
			// @ts-ignore
			lib.sortArray(arr, basedOn, sortOrder, cb)
			assert.deepEqual(arr, expected)
		}
		
		const failingTestValues = [
			// either basedOn or cb must be provided
			{
				arr: [
					{id: 1, value: 50},
					{id: 2, value: 60},
					{id: 3, value: 40},
				],
			},
		]
		for (const {arr} of failingTestValues) {
			assert.throw(() => { lib.sortArray(arr) })
		}
		
	})
	
	test('assignRank', assert => {
		// reverse sorted array must be provided for this function
		const arr = [
			{id: 2, value: 60},
			{id: 1, value: 50},
			{id: 4, value: 50},
			{id: 3, value: 40},
		]
		const on = 'value'
		const rankKey = 'rank'
		const expected = [
			{id: 2, value: 60, rank: 1},
			{id: 1, value: 50, rank: 2},
			{id: 4, value: 50, rank: 2},
			{id: 3, value: 40, rank: 3},
		]
		
		lib.assignRank(arr, on, rankKey)
		assert.deepEqual(arr, expected)
	})
	
	test('toSingleQuote', assert => {
		assert.deepEqual(lib.toSingleQuote('"test" string'), '\'test\' string')
		assert.deepEqual(lib.toSingleQuote('\"test\" string'), '\'test\' string')
		assert.deepEqual(lib.toSingleQuote("\"test\" string"), '\'test\' string')
		assert.deepEqual(lib.toSingleQuote(`"test" string`), '\'test\' string')
		assert.deepEqual(lib.toSingleQuote(`test string`), 'test string')
	})
	
	test('toForwardSlash', assert => {
		assert.deepEqual(lib.toForwardSlash('c:\\path\\to\\file'), 'c:/path/to/file')
		assert.deepEqual(lib.toForwardSlash(`c:\\path\\to\\file`), 'c:/path/to/file')
		assert.deepEqual(lib.toForwardSlash('some\\\\string'), 'some/string')
	})
	
	test('arrayDiff', assert => {
		assert.deepEqual(lib.arrayDiff([1, 2, 3], [2, 3, 4]), [1])
		assert.deepEqual(lib.arrayDiff([1, 2, 3], [1, 2, 3, 4]), [])
		assert.deepEqual(lib.arrayDiff([1, 2, 3], [4]), [1, 2, 3])
	})
	
	test('arrayUnion', assert => {
		assert.deepEqual(lib.arrayUnion([], []), [])
		assert.deepEqual(lib.arrayUnion([1, 2, 3], [3, 4, 5]), [1, 2, 3, 4, 5])
	})
	
	test('arrayRemoveDuplicateItems', assert => {
		assert.deepEqual(lib.arrayRemoveDuplicateItems([]), [])
		assert.deepEqual(lib.arrayRemoveDuplicateItems([1, 3, 5, 1, 3]), [1, 3, 5])
	})
	
	test('keyBy', assert => {
		const arr = [
			{ id: 1, value: 100 },
			{ id: 2, value: 200 },
		]
		const expected = {
			1: { id: 1, value: 100 },
			2: { id: 2, value: 200 },
		}
		assert.deepEqual(lib.keyBy(arr, 'id'), expected)
	})
	
	test('getMomentDateList', assert => {
		let from: Moment
		let to: Moment
		
		from = moment('2000-02-27 10:00:00', DATETIME_FORMAT_STR)
		to = moment('2000-03-02 07:00:00', DATETIME_FORMAT_STR)
		const dateList = lib.getMomentDateList(from, to)
		const dateListStr: string[] = []
		for (const date of dateList) {
			dateListStr.push(date.format(DATETIME_FORMAT_STR))
		}
		const expected = [
			'2000-02-27 00:00:00',
			'2000-02-28 00:00:00',
			'2000-02-29 00:00:00',
			'2000-03-01 00:00:00',
			'2000-03-02 00:00:00',
		]
		assert.deepEqual(dateListStr, expected)
		
		from = moment('2000-01-02 00:00:00', DATETIME_FORMAT_STR)
		to = moment('2000-01-01 00:00:00', DATETIME_FORMAT_STR)
		assert.throw(() => { lib.getMomentDateList(from, to) })
	})
	
	test('getLuxonDateList', assert => {
		let from: DateTime
		let to: DateTime
		
		from = DateTime.fromFormat('2000-02-27 10:00:00', LUXON_DATETIME_FORMAT_STR)
		to = DateTime.fromFormat('2000-03-02 07:00:00', LUXON_DATETIME_FORMAT_STR)
		const dateList = lib.getLuxonDateList(from, to)
		const dateListStr: string[] = []
		for (const date of dateList) {
			dateListStr.push(date.toFormat(LUXON_DATETIME_FORMAT_STR))
		}
		const expected = [
			'2000-02-27 00:00:00',
			'2000-02-28 00:00:00',
			'2000-02-29 00:00:00',
			'2000-03-01 00:00:00',
			'2000-03-02 00:00:00',
		]
		assert.deepEqual(dateListStr, expected)
		
		from = DateTime.fromFormat('2000-01-02 00:00:00', LUXON_DATETIME_FORMAT_STR)
		to = DateTime.fromFormat('2000-01-01 00:00:00', LUXON_DATETIME_FORMAT_STR)
		assert.throw(() => { lib.getLuxonDateList(from, to) })
	})
	
	test('getCumulativeDaterangeList', assert => {
		const fromDate = moment('2000-02-27 10:00:00', DATETIME_FORMAT_STR)
		const toDate = moment('2000-03-02 07:00:00', DATETIME_FORMAT_STR)
		const cumulativeDaterangeList = lib.getCumulativeDaterangeList({fromDate, toDate})
		const labels: string[] = cumulativeDaterangeList.map(timerange => timerange.label)
		const expected = [
			'2000-02-27 00:00:00 - 2000-02-27 23:59:59',
			'2000-02-27 00:00:00 - 2000-02-28 23:59:59',
			'2000-02-27 00:00:00 - 2000-02-29 23:59:59',
			'2000-02-27 00:00:00 - 2000-03-01 23:59:59',
			'2000-02-27 00:00:00 - 2000-03-02 23:59:59',
		]
		assert.deepEqual(labels, expected)
	})
	
	test('getWeekList', assert => {
		const fromWeek = new Week(moment('2021-07-01 10:00:0', DATETIME_FORMAT_STR))
		const toWeek = new Week(moment('2021-08-01 07:00:0', DATETIME_FORMAT_STR))
		const weekList = lib.getWeekList(fromWeek, toWeek)
		const labels = weekList.map(week => week.label)
		const expected = [
			'2021-06-28 - 2021-07-04',
			'2021-07-05 - 2021-07-11',
			'2021-07-12 - 2021-07-18',
			'2021-07-19 - 2021-07-25',
			'2021-07-26 - 2021-08-01',
		]
		assert.deepEqual(labels, expected)
	})
	
	test('getMonthList', assert => {
		const monthList = lib.getMonthList(
			new Month(moment('2020-12-20 10:00:00', DATETIME_FORMAT_STR)),
			new Month(moment('2021-02-20 11:00:00', DATETIME_FORMAT_STR)),
		)
		const labels = monthList.map(month => month.label)
		const expected = [
			'2020_12',
			'2021_01',
			'2021_02',
		]
		assert.deepEqual(labels, expected)
	})
	
	test('isNumeric', assert => {
		assert.deepEqual(lib.isNumeric(100), true)
		assert.deepEqual(lib.isNumeric('100'), true)
		assert.deepEqual(lib.isNumeric('100.22'), true)
		assert.deepEqual(lib.isNumeric(' 100 '), true)
		assert.deepEqual(lib.isNumeric(' 100.22 '), true)
		assert.deepEqual(lib.isNumeric('100.22aaa'), false)
		assert.deepEqual(lib.isNumeric(true), false)
		assert.deepEqual(lib.isNumeric(false), false)
		assert.deepEqual(lib.isNumeric(100n), false)
	})
	
	test('toTitleCase', assert => {
		assert.deepEqual(lib.toTitleCase('aaa bbb ccc'), 'Aaa Bbb Ccc')
		assert.deepEqual(lib.toTitleCase('aaa bbb_ccc'), 'Aaa Bbb_ccc')
		assert.deepEqual(lib.toTitleCase('AAA Bbb ccc'), 'Aaa Bbb Ccc')
	})
	
	test('sample', assert => {
		assert.deepEqual([1,2,3,4].includes(lib.sample([1,2,3,4])), true)
		assert.deepEqual(lib.sample([1]), 1)
		assert.throw(() => { lib.sample([]) })
	})
	
	test('isWeekend', assert => {
		assert.deepEqual(lib.isWeekend(moment('2021-01-01 10:00:00', DATETIME_FORMAT_STR)), false) // Friday
		assert.deepEqual(lib.isWeekend(moment('2021-01-02 10:00:00', DATETIME_FORMAT_STR)), true) // Saturday
		assert.deepEqual(lib.isWeekend(moment('2021-01-03 10:00:00', DATETIME_FORMAT_STR)), true) // Sunday
		assert.deepEqual(lib.isWeekend(moment('2021-01-04 10:00:00', DATETIME_FORMAT_STR)), false) // Monday
		
		assert.deepEqual(lib.isWeekend(moment('2021-01-01', DATE_FORMAT_STR)), false) // Friday
		assert.deepEqual(lib.isWeekend(moment('2021-01-02', DATE_FORMAT_STR)), true) // Saturday
		assert.deepEqual(lib.isWeekend(moment('2021-01-03', DATE_FORMAT_STR)), true) // Sunday
		assert.deepEqual(lib.isWeekend(moment('2021-01-04', DATE_FORMAT_STR)), false) // Monday
	})
	
	test('multipleLevelKeyBy', assert => {
		
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
			[country: string]: {
				[date: string]: {
					[state: string]: {
						country: string
						state: string
						date: Moment
						value: number
					}
				}
			}
		} = lib.multipleLevelKeyBy({
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
		assert.deepEqual(objectWithMultiLevelKey['Country1']['2020-01-01']['State11'].value, 1000)
		assert.deepEqual(objectWithMultiLevelKey['Country1']['2020-01-01']['State12'].value, 900)
		assert.deepEqual(objectWithMultiLevelKey['Country2']['2020-01-01']['State21'].value, 2000)
	})
	
	test('getTimerangeState', assert => {
		const testArr = [
			{
				startTime: DateTime.fromFormat('2021-01-01', LUXON_DATE_FORMAT_STR),
				endTime: DateTime.fromFormat('2021-02-01', LUXON_DATE_FORMAT_STR),
				currentTime: DateTime.fromFormat('2020-12-01', LUXON_DATE_FORMAT_STR),
				expected: 'UPCOMING',
			},
			{
				startTime: DateTime.fromFormat('2021-01-01', LUXON_DATE_FORMAT_STR),
				endTime: DateTime.fromFormat('2021-02-01', LUXON_DATE_FORMAT_STR),
				currentTime: DateTime.fromFormat('2021-01-01', LUXON_DATE_FORMAT_STR),
				expected: 'ONGOING',
			},
			{
				startTime: DateTime.fromFormat('2021-01-01', LUXON_DATE_FORMAT_STR),
				endTime: DateTime.fromFormat('2021-02-01', LUXON_DATE_FORMAT_STR),
				currentTime: DateTime.fromFormat('2021-01-15', LUXON_DATE_FORMAT_STR),
				expected: 'ONGOING',
			},
			{
				startTime: DateTime.fromFormat('2021-01-01', LUXON_DATE_FORMAT_STR),
				endTime: DateTime.fromFormat('2021-02-01', LUXON_DATE_FORMAT_STR),
				currentTime: DateTime.fromFormat('2021-02-01', LUXON_DATE_FORMAT_STR),
				expected: 'ONGOING',
			},
			{
				startTime: DateTime.fromFormat('2021-01-01', LUXON_DATE_FORMAT_STR),
				endTime: DateTime.fromFormat('2021-02-01', LUXON_DATE_FORMAT_STR),
				currentTime: DateTime.fromFormat('2021-03-01', LUXON_DATE_FORMAT_STR),
				expected: 'FINISHED',
			},
		]
		for (const { startTime, endTime, currentTime, expected } of testArr) {
			const res = lib.getTimerangeState({
				startTime,
				endTime,
				currentTime,
			})
			assert.deepEqual(res, expected)
		}
	})
	
	test('objValues', assert => {
		assert.deepEqual(objValues({}), [])
		assert.deepEqual(objValues({ 1: { id: 1 }, 2: { id: 2 } }), [ { id: 1 }, { id: 2 } ])
	})
	
	test('objKeys', assert => {
		assert.deepEqual(0, 0)
	})
	
	test('objKeys', assert => {
		const obj = {
			1: { id: 1 },
			2: { id: 2 },
		}
		assert.deepEqual(objKeys(obj), ['1', '2'])
	})
	
	test('objKeysAsNumbers', assert => {
		const obj = {
			1: { id: 1 },
			2: { id: 2 },
		}
		assert.deepEqual(objKeysAsNumbers(obj), [1, 2])
	})
	
	test('objEntries', assert => {
		const obj = {
			1: { id: 1 },
			2: { id: 2 },
		}
		const expected = [
			['1', { id: 1 }],
			['2', { id: 2 }],
		]
		assert.deepEqual(objEntries(obj), expected)
	})
	
	test('objEntriesKeysAsNumbers', assert => {
		const obj = {
			1: { id: 1 },
			2: { id: 2 }
		}
		const expected = [
			[1, { id: 1 }],
			[2, { id: 2 }],
		]
		assert.deepEqual(objEntriesKeysAsNumbers(obj), expected)
	})
	
	test('objFilterByKeys', assert => {
		const obj = {
			1: { id: 1 },
			2: { id: 2 },
		}
		const expected = {
			2: { id: 2 },
		}
		assert.deepEqual(objFilterByKeys(obj, [ 2 ]), expected)
	})
	
	test('objFromArr', assert => {
		const arr = [
			{ id: 1 },
			{ id: 2 },
		]
		const expected = {
			1: { id: 1 },
			2: { id: 2 },
		}
		assert.deepEqual(objFromArr(arr, 'id'), expected)
	})
	
	test('getStringFromStream', async (assert) => {
		let dataStream: Readable
		
		dataStream = Readable.from(Buffer.from('ABC'))
		assert.deepEqual(await getStringFromStream({ dataStream }), 'ABC')
		
		dataStream = Readable.from(Buffer.from('ABC', 'ascii'))
		assert.deepEqual(await getStringFromStream({ dataStream, encoding: 'ascii' }), 'ABC')
	})
	
	test('valOrUndefStr', assert => {
		assert.deepEqual(valOrUndefStr(undefined), UNDEFINED_STR)
		assert.deepEqual(valOrUndefStr(null), null)
		assert.deepEqual(valOrUndefStr(100), 100)
		assert.deepEqual(valOrUndefStr({ id: 1 }), { id: 1 })
	})
	
	test('range', assert => {
		assert.deepEqual(range({ size: 4, startAt: 10 }), [10, 11, 12, 13])
		assert.deepEqual(range({ size: 4 }), [0, 1, 2, 3])
	})
	
	test('fractionalPart', assert => {
		assert.deepEqual(fractionalPart(0), 0)
		assert.deepEqual(fractionalPart(10), 0)
		assert.deepEqual(fractionalPart(0.1e1), 0)
		
		// 2.3 % 1 = 0.2999999999999998 // which is wrong
		assert.deepEqual(fractionalPart(2.3), 0.3) // it should give correct result
		
		assert.deepEqual(fractionalPart(10.05), 0.05)
		assert.deepEqual(fractionalPart(10.33333333333333), 0.33333333333333)
		assert.deepEqual(fractionalPart(10.0000000000001), 0.0000000000001)
		assert.deepEqual(fractionalPart(-10.05), 0.05)
	})
	
	test('removeTrailingSlash', assert => {
		assert.deepEqual(removeTrailingSlash('/path/to/directory/'), '/path/to/directory')
		assert.deepEqual(removeTrailingSlash('/path/to/directory////'), '/path/to/directory')
		
		assert.deepEqual(removeTrailingSlash('\\path\\to\\directory\\'), '\\path\\to\\directory')
		assert.deepEqual(removeTrailingSlash('\\path\\to\\directory\\\\\\\\'), '\\path\\to\\directory')
	})
	
	test('cleanFilePath', assert => {
		assert.deepEqual(cleanFilePath('/path/to/directory/'), '/path/to/directory')
		assert.deepEqual(cleanFilePath('/path/to/directory////'), '/path/to/directory')
		
		assert.deepEqual(cleanFilePath('\\path\\to\\directory\\'), '/path/to/directory')
		assert.deepEqual(cleanFilePath('\\path\\to\\directory\\\\\\\\'), '/path/to/directory')
	})
	
})
