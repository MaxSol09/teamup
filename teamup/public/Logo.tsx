import React from 'react'

interface Props {
    size: string
}

export const Logo = ({size}: Props) => {
  return (
    <div className={`group text-${size} font-bold cursor-pointer`}>
        <span className=" text-blue-600">
            Team
        </span>
        <span className="text-indigo-600">
            Up
        </span>
    </div>
  )
}
