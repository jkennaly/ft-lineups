/* This example requires Tailwind CSS v2.0+ */
/* This example requires Tailwind CSS v2.0+ */
import React, { useState, useEffect } from 'react';
import { arachProcessed } from '../../models/lists/extracts'
import { ArrowCircleUpIcon, MinusCircleIcon } from '@heroicons/react/solid'

function iSlice(arr, start, end) {
	let beginning = arr.slice(0, start);
	let ending = arr.slice(end, arr.length);
	let newArr = beginning.concat(ending);
	return newArr;
}

function clickWord(cb) {
	return (e) => {
		let b;
		var sel = window.getSelection();
		if (typeof e.processedRow === 'string') {
			cb(e.processedRow, -1, e.processedIndex)
			return
		}
		var str = sel.anchorNode.nodeValue
		if (!str) return
		var len = str.length, a = b = sel.anchorOffset;
		while (str[a] != ' ' && a--) { }; if (str[a] == ' ') a++; // start of word
		while (str[b] != ' ' && b++ < len) { };                   // end of word+1
		cb(str.substring(a, b), sel.anchorOffset, e.processedIndex)
	}
}


export default function Processed({ lineupUrl, topRows = [], removeRow, appendWord, modifyRow }) {
	const line = lineupUrl ?? `https://www.coachella.com/`
	const [processed, setProcessed] = useState({ status: 'pending' })
	useEffect(() => {
		const fetchProcessedArach = async () => {
			const response = await arachProcessed(line)

			//console.log('splash fetchProcessedArach', response)
			if (response.status === 'pending') { }
			if (response) setProcessed(response)
		}
		fetchProcessedArach()
	}, []);
	//console.log(processed)
	const addWord = (word, offset, processedIndex) => {
		const totalRows = topRows.concat(processed)

		if (offset < 0) {
			appendWord(totalRows[processedIndex])
			if (processedIndex < topRows.length) removeRow(processedIndex)
			else setProcessed(totalRows.filter((v, i) => i !== processedIndex && i >= topRows.length))
			return
		}
		const snipStart = totalRows[processedIndex].indexOf(word, offset - (word.length - 1))
		const snipEnd = snipStart + word.length
		const newRow = iSlice(totalRows[processedIndex], snipStart, snipEnd)
		appendWord(word)
		if (processedIndex < topRows.length) {
			modifyRow(processedIndex, newRow)
			return
		}
		processed[processedIndex - topRows.length] = newRow
		setProcessed(processed)

	}
	return (
		<div className="text-center">
			<div className="mt-6" onClick={clickWord(addWord)}>
				{processed.status !== 'pending' && [...topRows, ...processed].map((p, i) =>
					<div key={i} onClick={e => { e.processedIndex = i }} className={'lineup-row w-full flex'}>

						<button
							type="button"
							onClick={e => {
								if (i < topRows.length) removeRow(i)
								setProcessed(processed.filter((x, index) => i - topRows.length !== index))
								e.stopPropagation()
							}}
							className="-ml-px  flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
						>
							<span className="sr-only">Delete Row</span>
							<MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
						</button>
						<div className='flex-grow'>{p}</div>
						<button
							type="button"
							onClick={e => {
								e.processedRow = processed[i]
							}}
							className="-ml-px  flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
						>
							<span className="sr-only">Add Entire Row</span>
							<ArrowCircleUpIcon className="h-5 w-5" aria-hidden="true" />
						</button>
					</div>
				)}

			</div>
		</div>
	)
}
