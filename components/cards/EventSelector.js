/* This example requires Tailwind CSS v2.0+ */
import React, { useState, useEffect } from 'react';
const exampleSeries = [{name: 'Coachella', id: 1}, {name: 'Bonnaroo', id: 2}]
const exampleYears = [{year: '2020', series: 1, id: 1}, {year: '2022', series: 2, id: 2}]
export default function Card({children, name, colorIndex, clicked, series, years, selectYear, selectSeries}) {
	const [selectedSeries, setSeries] = useState()
	const [selectedYear, setYear] = useState()
	const [displayYears, showYears] = useState([])
	const seriesChange = e => {
		const val = parseInt(e.target.value, 10)
		selectSeries(val)
		selectYear()
		setSeries(val)
		setYear()
		const seriesYears = years && val && years.filter(y => y.series === val).sort((a, b) => a.year.localeCompare(b.year))
		//console.log('seriesYears', val, years, seriesYears)
		showYears(seriesYears)

	}
	const optYears = displayYears ? displayYears : []
    return (
    	<div>
        <div 
        	onClick={clicked ? clicked : () => {}}
        	className={`flex my-6 p-4 rounded-lg cvlc-${colorIndex} cursor-pointer hover:bg-indigo-600`}
        >
        	<form>
	        <label htmlFor="series-selector">Festival</label>
	        <select 
	        	id="series-selector" 
	        	name="series-selector" 
	        	defaultValue="unselected"
            	onChange={seriesChange}
            >
            	<option value="unselected">Choose...</option>
	        	{(series.length ? series.sort((a, b) => a.name.localeCompare(b.name)) : exampleSeries).map(s => {
	        		return <option key={s.id} value={s.id}>{s.name}</option>
	        	})}
	        </select>
	        <label htmlFor="year-selector">Year</label>
	        <select 
	        	id="year-selector" 
	        	name="year-selector"
	        	defaultValue="unselected"
            	onChange={e => {
            		selectYear(e.target.value)
            		setYear(e.target.value)
            	}}
            >
            	<option value="unselected">Choose...</option>
	        	{optYears.map(y => {
		return <option key={y.id} value={y.id}>{y.year}</option>
	})}
	        </select>
	        </form>
	        </div>
    	{children && <div>
    		{children}
    	</div>}
        </div>
    )
}