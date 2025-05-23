import React from 'react'
import { BiSearch } from 'react-icons/bi'
import { Input } from '../ui/input'

export default function Search({ value, onChange, defaultValue, placeholder }) {
    return (
        <div className='relative'>
            <BiSearch size={18} className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-400' />
            <Input type="text"
                placeholder={placeholder}
                className="pl-8 text-color-dark"
                value={value}
                onChange={onChange}
                defaultValue={defaultValue}
            />
        </div>
    )
}
