'use client'

import Search, { SearchProps } from 'antd/es/input/Search'
import React from 'react'


interface QlsvSearchProps {
  setKey: React.Dispatch<React.SetStateAction<string>>;
}
const QlsvSearch: React.FC<QlsvSearchProps> = ({ setKey }) => {
  const onSearch: SearchProps['onSearch'] = (value) => setKey(value);
  return (
    <div>
      <div className="text-xl mb-2">Tìm Kiếm</div>
      <div className='w-3xl mb-10'>
        <Search placeholder="nhập tên sinh viên muốn tìm"
          onSearch={onSearch}
          enterButton />

      </div>
    </div>

  )
}

export default QlsvSearch;